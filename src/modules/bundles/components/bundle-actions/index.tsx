// src/modules/bundles/components/bundle-actions/index.tsx - FIXED VERSION
"use client"

import { Button, Heading, Text } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import { useRef, useState, useEffect } from "react"
import { useBundleSelection } from "../../context/bundle-selection-context"
import { addFlexibleBundleToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { getPricesForVariant } from "@lib/util/get-product-price"
import { formatCurrency } from "@lib/utils/currency"
import Spinner from "@modules/common/icons/spinner"

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
  items?: Array<{
    id: string
    product?: {
      variants?: Array<{
        id: string
        [key: string]: any
      }>
      [key: string]: any
    }
    [key: string]: any
  }>
}

// FIXED: Updated pricing hook to use total quantity instead of item count
const useBundlePricing = (
  bundle: FlexibleBundle,
  selectedItems: any[],
  region: HttpTypes.StoreRegion
) => {
  const baseTotal = selectedItems.reduce((sum, item) => {
    const variant = bundle.items
      ?.find((bundleItem) => bundleItem.id === item.itemId)
      ?.product?.variants?.find((v) => v.id === item.variantId)

    const price = variant
      ? getPricesForVariant(variant, region)?.calculated_price_number || 0
      : 0
    return sum + price * item.quantity
  }, 0)

  // FIXED: Calculate total quantity (1 quantity = 1 item)
  const totalQuantity = selectedItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  )

  // Support both fixed and percentage discounts based on TOTAL QUANTITY
  const getDiscountInfo = (totalQuantity: number) => {
    // Check for fixed discount first (new system)
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

    // Fallback to percentage system (backward compatibility)
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

    return {
      type: "none",
      promotionalTotal: baseTotal,
      savings: 0,
      hasPromotion: false,
      displayText: "",
    }
  }

  // FIXED: Pass total quantity instead of selectedItems.length
  const discountInfo = getDiscountInfo(totalQuantity)

  return {
    baseTotal,
    totalQuantity, // Add this for debugging/display
    ...discountInfo,
  }
}

type BundleActionsProps = {
  bundle: FlexibleBundle
  region: HttpTypes.StoreRegion
  countryCode: string
}

const BundleActions = ({ bundle, region, countryCode }: BundleActionsProps) => {
  const { selectedItems, canAddToCart, getSelectionSummary, clearSelection } =
    useBundleSelection()
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const summary = getSelectionSummary()
  const pricingInfo = useBundlePricing(bundle, selectedItems, region)

  const actionsRef = useRef<HTMLDivElement>(null)
  const inView = useIntersection(actionsRef, "0px")

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("bundle-changed", {
        detail: {
          selectedItems,
          promotionalTotal: pricingInfo.promotionalTotal,
        },
      })
    )
  }, [selectedItems, pricingInfo.promotionalTotal])

  const handleAddToCart = async () => {
    if (!canAddToCart()) return

    setIsAdding(true)
    setError(null)

    try {
      await addFlexibleBundleToCart({
        bundleId: bundle.id,
        countryCode,
        selectedItems: selectedItems.map((item) => ({
          item_id: item.itemId,
          variant_id: item.variantId,
          quantity: item.quantity,
        })),
      })

      clearSelection()

      // FIXED: Calculate total items correctly
      const totalItemsAdded = selectedItems.reduce(
        (total, item) => total + item.quantity,
        0
      )

      // Dispatch immediate update event
      window.dispatchEvent(
        new CustomEvent("cart-updated", {
          detail: {
            itemsAdded: totalItemsAdded,
            bundleId: bundle.id,
          },
        })
      )

      // Also dispatch bundle-changed event for compatibility
      window.dispatchEvent(
        new CustomEvent("bundle-changed", {
          detail: {
            selectedItems,
            promotionalTotal: pricingInfo.promotionalTotal,
            itemsAdded: totalItemsAdded,
          },
        })
      )

      // Force another update after a short delay to ensure server sync
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("cart-updated"))
      }, 500)
    } catch (err) {
      console.error(err)
      setError("Failed to add items to cart")
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div
      className="border border-ui-border-base rounded-lg p-6 bg-white"
      ref={actionsRef}
    >
      <Heading level="h3" className="text-lg font-semibold mb-4">
        Your Selection
      </Heading>

      {/* DEBUG: Show quantity calculation */}
      {process.env.NODE_ENV === "development" && (
        <div className="mb-2 p-2 bg-yellow-100 rounded text-xs">
          Debug: {selectedItems.length} products, {pricingInfo.totalQuantity}{" "}
          total items
        </div>
      )}

      <div className="border-t pt-4 mb-4">
        {/* Show pricing based on discount type */}
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

        {/* Show discount information */}
        {pricingInfo.hasPromotion && (
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-sm text-[#99b2dd]">
              <Text>Discount Applied:</Text>
              <Text className="font-medium">{pricingInfo.displayText}</Text>
            </div>
          </div>
        )}
      </div>

      {/* FIXED: Discount Tiers Info - Updated text to clarify quantity */}
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
                {bundle.discount_type === "fixed" ||
                bundle.discount_2_items_amount
                  ? `${formatCurrency(
                      (bundle.discount_2_items_amount || 0) / 100
                    )} off`
                  : `${bundle.discount_2_items}% off`}
              </span>
            </div>
          )}
          {(bundle.discount_3_items_amount || bundle.discount_3_items) && (
            <div className="flex justify-between">
              <span>• 3+ items total:</span>
              <span className="text-[#99b2dd] font-medium">
                {bundle.discount_type === "fixed" ||
                bundle.discount_3_items_amount
                  ? `${formatCurrency(
                      (bundle.discount_3_items_amount || 0) / 100
                    )} off`
                  : `${bundle.discount_3_items}% off`}
              </span>
            </div>
          )}
        </div>
      </div>

      {error && <Text className="text-red-500 text-sm mb-4">{error}</Text>}

      <Button
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
          `Add to Cart`
        )}
      </Button>

      {/* Sticky behavior for mobile */}
      {!inView && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-ui-border-base p-4 z-50 md:hidden">
          <div className="flex items-center justify-between mb-3">
            <div>
              <Text className="font-semibold">
                {formatCurrency(pricingInfo.promotionalTotal)}
              </Text>
              {pricingInfo.hasPromotion && (
                <Text className="text-sm text-[#99b2dd]">
                  Save {formatCurrency(pricingInfo.savings)}
                </Text>
              )}
            </div>
            <Text className="text-sm text-ui-fg-subtle">
              {summary.totalItems} item{summary.totalItems !== 1 ? "s" : ""}{" "}
              selected
            </Text>
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={!canAddToCart() || isAdding}
            className="w-full"
            size="large"
          >
            {isAdding ? (
              <div className="flex items-center gap-2">
                <Spinner />
                Adding...
              </div>
            ) : (
              "Add to Cart"
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

export default BundleActions
