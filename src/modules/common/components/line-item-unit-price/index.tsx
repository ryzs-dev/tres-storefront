import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { clx, Text } from "@medusajs/ui"

type LineItemUnitPriceProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  style?: "default" | "tight"
  currencyCode: string
}

const LineItemUnitPrice = ({
  item,
  style = "default",
  currencyCode,
}: LineItemUnitPriceProps) => {
  const originalPrice = Number(item.original_total) || 0

  const hasReducedPrice = Number(item?.metadata?.original_price_cents) / 100

  return (
    <div className="flex flex-col text-ui-fg-muted justify-start h-full">
      {hasReducedPrice ? (
        <>
          <Text>
            <span data-testid="product-unit-original-price">
              {convertToLocale({
                amount: (hasReducedPrice ?? 0) / 100,
                currency_code: currencyCode,
              })}
            </span>
          </Text>
        </>
      ) : (
        <span
          // className={clx("text-base-regular", {
          //   "text-ui-fg-interactive": hasReducedPrice,
          // })}
          // data-testid="product-unit-price"
          className="text-gray-900 text-sm"
        >
          {convertToLocale({
            amount: originalPrice,
            currency_code: currencyCode,
          })}
        </span>
      )}
    </div>
  )
}

export default LineItemUnitPrice
