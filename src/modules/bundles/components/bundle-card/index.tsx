// src/modules/bundles/components/bundle-card/index.tsx
import { HttpTypes } from "@medusajs/types"
import { FlexibleBundle } from "@lib/data/bundles"
import { Heading, Text, Badge } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import Image from "next/image"

type BundleCardProps = {
  bundle: FlexibleBundle
  region: HttpTypes.StoreRegion
}

const BundleCard = ({ bundle, region }: BundleCardProps) => {
  const defaultThumbnail =
    bundle.items[0]?.product?.thumbnail || "/placeholder-image.jpg"
  const hoverThumbnail = bundle.items[1]?.product?.thumbnail || defaultThumbnail

  return (
    <LocalizedClientLink href={`/bundles/${bundle.id}`} className="group block">
      <div data-testid="bundle-wrapper">
        <div className="relative w-full aspect-[1/1] overflow-hidden">
          <Image
            src={defaultThumbnail}
            alt={bundle.title}
            fill
            className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
          />
          <img
            src={hoverThumbnail}
            alt={`${bundle.title} (hover)`}
            className="w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          />
        </div>
        <div className="flex flex-col txt-compact-medium mt-4 justify-between">
          <Text className="text-ui-fg-subtle" data-testid="product-title">
            {bundle.title}
          </Text>
        </div>
      </div>
    </LocalizedClientLink>
  )
}

export default BundleCard
