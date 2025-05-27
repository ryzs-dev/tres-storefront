import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { HttpTypes } from "@medusajs/types"
import Image from "next/image"

export default function CollectionTemplate({
  sortBy,
  collection,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  collection: HttpTypes.StoreCollection
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  const heroImage =
    "https://qlhcdbukacsyqfgxdwut.supabase.co/storage/v1/object/public/tres//DSCF3030.JPG"

  return (
    <div className="flex flex-col small:flex-row small:items-start py-6 content-container">
      <RefinementList sortBy={sort} />
      <div className="w-full">
        {heroImage && (
          <div className="relative w-full h-[300px] mb-8 rounded-lg overflow-hidden">
            <Image
              src={heroImage}
              alt={`${collection.title} Hero`}
              fill
              className="object-cover [object-position:50%_45%]"
              priority
            />
            <div className="absolute bottom-6 left-6 z-10 text-white">
              <h1 className="text-3xl font-semibold">{collection.title}</h1>
            </div>
          </div>
        )}
        <Suspense
          fallback={
            <SkeletonProductGrid
              numberOfProducts={collection.products?.length}
            />
          }
        >
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            collectionId={collection.id}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </div>
  )
}
