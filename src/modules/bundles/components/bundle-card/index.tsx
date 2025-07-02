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

const BundleCard = ({ bundle, region, size = "medium" }: BundleCardProps) => {
  const defaultThumbnail =
    bundle.items[0]?.product?.thumbnail || "/placeholder-image.jpg"
  const hoverThumbnail = bundle.items[1]?.product?.thumbnail || defaultThumbnail

  const sizeClass = {
    small: "w-[180px]",
    medium: "w-[290px]",
    large: "w-[440px]",
  }[size]

  return (
    <LocalizedClientLink href={`/bundles/${bundle.id}`} className="group block">
      <div
        data-testid="bundle-wrapper"
        className={`relative overflow-hidden p-4 bg-ui-bg-subtle shadow-elevation-card-rest rounded-large group-hover:shadow-elevation-card-hover transition-shadow ease-in-out duration-150 aspect-[9/16] ${sizeClass}`}
      >
        <Image
          src={defaultThumbnail}
          alt={bundle.title}
          className="absolute inset-0 object-cover object-center w-full h-full transition-opacity duration-300 group-hover:opacity-0"
          fill
          quality={50}
          draggable={false}
          sizes="100vw"
        />
        <Image
          src={hoverThumbnail}
          alt={`${bundle.title} (hover)`}
          className="absolute inset-0 object-cover object-center w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          fill
          quality={50}
          draggable={false}
          sizes="100vw"
        />
      </div>

      <div className="flex flex-col txt-compact-medium mt-4 justify-between">
        <Text className="text-ui-fg-subtle" data-testid="product-title">
          {bundle.title}
        </Text>
      </div>
    </LocalizedClientLink>
  )
}

export default BundleCard
