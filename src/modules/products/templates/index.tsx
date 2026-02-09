import React, { Suspense } from "react"

import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import ProductActionsWrapper from "./product-actions-wrapper"
import { HttpTypes } from "@medusajs/types"
import ProductGalleryWrapper from "../ProductGalleryWrapper"
import ProductReviews from "../components/product-reviews"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <>
      <div className="p-4 ">
        <div
          className="flex flex-col lg:flex-row gap-x-12 gap-y-8 py-6 w-full max-w-7xl mx-auto"
          data-testid="product-container"
        >
          {/* Left: Product Images */}
          <div className="w-full lg:w-1/2">
            <ProductGalleryWrapper
              images={product?.images || []}
              product={product}
            />
          </div>

          {/* Right: Info & Actions */}
          <div className="w-full lg:w-1/2  flex flex-col gap-y-6 lg:sticky lg:top-24">
            <ProductInfo product={product} />
            <Suspense
              fallback={
                <ProductActions disabled product={product} region={region} />
              }
            >
              <ProductActionsWrapper id={product.id} region={region} />
            </Suspense>
            <ProductOnboardingCta />
          </div>
        </div>
        {/* Bottom: Description, Tabs */}
        <div className="w-full mt-8 flex max-w-7xl mx-auto flex-col gap-y-6">
          <ProductTabs product={product} />
          <ProductReviews productId={product.id} productTitle={product.title} />
        </div>
        {/* Related Products */}
        <div
          className="content-container my-16 small:my-32"
          data-testid="related-products-container"
        >
          <Suspense fallback={<SkeletonRelatedProducts />}>
            <RelatedProducts product={product} countryCode={countryCode} />
          </Suspense>
        </div>{" "}
      </div>
    </>
  )
}

export default ProductTemplate
