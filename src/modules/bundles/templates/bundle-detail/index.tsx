import { HttpTypes } from "@medusajs/types"
import { FlexibleBundle } from "@lib/data/bundles"
import { Heading, Text, Badge } from "@medusajs/ui"
import BundleActions from "../../components/bundle-actions"
import BundleItemCard from "../../components/bundle-item-card"
import { BundleSelectionProvider } from "../../context/bundle-selection-context"
import clsx from "clsx"
import BundleInfo from "../bundle-info"
import BundleImageGallery from "@modules/bundles/components/bundle-image-gallery"
import BundleGalleryWrapper from "@modules/bundles/BundleGalleryWrapper"
import RelatedProducts from "@modules/products/components/related-products"
import RelatedBundles from "@modules/bundles/related-bundles"

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
      <div className="content-container grid grid-cols-1 lg:grid-cols-12 gap-8 py-6">
        {/* Left Sidebar: Bundle Info */}
        <div className="lg:col-span-3 order-1 lg:order-none">
          <div className="sticky top-24">
            <BundleInfo bundle={bundle} />
          </div>
        </div>

        {/* Center: Gallery */}
        <div className="lg:col-span-6 order-2 lg:order-none">
          <BundleGalleryWrapper bundle={bundle} />
        </div>

        {/* Right Sidebar: Actions */}
        <div className="lg:col-span-3 order-3 lg:order-none">
          <div className="sticky top-24 mt">
            <div className="mt-6 space-y-6">
              {bundle.items.map((item) => (
                <BundleItemCard key={item.id} item={item} region={region} />
              ))}
            </div>
            <div className="mt-6">
              <BundleActions
                bundle={bundle}
                region={region}
                countryCode={countryCode}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Related Bundles Section */}
      <div
        className="content-container my-16 small:my-32"
        data-testid="related-products-container"
      >
        <RelatedBundles bundle={bundle} countryCode={countryCode} />
      </div>
    </BundleSelectionProvider>
  )
}

export default BundleDetailTemplate
