import { HttpTypes } from "@medusajs/types"
import { FlexibleBundle } from "@lib/data/bundles"
import { getRegion } from "@lib/data/regions"
import { listBundles } from "@lib/data/bundles" // Adjust import path as needed
import BundlePreview from "../bundle-preview"

type RelatedBundlesProps = {
  bundle: FlexibleBundle
  countryCode: string
}

export default async function RelatedBundles({
  bundle,
  countryCode,
}: RelatedBundlesProps) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  // Define related bundles query parameters
  const queryParams: HttpTypes.FindParams = {
    limit: 4, // Limit to 4 related bundles
  }

  const { response } = await listBundles({
    queryParams,
    countryCode: region.currency_code, // Use region.currency_code for currency
    regionId: region.id,
  })

  const bundles = response.bundles
    .filter((responseBundle) => responseBundle.id !== bundle.id)
    .slice(0, 4) // Ensure no more than 4 bundles

  if (!bundles.length) {
    return null
  }

  return (
    <div id="related-bundles" className="product-page-constraint">
      <div className="flex flex-col items-center text-center mb-16">
        <span className="text-base-regular text-gray-600 mb-6">
          Related Bundles
        </span>
        <p className="text-2xl-regular text-ui-fg-base max-w-lg">
          Explore these other bundles you might love.
        </p>
      </div>

      <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8">
        {bundles.map((bundle) => (
          <li key={bundle.id}>
            <BundlePreview region={region} bundle={bundle} />
          </li>
        ))}
      </ul>
    </div>
  )
}
