import { HttpTypes } from "@medusajs/types"
import { FlexibleBundle } from "@lib/data/bundles"
import { Heading, Text, Badge } from "@medusajs/ui"
import BundleActions from "../../components/bundle-actions"
import BundleItemCard from "../../components/bundle-item-card"
import { BundleSelectionProvider } from "../../context/bundle-selection-context"
import clsx from "clsx"

type BundleDetailTemplateProps = {
  bundle: FlexibleBundle
  region: HttpTypes.StoreRegion
  countryCode: string
}

const BundleDetailTemplate = ({
  bundle,
  region,
  countryCode,
}: BundleDetailTemplateProps) => {
  const getSelectionRulesText = () => {
    if (bundle.selection_type === "required_all") {
      return "You must select all items from this bundle."
    }

    const min = bundle.min_items
    const max = bundle.max_items

    if (max) {
      return `You can select between ${min} and ${max} items from this bundle.`
    }

    return min === 1
      ? "You can select any items you want from this bundle."
      : `You must select at least ${min} items from this bundle.`
  }

  return (
    <BundleSelectionProvider bundle={bundle}>
      <div className="content-container py-6">
        {/* Thumbnail Section */}
        <figure
          className="relative w-full h-[300px] sm:h-[400px] mb-8 rounded-lg overflow-hidden shadow-sm"
          aria-label={`Thumbnail for ${bundle.title}`}
        >
          <img
            src={
              bundle.items[0]?.product?.thumbnail || "/placeholder-image.jpg"
            }
            alt={`Image of ${bundle.title} bundle`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <Heading
              level="h1"
              className="text-white text-3xl sm:text-4xl font-bold text-center px-4 drop-shadow-md"
            >
              {bundle.title}
            </Heading>
          </div>
        </figure>

        {/* Main Content */}
        <Heading level="h2" className="text-xl font-semibold mb-4">
          Choose Your Products
        </Heading>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bundle Info */}
          <div className="lg:col-span-2">
            {/* Products Grid */}
            <div>
              <div className="flex flex-col gap-4">
                {bundle.items.map((item) => (
                  <BundleItemCard key={item.id} item={item} region={region} />
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Actions Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BundleActions
                bundle={bundle}
                region={region}
                countryCode={countryCode}
              />
            </div>
          </div>
        </div>
      </div>
    </BundleSelectionProvider>
  )
}

export default BundleDetailTemplate
