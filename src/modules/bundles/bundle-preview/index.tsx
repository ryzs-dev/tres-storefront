import { HttpTypes } from "@medusajs/types"
import { FlexibleBundle } from "@lib/data/bundles"
import Link from "next/link"
import Image from "next/image"
import { getPricesForVariant } from "@lib/util/get-product-price"

type BundlePreviewProps = {
  bundle: FlexibleBundle
  region: HttpTypes.StoreRegion
}

export default function BundlePreview({ bundle, region }: BundlePreviewProps) {
  // Use the first item's thumbnail or a fallback image
  const thumbnail = bundle.items[0]?.product.thumbnail || ""

  // Calculate the minimum price for display (simplified)
  // const minPrice = bundle.items.reduce((min, item) => {
  //   const variant = item.product.variants?.[0]
  //   if (!variant) return min
  //   const price =
  //     getPricesForVariant(variant, region)?.calculated_price_number || 0
  //   return Math.min(min, price * item.quantity)
  // }, Infinity)

  return (
    <Link href={`/bundles/${bundle.id}`} className="block">
      <div className="group relative">
        <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-ui-bg-subtle">
          <Image
            src={thumbnail}
            alt={bundle.title || "Bundle"}
            width={300}
            height={400}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="mt-4">
          <h3 className="text-base-regular text-ui-fg-base line-clamp-2">
            {bundle.title || "Bundle"}
          </h3>
          {/* <p className="text-sm text-ui-fg-subtle">
            From {region.currency_code.toUpperCase()}{" "}
            {isFinite(minPrice) ? (minPrice / 100).toFixed(2) : "N/A"}
          </p> */}
        </div>
      </div>
    </Link>
  )
}
