import { HttpTypes } from "@medusajs/types"
import InteractiveLink from "@modules/common/components/interactive-link"
import ProductRail from "@modules/home/components/featured-products/product-rail"
import Image from "next/image"

export default async function FeaturedProducts({
  collections,
  region,
}: {
  collections: HttpTypes.StoreCollection[]
  region: HttpTypes.StoreRegion
}) {
  return collections.map((collection) => (
    <div className="content-container py-12 small:py-24" key={collection.id}>
      {/* <ProductRail collection={collection} region={region} /> */}

      <div className="relative w-full max-w-[500px] h-[300px] overflow-hidden rounded-xl group">
        <InteractiveLink href={`/collections/${collection.handle}`}>
          {/* Primary Image (visible by default) */}
          <Image
            src={
              typeof collection.metadata?.hero_image === "string"
                ? collection.metadata.hero_image
                : ""
            }
            alt={collection.title}
            layout="fill"
            objectFit="cover"
            className="rounded-xl transition-opacity duration-500 object-[10%_30%] group-hover:opacity-0"
          />

          {/* Secondary Image (shown on hover) */}
          {typeof collection.metadata?.secondary_image === "string" && (
            <Image
              src={collection.metadata.secondary_image}
              alt={`${collection.title} Hover`}
              layout="fill"
              objectFit="cover"
              className="rounded-xl absolute top-0 left-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100 object-[10%_30%]"
            />
          )}

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4 z-10">
            <h2 className="text-white text-lg font-semibold">
              {collection.title}
            </h2>
          </div>
        </InteractiveLink>
      </div>
    </div>
  ))
}
