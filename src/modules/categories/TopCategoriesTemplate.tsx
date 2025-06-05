import { HttpTypes } from "@medusajs/types"
import InteractiveLink from "@modules/common/components/interactive-link"
import Image from "next/image"

type TopCategoriesTemplateProps = {
  categories: HttpTypes.StoreProductCategory[]
  countryCode: string
}

export default function TopCategoriesTemplate({
  categories,
  countryCode,
}: TopCategoriesTemplateProps) {
  // Filter to only show top-level categories (no parent)
  const topCategories = categories.filter(
    (category) => !category.parent_category
  )

  return (
    <div
      className="content-container py-12"
      data-testid="top-categories-container"
    >
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Shop All Products
        </h1>
      </div>

      {topCategories.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500">No categories available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {topCategories.map((category) => (
            <div
              key={category.id}
              className="group rounded-3xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden"
            >
              <InteractiveLink href={`/categories/${category.handle}`}>
                <div className="relative w-full h-64 bg-gray-50 overflow-hidden">
                  {typeof category.metadata?.thumbnail === "string" ? (
                    <Image
                      src={category.metadata.thumbnail as string}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <div className="text-gray-400 text-center">
                        <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
                          <svg
                            className="w-8 h-8"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-sm font-medium">No Image</span>
                      </div>
                    </div>
                  )}

                  {/* Overlay with category info */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-end">
                    <div className="w-full p-6 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="text-white text-xl font-bold mb-1">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-white/80 text-sm line-clamp-2">
                          {category.description}
                        </p>
                      )}
                      {category.category_children &&
                        category.category_children.length > 0 && (
                          <p className="text-white/60 text-xs mt-2">
                            {category.category_children.length} subcategories
                          </p>
                        )}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-800 group-hover:text-black transition-colors mb-2">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {category.description}
                      </p>
                    )}

                    {/* Subcategories count */}
                    {category.category_children &&
                      category.category_children.length > 0 && (
                        <div className="flex items-center justify-center text-gray-500 text-sm">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            />
                          </svg>
                          {category.category_children.length} subcategories
                        </div>
                      )}
                  </div>

                  {/* View category button */}
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="w-full bg-black text-white text-center py-2 rounded-lg text-sm font-medium">
                      Explore Category →
                    </div>
                  </div>
                </div>
              </InteractiveLink>
            </div>
          ))}
        </div>
      )}

      {/* Optional: Add a link to view all categories */}
      <div className="mt-16 text-center">
        <InteractiveLink href="/categories">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          </svg>
          View All Categories
        </InteractiveLink>
      </div>
    </div>
  )
}
