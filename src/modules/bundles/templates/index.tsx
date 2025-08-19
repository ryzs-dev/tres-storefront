import { HttpTypes } from "@medusajs/types"
import { FlexibleBundle } from "@lib/data/bundles"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import BundleCard from "@modules/bundles/components/bundle-card"
import { Pagination } from "@modules/store/components/pagination"

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
  const itemsPerPage = 1
  const totalPages = Math.ceil(count / itemsPerPage)
  const hasNextPage = currentPage < totalPages
  const hasPrevPage = currentPage > 1

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

      {/* Bundles Grid */}
      {bundles && bundles.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {bundles.map((bundle) => (
              <BundleCard key={bundle.id} bundle={bundle} region={region} />
            ))}
          </div>

          {/* Pagination */}

          {totalPages > 1 && (
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              data-testid="pagination"
            />
          )}
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
