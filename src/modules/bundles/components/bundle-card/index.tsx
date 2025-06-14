// src/modules/bundles/components/bundle-card/index.tsx
import { HttpTypes } from "@medusajs/types"
import { FlexibleBundle } from "@lib/data/bundles"
import { Heading, Text, Badge } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"

type BundleCardProps = {
  bundle: FlexibleBundle
  region: HttpTypes.StoreRegion
}

const BundleCard = ({ bundle, region }: BundleCardProps) => {
  // Use first product's thumbnail as bundle thumbnail
  const thumbnail =
    bundle.items[0]?.product?.thumbnail || "/placeholder-image.jpg"

  // Get selection rules text
  const getSelectionText = () => {
    if (bundle.selection_type === "required_all") {
      return "All items required"
    }

    const min = bundle.min_items
    const max = bundle.max_items

    if (max) {
      return `Select ${min}-${max} items`
    }

    return min === 1 ? "Select any items" : `Select ${min}+ items`
  }

  return (
    <LocalizedClientLink href={`/bundles/${bundle.id}`} className="group block">
      <div data-testid="bundle-wrapper">
        <Thumbnail thumbnail={thumbnail} size="full" />
        <div className="flex flex-col txt-compact-medium mt-4 justify-between">
          <Text className="text-ui-fg-subtle" data-testid="product-title">
            {bundle.title}
          </Text>
        </div>
      </div>
    </LocalizedClientLink>
  )
}

export default BundleCard
