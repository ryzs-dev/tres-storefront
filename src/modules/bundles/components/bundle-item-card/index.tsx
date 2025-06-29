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

  const selectedItem = useMemo(
    () => selectedItems.find((si) => si.itemId === item.id),
    [selectedItems, item.id]
  )

  const selectedVariantId = selectedItem?.variantId
  const selectedQuantity = selectedItem?.quantity || item.quantity

  const matchedVariant = useMemo(() => {
    if (!item.product.variants) return undefined
    return item.product.variants.find(
      (variant) => variant.id === selectedVariantId
    )
  }, [item.product.variants, selectedVariantId])

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
        const defaultVariant = item.product.variants?.[0]
        if (defaultVariant) {
          toggleItem(item.id, defaultVariant.id, selectedQuantity || 1)
        } else {
          console.warn("Cannot select item without any variants.")
        }
      } else {
        toggleItem(item.id, undefined, 0)
      }
    },
    [toggleItem, item.id, item.product.variants, selectedQuantity]
  )

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
    <div
      className={clsx(
        "border rounded-lg p-4 transition-colors",
        isSelected
          ? "border-blue-200 bg-blue-50/30"
          : "border-gray-200 hover:border-gray-300"
      )}
    >
      {/* Header */}
      <div className="flex gap-4">
        {/* Image with proper spacing for quantity indicator */}
        <div className="relative">
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
            {filteredImages.length > 0 ? (
              <>
                <img
                  src={filteredImages[currentImageIndex].url}
                  alt={item.product.title || "Product image"}
                  className="w-full h-full object-cover"
                />
                {filteredImages.length > 1 && (
                  <div className="absolute inset-0 flex items-center justify-between px-1 opacity-0 hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePrevImage()
                      }}
                      disabled={currentImageIndex === 0}
                      className="p-1.5 rounded-full bg-white/90 text-gray-700 shadow-sm hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleNextImage()
                      }}
                      disabled={currentImageIndex === filteredImages.length - 1}
                      className="p-1.5 rounded-full bg-white/90 text-gray-700 shadow-sm hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg
                        width="12"
                        height="12"
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
              <div className="w-full h-full flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-gray-400"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21,15 16,10 5,21" />
                </svg>
              </div>
            )}
          </div>

          {/* Fixed quantity indicator positioning */}
          {isSelected && (
            <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center shadow-sm border-2 border-white font-medium">
              {selectedQuantity}
            </div>
          )}
        </div>

        {/* Product info and selection */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div
            className="flex-1 cursor-pointer py-1"
            onClick={() => handleSelectionChange(!isSelected)}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <Heading
                level="h3"
                className="text-sm font-medium line-clamp-2 flex-1"
              >
                {item.product.title}
              </Heading>
              <div className="flex-shrink-0">
                <div
                  className={clsx(
                    "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                    isSelected
                      ? "bg-blue-600 border-blue-600"
                      : "border-gray-300 hover:border-gray-400"
                  )}
                >
                  {isSelected && (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                    >
                      <polyline points="20,6 9,17 4,12" />
                    </svg>
                  )}
                </div>
              </div>
            </div>

            {matchedVariant && (
              <ProductPrice
                product={item.product as unknown as HttpTypes.StoreProduct}
                variant={matchedVariant as HttpTypes.StoreProductVariant}
                className="text-sm font-semibold text-gray-900"
              />
            )}
          </div>

          {isSelected && (
            <div className="text-xs text-blue-600 font-medium flex items-center gap-1 mt-1">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
              Added to bundle
            </div>
          )}
        </div>
      </div>

      {isSelected && (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-4 animate-in slide-in-from-top-2 duration-200">
          {/* Options */}
          {(item.product.options || []).map(
            (option: HttpTypes.StoreProductOption) => (
              <div key={option.id}>
                <OptionSelect
                  option={option}
                  current={optionValues?.[option.id] ?? ""}
                  updateOption={handleOptionChange}
                  title={option.title}
                  disabled={false}
                />
              </div>
            )
          )}

          {/* Quantity with improved controls */}
          <div className="flex items-center gap-2">
            <label
              htmlFor={`quantity-${item.id}`}
              className="text-sm font-medium"
            >
              Qty:
            </label>
            <div className="flex items-center border rounded">
              <button
                type="button"
                onClick={() => handleQuantityChange(selectedQuantity - 1)}
                disabled={selectedQuantity <= 1}
                className="px-2 py-1 bg-white hover:bg-gray-100 disabled:opacity-50 transition-colors"
              >
                −
              </button>
              <input
                id={`quantity-${item.id}`}
                type="number"
                min="1"
                value={selectedQuantity}
                onChange={(e) =>
                  handleQuantityChange(parseInt(e.target.value) || 1)
                }
                className="w-12 h-8 text-center text-sm border-0 focus:ring-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <button
                type="button"
                onClick={() => handleQuantityChange(selectedQuantity + 1)}
                className="px-2 py-1 bg-white hover:bg-gray-100 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Variant info with better styling */}
          {matchedVariant && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <Text className="text-xs text-gray-500 mb-1">
                Selected variant:
              </Text>
              <Text className="text-sm font-medium text-gray-900">
                {matchedVariant.title}
              </Text>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default BundleItemCard
