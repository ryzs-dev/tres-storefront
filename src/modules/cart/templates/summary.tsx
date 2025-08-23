// src/modules/cart/templates/summary.tsx - Enhanced version
"use client"

import { Badge, Button, Heading, Text } from "@medusajs/ui"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { BundleDiscountDisplay } from "@modules/common/components/bundle-discount-display"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useParams } from "next/navigation"

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    shipping_total: number
    tax_total: number
  }
}

const Summary = ({ cart }: SummaryProps) => {
  const { countryCode } = useParams() as { countryCode: string }

  // Calculate bundle savings
  const bundleSavings =
    cart.items?.reduce((total, item) => {
      if (
        item.metadata?.discounted_price_cents &&
        item.metadata?.original_price_cents
      ) {
        const originalPrice = item.metadata.original_price_cents
        const currentPrice = item.metadata.discounted_price_cents
        const savings =
          ((Number(originalPrice) - Number(currentPrice)) * item.quantity) / 100
        return total + savings
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

  const discountedCartTotal =
    cart.items?.reduce((total, item) => {
      return total + item.unit_price * item.quantity
    }, 0) || 0

  console.log(cart.items)

  return (
    <div className="flex flex-col gap-y-6">
      <Heading level="h2" className="text-[2rem] leading-[2.75rem]">
        Summary
      </Heading>

      {/* Price Breakdown */}
      <div className="flex flex-col gap-y-2 txt-medium text-ui-fg-subtle">
        <div className="flex items-center justify-between">
          <Text>Original Total</Text>
          <Text className="line-through text-gray-600">
            {convertToLocale({
              amount: originalCartTotal,
              currency_code: cart.currency_code,
            })}
          </Text>
        </div>
        <div className="flex items-center justify-between">
          <Text>Discounted Total</Text>
          <Text data-testid="cart-bundle-saving">
            -{" "}
            {convertToLocale({
              amount: bundleSavings,
              currency_code: cart.currency_code,
            })}
          </Text>
        </div>

        <div className="flex items-center justify-between">
          <Text className="flex items-center gap-x-1">Subtotal</Text>
          <Text data-testid="cart-subtotal">
            {convertToLocale({
              amount: cart.subtotal ?? 0,
              currency_code: cart.currency_code,
            })}
          </Text>
        </div>

        {/* Bundle Discounts */}
        {/* {bundleSavings > 0 && (
          <div className="flex items-center justify-between">
            <Text className="text-[#99b2dd]">Bundle Discounts</Text>
            <Text
              className="text-[#99b2dd] font-medium"
              data-testid="bundle-savings"
            >
              -
              {convertToLocale({
                amount: bundleSavings,
                currency_code: cart.currency_code,
              })}
            </Text>
          </div>
        )} */}

        {/* Regular Discounts */}
        {!!cart.discount_total && (
          <div className="flex items-center justify-between">
            <Text>Other Discounts</Text>
            <Text
              className="text-ui-fg-interactive"
              data-testid="cart-discount"
            >
              -
              {convertToLocale({
                amount: cart.discount_total,
                currency_code: cart.currency_code,
              })}
            </Text>
          </div>
        )}

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

      <div className="h-px w-full border-b border-gray-200" />

      <div className="flex items-center justify-between text-ui-fg-base txt-medium-plus">
        <Text>Total</Text>
        <Text className="txt-xlarge-plus" data-testid="cart-total">
          {convertToLocale({
            amount: cart.total,
            currency_code: cart.currency_code,
          })}
        </Text>
      </div>

      <LocalizedClientLink href={`/checkout`} data-testid="checkout-button">
        <Button className="w-full h-10">Checkout</Button>
      </LocalizedClientLink>
    </div>
  )
}

export default Summary
