"use client"

import { HttpTypes } from "@medusajs/types"
import { FlexibleBundle } from "@lib/data/bundles"
import { Container, Text } from "@medusajs/ui"
import Image from "next/image"
import { useMemo } from "react"

// Swiper
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { useBundleSelection } from "@modules/bundles/context/bundle-selection-context"

type BundleImageGalleryProps = {
  bundle: FlexibleBundle
  images?: HttpTypes.StoreProductImage[]
}

const BundleImageGallery = ({ bundle }: BundleImageGalleryProps) => {
  const { selectedItems, getSelectedVariant } = useBundleSelection()

  const getSelectedVariantTyped = (
    itemId: string
  ): HttpTypes.StoreProductVariant | undefined => {
    const variant = getSelectedVariant(itemId)
    return typeof variant === "string" ? undefined : variant
  }

  const getColorVariations = (color: string): string[] => {
    const variations: Record<string, string[]> = {
      black: ["black", "blk", "noir", "negro", "schwarz"],
      white: ["white", "wht", "blanc", "blanco", "weiss"],
      red: ["red", "rouge", "rojo", "rot"],
      blue: ["blue", "blu", "bleu", "azul", "blau"],
      green: ["green", "grn", "vert", "verde", "grün"],
      yellow: ["yellow", "ylw", "jaune", "amarillo", "gelb"],
      orange: ["orange", "org", "naranja"],
      pink: ["pink", "rosa", "rose"],
      purple: ["purple", "violet", "morado"],
      brown: ["brown", "brn", "marron", "café"],
      gray: ["gray", "grey", "gris"],
      peach: ["peach", "pch", "pêche", "durazno"],
      navy: ["navy", "marine", "marino"],
      beige: ["beige", "bge", "beige"],
    }
    return variations[color] || [color]
  }

  const filteredImages = useMemo(() => {
    const imagesByProduct: Array<{
      productId: string
      productTitle: string
      image: HttpTypes.StoreProductImage
      priority: number
    }> = []

    bundle.items.forEach((item, index) => {
      const product = item.product as unknown as HttpTypes.StoreProduct
      const isSelected = selectedItems.some((si) => si.itemId === item.id)
      const selectedVariant = getSelectedVariantTyped(item.id)
      const productImages = product.images || []

      // Use thumbnail as a fallback image if no images are available
      const thumbnailImage: HttpTypes.StoreProductImage | undefined =
        product.thumbnail
          ? {
              id: `thumbnail_${product.id}`,
              url: product.thumbnail,
              metadata: {},
              rank: 0, // Default rank value added to satisfy the type requirement
            }
          : undefined

      let imagesToProcess =
        productImages.length > 0
          ? productImages
          : thumbnailImage
          ? [thumbnailImage]
          : []

      if (!imagesToProcess.length) return

      let filteredProductImages: HttpTypes.StoreProductImage[] = imagesToProcess

      // Only apply color/SKU filtering for selected items with a valid variant
      if (isSelected && selectedVariant && product.options) {
        const colorOption =
          selectedVariant &&
          typeof selectedVariant === "object" &&
          "options" in selectedVariant &&
          Array.isArray((selectedVariant as any).options) &&
          (selectedVariant as any).options.find(
            (opt: { option_id: string }) => {
              const productOption = product.options?.find(
                (po) => po.id === opt.option_id
              )
              return productOption?.title?.toLowerCase() === "color"
            }
          )

        if (colorOption) {
          const colorValue = colorOption.value?.toLowerCase()
          const sku =
            selectedVariant &&
            typeof selectedVariant === "object" &&
            "sku" in selectedVariant
              ? selectedVariant.sku?.toLowerCase()
              : undefined

          if (colorValue) {
            filteredProductImages = imagesToProcess.filter((image) => {
              if (!image.url) return false
              const fullUrl = image.url.toLowerCase()
              const hasExactColor = fullUrl.includes(colorValue)
              const hasColorVariation = getColorVariations(colorValue).some(
                (v) => fullUrl.includes(v)
              )
              return hasExactColor || hasColorVariation
            })
          }

          // Fallback to SKU if no color matches
          if (filteredProductImages.length === 0 && sku) {
            filteredProductImages = imagesToProcess.filter((image) => {
              if (!image.url) return false
              const fullUrl = image.url.toLowerCase()
              return sku
                .split("-")
                .filter((part: string | any[]) => part.length > 1)
                .some((part: string) => fullUrl.includes(part))
            })
          }

          // Fallback to splitting images by unique colors
          if (filteredProductImages.length === 0) {
            const variants = product.variants || []
            const uniqueColors = [
              ...new Set(
                variants
                  .map((v) => {
                    const colorOpt = v.options?.find((opt) => {
                      const prodOpt = product.options?.find(
                        (po) => po.id === opt.option_id
                      )
                      return prodOpt?.title?.toLowerCase() === "color"
                    })
                    return colorOpt?.value?.toLowerCase()
                  })
                  .filter(Boolean)
              ),
            ]

            if (uniqueColors.length > 1 && colorValue) {
              const index = uniqueColors.indexOf(colorValue)
              if (index !== -1) {
                const perColor = Math.floor(
                  imagesToProcess.length / uniqueColors.length
                )
                const start = index * perColor
                filteredProductImages = imagesToProcess.slice(
                  start,
                  start + perColor
                )
              }
            }
          }
        }
      }

      // Use all images if no filtering applied or no images matched
      if (filteredProductImages.length === 0) {
        filteredProductImages = imagesToProcess
      }

      filteredProductImages.forEach((image) => {
        imagesByProduct.push({
          productId: product.id,
          productTitle: product.title || `Product ${index + 1}`,
          image,
          priority: isSelected ? 0 : 1, // Prioritize selected items
        })
      })
    })

    // Sort images to show selected items first
    const sortedImages = imagesByProduct
      .sort((a, b) => a.priority - b.priority)
      .map((entry) => ({
        ...entry.image,
        metadata: {
          ...entry.image.metadata,
          productTitle: entry.productTitle,
        },
      }))

    return sortedImages
  }, [bundle.items, selectedItems, getSelectedVariant])

  const displayImages = filteredImages.length > 0 ? filteredImages : []

  return (
    <div className="flex flex-1 items-start relative w-full">
      <div className="w-full mx-auto overflow-hidden px-4 max-w-full sm:max-w-[90%] lg:max-w-[800px]">
        <Swiper
          slidesPerView={1}
          spaceBetween={16}
          loop={displayImages.length > 1}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Pagination, Navigation]}
          className="w-full max-w-screen-md mx-auto" // ✅ responsive width
        >
          {displayImages.map((image, index) => (
            <SwiperSlide key={`${image.id}-${index}`}>
              <div className="w-full">
                <Container className="aspect-[29/34] w-full max-w-full sm:max-w-[90%] lg:max-w-[800px] mx-auto flex items-center justify-center bg-ui-bg-subtle">
                  {image.url && (
                    <Image
                      src={image.url}
                      priority={index <= 2}
                      alt={`Image for ${
                        image.metadata?.productTitle || "bundle item"
                      } ${index + 1}`}
                      fill
                      sizes="(max-width: 576px) 100vw, (max-width: 768px) 90vw, 800px"
                      className="absolute inset-0 rounded-rounded object-cover"
                    />
                  )}
                  <Text className="absolute top-2 left-2 bg-ui-bg-base bg-opacity-75 px-2 py-1 rounded text-xs text-ui-fg-subtle">
                    {image.metadata?.productTitle}
                  </Text>
                </Container>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {displayImages.length === 0 && (
          <Container className="aspect-[29/34] w-full flex items-center justify-center bg-ui-bg-subtle">
            <Text className="text-ui-fg-muted">No images available</Text>
          </Container>
        )}
      </div>
    </div>
  )
}

export default BundleImageGallery
