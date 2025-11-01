"use client"

import { Button, Heading, Text } from "@medusajs/ui"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getBundleDiscounts } from "@lib/util/get-bundle-discount"

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    shipping_total: number
    metadata?: Record<string, any>
  }
}

const Summary = ({ cart }: SummaryProps) => {
  const originalCartTotal =
    cart.items?.reduce((total, item) => {
      const basePrice = item.metadata?.unit_price
        ? Number(item.metadata.unit_price)
        : item.unit_price
      return total + basePrice * item.quantity
    }, 0) || 0

  const bundleDiscounts = getBundleDiscounts(cart)

  const otherDiscount = cart.discount_total

  return (
    <div className="flex flex-col gap-y-6">
      <Heading level="h2" className="text-[2rem] leading-[2.75rem]">
        Summary
      </Heading>

      <div className="flex flex-col gap-y-3 txt-medium text-ui-fg-subtle">
        <div className="flex items-center justify-between">
          <Text>Subtotal</Text>
          <Text className="text-gray-700 font-medium">
            {convertToLocale({
              amount: originalCartTotal,
              currency_code: cart.currency_code,
            })}
          </Text>
        </div>

        {Object.values(bundleDiscounts)
          .filter((bundle) => bundle.discount > 0) // ✅ only show bundles with discount
          .map((bundle) => (
            <div
              key={bundle.title}
              className="flex items-center justify-between border-b border-gray-100 pb-1"
            >
              <Text className="text-gray-500">Bundle: {bundle.title}</Text>
              <Text className="text-[#99b2dd] font-medium">
                -{" "}
                {convertToLocale({
                  amount: bundle.discount / 100,
                  currency_code: cart.currency_code,
                })}
              </Text>
            </div>
          ))}

        {/* Other Discounts */}
        {otherDiscount > 0 && (
          <div className="flex items-center justify-between">
            <Text>Other Discount</Text>
            <Text className="text-[#99b2dd] font-medium">
              -{" "}
              {convertToLocale({
                amount: otherDiscount,
                currency_code: cart.currency_code,
              })}
            </Text>
          </div>
        )}

        {/* Shipping */}
        <div className="flex items-center justify-between">
          <Text>Shipping</Text>
          <Text className="text-gray-700 font-medium">
            {convertToLocale({
              amount: cart.shipping_total ?? 0,
              currency_code: cart.currency_code,
            })}
          </Text>
        </div>
      </div>

      <div className="h-px w-full border-b border-gray-200" />

      {/* --- Total --- */}
      <div className="flex items-center justify-between text-ui-fg-base txt-medium-plus">
        <Text>Total</Text>
        <Text
          className="txt-xlarge-plus font-semibold"
          data-testid="cart-total"
        >
          {convertToLocale({
            amount: cart.total,
            currency_code: cart.currency_code,
          })}
        </Text>
      </div>

      {/* --- Checkout Button --- */}
      <LocalizedClientLink href={`/checkout`} data-testid="checkout-button">
        <Button className="w-full h-10">
          Checkout{" "}
          {convertToLocale({
            amount: cart.total,
            currency_code: cart.currency_code,
          })}
        </Button>
      </LocalizedClientLink>
    </div>
  )
}

export default Summary
