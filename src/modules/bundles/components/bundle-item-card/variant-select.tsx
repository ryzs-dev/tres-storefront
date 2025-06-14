// src/modules/bundles/components/bundle-item-card/variant-select.tsx
"use client"

import { HttpTypes } from "@medusajs/types"
import { Label, Select, Text, Input } from "@medusajs/ui"
import { useState, useMemo } from "react"
import { useBundleSelection } from "../../context/bundle-selection-context"

type VariantSelectProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  selectedVariant?: string
  onVariantChange: (variantId: string) => void
  bundleQuantity: number
}

const VariantSelect = ({
  product,
  region,
  selectedVariant,
  onVariantChange,
  bundleQuantity,
}: VariantSelectProps) => {
  const { updateItemQuantity } = useBundleSelection()
  const [customQuantity, setCustomQuantity] = useState(bundleQuantity)

  // Get current selected variant object
  const currentVariant = useMemo(() => {
    return product.variants?.find((v) => v.id === selectedVariant)
  }, [product.variants, selectedVariant])

  // Group variants by options for better display
  const variantOptions = useMemo(() => {
    if (!product.variants) return null

    return product.variants.map((variant) => ({
      id: variant.id!,
      title: variant.title,
      inStock: true, // Since we don't have inventory data, assume in stock
    }))
  }, [product.variants])

  // Handle quantity change
  const handleQuantityChange = (newQuantity: number) => {
    setCustomQuantity(newQuantity)
    // Note: We'll need to update this when we implement the quantity update in context
  }

  if (!variantOptions || variantOptions.length <= 1) {
    // Single variant or no variants - show simple display
    return (
      <div className="space-y-3">
        <div>
          <Text className="text-sm">
            {currentVariant ? currentVariant.title : "Default variant"}
          </Text>
        </div>

        <div>
          <Label htmlFor="quantity" className="text-sm">
            Quantity
          </Label>
          <Input
            id="quantity"
            type="number"
            min={1}
            value={customQuantity}
            onChange={(e) =>
              handleQuantityChange(parseInt(e.target.value) || 1)
            }
            className="w-20"
          />
          <Text className="text-xs text-ui-fg-muted mt-1">
            Bundle default: {bundleQuantity}
          </Text>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Variant Selection */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Select Variant</Label>
        <Select value={selectedVariant || ""} onValueChange={onVariantChange}>
          <Select.Trigger>
            <Select.Value placeholder="Choose variant..." />
          </Select.Trigger>
          <Select.Content>
            {variantOptions.map((variant) => (
              <Select.Item key={variant.id} value={variant.id}>
                {variant.title}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
      </div>

      {/* Quantity Selection */}
      <div>
        <Label htmlFor={`quantity-${product.id}`} className="text-sm">
          Quantity
        </Label>
        <div className="flex items-center gap-2">
          <Input
            id={`quantity-${product.id}`}
            type="number"
            min={1}
            value={customQuantity}
            onChange={(e) =>
              handleQuantityChange(parseInt(e.target.value) || 1)
            }
            className="w-20"
          />
          <Text className="text-xs text-ui-fg-muted">
            Bundle default: {bundleQuantity}
          </Text>
        </div>
      </div>

      {/* Selected Variant Info */}
      {currentVariant && (
        <div className="pt-2 border-t">
          <Text className="text-xs text-ui-fg-muted">Selected:</Text>
          <Text className="text-sm font-medium">{currentVariant.title}</Text>
        </div>
      )}
    </div>
  )
}

export default VariantSelect
