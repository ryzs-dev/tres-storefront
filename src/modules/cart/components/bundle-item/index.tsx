"use client"

import { Text, toast } from "@medusajs/ui"
import Thumbnail from "@modules/products/components/thumbnail"
import { HttpTypes } from "@medusajs/types"
import { useState } from "react"
import DeleteButton from "@modules/common/components/delete-button"
import { useCart } from "context/CartContext"

type BundleItemProps = {
  bundleId: string
  bundleTitle: string
  countryCode: string
  items: HttpTypes.StoreCartLineItem[]
  currencyCode: string
}

const BundleItem = ({
  bundleId,
  bundleTitle,
  items,
  currencyCode,
  countryCode,
}: BundleItemProps) => {
  const [updating, setUpdating] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { updateToCart } = useCart()

  // Calculate bundle discount
  const bundleDiscount = (items[0]?.metadata?.discount_applied as number) || 0

  const updateBundleItemQuantity = async (
    bundleItemId: string,
    newQuantity: number
  ) => {
    // Prepare the updated selection with the correct structure
    const updatedSelection = items
      .map((bundleItem) => {
        const itemBundleItemId = bundleItem.metadata?.bundle_item_id as string

        return {
          item_id: itemBundleItemId,
          variant_id: bundleItem.variant_id as string,
          quantity:
            itemBundleItemId === bundleItemId
              ? newQuantity
              : bundleItem.quantity,
        }
      })
      .filter((item) => item.quantity > 0) // Remove zero-quantity items

    console.log("🧩 Sending payload:", {
      bundle_id: bundleId,
      selected_items: updatedSelection, // ✅ must be snake_case
    })

    try {
      await updateToCart({
        bundleId,
        selectedItems: updatedSelection, // CartContext handles renaming internally
        countryCode,
      })

      toast.success("Item quantity updated successfully")
    } catch (err) {
      console.error("❌ Update failed:", err)
      toast.error("Failed to update item quantity. Please try again.")
    }
  }

  const changeQuantity = async (
    item: HttpTypes.StoreCartLineItem,
    quantity: number
  ) => {
    setError(null)
    setUpdating(item.id)

    try {
      const bundleItemId = item.metadata?.bundle_item_id as string
      await updateBundleItemQuantity(bundleItemId, quantity)
      toast.success("Item quantity updated successfully")
    } catch (err) {
      setError("Limited Availability")
      toast.error("Failed to update item quantity. Please try again.")
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="mb-6">
      {/* Bundle Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <Text className="font-semibold text-gray-900">{bundleTitle}</Text>
          {bundleDiscount > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              RM {bundleDiscount / 100} OFF
            </span>
          )}
        </div>
        <Text className="text-sm text-gray-500">
          {items.length} {items.length > 1 ? "items" : "item"}
        </Text>
      </div>

      {/* Error message */}
      {error && (
        <div className="px-4 py-2 bg-red-50 text-red-600 text-sm rounded mb-4">
          {error}
        </div>
      )}

      {/* Bundle Items */}
      <div className="space-y-4">
        {items.map((item) => {
          const isUpdating = updating === item.id

          return (
            <div key={item.id} className="flex gap-4">
              {/* Thumbnail */}
              <div className="flex-shrink-0 aspect-video">
                <Thumbnail
                  thumbnail={item.thumbnail}
                  images={item.variant?.product?.images}
                  size="full"
                  className="rounded-md w-28 h-40 object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="flex-grow">
                <Text className="text-base font-medium text-gray-900 mb-1">
                  {item.product_title}
                </Text>
                <Text className="text-sm text-gray-600 mb-1">
                  Variant : {item.variant?.title?.split(" / ")[0] || "N/A"}
                </Text>

                {/* Price */}
                {/* Original price (if discounted) */}
                {item.compare_at_unit_price &&
                  item.compare_at_unit_price > item.unit_price && (
                    <Text className="text-lg font-semibold text-gray-500 line-through">
                      {item.compare_at_unit_price.toLocaleString("en-MY", {
                        style: "currency",
                        currency: currencyCode,
                      })}
                    </Text>
                  )}

                {/* Discounted unit price */}
                <Text className="text-lg font-semibold text-gray-900">
                  {item.unit_price.toLocaleString("en-MY", {
                    style: "currency",
                    currency: currencyCode,
                  })}
                </Text>

                {/* Quantity Controls and Remove */}
                <div className="flex items-center gap-6 mt-3">
                  <div className="flex items-center gap-3">
                    <button
                      className="flex items-center justify-center w-8 h-8 rounded border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      onClick={() => changeQuantity(item, item.quantity - 1)}
                      disabled={item.quantity <= 1 || isUpdating}
                      aria-label="Decrease quantity"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-gray-700"
                      >
                        <path
                          d="M2 6H10"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>

                    <span className="min-w-[40px] text-center text-base font-medium text-gray-900 select-none">
                      {isUpdating ? (
                        <svg
                          className="animate-spin h-5 w-5 mx-auto text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      ) : (
                        item.quantity
                      )}
                    </span>

                    <button
                      className="flex items-center justify-center w-8 h-8 rounded border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      onClick={() => changeQuantity(item, item.quantity + 1)}
                      disabled={item.quantity >= 5 || isUpdating}
                      aria-label="Increase quantity"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-gray-700"
                      >
                        <path
                          d="M6 2V10M2 6H10"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>

                  <DeleteButton
                    id={item.id}
                    bundle_id={item.metadata?.bundle_id as string}
                    bundle_item_id={item.metadata?.bundle_item_id as string} // Add this
                    countryCode={countryCode} // Add this
                    remove_entire_bundle={true} // Set to false for single item removal
                    className="text-sm font-medium text-gray-900 underline hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Remove
                  </DeleteButton>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default BundleItem
