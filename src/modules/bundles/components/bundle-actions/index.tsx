"use client"

import { Button, Heading, Text, toast } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import { useState } from "react"
import { useBundleSelection } from "../../context/bundle-selection-context"
import { retrieveCart } from "@lib/data/cart"
import { getPricesForVariant } from "@lib/util/get-product-price"
import { formatCurrency } from "@lib/utils/currency"
import Spinner from "@modules/common/icons/spinner"
import { mergeBundleItems } from "@lib/util/bundle/mergeBundleItems"
import { useCart } from "context/CartContext"

// Types
type BundleVariant = {
  id: string
  [key: string]: any
}

type BundleProduct = {
  variants?: BundleVariant[]
  [key: string]: any
}

type BundleItem = {
  id: string
  product?: BundleProduct
  [key: string]: any
}

type FlexibleBundle = {
  id: string
  title: string
  discount_type?: string
  discount_2_items?: number
  discount_3_items?: number
  discount_2_items_amount?: number
  discount_3_items_amount?: number
  min_items: number
  max_items?: number
  items?: BundleItem[]
}

type SelectedItem = {
  itemId: string
  variantId: string
  quantity: number
}

type DiscountInfo = {
  type: "fixed" | "percentage" | "none"
  promotionalTotal: number
  savings: number
  hasPromotion: boolean
  displayText: string
  discountAmount?: number
  discountRate?: number
  discountPercentage?: number
}

type PricingInfo = DiscountInfo & {
  baseTotal: number
  totalQuantity: number
}

// Pricing Hook
const useBundlePricing = (
  bundle: FlexibleBundle,
  selectedItems: SelectedItem[],
  region: HttpTypes.StoreRegion
): PricingInfo => {
  // Calculate base total
  const baseTotal = selectedItems.reduce((sum, item) => {
    const variant = bundle.items
      ?.find((bundleItem) => bundleItem.id === item.itemId)
      ?.product?.variants?.find((v) => v.id === item.variantId)

    const price = variant
      ? getPricesForVariant(variant, region)?.calculated_price_number || 0
      : 0

    return sum + price * item.quantity
  }, 0)

  // Calculate total quantity (sum of all item quantities)
  const totalQuantity = selectedItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  )

  // Get applicable discount
  const discountInfo = getDiscountInfo(bundle, totalQuantity, baseTotal)

  return {
    baseTotal,
    totalQuantity,
    ...discountInfo,
  }
}

function getDiscountInfo(
  bundle: FlexibleBundle,
  totalQuantity: number,
  baseTotal: number
): DiscountInfo {
  // Check for fixed discount
  if (
    bundle.discount_type === "fixed" ||
    bundle.discount_2_items_amount ||
    bundle.discount_3_items_amount
  ) {
    let discountAmount = 0 // in cents

    if (totalQuantity === 2 && bundle.discount_2_items_amount) {
      discountAmount = bundle.discount_2_items_amount
    } else if (totalQuantity >= 3 && bundle.discount_3_items_amount) {
      discountAmount = bundle.discount_3_items_amount
    }

    if (discountAmount > 0) {
      const discountInRM = discountAmount / 100
      const promotionalTotal = Math.max(0, baseTotal - discountInRM)
      const savings = baseTotal - promotionalTotal

      return {
        type: "fixed",
        discountAmount: discountInRM,
        promotionalTotal,
        savings,
        hasPromotion: true,
        displayText: `${formatCurrency(discountInRM)} off`,
      }
    }
  }

  // Check for percentage discount
  let rate = 0
  if (totalQuantity === 2 && bundle.discount_2_items) {
    rate = Number(bundle.discount_2_items) / 100
  } else if (totalQuantity >= 3 && bundle.discount_3_items) {
    rate = Number(bundle.discount_3_items) / 100
  }

  if (rate > 0) {
    const promotionalTotal = baseTotal * (1 - rate)
    const savings = baseTotal - promotionalTotal
    const discountPercentage = Math.round(rate * 100)

    return {
      type: "percentage",
      discountRate: rate,
      promotionalTotal,
      savings,
      discountPercentage,
      hasPromotion: true,
      displayText: `${discountPercentage}% off`,
    }
  }

  // No discount
  return {
    type: "none",
    promotionalTotal: baseTotal,
    savings: 0,
    hasPromotion: false,
    displayText: "",
  }
}

// Component Props
type BundleActionsProps = {
  bundle: FlexibleBundle
  region: HttpTypes.StoreRegion
  countryCode: string
}

const BundleActions = ({ bundle, region, countryCode }: BundleActionsProps) => {
  const { selectedItems, canAddToCart, clearSelection } = useBundleSelection()
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { cart, addToCart, updateToCart, refreshCart } = useCart()

  const pricingInfo = useBundlePricing(bundle, selectedItems, region)

  const handleAddToCart = async () => {
    if (!canAddToCart()) return

    setIsAdding(true)
    setError(null)

    try {
      const currentCart = cart
      console.log("Current Cart ID in Bundle Actions:", currentCart?.id)
      const existingCart = await retrieveCart(currentCart?.id)
      const existingBundle = existingCart?.items?.find(
        (item) => item.metadata?.bundle_id === bundle.id
      )

      if (existingBundle) {
        const mergedItems = await mergeBundleItems(
          bundle.id,
          countryCode,
          selectedItems
        )

        await updateToCart({
          bundleId: bundle.id,
          countryCode,
          selectedItems: mergedItems,
        })
      } else {
        await addToCart({
          bundleId: bundle.id,
          countryCode,
          selectedItems: selectedItems.map((item) => ({
            item_id: item.itemId,
            variant_id: item.variantId,
            quantity: item.quantity,
          })),
        })
      }

      toast.success("Bundle added to cart successfully!")

      refreshCart()
      clearSelection()
    } catch (error) {
      console.error("Failed to add bundle to cart:", error)
      toast.error("Failed to add bundle to cart")
      setError("Failed to add items to cart")
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="border border-ui-border-base rounded-lg p-6 bg-white">
      <Heading level="h3" className="text-lg font-semibold mb-4">
        Your Selection
      </Heading>

      {/* Pricing Section */}
      <div className="border-t pt-4 mb-4">
        {pricingInfo.hasPromotion && (
          <div className="flex justify-between text-sm text-ui-fg-muted line-through">
            <Text>Regular Price:</Text>
            <Text>{formatCurrency(pricingInfo.baseTotal)}</Text>
          </div>
        )}

        <div className="flex justify-between">
          <Text className="font-medium">
            {pricingInfo.hasPromotion ? "Bundle Price:" : "Total:"}
          </Text>
          <Text
            className={`text-lg font-semibold ${
              pricingInfo.hasPromotion ? "text-[#99b2dd]" : ""
            }`}
          >
            {formatCurrency(pricingInfo.promotionalTotal)}
          </Text>
        </div>

        {pricingInfo.hasPromotion && (
          <div className="mt-2">
            <div className="flex justify-between text-sm text-[#99b2dd]">
              <Text>Discount Applied:</Text>
              <Text className="font-medium">{pricingInfo.displayText}</Text>
            </div>
          </div>
        )}
      </div>

      {/* Discount Tiers Info */}
      {(bundle.discount_2_items_amount || bundle.discount_2_items) && (
        <div className="mb-4 p-3 bg-ui-bg-subtle rounded-lg">
          <Text className="text-sm font-medium mb-2">Bundle Discounts:</Text>
          <div className="space-y-1 text-xs text-ui-fg-subtle">
            <div className="flex justify-between">
              <span>• 1 item total:</span>
              <span>Regular price</span>
            </div>

            {(bundle.discount_2_items_amount || bundle.discount_2_items) && (
              <div className="flex justify-between">
                <span>• 2 items total:</span>
                <span className="text-[#99b2dd] font-medium">
                  {formatDiscountText(
                    bundle.discount_type,
                    bundle.discount_2_items_amount,
                    bundle.discount_2_items
                  )}
                </span>
              </div>
            )}

            {(bundle.discount_3_items_amount || bundle.discount_3_items) && (
              <div className="flex justify-between">
                <span>• 3+ items total:</span>
                <span className="text-[#99b2dd] font-medium">
                  {formatDiscountText(
                    bundle.discount_type,
                    bundle.discount_3_items_amount,
                    bundle.discount_3_items
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && <Text className="text-red-500 text-sm mb-4">{error}</Text>}

      {/* Add to Cart Button */}
      <Button
        id="add-to-cart-button"
        onClick={handleAddToCart}
        disabled={!canAddToCart() || isAdding}
        className="w-full"
        size="large"
      >
        {isAdding ? (
          <div className="flex items-center gap-2">
            <Spinner />
            Adding to Cart...
          </div>
        ) : (
          "Add to Cart"
        )}
      </Button>
    </div>
  )
}

// Helper function for discount text formatting
function formatDiscountText(
  discountType: string | undefined,
  fixedAmount: number | undefined,
  percentage: number | undefined
): string {
  if (discountType === "fixed" || fixedAmount) {
    return `${formatCurrency((fixedAmount || 0) / 100)} off`
  }
  return `${percentage}% off`
}

export default BundleActions
