// src/modules/bundles/components/bundle-actions/index.tsx
"use client"

import { HttpTypes } from "@medusajs/types"
import { FlexibleBundle } from "@lib/data/bundles"
import { Button, Heading, Text, Alert, Badge } from "@medusajs/ui"
import { useBundleSelection } from "../../context/bundle-selection-context"
import { useState, useEffect, useRef } from "react"
import { addFlexibleBundleToCart } from "@lib/data/cart"
import { getPricesForVariant } from "@lib/util/get-product-price"
import MobileActions from "@modules/products/components/product-actions/mobile-actions"
import { useIntersection } from "@lib/hooks/use-in-view"

const useBundlePricing = (
  bundle: FlexibleBundle,
  selectedItems: any[],
  region: HttpTypes.StoreRegion
) => {
  const getDiscountRate = (count: number) => {
    if (count === 2 && bundle.discount_2_items) {
      return Number(bundle.discount_2_items) / 100
    }
    if (count >= 3 && bundle.discount_3_items) {
      return Number(bundle.discount_3_items) / 100
    }
    return 0
  }

  const baseTotal = selectedItems.reduce((sum, item) => {
    const bItem = bundle.items.find((i) => i.id === item.itemId)
    const variant = bItem?.product.variants?.find(
      (v) => v.id === item.variantId
    )
    const price = variant
      ? getPricesForVariant(variant, region)?.calculated_price_number || 0
      : 0
    return sum + price * item.quantity
  }, 0)

  const discountRate = getDiscountRate(selectedItems.length)
  const promotionalTotal = baseTotal * (1 - discountRate)
  const savings = baseTotal - promotionalTotal
  const discountPercentage = Math.round(discountRate * 100)
  const hasPromotion = discountRate > 0

  return {
    baseTotal,
    promotionalTotal,
    savings,
    discountPercentage,
    hasPromotion,
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
  const {
    baseTotal,
    promotionalTotal,
    savings,
    discountPercentage,
    hasPromotion,
  } = useBundlePricing(bundle, selectedItems, region)

  const actionsRef = useRef<HTMLDivElement>(null)
  const inView = useIntersection(actionsRef, "0px")

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("bundle-changed", {
        detail: {
          selectedItems,
          promotionalTotal,
        },
      })
    )
  }, [selectedItems])

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

      <div className="border-t pt-4 mb-4">
        {hasPromotion && (
          <div className="flex justify-between text-sm text-ui-fg-muted line-through">
            <Text>Regular Price:</Text>
            <Text>MYR {baseTotal.toFixed(2)}</Text>
          </div>
        )}
        <div className="flex justify-between">
          <Text className="font-medium">
            {hasPromotion ? "Bundle Price:" : "Total:"}
          </Text>
          <Text
            className={`text-lg font-semibold ${
              hasPromotion ? "text-green-600" : ""
            }`}
          >
            MYR {promotionalTotal.toFixed(2)}
          </Text>
        </div>
        {hasPromotion && (
          <div className="flex justify-between text-sm text-green-600 mt-1">
            <Text>You Save ({discountPercentage}% off):</Text>
            <Text>MYR {savings.toFixed(2)}</Text>
          </div>
        )}
      </div>

      {error && (
        <Alert className="mb-4">
          <Text className="text-sm text-ui-fg-error">{error}</Text>
        </Alert>
      )}

      <div className="space-y-2">
        <Button
          onClick={handleAddToCart}
          disabled={!canAddToCart() || isAdding}
          isLoading={isAdding}
          className="w-full"
        >
          {isAdding
            ? "Adding to Cart..."
            : summary.totalItems === 0
            ? "Select Items to Add"
            : hasPromotion
            ? `Add Bundle - Save MYR ${savings.toFixed(
                2
              )} (${discountPercentage}% Off)`
            : `Add to Cart - MYR ${baseTotal.toFixed(2)}`}
        </Button>

        {selectedItems.length > 0 && (
          <Button
            variant="secondary"
            onClick={clearSelection}
            className="w-full"
            disabled={isAdding}
          >
            Clear Selection
          </Button>
        )}
      </div>

      {/* <MobileActions
        product={undefined}
        variant={undefined}
        inStock={canAddToCart()}
        handleAddToCart={handleAddToCart}
        isAdding={isAdding}
        show={!inView}
        optionsDisabled={isAdding}
      /> */}
    </div>
  )
}

export default BundleActions
