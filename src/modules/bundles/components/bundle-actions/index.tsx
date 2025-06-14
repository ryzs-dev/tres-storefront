// src/modules/bundles/components/bundle-actions/index.tsx
"use client"

import { HttpTypes } from "@medusajs/types"
import { FlexibleBundle } from "@lib/data/bundles"
import { Button, Heading, Text, Alert } from "@medusajs/ui"
import { useBundleSelection } from "../../context/bundle-selection-context"
import { useState } from "react"
import { addFlexibleBundleToCart } from "@lib/data/cart"
import { getPricesForVariant } from "@lib/util/get-product-price"

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

  // Define discount percentages
  const DISCOUNT_RATES = {
    2: 0.1, // 10% off for 2 items
    3: 0.15, // 15% off for 3 items
  }

  // Calculate base total (without promotions)
  const calculateBaseTotal = () => {
    return selectedItems.reduce((total, selectedItem) => {
      const bundleItem = bundle.items.find(
        (item) => item.id === selectedItem.itemId
      )
      if (!bundleItem) return total

      const variant = bundleItem.product.variants?.find(
        (v) => v.id === selectedItem.variantId
      )
      if (!variant) return total

      const priceInfo = getPricesForVariant(variant)
      if (!priceInfo) return total

      return total + priceInfo.calculated_price_number * selectedItem.quantity
    }, 0)
  }

  // Calculate promotional total with percentage discounts
  const calculatePromotionalTotal = () => {
    const baseTotal = calculateBaseTotal()
    const itemCount = selectedItems.length

    // Apply percentage discount based on item count
    const discountRate =
      DISCOUNT_RATES[itemCount as keyof typeof DISCOUNT_RATES] || 0

    if (discountRate > 0) {
      return baseTotal * (1 - discountRate)
    }

    return baseTotal // No discount for 1 item or other counts
  }

  // Get the discount percentage for display
  const getDiscountPercentage = () => {
    const itemCount = selectedItems.length
    const discountRate =
      DISCOUNT_RATES[itemCount as keyof typeof DISCOUNT_RATES]
    return discountRate ? Math.round(discountRate * 100) : 0
  }

  const baseTotal = calculateBaseTotal()
  const promotionalTotal = calculatePromotionalTotal()
  const hasPromotion = baseTotal !== promotionalTotal
  const savings = baseTotal - promotionalTotal
  const discountPercentage = getDiscountPercentage()

  // Get selected items for display with pricing
  const getSelectedItemsDisplay = () => {
    return selectedItems.map((selectedItem) => {
      const bundleItem = bundle.items.find(
        (item) => item.id === selectedItem.itemId
      )
      const variant = bundleItem?.product.variants?.find(
        (v) => v.id === selectedItem.variantId
      )

      const priceInfo = variant ? getPricesForVariant(variant) : null

      return {
        title: bundleItem?.product.title || "Unknown",
        variant: variant?.title || "Default",
        quantity: selectedItem.quantity,
        priceInfo,
      }
    })
  }

  const handleAddToCart = async () => {
    if (!canAddToCart()) return

    setIsAdding(true)
    setError(null)

    try {
      const formattedItems = selectedItems.map((item) => ({
        item_id: item.itemId,
        variant_id: item.variantId,
        quantity: item.quantity,
      }))

      console.log("Adding items to cart:", formattedItems)

      await addFlexibleBundleToCart({
        bundleId: bundle.id,
        countryCode,
        selectedItems: formattedItems,
      })

      clearSelection()
    } catch (err) {
      console.error("Error adding bundle to cart:", err)
      setError(
        err instanceof Error ? err.message : "Failed to add items to cart"
      )
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="border border-ui-border-base rounded-lg p-6 bg-white">
      {/* Header */}
      <Heading level="h3" className="text-lg font-semibold mb-4">
        Your Selection
      </Heading>

      {/* Selection Summary */}
      <div className="mb-4">
        <Text className="text-sm text-ui-fg-muted mb-2">
          {summary.totalItems} of {bundle.items.length} items selected
        </Text>

        {/* Progress bar */}
        <div className="w-full bg-ui-bg-subtle rounded-full h-2 mb-3">
          <div
            className="bg-ui-fg-interactive h-2 rounded-full transition-all"
            style={{
              width: `${Math.min(
                (summary.totalItems / bundle.items.length) * 100,
                100
              )}%`,
            }}
          />
        </div>

        {/* Selection rules feedback */}
        {summary.violatesRules && (
          <Alert className="mb-3">
            <Text className="text-sm text-ui-fg-error">
              {summary.violatesRules}
            </Text>
          </Alert>
        )}
      </div>

      {/* Selected Items List */}
      {selectedItems.length > 0 && (
        <div className="mb-4">
          <Text className="text-sm font-medium mb-2">Selected Items:</Text>
          <div className="space-y-2">
            {getSelectedItemsDisplay().map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center text-xs bg-ui-bg-subtle p-2 rounded"
              >
                <div>
                  <div className="font-medium">{item.title}</div>
                  <div className="text-ui-fg-muted">
                    {item.variant} × {item.quantity}
                  </div>
                </div>
                <div className="text-right">
                  {item.priceInfo ? (
                    <div className="font-medium">
                      {item.priceInfo.calculated_price}
                    </div>
                  ) : (
                    <div className="text-xs text-ui-fg-muted">
                      Price unavailable
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pricing Summary */}
      {selectedItems.length > 0 && baseTotal > 0 && (
        <div className="border-t pt-4 mb-4">
          {/* Base Total */}
          {hasPromotion && (
            <div className="flex justify-between items-center text-sm text-ui-fg-muted line-through">
              <Text>Regular Price:</Text>
              <Text>MYR {baseTotal.toFixed(2)}</Text>
            </div>
          )}

          {/* Promotional Total */}
          <div className="flex justify-between items-center">
            <Text className="font-medium">
              {hasPromotion ? "Bundle Price:" : "Total:"}
            </Text>
            <Text className="text-lg font-semibold">
              MYR {promotionalTotal.toFixed(2)}
            </Text>
          </div>

          {/* Savings Display */}
          {hasPromotion && (
            <div className="flex justify-between items-center text-sm text-green-600 mt-1">
              <Text>You Save ({discountPercentage}% off):</Text>
              <Text className="font-medium">MYR {savings.toFixed(2)}</Text>
            </div>
          )}

          {/* Promotion Badge */}
          {hasPromotion && (
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-center">
              <Text className="text-sm text-green-700 font-medium">
                🎉 {discountPercentage}% Bundle Discount Applied!
              </Text>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <Alert className="mb-4">
          <Text className="text-sm text-ui-fg-error">{error}</Text>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button
          onClick={handleAddToCart}
          disabled={!canAddToCart() || isAdding}
          className="w-full"
          isLoading={isAdding}
        >
          {isAdding
            ? "Adding to Cart..."
            : selectedItems.length === 0
            ? "Select Items to Add"
            : hasPromotion
            ? `Add Bundle `
            : `Add to Cart `}
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

      {/* Help Text */}
      <div className="mt-4 pt-4 border-t">
        <Text className="text-xs text-ui-fg-muted text-center">
          {bundle.selection_type === "flexible"
            ? "Select any items you want from this bundle"
            : "All items must be selected"}
        </Text>
      </div>
    </div>
  )
}

export default BundleActions
