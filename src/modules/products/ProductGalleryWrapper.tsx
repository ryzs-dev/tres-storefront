"use client"

import { HttpTypes } from "@medusajs/types"
import { useState, useEffect } from "react"
import ImageGallery from "@modules/products/components/image-gallery"

type ProductGalleryWrapperProps = {
  images: HttpTypes.StoreProductImage[]
  product: HttpTypes.StoreProduct
}

// Client component that handles variant state and image coordination
const ProductGalleryWrapper = ({
  images,
  product,
}: ProductGalleryWrapperProps) => {
  const [selectedVariant, setSelectedVariant] = useState<
    HttpTypes.StoreProductVariant | undefined
  >(
    product.variants?.[0] // Default to first variant if available
  )

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

    // Listen for custom event
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
      images={images}
      selectedVariant={selectedVariant}
      product={product}
    />
  )
}

export default ProductGalleryWrapper
