"use client"

import { HttpTypes } from "@medusajs/types"
import { FlexibleBundle } from "@lib/data/bundles"
import { Container, Text } from "@medusajs/ui"
import Image from "next/image"
import { useMemo, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import { useBundleSelection } from "@modules/bundles/context/bundle-selection-context"

type BundleImageGalleryProps = {
  bundle: FlexibleBundle
  selectedVariants: Record<string, HttpTypes.StoreProductVariant | undefined>
}

function SlideNavButtons({ swiper }: { swiper: any }) {
  return (
    <div className="absolute inset-0 flex items-center justify-between px-2 sm:px-4 z-10">
      <button
        onClick={() => swiper?.slidePrev()}
        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center border rounded-full hover:bg-gray-100 transition bg-white"
        aria-label="Previous image"
        disabled={!swiper}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => swiper?.slideNext()}
        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center border rounded-full hover:bg-gray-100 transition bg-white"
        aria-label="Next image"
        disabled={!swiper}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}

const BundleImageGallery = ({
  bundle,
  selectedVariants,
}: BundleImageGalleryProps) => {
  const { selectedItems } = useBundleSelection()
  const [swiper, setSwiper] = useState<any>(null)

  const filteredImages = useMemo(() => {
    const imagesByProduct: Array<{
      productId: string
      productTitle: string
      image: HttpTypes.StoreProductImage
      priority: number
    }> = []

    const hasSelectedItems = selectedItems.length > 0

    bundle.items.forEach((item, index) => {
      const product = item.product as unknown as HttpTypes.StoreProduct
      const isSelected = selectedItems.some((si) => si.itemId === item.id)
      const selectedVariant = selectedVariants[item.id]
      const productImages = product.images || []

      // Create a fallback thumbnail image if no images are available
      const thumbnailImage: HttpTypes.StoreProductImage | undefined =
        product.thumbnail
          ? {
              id: `thumbnail_${product.id}`,
              url: product.thumbnail,
              metadata: {},
              rank: 0,
            }
          : undefined

      const imagesToProcess =
        productImages.length > 0
          ? productImages
          : thumbnailImage
          ? [thumbnailImage]
          : []

      // If no items are selected, include all images from all products
      if (!hasSelectedItems) {
        imagesToProcess.forEach((image) => {
          imagesByProduct.push({
            productId: product.id,
            productTitle: product.title || `Product ${index + 1}`,
            image,
            priority: 1,
          })
        })
        return
      }

      // Skip non-selected products when items are selected
      if (!isSelected) {
        return
      }

      let filteredProductImages = imagesToProcess

      // Apply color filtering if a variant with a color option is selected
      if (selectedVariant && product.options) {
        const colorOption = product.options.find(
          (opt) => opt.title.toLowerCase() === "color"
        )
        if (colorOption) {
          const selectedColor = selectedVariant.options
            ?.find((opt) => opt.option_id === colorOption.id)
            ?.value?.toLowerCase()

          if (selectedColor) {
            filteredProductImages = imagesToProcess.filter((image) =>
              image.url.toLowerCase().includes(selectedColor)
            )
          }
        }
      }

      // If no color-specific images are found, use all product images
      if (filteredProductImages.length === 0) {
        filteredProductImages = imagesToProcess
      }

      filteredProductImages.forEach((image) => {
        imagesByProduct.push({
          productId: product.id,
          productTitle: product.title || `Product ${index + 1}`,
          image,
          priority: 0,
        })
      })
    })

    // Sort images to prioritize selected items
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
  }, [bundle.items, selectedItems, selectedVariants])

  const displayImages = filteredImages.length > 0 ? filteredImages : []

  return (
    <div className="flex flex-1 items-start relative w-full">
      <div className="w-full mx-auto overflow-hidden px-4 max-w-full sm:max-w-[90%] lg:max-w-[800px] relative">
        <Swiper
          onSwiper={setSwiper}
          slidesPerView={1}
          spaceBetween={16}
          loop={displayImages.length > 1}
          pagination={{
            clickable: true,
            dynamicBullets: true,
            dynamicMainBullets: 2,
          }}
          modules={[Pagination]}
          className="w-full max-w-screen-md mx-auto"
        >
          {displayImages.map((image, index) => (
            <SwiperSlide key={`${image.id}-${index}`}>
              <div className="w-full relative">
                <Container className="aspect-[29/34] w-full max-w-full sm:max-w-[90%] lg:max-w-[800px] mx-auto flex items-center justify-center bg-ui-bg-subtle">
                  {image.url ? (
                    <Image
                      src={image.url}
                      priority={index <= 2}
                      alt={`Image for ${
                        image.metadata?.productTitle || "bundle item"
                      } ${index + 1}`}
                      fill
                      className="absolute inset-0 rounded-rounded object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 800px"
                    />
                  ) : (
                    <Text className="text-ui-fg-muted">No image available</Text>
                  )}
                </Container>
              </div>
            </SwiperSlide>
          ))}
          {displayImages.length > 1 && <SlideNavButtons swiper={swiper} />}
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
