// src/modules/cart/components/item/index.tsx
"use client"

import { Table, Text, clx, Badge } from "@medusajs/ui"
import { updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import CartItemSelect from "@modules/cart/components/cart-item-select"
import ErrorMessage from "@modules/checkout/components/error-message"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import Thumbnail from "@modules/products/components/thumbnail"
import { calculateItemSavings, formatCurrency } from "@lib/utils/currency"
import { useState } from "react"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
}

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)

    await updateLineItem({
      lineId: item.id,
      quantity,
    })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setUpdating(false)
      })
  }

  console.log("🔍 CartItemSelect debug:", {
    itemId: item.id,
    quantity: item.quantity,
    quantityType: typeof item.quantity,
    value: item.quantity,
  })

  // TODO: Update this to grab the actual max inventory
  const maxQtyFromInventory = 10
  const maxQuantity = item.variant?.manage_inventory ? 10 : maxQtyFromInventory

  // UPDATED: Bundle discount information - supports both fixed and percentage discounts
  const isBundleItem = item.metadata?.is_from_bundle === true
  const bundleTitle = item.metadata?.bundle_title as string
  const savingsInfo = calculateItemSavings(item)

  return (
    <Table.Row className="w-full" data-testid="product-row">
      <Table.Cell className="!pl-0 p-4 w-24">
        <LocalizedClientLink
          href={`/products/${item.product_handle}`}
          className={clx("flex", {
            "w-16": type === "preview",
            "small:w-24 w-12": type === "full",
          })}
        >
          <Thumbnail
            thumbnail={item.thumbnail}
            images={item.variant?.product?.images}
            size="square"
          />
        </LocalizedClientLink>
      </Table.Cell>

      <Table.Cell className="text-left">
        <Text
          className="txt-medium-plus text-ui-fg-base"
          data-testid="product-title"
        >
          {item.product_title}
        </Text>
        <LineItemOptions variant={item.variant} data-testid="product-variant" />
        <DeleteButton
          id={item.id}
          data-testid="product-delete-button"
          bundle_id={item.metadata?.bundle_id as string}
        >
          {item.metadata?.bundle_id !== undefined
            ? "Remove from Bundle"
            : "Remove"}
        </DeleteButton>

        {/* UPDATED: Bundle Information with Fixed Discount Support
        {isBundleItem && (
          <div className="mt-2 space-y-1">
            <Badge className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              📦 {bundleTitle || "Bundle Item"}
            </Badge>
            {savingsInfo.discountType !== "none" && (
              <div className="text-xs text-green-600 font-medium">
                🎉 {savingsInfo.discountText}
              </div>
            )}
            {savingsInfo.savings > 0 && (
              <div className="text-xs text-green-600">
                Saved: {formatCurrency(savingsInfo.savings)}
              </div>
            )}
          </div>
        )} */}
      </Table.Cell>

      {type === "full" && (
        <Table.Cell>
          <div className="flex gap-2 items-center">
            {/* <CartItemSelect
              value={item.quantity}
              onChange={(e) => changeQuantity(Number(e.target.value))}
              disabled={updating}
              data-testid="product-quantity-select"
            >
            </CartItemSelect> */}
            {item.quantity}
          </div>
          <ErrorMessage error={error} data-testid="product-error-message" />
        </Table.Cell>
      )}

      <Table.Cell className="hidden small:table-cell">
        <LineItemUnitPrice
          item={item}
          style="default"
          currencyCode={currencyCode}
        />
        {/* Show original price if discounted
        {savingsInfo.savings > 0 &&
          savingsInfo.originalPrice > savingsInfo.discountedPrice && (
            <div className="text-xs text-ui-fg-muted line-through">
              Original: {formatCurrency(savingsInfo.originalPrice)}
            </div>
          )} */}
      </Table.Cell>

      <Table.Cell>
        <div className="flex flex-col items-end">
          <LineItemPrice
            item={item}
            style="default"
            currencyCode={currencyCode}
          />
          {updating && <Spinner />}
        </div>
      </Table.Cell>
    </Table.Row>
  )
}

export default Item
