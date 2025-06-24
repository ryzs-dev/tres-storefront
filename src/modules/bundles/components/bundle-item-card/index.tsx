"use client"

import { useState, useMemo, useCallback, useRef } from "react"
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
  const { toggleItem, isItemSelected, updateItemQuantity, selectedItems } =
    useBundleSelection()

  const [optionValues, setOptionValues] = useState<Record<string, string>>({})
  const [customQuantity, setCustomQuantity] = useState(item.quantity)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)

  const isSelected = isItemSelected(item.id)
  const images = item.product.images || []

  const matchedVariant = useMemo(() => {
    if (!item.product.variants) return undefined

    return item.product.variants.find((variant) => {
      const variantMap = getOptionMap(variant.options)
      return Object.keys(optionValues).every(
        (id) => variantMap?.[id] === optionValues[id]
      )
    })
  }, [item.product.variants, optionValues])

  const filteredImages = useMemo(() => {
    if (!matchedVariant || !images.length) return images

    const colorOption = item.product.options?.find(
      (opt: HttpTypes.StoreProductOption) => opt.title.toLowerCase() === "color"
    )
    if (!colorOption) return images

    const selectedColor =
      colorOption && (colorOption as HttpTypes.StoreProductOption).id
        ? optionValues[
            (colorOption as HttpTypes.StoreProductOption).id
          ]?.toLowerCase()
        : undefined
    if (!selectedColor) return images

    return images.filter((image) =>
      image.url.toLowerCase().includes(selectedColor)
    )
  }, [images, matchedVariant, optionValues, item.product.options])

  const isValid = !!matchedVariant
  const inStock =
    matchedVariant &&
    (!matchedVariant.manage_inventory ||
      matchedVariant.allow_backorder ||
      matchedVariant.inventory_quantity > 0)

  const handleOptionChange = useCallback(
    (optionId: string, value: string) => {
      setOptionValues((prev) => ({
        ...prev,
        [optionId]: value,
      }))
      setCurrentImageIndex(0)

      // Find the new matched variant after updating options
      const newMatchedVariant = item.product.variants?.find((variant) => {
        const variantMap = getOptionMap(variant.options)
        return Object.keys({ ...optionValues, [optionId]: value }).every(
          (id) =>
            variantMap?.[id] === { ...optionValues, [optionId]: value }[id]
        )
      })

      // Dispatch bundle-changed event if the item is selected
      if (isSelected && newMatchedVariant) {
        const updatedSelectedItems = [
          ...selectedItems.filter((si) => si.itemId !== item.id),
          {
            itemId: item.id,
            variantId: newMatchedVariant.id,
            quantity: customQuantity,
          },
        ]

        window.dispatchEvent(
          new CustomEvent("bundle-changed", {
            detail: {
              selectedItems: updatedSelectedItems,
              promotionalTotal: 0,
            },
          })
        )
      }
    },
    [
      isSelected,
      item.id,
      item.product.title,
      item.product.variants,
      optionValues,
      customQuantity,
      selectedItems,
    ]
  )

  const handleQuantityChange = (value: number) => {
    setCustomQuantity(value)
    updateItemQuantity(item.id, value)

    if (isSelected && matchedVariant) {
      toggleItem(item.id, matchedVariant.id, value)
      window.dispatchEvent(
        new CustomEvent("bundle-changed", {
          detail: {
            selectedItems: selectedItems.map((si) =>
              si.itemId === item.id ? { ...si, quantity: value } : si
            ),
            promotionalTotal: 0,
          },
        })
      )
    }
  }

  const handleSelectionChange = (checked: boolean) => {
    if (checked && matchedVariant) {
      toggleItem(item.id, matchedVariant.id, customQuantity)
    } else {
      toggleItem(item.id, undefined, 0)
      setOptionValues({})
    }

    window.dispatchEvent(
      new CustomEvent("bundle-changed", {
        detail: {
          selectedItems:
            checked && matchedVariant
              ? [
                  ...selectedItems,
                  {
                    itemId: item.id,
                    variantId: matchedVariant.variantId,
                    quantity: customQuantity,
                  },
                ]
              : selectedItems.filter((si) => si.itemId !== item.id),
          promotionalTotal: 0,
        },
      })
    )
  }

  const handleAddToBundle = () => {
    if (matchedVariant && inStock) {
      toggleItem(item.id, matchedVariant.id, customQuantity)
      window.dispatchEvent(
        new CustomEvent("bundle-changed", {
          detail: {
            selectedItems: [
              ...selectedItems.filter((si) => si.itemId !== item.id),
              {
                itemId: item.id,
                variantId: matchedVariant.id,
                quantity: customQuantity,
              },
            ],
            promotionalTotal: 0,
          },
        })
      )
    }
  }

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
        "flex flex-col gap-y-4 p-4 border rounded-lg shadow-sm",
        isSelected
          ? "border-ui-border-interactive bg-ui-bg-highlight"
          : "border-ui-border-base hover:border-ui-border-strong"
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-4">
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
                current={optionValues[option.id]}
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
