"use client"

import { HttpTypes } from "@medusajs/types"
import { FlexibleBundle } from "@lib/data/bundles"
import { Button, Heading, Text, Checkbox } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import Thumbnail from "@modules/products/components/thumbnail"
import ProductPrice from "@modules/products/components/product-price"
import { useBundleSelection } from "../../context/bundle-selection-context"
import VariantSelect from "./variant-select"
import { useMemo } from "react"
import clsx from "clsx"

type BundleItemCardProps = {
  item: FlexibleBundle["items"][0]
  region: HttpTypes.StoreRegion
}

const BundleItemCard = ({ item, region }: BundleItemCardProps) => {
  const { toggleItem, isItemSelected, getSelectedVariant } =
    useBundleSelection()

  const isSelected = useMemo(
    () => isItemSelected(item.id),
    [isItemSelected, item.id]
  )
  const selectedVariant = useMemo(
    () => getSelectedVariant(item.id),
    [getSelectedVariant, item.id]
  )

  // Use the selected variant if available, otherwise default to the first variant
  const displayVariant = useMemo(() => {
    if (selectedVariant && typeof selectedVariant !== "string") {
      return selectedVariant as HttpTypes.StoreProductVariant
    }
    if (
      item.product.variants?.[0] &&
      typeof item.product.variants[0] !== "string"
    ) {
      return item.product.variants[0] as HttpTypes.StoreProductVariant
    }
    return undefined
  }, [selectedVariant, item.product.variants])

  const handleSelectionChange = (checked: boolean) => {
    if (checked && item.product.variants?.length) {
      toggleItem(item.id, item.product.variants[0].id!)
    } else {
      toggleItem(item.id)
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
      aria-label={`Select ${item.product.title} for bundle`}
    >
      {/* Thumbnail and Checkbox */}
      <div className="flex flex-row gap-4 items-start">
        <div className="relative w-[100px] rounded-lg overflow-hidden flex-shrink-0">
          <Thumbnail thumbnail={item.product.thumbnail} size="square" />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between">
            <Heading level="h3" className="text-base font-semibold">
              {item.product.title}
            </Heading>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={isSelected}
                onCheckedChange={handleSelectionChange}
                id={`item-${item.id}`}
                className="h-5 w-5"
                aria-label={`Select ${item.product.title}`}
              />
              <label htmlFor={`item-${item.id}`} className="sr-only">
                Select {item.product.title}
              </label>
            </div>
          </div>
          {item.product.variants && (
            <ProductPrice
              product={item.product as HttpTypes.StoreProduct}
              variant={displayVariant}
            />
          )}
        </div>
      </div>

      {/* Divider */}
      <Divider />

      {/* Item Details */}
      <div className="flex flex-col gap-y-2">
        <Text className="text-xs text-ui-fg-muted">
          Includes: {item.quantity} {item.quantity === 1 ? "piece" : "pieces"}
        </Text>
        {(item.product.variants?.length ?? 0) > 0 && (
          <Text className="text-xs text-ui-fg-muted">
            {item.product.variants?.length ?? 0} variant
            {(item.product.variants?.length ?? 0) > 1 ? "s" : ""} available
          </Text>
        )}
      </div>

      {/* Variant Selection */}
      {isSelected &&
        item.product.variants &&
        item.product.variants.length > 0 && (
          <div className="flex flex-col gap-y-4">
            <VariantSelect
              product={item.product as HttpTypes.StoreProduct}
              region={region}
              selectedVariant={selectedVariant}
              onVariantChange={(variantId) => toggleItem(item.id, variantId)}
              bundleQuantity={item.quantity}
            />
          </div>
        )}
    </article>
  )
}

export default BundleItemCard
