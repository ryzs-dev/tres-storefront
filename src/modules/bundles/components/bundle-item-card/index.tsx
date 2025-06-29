"use client"

import { useMemo, useCallback, useRef, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { FlexibleBundle } from "@lib/data/bundles"
import { useBundleSelection } from "../../context/bundle-selection-context"
import { Button, Heading, Text, Checkbox, Label, Input } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import clsx from "clsx"
import ProductPrice from "@modules/products/components/product-price"

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

const BundleItemCard = ({ item, region }: Props) => {
  const {
    toggleItem,
    isItemSelected,
    updateItemQuantity,
    selectedItems,
    getSelectedVariant,
  } = useBundleSelection()

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)

  const isSelected = isItemSelected(item.id)
  const images = item.product.images || []

  // Use a memoized value from the context for the selected item
  const selectedItem = useMemo(
    () => selectedItems.find((si) => si.itemId === item.id),
    [selectedItems, item.id]
  )

  // Derive variantId and quantity from the context state
  const selectedVariantId = selectedItem?.variantId
  const selectedQuantity = selectedItem?.quantity || item.quantity

  // Find the matched variant based on the selectedVariantId from the context
  const matchedVariant = useMemo(() => {
    if (!item.product.variants) return undefined
    return item.product.variants.find(
      (variant) => variant.id === selectedVariantId
    )
  }, [item.product.variants, selectedVariantId])

  // Derive option values from the matched variant
  const optionValues = useMemo(() => {
    return getOptionMap(matchedVariant?.options || [])
  }, [matchedVariant])

  const filteredImages = useMemo(() => {
    if (!matchedVariant || !images.length) return images

    const colorOption = item.product.options?.find(
      (opt: HttpTypes.StoreProductOption) => opt.title.toLowerCase() === "color"
    )
    if (!colorOption) return images

    const selectedColor =
      colorOption && (colorOption as HttpTypes.StoreProductOption).id
        ? (
            getOptionMap(matchedVariant?.options ?? [])?.[
              (colorOption as HttpTypes.StoreProductOption).id
            ] ?? ""
          ).toLowerCase() ?? ""
        : undefined
    if (!selectedColor) return images

    return images.filter((image) =>
      image.url.toLowerCase().includes(selectedColor)
    )
  }, [images, matchedVariant, item.product.options])

  const isValid = !!matchedVariant
  const inStock =
    matchedVariant &&
    (!matchedVariant.manage_inventory ||
      matchedVariant.allow_backorder ||
      matchedVariant.inventory_quantity > 0)

  const handleOptionChange = useCallback(
    (optionId: string, value: string) => {
      // Find the new variant based on the new option
      const currentOptions = getOptionMap(matchedVariant?.options || [])
      const newOptionValues = { ...currentOptions, [optionId]: value }

      const newMatchedVariant = item.product.variants?.find((variant) => {
        const variantMap = getOptionMap(variant.options)
        return Object.keys(newOptionValues).every(
          (id) => variantMap?.[id] === newOptionValues[id]
        )
      })

      if (isSelected && newMatchedVariant) {
        updateItemQuantity(item.id, selectedQuantity, newMatchedVariant.id)
      }
      setCurrentImageIndex(0)
    },
    [
      isSelected,
      item.id,
      item.product.variants,
      updateItemQuantity,
      selectedQuantity,
      matchedVariant,
    ]
  )

  const handleQuantityChange = useCallback(
    (value: number) => {
      const newQuantity = value > 0 ? value : 1
      if (isSelected && matchedVariant) {
        updateItemQuantity(item.id, newQuantity, matchedVariant.id)
      }
    },
    [isSelected, item.id, matchedVariant, updateItemQuantity]
  )

  const handleSelectionChange = useCallback(
    (checked: boolean) => {
      if (checked) {
        // Find a default variant to add if the item is not yet selected
        const defaultVariant = item.product.variants?.[0]
        if (defaultVariant) {
          toggleItem(item.id, defaultVariant.id, selectedQuantity || 1)
        } else {
          console.warn("Cannot select item without any variants.")
        }
      } else {
        // Deselect the item
        toggleItem(item.id, undefined, 0)
      }
    },
    [toggleItem, item.id, item.product.variants, selectedQuantity]
  )

  const handleAddToBundle = useCallback(() => {
    if (matchedVariant && inStock) {
      toggleItem(item.id, matchedVariant.id, selectedQuantity)
    }
  }, [matchedVariant, inStock, toggleItem, item.id, selectedQuantity])

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return

    const touchEndX = e.changedTouches[0].clientX
    const deltaX = touchStartX.current - touchEndX

    if (deltaX > 50 && currentImageIndex < filteredImages.length - 1) {
      setCurrentImageIndex((prev) => prev + 1)
    } else if (deltaX < -50 && currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1)
    }

    touchStartX.current = null
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    touchStartX.current = e.clientX
  }

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return

    const deltaX = touchStartX.current - e.clientX

    if (deltaX > 50 && currentImageIndex < filteredImages.length - 1) {
      setCurrentImageIndex((prev) => prev + 1)
    } else if (deltaX < -50 && currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1)
    }

    touchStartX.current = null
  }

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1)
    }
  }

  const handleNextImage = () => {
    if (currentImageIndex < filteredImages.length - 1) {
      setCurrentImageIndex((prev) => prev + 1)
    }
  }

  return (
    <article
      className={clsx(
        "relative flex flex-col gap-y-4 p-4 border rounded-lg shadow-sm transition-colors",
        isSelected
          ? "border-ui-border-interactive bg-ui-bg-highlight"
          : "border-ui-border-base hover:border-ui-border-strong"
      )}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 bg-blue-600 rounded-full p-1 shadow-md z-10">
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}
      {/* Header */}
      <div
        className="flex items-start gap-4 cursor-pointer"
        onClick={() => handleSelectionChange(!isSelected)}
      >
        <div className="w-[100px] h-[100px] relative overflow-hidden rounded">
          {filteredImages.length > 0 ? (
            <>
              <img
                src={filteredImages[currentImageIndex].url}
                alt={item.product.title || "Product image"}
                className="w-full h-full object-cover"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
              />
              {filteredImages.length > 1 && (
                <div className="absolute top-0 left-0 h-full flex items-center justify-between w-full px-1">
                  <button
                    onClick={handlePrevImage}
                    disabled={currentImageIndex === 0}
                    className={clsx(
                      "p-1 bg-ui-bg-base bg-opacity-70 rounded-full",
                      currentImageIndex === 0 && "opacity-50 cursor-not-allowed"
                    )}
                    aria-label="Previous image"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    onClick={handleNextImage}
                    disabled={currentImageIndex === filteredImages.length - 1}
                    className={clsx(
                      "p-1 bg-ui-bg-base bg-opacity-70 rounded-full",
                      currentImageIndex === filteredImages.length - 1 &&
                        "opacity-50 cursor-not-allowed"
                    )}
                    aria-label="Next image"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-ui-bg-subtle flex items-center justify-center">
              <Text className="text-xs text-ui-fg-muted">No image</Text>
            </div>
          )}
        </div>

        <div className="flex-1">
          <Heading level="h3" className="text-base font-semibold">
            {item.product.title}
          </Heading>
          {matchedVariant && (
            <ProductPrice
              product={item.product as unknown as HttpTypes.StoreProduct}
              variant={matchedVariant as HttpTypes.StoreProductVariant}
              className="mt-1 text-base font-semibold"
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
                current={optionValues?.[option.id] ?? ""}
                updateOption={handleOptionChange}
                title={option.title}
                disabled={false}
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
                value={selectedQuantity}
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
          {/* <Button
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
          </Button> */}
        </div>
      )}
    </article>
  )
}

export default BundleItemCard
