// imports
import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import Image from "next/image"
import { useMemo } from "react"

// Swiper
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
  selectedVariant?: HttpTypes.StoreProductVariant
  product?: HttpTypes.StoreProduct
}

const ImageGallery = ({
  images,
  selectedVariant,
  product,
}: ImageGalleryProps) => {
  const getColorVariations = (color: string): string[] => {
    const variations: Record<string, string[]> = {
      black: ["black", "blk", "noir"],
      white: ["white", "wht", "blanc"],
      red: ["red", "rouge"],
      blue: ["blue", "bleu"],
      green: ["green", "vert"],
      beige: ["beige", "bge"],
    }
    return variations[color] || [color]
  }

  const filteredImages = useMemo(() => {
    if (!selectedVariant || !selectedVariant.options || !product?.options) {
      return images
    }

    const colorOption = selectedVariant.options.find((opt) => {
      const productOption = product.options?.find(
        (po) => po.id === opt.option_id
      )
      return productOption?.title?.toLowerCase() === "color"
    })

    if (!colorOption) return images

    const colorValue = colorOption.value.toLowerCase()

    const matched = images.filter((image) => {
      if (!image.url) return false
      const url = image.url.toLowerCase()
      return getColorVariations(colorValue).some((v) => url.includes(v))
    })

    return matched.length > 0 ? matched : images
  }, [images, selectedVariant, product])

  const displayImages = filteredImages.length > 0 ? filteredImages : images

  return (
    <div className="relative w-full md:px-6 lg:px-8">
      <Swiper
        slidesPerView={1}
        spaceBetween={16}
        loop
        pagination={{ clickable: true }}
        navigation={false}
        modules={[Pagination, Navigation]}
        className="w-full max-w-[420px] sm:max-w-[520px] lg:max-w-[700px] mx-auto"
      >
        {displayImages.map((image, index) => (
          <SwiperSlide key={`${image.id}-${index}`}>
            <Container className="relative aspect-[3/4] sm:aspect-[29/34] w-full overflow-hidden bg-ui-bg-subtle rounded-lg">
              {image.url && (
                <Image
                  src={image.url}
                  priority={index === 0}
                  alt={`Product image ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 60vw, 700px"
                  className="object-cover"
                />
              )}
            </Container>
          </SwiperSlide>
        ))}
      </Swiper>

      {displayImages.length === 0 && (
        <Container className="aspect-[3/4] w-full flex items-center justify-center bg-ui-bg-subtle">
          <p className="text-ui-fg-muted">No images available</p>
        </Container>
      )}
    </div>
  )
}

export default ImageGallery
