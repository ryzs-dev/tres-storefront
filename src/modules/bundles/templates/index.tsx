import { HttpTypes } from "@medusajs/types"
import { FlexibleBundle } from "@lib/data/bundles"
import BundleCard from "../components/bundle-card"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

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
  const totalPages = Math.ceil(count / itemsPerPage)
  const hasNextPage = currentPage < totalPages
  const hasPrevPage = currentPage > 1

  return (
    <div className="content-container py-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <Heading level="h1" className="text-3xl font-bold mb-4">
          Explore Our Products{" "}
        </Heading>
      </div>

      {/* Bundles Grid */}
      {bundles && bundles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {bundles.map((bundle) => (
              <BundleCard key={bundle.id} bundle={bundle} region={region} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4">
              {hasPrevPage && (
                <LocalizedClientLink
                  href={`/bundles?page=${currentPage - 1}`}
                  className="px-4 py-2 border border-ui-border-base rounded-md hover:bg-ui-bg-subtle transition-colors"
                >
                  Previous
                </LocalizedClientLink>
              )}

              <span className="text-ui-fg-subtle">
                Page {currentPage} of {totalPages}
              </span>

              {hasNextPage && (
                <LocalizedClientLink
                  href={`/bundles?page=${currentPage + 1}`}
                  className="px-4 py-2 border border-ui-border-base rounded-md hover:bg-ui-bg-subtle transition-colors"
                >
                  Next
                </LocalizedClientLink>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <Heading level="h2" className="text-xl mb-4">
            No bundles found
          </Heading>
          <Text className="text-ui-fg-subtle">
            We're working on creating some amazing flexible bundles for you.
          </Text>
        </div>
      )}
    </div>
  )
}

export default BundlesTemplate
