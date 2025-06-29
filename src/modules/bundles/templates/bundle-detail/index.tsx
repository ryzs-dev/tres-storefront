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
      <div className="content-container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-3">
            <div className="sticky top-24">
              <BundleInfo bundle={bundle} />
            </div>
          </div>

          {/* Center Gallery */}
          <div className="lg:col-span-6">
            <BundleGalleryWrapper bundle={bundle} />
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto custom-scrollbar">
              <div className="space-y-6">
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
      </div>

      {/* Related Bundles */}
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
