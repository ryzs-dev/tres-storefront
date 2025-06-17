// src/modules/bundles/components/bundle-actions/index.tsx
"use client"

import { HttpTypes } from "@medusajs/types"
import { FlexibleBundle } from "@lib/data/bundles"
import { Button, Heading, Text, Alert, Badge } from "@medusajs/ui"
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

  // Add comprehensive debug logging
  console.log("=== BUNDLE DISCOUNT DEBUG ===")
  console.log("Bundle object:", bundle)
  console.log(
    "discount_2_items:",
    bundle.discount_2_items,
    "type:",
    typeof bundle.discount_2_items
  )
  console.log(
    "discount_3_items:",
    bundle.discount_3_items,
    "type:",
    typeof bundle.discount_3_items
  )
  console.log("Selected items count:", selectedItems.length)
  console.log("Selected items:", selectedItems)

  const getDiscountRate = (itemCount: number, bundle: any) => {
    console.log("getDiscountRate called with:", {
      itemCount,
      bundle: {
        discount_2_items: bundle.discount_2_items,
        discount_3_items: bundle.discount_3_items,
      },
    })

    if (itemCount === 2 && bundle.discount_2_items) {
      const rate = Number(bundle.discount_2_items) / 100
      console.log("2 items discount rate:", rate)
      return rate
    }
    if (itemCount >= 3 && bundle.discount_3_items) {
      const rate = Number(bundle.discount_3_items) / 100
      console.log("3+ items discount rate:", rate)
      return rate
    }
    console.log("No discount applied")
    return 0
  }

  // Calculate base total (without promotions)
  const calculateBaseTotal = () => {
    console.log("=== CALCULATING BASE TOTAL ===")
    const total = selectedItems.reduce((total, selectedItem) => {
      const bundleItem = bundle.items.find(
        (item) => item.id === selectedItem.itemId
      )
      if (!bundleItem) {
        console.log("No bundle item found for:", selectedItem.itemId)
        return total
      }

      const variant = bundleItem.product.variants?.find(
        (v) => v.id === selectedItem.variantId
      )
      if (!variant) {
        console.log("No variant found for:", selectedItem.variantId)
        return total
      }

      const priceInfo = getPricesForVariant(variant)
      console.log("Price info for", bundleItem.product.title, ":", priceInfo)

      if (!priceInfo) {
        console.log("No price info for variant:", variant.title)
        return total
      }

      const itemTotal =
        priceInfo.calculated_price_number * selectedItem.quantity
      console.log("Item total:", itemTotal, "for", bundleItem.product.title)

      return total + itemTotal
    }, 0)

    console.log("Total base price:", total)
    return total
  }

  // Calculate promotional total with dynamic discount rates
  const calculatePromotionalTotal = () => {
    const baseTotal = calculateBaseTotal()
    const itemCount = selectedItems.length

    console.log("=== CALCULATING PROMOTIONAL TOTAL ===")
    console.log("Base total:", baseTotal)
    console.log("Item count:", itemCount)

    const discountRate = getDiscountRate(itemCount, bundle)
    console.log("Applied discount rate:", discountRate)

    if (discountRate > 0) {
      const promotionalTotal = baseTotal * (1 - discountRate)
      console.log("Promotional total:", promotionalTotal)
      return promotionalTotal
    }

    console.log("No discount applied, returning base total")
    return baseTotal
  }

  // Get the discount percentage for display
  const getDiscountPercentage = () => {
    const itemCount = selectedItems.length
    const discountRate = getDiscountRate(itemCount, bundle)
    const percentage = discountRate ? Math.round(discountRate * 100) : 0
    console.log("Display percentage:", percentage)
    return percentage
  }

  const baseTotal = calculateBaseTotal()
  const promotionalTotal = calculatePromotionalTotal()
  const hasPromotion = baseTotal !== promotionalTotal
  const savings = baseTotal - promotionalTotal
  const discountPercentage = getDiscountPercentage()

  console.log("=== FINAL CALCULATIONS ===")
  console.log("Base total:", baseTotal)
  console.log("Promotional total:", promotionalTotal)
  console.log("Has promotion:", hasPromotion)
  console.log("Savings:", savings)
  console.log("Discount percentage:", discountPercentage)

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
      console.log("Bundle discount config:", {
        discount_2_items: bundle.discount_2_items,
        discount_3_items: bundle.discount_3_items,
        calculatedDiscount: discountPercentage,
      })

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

  // Dynamic discount display based on bundle configuration
  const getDiscountDisplayText = () => {
    const discounts = []

    if (
      typeof bundle.discount_2_items === "number" &&
      bundle.discount_2_items > 0
    ) {
      discounts.push(`2 items = ${bundle.discount_2_items}% off`)
    }

    if (bundle.discount_3_items && bundle.discount_3_items > 0) {
      discounts.push(`3+ items = ${bundle.discount_3_items}% off`)
    }

    if (discounts.length === 0) {
      return "No bundle discounts available"
    }

    return discounts.join(" • ")
  }

  // Get available discount tiers - ADDED
  const getAvailableDiscounts = () => {
    const discounts = []
    
    if (bundle.discount_2_items && bundle.discount_2_items > 0) {
      discounts.push({
        items: 2,
        percentage: bundle.discount_2_items,
        isActive: selectedItems.length === 2,
        isEligible: selectedItems.length >= 2,
      })
    }
    
    if (bundle.discount_3_items && bundle.discount_3_items > 0) {
      discounts.push({
        items: 3,
        percentage: bundle.discount_3_items,
        isActive: selectedItems.length >= 3,
        isEligible: selectedItems.length >= 3,
      })
    }
    
    return discounts
  }

  const availableDiscounts = getAvailableDiscounts()

  return (
    <div className="border border-ui-border-base rounded-lg p-6 bg-white">
      {/* Header */}
      <Heading level="h3" className="text-lg font-semibold mb-4">
        Your Selection
      </Heading>

      {/* Available Discounts Display - ADDED */}
      {availableDiscounts.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <Text className="text-sm font-medium text-blue-800 mb-2">
            🎯 Bundle Discounts Available:
          </Text>
          <div className="flex gap-2 flex-wrap">
            {availableDiscounts.map((discount, index) => (
              <Badge
                key={index}
                className={`text-xs ${
                  discount.isActive 
                    ? "bg-green-100 text-green-800 border-green-300" 
                    : discount.isEligible
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {discount.items}+ items: {discount.percentage}% off
                {discount.isActive && " ✓"}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* DEBUG INFO - Remove this in production */}
      <div className="mb-4 p-3 bg-gray-100 rounded text-xs">
        <div>Debug Info:</div>
        <div>Items selected: {selectedItems.length}</div>
        <div>Base total: MYR {baseTotal.toFixed(2)}</div>
        <div>Promotional total: MYR {promotionalTotal.toFixed(2)}</div>
        <div>Discount: {discountPercentage}%</div>
        <div>Has promotion: {hasPromotion ? "Yes" : "No"}</div>
        <div>Bundle discount_2_items: {bundle.discount_2_items}</div>
        <div>Bundle discount_3_items: {bundle.discount_3_items}</div>
      </div>

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
                    <div>
                      {/* Show original price crossed out if there's a discount - ADDED */}
                      {hasPromotion && (
                        <div className="text-xs text-ui-fg-muted line-through">
                          {item.priceInfo.calculated_price}
                        </div>
                      )}
                      <div className={`font-medium ${hasPromotion ? 'text-green-600' : ''}`}>
                        {hasPromotion 
                          ? `MYR ${(item.priceInfo.calculated_price_number * item.quantity * (1 - getDiscountRate(selectedItems.length, bundle))).toFixed(2)}`
                          : item.priceInfo.calculated_price
                        }
                      </div>
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
            <Text className={`text-lg font-semibold ${hasPromotion ? 'text-green-600' : ''}`}>
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
            ? `Add Bundle - Save MYR ${savings.toFixed(2)} (${discountPercentage}% Off)`
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

      {/* Incentive Messages - ADDED */}
      {selectedItems.length === 1 && bundle.discount_2_items && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-center">
          <Text className="text-sm text-yellow-800">
            💡 Add 1 more item to get {bundle.discount_2_items}% off!
          </Text>
        </div>
      )}
      
      {selectedItems.length === 2 &&
        bundle.discount_3_items &&
        bundle.discount_2_items !== undefined &&
        bundle.discount_3_items > bundle.discount_2_items && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-center">
          <Text className="text-sm text-yellow-800">
            💡 Add 1 more item to upgrade from {bundle.discount_2_items}% to {bundle.discount_3_items}% off!
          </Text>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-4 pt-4 border-t">
        <Text className="text-xs text-ui-fg-muted text-center">
          {bundle.selection_type === "flexible"
            ? "Select any items you want from this bundle"
            : "All items must be selected"}
        </Text>
        <div className="mt-2 text-xs text-ui-fg-muted text-center">
          <div>💰 Bundle Discounts:</div>
          <div>{getDiscountDisplayText()}</div>
        </div>
      </div>
    </div>
  )
}

export default BundleActions