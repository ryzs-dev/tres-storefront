// src/modules/cart/templates/summary.tsx - Enhanced version with Custom Promo
"use client"

import { Button, Heading, Text } from "@medusajs/ui"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CustomPromoCode from "@modules/checkout/components/custom-promo-code"
import { useParams } from "next/navigation"

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    shipping_total: number
    tax_total: number
    metadata?: Record<string, any>
  }
}

const Summary = ({ cart }: SummaryProps) => {
  const { countryCode } = useParams() as { countryCode: string }

  // Calculate bundle savings
  const bundleSavings =
    cart.items?.reduce((total, item) => {
      // Only calculate for bundle items that have discounts applied
      if (
        item.metadata?.is_from_bundle &&
        item.metadata?.actual_discount_amount
      ) {
        // Use the actual_discount_amount which is already the total discount for this item
        const itemSavings = Number(item.metadata.actual_discount_amount) / 100
        console.log(`Item ${item.id}: ${itemSavings} RM savings`)
        return total + itemSavings
      }
      return total
    }, 0) || 0

  // Calculate original and discounted totals
  const originalCartTotal =
    cart.items?.reduce((total, item) => {
      if (item.metadata?.original_price_cents) {
        return (
          total +
          (Number(item.metadata.original_price_cents) * item.quantity) / 100
        )
      }
      // Fallback to current price if no original price is set
      return total + item.unit_price * item.quantity
    }, 0) || 0

  const otherDiscount = cart.discount_total

  console.log("Cart in Summary:", cart)

  return (
    <div className="flex flex-col gap-y-6">
      <Heading level="h2" className="text-[2rem] leading-[2.75rem]">
        Summary
      </Heading>

      {/* Price Breakdown */}
      <div className="flex flex-col gap-y-2 txt-medium text-ui-fg-subtle">
        <div className="flex items-center justify-between">
          <Text>Original Total</Text>
          <Text className=" text-gray-600">
            {convertToLocale({
              amount: originalCartTotal,
              currency_code: cart.currency_code,
            })}
          </Text>
        </div>

        {bundleSavings > 0 && (
          <div className="flex items-center justify-between">
            <Text>Bundle Discount</Text>
            <Text data-testid="cart-bundle-saving" className="text-[#99b2dd]">
              -{" "}
              {convertToLocale({
                amount: bundleSavings,
                currency_code: cart.currency_code,
              })}
            </Text>
          </div>
        )}

        {otherDiscount > 0 && (
          <div className="flex items-center justify-between">
            <Text>Other Discount</Text>
            <Text data-testid="cart-bundle-saving" className="text-[#99b2dd]">
              -{" "}
              {convertToLocale({
                amount: otherDiscount,
                currency_code: cart.currency_code,
              })}
            </Text>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Text className="flex items-center gap-x-1">Subtotal</Text>
          <Text data-testid="cart-subtotal">
            {convertToLocale({
              amount: cart.total ?? 0,
              currency_code: cart.currency_code,
            })}
          </Text>
        </div>

        <div className="flex items-center justify-between">
          <Text>Shipping</Text>
          <Text data-testid="cart-shipping">
            {convertToLocale({
              amount: cart.shipping_total ?? 0,
              currency_code: cart.currency_code,
            })}
          </Text>
        </div>

        <div className="flex justify-between">
          <Text className="flex items-center gap-x-1">Taxes</Text>
          <Text data-testid="cart-taxes">
            {convertToLocale({
              amount: cart.tax_total ?? 0,
              currency_code: cart.currency_code,
            })}
          </Text>
        </div>
      </div>

      {/* Custom Promo Code Component */}

      <div className="h-px w-full border-b border-gray-200" />

      <div className="flex items-center justify-between text-ui-fg-base txt-medium-plus">
        <Text>Total</Text>
        <Text className="txt-xlarge-plus" data-testid="cart-total">
          {convertToLocale({
            amount: cart.total, // Now cart.total should already include all discounts
            currency_code: cart.currency_code,
          })}
        </Text>
      </div>

      <LocalizedClientLink href={`/checkout`} data-testid="checkout-button">
        <Button className="w-full h-10">
          Checkout{" "}
          {convertToLocale({
            amount: cart.total, // Use native cart total
            currency_code: cart.currency_code,
          })}
        </Button>
      </LocalizedClientLink>
    </div>
  )
}

export default Summary
