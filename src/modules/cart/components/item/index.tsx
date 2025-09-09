"use client"

import { Table, Text, clx } from "@medusajs/ui"
import { updateFlexibleBundleInCart, updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import ErrorMessage from "@modules/checkout/components/error-message"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import Thumbnail from "@modules/products/components/thumbnail"
import { useState } from "react"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
  cartId: string // Add cartId prop
  countryCode: string // Add countryCode prop
  allCartItems: HttpTypes.StoreCartLineItem[] // Add all cart items to find bundle siblings
}

const Item = ({
  item,
  type = "full",
  currencyCode,
  cartId,
  countryCode,
  allCartItems,
}: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Bundle information
  const isBundleItem = item.metadata?.is_from_bundle === true
  const bundleId = item.metadata?.bundle_id as string
  const bundleItemId = item.metadata?.bundle_item_id as string

  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)

    try {
      if (isBundleItem && bundleId) {
        // Handle bundle item quantity update
        await updateBundleItemQuantity(quantity)
      } else {
        // Handle regular item quantity update
        await updateLineItem({
          lineId: item.id,
          quantity,
        })

        window.dispatchEvent(new Event("cart-updated"))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update quantity")
    } finally {
      setUpdating(false)
    }
  }

  const updateBundleItemQuantity = async (newQuantity: number) => {
    if (!bundleId || !bundleItemId) {
      throw new Error("Missing bundle information")
    }

    // Find all items in the same bundle
    const bundleItems = allCartItems.filter(
      (cartItem) => cartItem.metadata?.bundle_id === bundleId
    )

    // Create updated selection with new quantity for this item
    const updatedSelection = bundleItems
      .map((bundleItem) => {
        if (bundleItem.metadata?.bundle_item_id === bundleItemId) {
          // This is the item being updated
          return {
            item_id: bundleItem.metadata?.bundle_item_id as string,
            variant_id: bundleItem.variant_id as string,
            quantity: newQuantity,
          }
        } else {
          // Keep other items as they are
          return {
            item_id: bundleItem.metadata?.bundle_item_id as string,
            variant_id: bundleItem.variant_id as string,
            quantity: bundleItem.quantity,
          }
        }
      })
      .filter((item) => item.quantity > 0) // Remove items with 0 quantity

    // Update the entire bundle with new selection
    await updateFlexibleBundleInCart({
      bundleId,
      countryCode,
      selectedItems: updatedSelection,
    })

    // Dispatch bundle update event
    window.dispatchEvent(
      new CustomEvent("bundle-updated", {
        detail: {
          bundleId,
          action: "quantity-updated",
          itemId: bundleItemId,
          newQuantity,
        },
      })
    )

    window.dispatchEvent(new Event("cart-updated"))
  }

  return (
    <Table.Row className="w-full items-start" data-testid="product-row">
      {/* Product Image */}
      <Table.Cell className="!pl-0 p-2 small:p-4 w-16 small:w-24 align-top">
        <Thumbnail
          thumbnail={item.thumbnail}
          images={item.variant?.product?.images}
          size="square"
          className={clx("rounded-md", {
            "w-12 h-12": type === "preview",
            "w-14 h-14 small:w-20 small:h-20": type === "full",
          })}
        />
      </Table.Cell>

      {/* Product Details */}
      <Table.Cell className="text-left p-2 small:p-4 align-top">
        <div className="flex flex-col gap-1 small:gap-2">
          <Text
            className="text-sm small:txt-medium-plus text-ui-fg-base font-medium"
            data-testid="product-title"
          >
            {item.product_title}
          </Text>

          <LineItemOptions
            variant={item.variant}
            data-testid="product-variant"
          />

          <DeleteButton
            id={item.id}
            bundle_id={item.metadata?.bundle_id as string}
            bundle_item_id={item.metadata?.bundle_item_id as string} // Add this
            allCartItems={allCartItems} // Add this
            countryCode={countryCode} // Add this
            remove_entire_bundle={false} // Set to false for single item removal
            className="text-xs text-gray-400 hover:text-black hover:underline mt-1"
          >
            {/* {item.metadata?.bundle_id !== undefined ? (
              <>
                Remove
                <span className="hidden small:inline"> from Bundle</span>
              </>
            ) : (
              "Remove"
            )} */}
            Remove
          </DeleteButton>

          {error && (
            <ErrorMessage error={error} data-testid="product-error-message" />
          )}
        </div>
      </Table.Cell>

      <Table.Cell></Table.Cell>
      {/* Quantity Column */}
      {type === "full" && (
        <Table.Cell className="p-2 small:p-4 align-top text-right">
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <button
                className="text-lg px-2 py-1 rounded hover:bg-ui-bg-subtle disabled:opacity-40"
                onClick={() => changeQuantity(item.quantity - 1)}
                disabled={item.quantity <= 1 || updating}
                title={
                  isBundleItem
                    ? "Update bundle item quantity"
                    : "Decrease quantity"
                }
              >
                –
              </button>

              <span className="w-8 text-center text-ui-fg-base">
                {item.quantity}
              </span>

              <button
                className="text-lg px-2 py-1 rounded hover:bg-ui-bg-subtle disabled:opacity-40"
                onClick={() => changeQuantity(item.quantity + 1)}
                disabled={item.quantity >= 5 || updating}
                title={
                  isBundleItem
                    ? "Update bundle item quantity"
                    : "Increase quantity"
                }
              >
                +
              </button>
            </div>

            {updating && <Spinner className="w-3 h-3 small:w-4 small:h-4" />}

            {/* Bundle-specific loading message
            {updating && isBundleItem && (
              <Text className="text-xs text-ui-fg-muted">
                Updating bundle...
              </Text>
            )} */}
          </div>
        </Table.Cell>
      )}

      {/* Unit Price (desktop only) */}
      <Table.Cell className="hidden small:table-cell p-2 small:p-4 align-top text-right">
        <LineItemUnitPrice
          item={item}
          style="default"
          currencyCode={currencyCode}
        />
      </Table.Cell>

      {/* Total Column */}
      {/* <Table.Cell className="!pr-0 p-2 small:p-4 align-top text-right">
        <div className="flex flex-col items-end gap-1">
          Mobile: Show unit price above total
          <div className="small:hidden text-xs text-gray-600">
            <LineItemUnitPrice
              item={item}
              style="tight"
              currencyCode={currencyCode}
            />
          </div>

          Total Price
          <LineItemPrice
            item={item}
            style="default"
            currencyCode={currencyCode}
          />
        </div>
      </Table.Cell> */}
    </Table.Row>
  )
}

export default Item
