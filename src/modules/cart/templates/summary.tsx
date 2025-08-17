"use client"
// src/modules/cart/templates/summary.tsx
import { Badge, Button, Heading, Text } from "@medusajs/ui"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { BundleSavingsSummary } from "@modules/common/components/bundle-discount-display"
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

  return (
    <div className="flex flex-col gap-y-4">
      <Heading level="h2" className="text-[2rem] leading-[2.75rem]">
        Summary
      </Heading>

      <div className="flex flex-col gap-y-2 txt-medium text-ui-fg-subtle ">
        <div className="flex items-center justify-between">
          <Text className="flex items-center gap-x-1">Subtotal</Text>
          <Text data-testid="cart-subtotal">
            {convertToLocale({
              amount: cart.subtotal ?? 0,
              currency_code: cart.currency_code,
            })}
          </Text>
        </div>
        {!!cart.discount_total && (
          <div className="flex items-center justify-between">
            <Text>Discount</Text>
            <Text
              className="text-ui-fg-interactive"
              data-testid="cart-discount"
            >
              -{" "}
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
            amount: cart.total ?? 0,
            currency_code: cart.currency_code,
          })}
        </Text>
      </div>
      <div className="h-px w-full border-b border-gray-200" />
      <div className="flex items-center gap-x-2 py-2">
        <LocalizedClientLink
          href={`/${countryCode}/checkout`}
          className="w-full"
          data-testid="checkout-button"
        >
          <Button className="w-full h-10">Go to checkout</Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default Summary
