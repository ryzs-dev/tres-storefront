"use client"

import { addBundleToCart, addToCart } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Button, Divider } from "@medusajs/ui"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { BundleProduct } from "@lib/data/products"
import { isEqual } from "lodash"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import ProductPrice from "../product-price"
import Thumbnail from "../thumbnail"
import { ChevronDown } from "lucide-react"

type BundleActionsProps = {
  bundle: BundleProduct
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

const dispatchBundleVariantChange = (
  productId: string,
  variant: HttpTypes.StoreProductVariant | undefined
) => {
  const event = new CustomEvent("bundle-variant-changed", {
    detail: { productId, variant },
  })
  window.dispatchEvent(event)
}

export default function BundleActions({ bundle }: BundleActionsProps) {
  const [productOptions, setProductOptions] = useState<
    Record<string, Record<string, string>>
  >({})
  const [isAdding, setIsAdding] = useState(false)
  const [addingProductId, setAddingProductId] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState<string | null>(null)
  const [showOptions, setShowOptions] = useState<Record<string, boolean>>({})
  const countryCode = useParams().countryCode as string

  useEffect(() => {
    const initialOptions: Record<string, Record<string, string>> = {}
    const initialShowOptions: Record<string, boolean> = {}
    bundle.items.forEach((item) => {
      initialOptions[item.product.id] = {}
      initialShowOptions[item.product.id] = false
      if (item.product.variants?.length === 1 && item.product.options?.length) {
        const variantOptions = optionsAsKeymap(item.product.variants[0].options)
        initialOptions[item.product.id] = variantOptions ?? {}
      }
    })
    setProductOptions(initialOptions)
    setShowOptions(initialShowOptions)
  }, [bundle.items])

  const selectedVariants = useMemo(() => {
    return bundle.items.map((item) => {
      if (!item.product.variants || item.product.variants.length === 0) {
        return undefined
      }

      const currentOptions = productOptions[item.product.id] || {}
      const variant = item.product.variants.find((v) => {
        const variantOptions = optionsAsKeymap(v.options)
        return isEqual(variantOptions, currentOptions)
      })

      return variant
    })
  }, [bundle.items, productOptions])

  useEffect(() => {
    bundle.items.forEach((item, index) => {
      const variant = selectedVariants[index]
      dispatchBundleVariantChange(item.product.id, variant)
    })
  }, [selectedVariants, bundle.items])

  const setOptionValue = (
    productId: string,
    optionId: string,
    value: string
  ) => {
    setProductOptions((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [optionId]: value,
      },
    }))
  }

  const toggleOptions = (productId: string) => {
    setShowOptions((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }))
  }

  const allVariantsSelected = useMemo(() => {
    return selectedVariants.every((v) => v !== undefined)
  }, [selectedVariants])

  const selectedCount = useMemo(() => {
    return selectedVariants.filter((v) => v !== undefined).length
  }, [selectedVariants])

  const isProductVariantReady = (productIndex: number) => {
    const variant = selectedVariants[productIndex]
    const product = bundle.items[productIndex].product

    if (!variant) return false
    if (!variant.manage_inventory) return true
    if (variant.allow_backorder) return true
    if (variant.inventory_quantity === undefined) return true
    if ((variant.inventory_quantity || 0) > 0) return true
    return false
  }

  const calculateBundleSavings = () => {
    const individualTotal = selectedVariants.reduce((total, variant) => {
      if (!variant) return total
      const price = variant.calculated_price?.calculated_amount || 0
      return total + price
    }, 0)

    const bundlePrice = bundle.calculated_price?.calculated_amount || 0
    return Math.max(0, individualTotal - bundlePrice)
  }

  const showSuccessMessage = (message: string) => {
    setShowSuccess(message)
    setTimeout(() => setShowSuccess(null), 3000)
  }

  const handleAddBundleToCart = async () => {
    if (!allVariantsSelected) return

    setIsAdding(true)
    try {
      await addBundleToCart({
        bundleId: bundle.id,
        quantity: 1,
        countryCode,
        items: bundle.items.map((item, index) => ({
          item_id: item.id,
          variant_id: selectedVariants[index]?.id ?? "",
        })),
      })
      showSuccessMessage("🎉 Bundle added to cart!")
    } catch (error) {
      console.error("❌ Error adding bundle to cart:", error)
    }
    setIsAdding(false)
  }

  const handleAddProductToCart = async (productIndex: number) => {
    const variant = selectedVariants[productIndex]
    const product = bundle.items[productIndex].product
    if (!variant?.id) return

    setAddingProductId(product.id)
    try {
      await addToCart({
        variantId: variant.id,
        quantity: 1,
        countryCode,
      })
      showSuccessMessage(`✓ ${product.title} added to cart!`)
    } catch (error) {
      console.error("❌ Error adding product to cart:", error)
    }
    setAddingProductId(null)
  }

  const bundleSavings = calculateBundleSavings()

  return (
    <div className="flex flex-col gap-y-6 max-w-4xl mx-auto w-full">
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-right">
          {showSuccess}
        </div>
      )}

      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-4 text-sm">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            {selectedCount}/{bundle.items.length} items selected
          </span>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${(selectedCount / bundle.items.length) * 100}%` }}
        />
      </div>

      <div className="flex flex-col gap-4">
        {bundle.items.map((item, index) => {
          const isSelected = selectedVariants[index] !== undefined
          const isReady = isProductVariantReady(index)
          const isCurrentlyAdding = addingProductId === item.product.id

          return (
            <div
              key={item.product.id}
              className={`relative rounded-xl p-6 border-2 transition-all duration-200 ${
                isSelected
                  ? "border-black bg-gray-50/50 shadow-md"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              {(item.product.variants?.length ?? 0) > 1 && (
                <Button
                  onClick={() => toggleOptions(item.product.id)}
                  variant="transparent"
                  className="absolute top-4 right-4 transition-300"
                >
                  <ChevronDown
                    className={`h-6 w-6 transition-transform duration-300 ${
                      showOptions[item.product.id] ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              )}
              <div className="relative flex items-start gap-4 mb-4">
                <Thumbnail
                  thumbnail={item.product.thumbnail}
                  className="w-20 h-20 rounded-lg flex-shrink-0"
                  size="square"
                  images={[]}
                />
                <div className="relative flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {item.product.title}
                  </h3>
                  <ProductPrice
                    product={item.product}
                    variant={selectedVariants[index]}
                    className="!text-base font-semibold mt-2"
                  />
                </div>
              </div>

              {(item.product.variants?.length ?? 0) > 1 &&
                showOptions[item.product.id] && (
                  <div className="space-y-3 mb-4">
                    {(item.product.options || []).map((option) => (
                      <div key={option.id}>
                        <OptionSelect
                          option={option}
                          current={productOptions[item.product.id]?.[option.id]}
                          updateOption={(optionId, value) =>
                            setOptionValue(item.product.id, optionId, value)
                          }
                          title={option.title ?? ""}
                          disabled={isAdding || addingProductId !== null}
                        />
                      </div>
                    ))}
                  </div>
                )}

              <Button
                onClick={() => handleAddProductToCart(index)}
                disabled={!isReady || isAdding || addingProductId !== null}
                variant="primary"
                className={`w-full h-10 transition-all ${
                  isCurrentlyAdding && !isAdding
                    ? "bg-green-100 text-green-700 border-green-300"
                    : isSelected
                    ? "hover:bg-black hover:text-white"
                    : ""
                }`}
                isLoading={addingProductId === item.product.id}
              >
                {(() => {
                  const currentOptions = productOptions[item.product.id] || {}
                  const hasAllRequiredOptions = item.product.options?.every(
                    (opt) =>
                      currentOptions[opt.id] !== undefined &&
                      currentOptions[opt.id] !== ""
                  )

                  if (addingProductId === item.product.id && !isAdding) {
                    return "✓ Added to Cart"
                  }

                  if (!selectedVariants[index]) {
                    if (!hasAllRequiredOptions) {
                      return "Select Options"
                    }
                    return "No Matching Variant"
                  }

                  if (!isReady) {
                    return "Out of Stock"
                  }

                  return `Add Item `
                })()}
              </Button>
            </div>
          )
        })}
        <Divider />
      </div>

      <p className="font-urw text-2xl ">
        MYR{" "}
        {!allVariantsSelected
          ? `${(bundle.calculated_price?.calculated_amount || 0).toFixed(2)}`
          : `${bundleSavings > 0 ? ` ${bundleSavings.toFixed(2)}` : ""}`}
      </p>

      <Button
        onClick={handleAddBundleToCart}
        disabled={!allVariantsSelected || isAdding || addingProductId !== null}
        variant="primary"
        className="w-full h-12"
        isLoading={isAdding}
      >
        {!allVariantsSelected
          ? `Select ${bundle.items.length - selectedCount} more item${
              bundle.items.length - selectedCount !== 1 ? "s" : ""
            }`
          : `Add Complete Bundle to Cart`}
      </Button>

      {/* <div className="bg-gradient-to-r from-gray-50 to-indigo-50 rounded-xl p-6 border border-gray-200">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Complete Bundle Deal
          </h3>

          {bundleSavings > 0 && (
            <div className="text-center">
              <span className="text-2xl font-bold text-green-600">
                Save ${(bundleSavings / 100).toFixed(2)}
              </span>
              <span className="text-gray-600 ml-2">
                when you buy the complete bundle
              </span>
            </div>
          )}

          <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
            <span>Bundle Price:</span>
            <span className="text-xl font-bold text-gray-900">
              $
              {(
                (bundle.calculated_price?.calculated_amount || 0) / 100
              ).toFixed(2)}
            </span>
          </div>

          <Button
            onClick={handleAddBundleToCart}
            disabled={
              !allVariantsSelected || isAdding || addingProductId !== null
            }
            variant="primary"
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            isLoading={isAdding}
          >
            {!allVariantsSelected
              ? `Select ${bundle.items.length - selectedCount} more item${
                  bundle.items.length - selectedCount !== 1 ? "s" : ""
                }`
              : `Add Complete Bundle to Cart${
                  bundleSavings > 0
                    ? ` (Save $${(bundleSavings / 100).toFixed(2)})`
                    : ""
                }`}
          </Button>

          {!allVariantsSelected && (
            <p className="text-sm text-gray-500">
              Select variants for all items to enable bundle purchase
            </p>
          )}
        </div>
      </div> */}
    </div>
  )
}
