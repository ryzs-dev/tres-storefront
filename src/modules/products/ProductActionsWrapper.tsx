import { HttpTypes } from "@medusajs/types"
import ProductActions from "@modules/products/components/product-actions"

type ProductActionsWrapperProps = {
  id: string
  region: HttpTypes.StoreRegion
  product: HttpTypes.StoreProduct
}

// Server component that can fetch additional data if needed
const ProductActionsWrapper = async ({
  id,
  region,
  product,
}: ProductActionsWrapperProps) => {
  // If you need to fetch additional product data or pricing, do it here
  // const enrichedProduct = await getProductById(id)
  // const regionPricing = await getRegionPricing(region.id)

  return <ProductActions product={product} region={region} />
}

export default ProductActionsWrapper
