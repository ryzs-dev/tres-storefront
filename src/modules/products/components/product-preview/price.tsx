import { Text, clx } from "@medusajs/ui"

export default async function PreviewPrice({ price }: { price: any }) {
  if (!price) {
    return null
  }

  return (
    <>
      {price.price_type === "sale" && (
        <Text
          className="line-through text-ui-fg-muted"
          data-testid="original-price"
          size="base"
        >
          {price.original_price}
        </Text>
      )}
      <Text
        className={clx("text-ui-fg-muted font-semibold", {
          "text-ui-fg-interactive": price.price_type === "sale",
        })}
        data-testid="price"
        size="base"
      >
        {price.calculated_price}
      </Text>
    </>
  )
}
