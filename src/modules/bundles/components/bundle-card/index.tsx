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

const BundleCard = ({ bundle }: BundleCardProps) => {
  const defaultThumbnail =
    bundle.items[0]?.product?.thumbnail || "/placeholder-image.jpg"
  const hoverThumbnail = bundle.items[1]?.product?.thumbnail || defaultThumbnail

  // Check if bundle is a best seller
  const bestSellerTitles = [
    "lively",
    "celine",
    "piper",
    "daz",
    "test no bundle",
  ]
  const isBestSeller = bestSellerTitles.some((title) =>
    bundle.title.toLowerCase().includes(title.toLowerCase())
  )

  return (
    <LocalizedClientLink href={`/bundles/${bundle.id}`} className="group block">
      <div
        data-testid="bundle-wrapper"
        className="relative overflow-hidden p-2 sm:p-3 md:p-4 
             bg-ui-bg-subtle shadow-elevation-card-rest rounded-large 
             hover:shadow-elevation-card-hover transition-shadow ease-in-out 
             duration-150 aspect-[9/16] min-h-[300px]"
      >
        <Image
          src={defaultThumbnail}
          alt={bundle.title}
          className="absolute inset-0 object-cover object-center w-full h-full 
               md:transition-opacity md:duration-300 md:group-hover:opacity-0"
          fill
          quality={40}
          draggable={false}
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
          priority={true}
        />
        <Image
          src={hoverThumbnail}
          alt={`${bundle.title} (hover)`}
          className="absolute inset-0 object-cover object-center w-full h-full 
               opacity-0 md:group-hover:opacity-100 md:transition-opacity 
               md:duration-300"
          fill
          quality={40}
          draggable={false}
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
        />

        {/* Best Seller Banner */}
        {isBestSeller && (
          <div className="absolute top-0 right-0 z-10 overflow-hidden w-24 h-24">
            <div
              className="absolute transform rotate-45 text-white text-center font-semibold text-xs py-2 shadow-lg bg-tres-primary"
              style={{
                width: "150px",
                top: "20px",
                right: "-37px",
              }}
            >
              BEST SELLER
            </div>
          </div>
        )}
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
