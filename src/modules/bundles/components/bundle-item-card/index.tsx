"use client"

import { HttpTypes } from "@medusajs/types"
import { FlexibleBundle } from "@lib/data/bundles"
import { Heading, Text, Badge, Checkbox } from "@medusajs/ui"
import Thumbnail from "@modules/products/components/thumbnail"
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
        "border rounded-2xl p-4 transition-all flex flex-col md:flex-row gap-4 shadow-sm",
        isSelected
          ? "border-ui-border-interactive bg-ui-bg-highlight"
          : "border-ui-border-base hover:border-ui-border-strong"
      )}
      aria-label={`Select ${item.product.title} for bundle`}
    >
      {/* Product Image */}
      <div className="relative w-full md:w-40 rounded-lg overflow-hidden flex-shrink-0">
        <Thumbnail thumbnail={item.product.thumbnail} size="full" />
        {/* {item.is_optional && (
          <Badge
            className="absolute top-2 right-2 text-xs"
            aria-label="Optional item"
          >
            Optional
          </Badge>
        )} */}
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Title + Checkbox */}
          <div className="flex items-start justify-between">
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

          {/* Description */}
          {item.product.description && (
            <Text className="text-sm text-ui-fg-subtle line-clamp-2">
              {item.product.description}
            </Text>
          )}

          {/* Bundle Quantity */}
          <Text className="text-xs text-ui-fg-muted">
            Includes: {item.quantity} {item.quantity === 1 ? "piece" : "pieces"}
          </Text>

          {/* Variant Count */}
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
            <div className="border-t mt-4 pt-4">
              <VariantSelect
                product={item.product}
                region={region}
                selectedVariant={selectedVariant}
                onVariantChange={(variantId) => toggleItem(item.id, variantId)}
                bundleQuantity={item.quantity}
              />
            </div>
          )}
      </div>
    </article>
  )
}

export default BundleItemCard
