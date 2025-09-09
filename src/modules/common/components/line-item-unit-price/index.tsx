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
  const originalPriceCents = Number(item.metadata?.original_price_cents) || 0
  const hasReducedPrice =
    originalPriceCents > 0 && originalPriceCents > item.unit_price * 100

  const amount = item.original_total

  return (
    <div className="flex flex-col text-ui-fg-muted justify-start h-full">
      {/* {hasReducedPrice && (
        <>
          <Text>
            <span data-testid="product-unit-original-price">
              {convertToLocale({
                amount: (originalPriceCents ?? 0) / 100,
                currency_code: currencyCode,
              })}
            </span>
          </Text>
        </>
      )} */}
      <span
        // className={clx("text-base-regular", {
        //   "text-ui-fg-interactive": hasReducedPrice,
        // })}
        // data-testid="product-unit-price"
        className="text-gray-900 text-sm"
      >
        {convertToLocale({
          amount: amount,
          currency_code: currencyCode,
        })}
      </span>
    </div>
  )
}

export default LineItemUnitPrice
