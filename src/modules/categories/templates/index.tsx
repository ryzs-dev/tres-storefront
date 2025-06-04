import { notFound } from "next/navigation"
import { Suspense } from "react"

import InteractiveLink from "@modules/common/components/interactive-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import Image from "next/image"

export default function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!category || !countryCode) notFound()

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }

  getParents(category)

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 content-container"
      data-testid="category-container"
    >
      <div className="flex flex-col">
        <RefinementList sortBy={sort} data-testid="sort-by-container" />

        {category.category_children && (
          <div className="mb-8 text-base-large">
            <ul className="grid grid-cols-1 gap-2">
              {category.category_children?.map((c) => (
                <li key={c.id}>
                  <InteractiveLink href={`/categories/${c.handle}`}>
                    {c.name}
                  </InteractiveLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="w-full">
        {typeof category.metadata?.thumbnail === "string" && (
          <div className="relative w-full h-72 mb-10 rounded-2xl overflow-hidden shadow-md">
            <Image
              src={category.metadata.thumbnail}
              alt={category.name}
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-6">
              <h2 className="text-white text-3xl font-bold drop-shadow-md">
                {category.name}
              </h2>
            </div>
          </div>
        )}
        <div className="flex flex-row mb-8 text-2xl-semi gap-4">
          {parents &&
            parents.map((parent) => (
              <span key={parent.id} className="text-ui-fg-subtle text-sm">
                <LocalizedClientLink
                  className="mr-4 hover:text-black"
                  href={`/categories/${parent.handle}`}
                  data-testid="sort-by-link"
                >
                  {parent.name}
                </LocalizedClientLink>
                /
              </span>
            ))}
          <h1 data-testid="category-page-title" className="text-sm">
            {category.name}
          </h1>
        </div>
        {category.description && (
          <div className="mb-8 text-base-regular">
            <p>{category.description}</p>
          </div>
        )}

        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {category.category_children.map((c) => (
            <li
              key={c.id}
              className="group rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg overflow-hidden"
            >
              <InteractiveLink href={`/categories/${c.handle}`}>
                <div className="relative w-full h-48 bg-gray-50 overflow-hidden">
                  {typeof c.metadata?.thumbnail === "string" ? (
                    <Image
                      src={c.metadata.thumbnail as string}
                      alt={c.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-black transition-colors">
                    {c.name}
                  </h3>
                </div>
              </InteractiveLink>
            </li>
          ))}
        </ul>

        <Suspense
          fallback={
            <SkeletonProductGrid
              numberOfProducts={category.products?.length ?? 8}
            />
          }
        >
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            categoryId={category.id}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </div>
  )
}
