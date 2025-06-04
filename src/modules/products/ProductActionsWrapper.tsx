import { HttpTypes } from "@medusajs/types"
import ProductActions from "@modules/products/components/product-actions"
import { BundleProduct } from "@lib/data/products"
import BundleActions from "@modules/products/components/bundle-actions"

type ProductActionsWrapperProps = {
  id: string
  region: HttpTypes.StoreRegion
  product: HttpTypes.StoreProduct
  bundle?: BundleProduct | null
}

// Server component that can fetch additional data if needed
const ProductActionsWrapper = async ({
  id,
  region,
  product,
  bundle,
}: ProductActionsWrapperProps) => {
  // If you need to fetch additional product data or pricing, do it here
  // const enrichedProduct = await getProductById(id)
  // const regionPricing = await getRegionPricing(region.id)
  if (bundle) {
    return <BundleActions bundle={bundle} />
  }

  return <ProductActions product={product} region={region} />
}

export default ProductActionsWrapper
