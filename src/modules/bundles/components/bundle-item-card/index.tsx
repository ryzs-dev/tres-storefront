"use client"

import { useState, useMemo, useCallback } from "react"
import { HttpTypes } from "@medusajs/types"
import { FlexibleBundle } from "@lib/data/bundles"
import { useBundleSelection } from "../../context/bundle-selection-context"
import { Button, Heading, Text, Checkbox, Label, Input } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import Thumbnail from "@modules/products/components/thumbnail"
import ProductPrice from "@modules/products/components/product-price"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import clsx from "clsx"

type Props = {
  item: FlexibleBundle["items"][0]
  region: HttpTypes.StoreRegion
}

const getOptionMap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) =>
  variantOptions?.reduce((acc: Record<string, string>, opt) => {
    if (opt.option_id != null) {
      acc[opt.option_id] = opt.value
    }
    return acc
  }, {})

const BundleItemCard = ({ item }: Props) => {
  const { toggleItem, isItemSelected, updateItemQuantity } =
    useBundleSelection()

  const [optionValues, setOptionValues] = useState<Record<string, string>>({})
  const [customQuantity, setCustomQuantity] = useState(item.quantity)

  const isSelected = isItemSelected(item.id)

  const matchedVariant = useMemo(() => {
    if (!item.product.variants) return undefined

    return item.product.variants.find((variant) => {
      const variantMap = getOptionMap(variant.options)
      return Object.keys(optionValues).every(
        (id) => variantMap?.[id] === optionValues[id]
      )
    })
  }, [item.product.variants, optionValues])

  console.log("Item:", item)

  const isValid = !!matchedVariant
  const inStock =
    matchedVariant &&
    (!matchedVariant.manage_inventory ||
      matchedVariant.allow_backorder ||
      matchedVariant.inventory_quantity > 0)

  const handleOptionChange = useCallback((optionId: string, value: string) => {
    setOptionValues((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }, [])

  const handleQuantityChange = (value: number) => {
    setCustomQuantity(value)
    updateItemQuantity(item.id, value)

    if (isSelected && matchedVariant) {
      toggleItem(item.id, matchedVariant.id, value)
    }
  }

  const handleSelectionChange = (checked: boolean) => {
    if (checked && matchedVariant) {
      toggleItem(item.id, matchedVariant.id, customQuantity)
    } else {
      toggleItem(item.id, undefined)
    }
  }

  const handleAddToBundle = () => {
    if (matchedVariant && inStock) {
      toggleItem(item.id, matchedVariant.id, customQuantity)
    }
  }

  return (
    <article
      className={clsx(
        "flex flex-col gap-y-4 p-4 border rounded-lg shadow-sm",
        isSelected
          ? "border-ui-border-interactive bg-ui-bg-highlight"
          : "border-ui-border-base hover:border-ui-border-strong"
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-[100px] rounded overflow-hidden">
          <Thumbnail thumbnail={item.product.thumbnail} size="square" />
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <Heading level="h3" className="text-base font-semibold">
              {item.product.title}
            </Heading>
            <Checkbox
              checked={isSelected}
              onCheckedChange={handleSelectionChange}
              className="h-5 w-5 mt-1"
              aria-label={`Select ${item.product.title}`}
            />
          </div>
          {matchedVariant && (
            <ProductPrice
              product={item.product as unknown as HttpTypes.StoreProduct}
              variant={matchedVariant as HttpTypes.StoreProductVariant}
            />
          )}
        </div>
      </div>

      {isSelected && (
        <div className="flex flex-col gap-y-4">
          <Divider />

          {/* Option Selectors */}
          {(item.product.options || []).map(
            (option: HttpTypes.StoreProductOption) => (
              <OptionSelect
                key={option.id}
                option={option}
                current={optionValues[option.id]}
                updateOption={handleOptionChange}
                title={option.title}
                disabled={false} // Adjust this value based on your logic
              />
            )
          )}

          <Divider />

          {/* Quantity Selector */}
          <div>
            <Label htmlFor={`quantity-${item.id}`}>Quantity</Label>
            <div className="flex items-center gap-2">
              <Input
                id={`quantity-${item.id}`}
                type="number"
                min={1}
                value={customQuantity}
                onChange={(e) =>
                  handleQuantityChange(parseInt(e.target.value) || 1)
                }
                className="w-20"
              />
              <Text className="text-xs text-ui-fg-muted">
                Default: {item.quantity}
              </Text>
            </div>
          </div>

          {/* Selected Variant Info */}
          {matchedVariant && (
            <div className="pt-2 border-t">
              <Text className="text-xs text-ui-fg-muted">
                Selected variant:
              </Text>
              <Text className="text-sm font-medium">
                {matchedVariant.title}
              </Text>
            </div>
          )}

          {/* Add to Bundle Button */}
          <Button
            onClick={handleAddToBundle}
            disabled={!isValid || !inStock}
            variant="primary"
            className="w-full h-10"
          >
            {!isValid
              ? "Select all options"
              : !inStock
              ? "Out of stock"
              : "Add to Bundle"}
          </Button>
        </div>
      )}
    </article>
  )
}

export default BundleItemCard
