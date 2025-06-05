// imports
import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import Image from "next/image"
import { useMemo, useState } from "react"

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
    const sku = selectedVariant.sku?.toLowerCase()

    const colorFilteredImages = images.filter((image) => {
      if (!image.url) return false
      const fullUrl = image.url.toLowerCase()
      const hasExactColor = fullUrl.includes(colorValue)
      const hasColorVariation = getColorVariations(colorValue).some((v) =>
        fullUrl.includes(v)
      )
      return hasExactColor || hasColorVariation
    })

    if (colorFilteredImages.length > 0) return colorFilteredImages

    if (sku) {
      const skuFilteredImages = images.filter((image) => {
        if (!image.url) return false
        const fullUrl = image.url.toLowerCase()
        return sku
          .split("-")
          .filter((part) => part.length > 1)
          .some((part) => fullUrl.includes(part))
      })
      if (skuFilteredImages.length > 0) return skuFilteredImages
    }

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
            return colorOpt?.value.toLowerCase()
          })
          .filter(Boolean)
      ),
    ]

    if (uniqueColors.length > 1) {
      const index = uniqueColors.indexOf(colorValue)
      if (index !== -1) {
        const perColor = Math.floor(images.length / uniqueColors.length)
        const start = index * perColor
        return images.slice(start, start + perColor)
      }
    }

    return images
  }, [images, selectedVariant, product])

  const displayImages = filteredImages.length > 0 ? filteredImages : images

  return (
    <div className="flex flex-1 items-start relative w-full">
      <div className="w-full mx-auto overflow-hidden px-4">
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          loop={true}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Pagination, Navigation]}
          className="w-[700px]"
        >
          {displayImages.map((image, index) => (
            <SwiperSlide
              key={`${image.id}-${selectedVariant?.sku || "default"}`}
            >
              <div className="w-full">
                <Container className="relative aspect-[29/34] w-full overflow-hidden bg-ui-bg-subtle">
                  {image.url && (
                    <Image
                      src={image.url}
                      priority={index <= 2}
                      alt={`Product image ${index + 1}`}
                      fill
                      sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
                      className="absolute inset-0 rounded-rounded object-cover"
                    />
                  )}
                </Container>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {displayImages.length === 0 && (
          <Container className="aspect-[29/34] w-full flex items-center justify-center bg-ui-bg-subtle">
            <p className="text-ui-fg-muted">No images available</p>
          </Container>
        )}
      </div>
    </div>
  )
}

export default ImageGallery
