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

  // TODO: Update this to grab the actual max inventory
  const maxQtyFromInventory = 10
  const maxQuantity = item.variant?.manage_inventory ? 10 : maxQtyFromInventory

  // Bundle discount information
  const isBundleItem = item.metadata?.is_from_bundle === true
  const bundleDiscountPercentage = item.metadata?.bundle_discount_percentage as number
  const originalPriceCents = item.metadata?.original_price_cents as number
  const discountedPriceCents = item.metadata?.discounted_price_cents as number
  const bundleTitle = item.metadata?.bundle_title as string
  
  // FIXED: Clean up the percentage display and ensure we have valid numbers
  const cleanDiscountPercentage = bundleDiscountPercentage ? Math.round(bundleDiscountPercentage) : 0
  const showBundleDiscount = isBundleItem && cleanDiscountPercentage > 0
  const originalPrice = originalPriceCents ? originalPriceCents / 100 : 0
  const discountedPrice = discountedPriceCents ? discountedPriceCents / 100 : 0
  const savings = originalPrice > 0 && discountedPrice > 0 ? originalPrice - discountedPrice : 0

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
        
        {/* Bundle Information - ENHANCED */}
        {isBundleItem && (
          <div className="mt-2 space-y-1">
            <Badge className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              📦 {bundleTitle || 'Bundle Item'}
            </Badge>
            {showBundleDiscount && (
              <div className="text-xs text-green-600 font-medium">
                🎉 {cleanDiscountPercentage}% Bundle Discount Applied
              </div>
            )}
          </div>
        )}
      </Table.Cell>

      {type === "full" && (
        <Table.Cell>
          <div className="flex gap-2 items-center w-28">
            <DeleteButton
              id={item.id}
              data-testid="product-delete-button"
              bundle_id={item.metadata?.bundle_id as string}
            >
              {item.metadata?.bundle_id !== undefined
                ? "Remove bundle"
                : "Remove"}
            </DeleteButton>
            <CartItemSelect
              value={item.quantity}
              onChange={(value) => changeQuantity(parseInt(value.target.value))}
              className="w-14 h-10 p-4"
              data-testid="product-select-button"
            >
              {/* TODO: Update this with the v2 way of managing inventory */}
              {Array.from(
                {
                  length: Math.min(maxQuantity, 10),
                },
                (_, i) => (
                  <option value={i + 1} key={i}>
                    {i + 1}
                  </option>
                )
              )}

              <option value={1} key={1}>
                1
              </option>
            </CartItemSelect>
            {updating && <Spinner />}
          </div>
          <ErrorMessage error={error} data-testid="product-error-message" />
        </Table.Cell>
      )}

      {type === "full" && (
        <Table.Cell className="hidden small:table-cell">
          {/* Show original price crossed out if discounted - FIXED */}
          <div className="flex flex-col items-end">
            {showBundleDiscount && originalPrice > 0 && savings > 0 && (
              <Text className="text-xs text-ui-fg-muted line-through">
                {currencyCode} {originalPrice.toFixed(2)}
              </Text>
            )}
            <LineItemUnitPrice
              item={item}
              style="tight"
              currencyCode={currencyCode}
            />
          </div>
        </Table.Cell>
      )}

      <Table.Cell className="!pr-0">
        <span
          className={clx("!pr-0", {
            "flex flex-col items-end h-full justify-center": type === "preview",
          })}
        >
          {type === "preview" && (
            <span className="flex gap-x-1 ">
              <Text className="text-ui-fg-muted">{item.quantity}x </Text>
              <LineItemUnitPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
            </span>
          )}
          
          {/* Show original total crossed out if discounted - FIXED */}
          {showBundleDiscount && originalPrice > 0 && savings > 0 && type === "full" && (
            <Text className="text-xs text-ui-fg-muted line-through">
              {currencyCode} {(originalPrice * item.quantity).toFixed(2)}
            </Text>
          )}
          
          <LineItemPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
          
          {/* Show savings - ENHANCED */}
          {showBundleDiscount && savings > 0 && (
            <Text className="text-xs text-green-600 font-medium">
              Saved: {currencyCode} {(savings * item.quantity).toFixed(2)}
            </Text>
          )}
        </span>
      </Table.Cell>
    </Table.Row>
  )
}

export default Item