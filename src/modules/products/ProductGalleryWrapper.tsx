"use client"

import { HttpTypes } from "@medusajs/types"
import { useState, useEffect, useMemo } from "react"
import ImageGallery from "@modules/products/components/image-gallery"
import { BundleProduct } from "@lib/data/products"

type ProductGalleryWrapperProps = {
  images: HttpTypes.StoreProductImage[]
  product: HttpTypes.StoreProduct
  bundle?: BundleProduct | null
}

// Client component that handles variant state and image coordination
const ProductGalleryWrapper = ({
  images,
  product,
  bundle,
}: ProductGalleryWrapperProps) => {
  const [selectedVariant, setSelectedVariant] = useState<
    HttpTypes.StoreProductVariant | undefined
  >(product.variants?.[0]) // Default to first variant if available

  // Choose images: use bundle images if bundle is passed in
  const galleryImages = useMemo(() => {
    if (bundle?.items?.length) {
      const bundleImages = bundle.items.flatMap(
        (item) => item.product?.images || []
      )
      if (bundleImages.length > 0) {
        return bundleImages
      }
    }
    return images
  }, [bundle, images])

  // Listen for variant changes from ProductActions via custom event
  useEffect(() => {
    const handleVariantChange = (
      event: CustomEvent<HttpTypes.StoreProductVariant | undefined>
    ) => {
      console.log(
        "🖼️ ProductGalleryWrapper: Received variant change:",
        event.detail?.sku
      )
      setSelectedVariant(event.detail)
    }

    window.addEventListener(
      "variant-changed",
      handleVariantChange as EventListener
    )

    return () => {
      window.removeEventListener(
        "variant-changed",
        handleVariantChange as EventListener
      )
    }
  }, [])

  return (
    <ImageGallery
      images={galleryImages}
      selectedVariant={selectedVariant}
      product={product}
    />
  )
}

export default ProductGalleryWrapper
