// src/modules/cart/components/item/index.tsx
"use client"

import { Table, Text, clx, Badge } from "@medusajs/ui"
import { updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
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

  // Bundle discount information
  const isBundleItem = item.metadata?.is_from_bundle === true
  const bundleTitle = item.metadata?.bundle_title as string
  const savingsInfo = calculateItemSavings(item)

  return (
    <Table.Row className="w-full items-start" data-testid="product-row">
      {/* Product Image */}
      <Table.Cell className="!pl-0 p-2 small:p-4 w-16 small:w-24 align-top">
        <LocalizedClientLink
          href={`/products/${item.product_handle}`}
          className="flex"
        >
          <Thumbnail
            thumbnail={item.thumbnail}
            images={item.variant?.product?.images}
            size="square"
            className={clx("rounded-md", {
              "w-12 h-12": type === "preview",
              "w-14 h-14 small:w-20 small:h-20": type === "full",
            })}
          />
        </LocalizedClientLink>
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
            data-testid="product-delete-button"
            bundle_id={item.metadata?.bundle_id as string}
            className="text-xs text-gray-400 hover:text-black hover:underline mt-1"
          >
            {item.metadata?.bundle_id !== undefined ? (
              <>
                Remove
                <span className="hidden small:inline"> from Bundle</span>
              </>
            ) : (
              "Remove"
            )}
          </DeleteButton>

          {error && (
            <ErrorMessage error={error} data-testid="product-error-message" />
          )}
        </div>
      </Table.Cell>

      {/* Quantity Column */}
      {type === "full" && (
        <Table.Cell className="p-2 small:p-4 align-top text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <button
                className="text-lg px-2 py-1 rounded hover:bg-ui-bg-subtle disabled:opacity-40"
                onClick={() => changeQuantity(item.quantity - 1)}
                disabled={item.quantity <= 1 || updating}
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
              >
                +
              </button>
            </div>

            {updating && <Spinner className="w-3 h-3 small:w-4 small:h-4" />}
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
      <Table.Cell className="!pr-0 p-2 small:p-4 align-top text-right">
        <div className="flex flex-col items-end gap-1">
          {/* Mobile: Show unit price above total */}
          <div className="small:hidden text-xs text-gray-600">
            <LineItemUnitPrice
              item={item}
              style="tight"
              currencyCode={currencyCode}
            />
          </div>

          {/* Total Price */}
          <LineItemPrice
            item={item}
            style="default"
            currencyCode={currencyCode}
          />

          {/* Savings Display */}
          {isBundleItem && savingsInfo.savings > 0 && (
            <div className="text-xs text-[#99b2dd]">
              Saved: {formatCurrency(savingsInfo.savings * item.quantity)}
            </div>
          )}
        </div>
      </Table.Cell>
    </Table.Row>
  )
}

export default Item
