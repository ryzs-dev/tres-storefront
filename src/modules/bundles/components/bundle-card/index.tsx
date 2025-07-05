import { HttpTypes } from "@medusajs/types"
import { FlexibleBundle } from "@lib/data/bundles"
import { Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

type BundleCardProps = {
  bundle: FlexibleBundle
  region: HttpTypes.StoreRegion
  size?: "small" | "medium" | "large"
}
const BundleCard = ({ bundle, region }: BundleCardProps) => {
  const defaultThumbnail =
    bundle.items[0]?.product?.thumbnail || "/placeholder-image.jpg"
  const hoverThumbnail = bundle.items[1]?.product?.thumbnail || defaultThumbnail

  return (
    <LocalizedClientLink href={`/bundles/${bundle.id}`} className="group block">
      <div
        data-testid="bundle-wrapper"
        className="relative overflow-hidden p-2 sm:p-3 md:p-4 bg-ui-bg-subtle shadow-elevation-card-rest rounded-large group-hover:shadow-elevation-card-hover transition-shadow ease-in-out duration-150 aspect-[9/16]"
      >
        <Image
          src={defaultThumbnail}
          alt={bundle.title}
          className="absolute inset-0 object-cover object-center w-full h-full transition-opacity duration-300 group-hover:opacity-0"
          fill
          quality={40}
          draggable={false}
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
        />
        <Image
          src={hoverThumbnail}
          alt={`${bundle.title} (hover)`}
          className="absolute inset-0 object-cover object-center w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          fill
          quality={40}
          draggable={false}
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
        />
      </div>

      <div className="flex flex-col txt-compact-medium mt-2 sm:mt-3 md:mt-4 justify-between">
        <Text
          className="text-ui-fg-subtle text-sm sm:text-base"
          data-testid="product-title"
        >
          {bundle.title}
        </Text>
      </div>
    </LocalizedClientLink>
  )
}

export default BundleCard
