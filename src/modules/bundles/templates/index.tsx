'use client'
import { HttpTypes } from "@medusajs/types"
import { FlexibleBundle } from "@lib/data/bundles"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import BundleCard from "@modules/bundles/components/bundle-card"
import { Pagination } from "@modules/store/components/pagination"
import { useMemo, useState } from "react"

type BundlesTemplateProps = {
  bundles: FlexibleBundle[]
  count: number
  region: HttpTypes.StoreRegion
  countryCode: string
  currentPage: number
}
const BundlesTemplate: React.FC<BundlesTemplateProps> = ({
  bundles,
  count,
  region,
  countryCode,
  currentPage,
}) => {
  const itemsPerPage = 12
  const hasPrevPage = currentPage > 1
  const [query, setQuery] = useState("")
  
  const filteredBundles = useMemo(() => {
    if (!query.trim()) return bundles
    
    const q = query.toLowerCase()
    
    return bundles.filter((bundle) =>
      bundle.title?.toLowerCase().includes(q) ||
    bundle.description?.toLowerCase().includes(q)
  )
}, [bundles, query])

const totalPages = Math.ceil(filteredBundles.length / itemsPerPage)
const hasNextPage = currentPage < totalPages
const paginatedBundles = filteredBundles.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
)


  return (
    <div className="content-container py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8 text-center">
        <Heading
          level="h1"
          className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4"
        >
          Explore Our Products
        </Heading>
      </div>

      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search bundles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-md border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ui-border-strong"
        />
      </div>


      {/* Bundles Grid */}
      {paginatedBundles && paginatedBundles.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {paginatedBundles.map((bundle) => (
              <BundleCard key={bundle.id} bundle={bundle} region={region} />
            ))}
          </div>

          {/* Pagination */}

          <div className="min-h-[56px] flex justify-center w-full mt-12">
            {totalPages > 1 && (
              <Pagination
                page={currentPage}
                totalPages={totalPages}
                data-testid="pagination"
              />
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-12 sm:py-16">
          <Heading level="h2" className="text-lg sm:text-xl mb-3 sm:mb-4">
            No bundles found
          </Heading>
          <Text className="text-ui-fg-subtle text-sm sm:text-base">
            We're working on creating some amazing flexible bundles for you.
          </Text>
        </div>
      )}
    </div>
  )
}

export default BundlesTemplate
