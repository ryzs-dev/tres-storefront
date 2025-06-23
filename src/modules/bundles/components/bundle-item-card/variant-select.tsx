"use client"

import { HttpTypes } from "@medusajs/types"
import { Button, Select, Label, Input, Text } from "@medusajs/ui"
import { X } from "lucide-react"
import { useState, useMemo } from "react"
import { useBundleSelection } from "../../context/bundle-selection-context"
import { isEqual } from "lodash"

type VariantSelectProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  selectedVariant?: string | HttpTypes.StoreProductVariant
  onVariantChange: (variantId: string) => void
  bundleQuantity: number
}

const colorMap: Record<string, string> = {
  "sonic pink": "#E157B1",
  "electric blue": "#114EB8",
  pistachio: "#798835",
  scarlet: "#E42E3B",
  violet: "#A05F9B",
  black: "#000000",
  white: "#FFFFFF",
  peach: "#FFDAB9",
  grey: "#212326",
  pink: "#BD3C7B",
  green: "#025D40",
  purple: "#802D57",
  brown: "#8B4513",
  coffee: "#6F4C3E",
}

const VariantSelect = ({
  product,
  region,
  selectedVariant,
  onVariantChange,
  bundleQuantity,
}: VariantSelectProps) => {
  const { updateItemQuantity } = useBundleSelection()
  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [customQuantity, setCustomQuantity] = useState(bundleQuantity)

  // Compute selected variant based on options
  const currentVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return undefined

    return (
      product.variants.find((v) => {
        const variantOptions = (v.options || []).reduce(
          (acc: Record<string, string>, opt: any) => {
            acc[opt.option_id] = opt.value
            return acc
          },
          {}
        )
        return isEqual(variantOptions, options)
      }) ||
      product.variants.find(
        (v) =>
          v.id ===
          (typeof selectedVariant === "string"
            ? selectedVariant
            : selectedVariant?.id)
      )
    )
  }, [product.variants, options, selectedVariant])

  // Update variant when options change
  useMemo(() => {
    if (currentVariant?.id) {
      onVariantChange(currentVariant.id)
    }
  }, [currentVariant, onVariantChange])

  // Handle option selection
  const updateOption = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value || undefined,
    }))
  }

  // Handle quantity change
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setCustomQuantity(newQuantity)
      updateItemQuantity(product.id, newQuantity)
    }
  }

  // If no variants or single variant, show simple display
  if (!product.variants || product.variants.length <= 1) {
    return (
      <div className="space-y-3">
        <div>
          <Text className="text-sm">
            {currentVariant ? currentVariant.title : "Default variant"}
          </Text>
        </div>
        <div>
          <Label htmlFor={`quantity-${product.id}`} className="text-sm">
            Quantity
          </Label>
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
          <Text className="text-xs text-ui-fg-muted mt-1">
            Bundle default: {bundleQuantity}
          </Text>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Option Selection */}
      {(product.options || []).map((option) => {
        const isColorOption = /color|colour/i.test(option.title || "")
        const currentValue = options[option.id]
        const filteredValues = (option.values || []).map((v) => v.value)

        return (
          <div key={option.id} className="flex flex-col gap-y-3">
            <span className="text-sm">Select {option.title}</span>
            {isColorOption ? (
              <div className="relative">
                <Select
                  value={currentValue || ""}
                  onValueChange={(value) => updateOption(option.id, value)}
                >
                  <Select.Trigger data-testid={`option-${option.id}`}>
                    <Select.Value placeholder={`Choose a ${option.title}`} />
                  </Select.Trigger>
                  <Select.Content>
                    {filteredValues.map((value) => {
                      const normalized = value.toLowerCase().trim()
                      const color = colorMap[normalized] || "#E5E7EB"
                      return (
                        <Select.Item key={value} value={value}>
                          <div className="flex items-center gap-2">
                            <span
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: color }}
                            />
                            <span>{value}</span>
                          </div>
                        </Select.Item>
                      )
                    })}
                  </Select.Content>
                </Select>
                {currentValue && (
                  <Button
                    variant="transparent"
                    size="small"
                    onClick={() => updateOption(option.id, "")}
                    className="absolute right-8 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100 rounded-full"
                  >
                    <X className="h-3 w-3 text-gray-500" />
                  </Button>
                )}
              </div>
            ) : (
              <div
                className="flex flex-row justify-start gap-2"
                data-testid={`option-${option.id}`}
              >
                {filteredValues.map((value) => {
                  const isSelected = value === currentValue
                  return (
                    <Button
                      variant="secondary"
                      onClick={() =>
                        updateOption(option.id, isSelected ? "" : value)
                      }
                      key={value}
                      className={`w-full text-sm h-10 rounded p-2 flex items-center justify-center gap-2 ${
                        isSelected
                          ? "bg-gray-100 border-2 border-black"
                          : "hover:shadow-md"
                      }`}
                    >
                      {value}
                    </Button>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}

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
