import { Text } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import ColorSelector from "./color-selector"

export default function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: any
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const selectedPrice = getProductPrice({
    product,
    region,
  })

  const colorOption = product.options?.find(
    (o: { title: string }) => o.title.toLowerCase() === "color"
  )

  const colorVariants = colorOption
    ? Array.from(
        new Map(
          product?.variants
            .map((v: { options: any[] }) => {
              const color = v.options?.find(
                (o) => o.option_id === colorOption.id
              )?.value
              return color ? [color, v] : null
            })
            .filter(Boolean) as [string, any][]
        )
      )
    : []

  const bestSellerTitles = ["lively", "celine", "piper", "daz"]
  const sales = ["hanna", "mel", "sunny", "piper", "luxy"]

  const isBestSeller = bestSellerTitles.some((title) =>
    product.title.toLowerCase().includes(title.toLowerCase())
  )

  return (
    <>
      <div data-testid="product-wrapper" className="relative">
        {/* IMAGE + COLOR are interactive */}
        <ColorSelector
          colors={colorVariants.map(([color, variant]) => ({
            color,
            thumbnail: variant.thumbnail,
            variantId: variant.id,
          }))}
          defaultImage={product.thumbnail}
          productHandle={product.handle}
        />

        {/* Best Seller Badge */}
        {isBestSeller && (
          <span className="absolute top-0 left-0 bg-tres-primary text-white text-sm font-semibold px-2 py-0.5 z-10">
            Best Seller
          </span>
        )}
        {sales && (
          <div className="absolute top-0 right-0 z-10 overflow-hidden w-24 h-24">
            <div
              className="absolute transform rotate-45 text-white text-center font-semibold text-xs py-2 shadow-lg bg-tres-primary"
              style={{
                width: "150px",
                top: "20px",
                right: "-37px",
              }}
            >
              SALES
            </div>
          </div>
        )}

        {/* LINK only for title and price */}
        <LocalizedClientLink
          href={`/products/${product.handle}`}
          className="group"
        >
          <div className="mt-4 flex flex-col txt-compact-medium">
            <Text size="xlarge" className="text-ui-fg-subtle">
              {product.title}
            </Text>

            <div className="flex items-center gap-x-2">
              {selectedPrice && <PreviewPrice price={selectedPrice} />}
            </div>
          </div>
        </LocalizedClientLink>
      </div>
    </>
  )
}
