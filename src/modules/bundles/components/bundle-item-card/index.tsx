"use client"

import { useMemo, useCallback, useRef, useState, useEffect } from "react"
import { HttpTypes } from "@medusajs/types"
import { FlexibleBundle } from "@lib/data/bundles"
import { useBundleSelection } from "../../context/bundle-selection-context"
import { Heading, Text } from "@medusajs/ui"
import ProductPrice from "@modules/products/components/product-price"
import clsx from "clsx"
import { useVariantAvailability } from "@lib/hooks/useVariantAvailability"
import { error } from "console"

type Props = {
  item: FlexibleBundle["items"][0] & { stock?: number | null }
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

const DEFAULT_SALES_CHANNEL =
  process.env.SALES_CHANNEL || "sc_01JQ41G40QHMRTH269SSZ8XAHB"

const BundleItemCard = ({ item, region }: Props) => {
  const { toggleItem, isItemSelected, updateItemQuantity, selectedItems } =
    useBundleSelection()

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [stock, setStock] = useState<number | null>(null)
  const [loadingStock, setLoadingStock] = useState(false)
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

  const { availability, isLoading, error } = useVariantAvailability(
    matchedVariant?.id ?? "",
    DEFAULT_SALES_CHANNEL
  )

  useEffect(() => {
    if (!matchedVariant?.id) return

    if (isLoading) {
      setLoadingStock(true)
      return
    }

    if (error) {
      console.error("❌ Failed to fetch stock:", error)
      setStock(null)
      setLoadingStock(false)
      return
    }

    const available = availability?.[0]?.available_quantity ?? null
    setStock(available)
    setLoadingStock(false)
  }, [matchedVariant?.id, isLoading, error, availability])

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

  return (
    <div
      className={clsx(
        "border rounded-lg p-4 transition-colors",
        isSelected
          ? "border-blue-200 bg-blue-50/30"
          : "border-gray-200 hover:border-gray-300"
      )}
    >
      <div className="flex gap-4">
        {/* Thumbnail */}
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
          {images?.[0] ? (
            <img
              src={images[currentImageIndex].url}
              alt={item.product.title || "Product image"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              No image
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div
            className="flex-1 cursor-pointer"
            onClick={() => handleSelectionChange(!isSelected)}
          >
            <Heading level="h3" className="text-sm font-medium line-clamp-2">
              {item.product.title}
            </Heading>

            {matchedVariant && (
              <>
                <ProductPrice
                  product={item.product as unknown as HttpTypes.StoreProduct}
                  variant={matchedVariant as HttpTypes.StoreProductVariant}
                  className="text-sm font-semibold text-gray-900"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {loadingStock ? (
                    "Checking stock..."
                  ) : stock !== null ? (
                    stock > 0 ? (
                      <span className="text-green-600 font-medium">
                        {stock} available
                      </span>
                    ) : (
                      <span className="text-red-500 font-medium">
                        Out of stock
                      </span>
                    )
                  ) : (
                    "Stock unavailable"
                  )}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BundleItemCard
