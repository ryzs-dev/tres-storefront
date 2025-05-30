import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import Image from "next/image"
import { useMemo } from "react"

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
  // Helper function to get color variations
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

  // Filter images based on filename patterns in Medusa URLs
  const filteredImages = useMemo(() => {
    if (!selectedVariant || !selectedVariant.options || !product?.options) {
      return images
    }

    // Get the color option from the selected variant
    const colorOption = selectedVariant.options.find((opt) => {
      const productOption = product.options?.find(
        (po) => po.id === opt.option_id
      )
      return productOption?.title?.toLowerCase() === "color"
    })

    if (!colorOption) {
      return images
    }

    const colorValue = colorOption.value.toLowerCase()
    const sku = selectedVariant.sku?.toLowerCase()

    console.log("🎨 Filtering images for color:", colorValue)
    console.log("📦 SKU:", sku)
    console.log(
      "🖼️ Available images:",
      images.map((img) => ({
        id: img.id,
        url: img.url,
        filename: img.url?.split("/").pop(),
      }))
    )

    // Method 1: Look for color keywords anywhere in the URL (flexible approach)
    const colorFilteredImages = images.filter((image) => {
      if (!image.url) return false

      // Convert entire URL to lowercase for case-insensitive matching
      const fullUrl = image.url.toLowerCase()

      console.log(`🔍 Checking URL: ${image.url}`)

      // Check if the selected color appears anywhere in the URL
      const hasExactColor = fullUrl.includes(colorValue)

      // Also check for color variations and common abbreviations
      const colorVariations = getColorVariations(colorValue)
      const hasColorVariation = colorVariations.some((variation) => {
        const found = fullUrl.includes(variation)
        if (found) {
          console.log(`   Found color variation "${variation}" in URL`)
        }
        return found
      })

      const colorMatch = hasExactColor || hasColorVariation
      console.log(`   Color match for "${colorValue}": ${colorMatch}`)

      return colorMatch
    })

    if (colorFilteredImages.length > 0) {
      console.log("✅ Found color matches:", colorFilteredImages.length)
      return colorFilteredImages
    }

    // Method 2: Enhanced SKU matching anywhere in URL
    if (sku && colorFilteredImages.length === 0) {
      const skuFilteredImages = images.filter((image) => {
        if (!image.url) return false

        const fullUrl = image.url.toLowerCase()

        // Split SKU into meaningful parts and check each
        const skuParts = sku.split("-").filter((part) => part.length > 1)
        const hasSkuPart = skuParts.some((part) => {
          const found = fullUrl.includes(part)
          if (found) {
            console.log(`🔍 Found SKU part "${part}" in URL: ${image.url}`)
          }
          return found
        })

        console.log(`🔍 SKU check for "${sku}": ${hasSkuPart}`)
        return hasSkuPart
      })

      if (skuFilteredImages.length > 0) {
        console.log("✅ Found SKU matches:", skuFilteredImages.length)
        return skuFilteredImages
      }
    }

    // Method 3: Fallback to position-based filtering
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
      const currentColorIndex = uniqueColors.indexOf(colorValue)
      if (currentColorIndex !== -1) {
        const imagesPerColor = Math.floor(images.length / uniqueColors.length)
        const startIndex = currentColorIndex * imagesPerColor
        const endIndex = startIndex + imagesPerColor

        console.log(
          `📍 Using position fallback: color index ${currentColorIndex}, showing images ${startIndex}-${
            endIndex - 1
          }`
        )
        console.log(`📍 Available colors: ${uniqueColors.join(", ")}`)

        return images.slice(startIndex, endIndex)
      }
    }

    console.log("⚠️ No matches found, showing all images")
    return images
  }, [images, selectedVariant, product])

  const displayImages = filteredImages.length > 0 ? filteredImages : images

  return (
    <div className="flex items-start relative">
      <div className="flex flex-col flex-1 small:mx-16 gap-y-4">
        {displayImages.map((image, index) => {
          return (
            <Container
              key={`${image.id}-${selectedVariant?.sku || "default"}`}
              className="relative aspect-[29/34] w-full overflow-hidden bg-ui-bg-subtle"
              id={image.id}
            >
              {!!image.url && (
                <Image
                  src={image.url}
                  priority={index <= 2 ? true : false}
                  className="absolute inset-0 rounded-rounded"
                  alt={`Product image ${index + 1}${
                    selectedVariant?.sku ? ` - ${selectedVariant.sku}` : ""
                  }`}
                  fill
                  sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
                  style={{
                    objectFit: "cover",
                  }}
                />
              )}
            </Container>
          )
        })}
        {displayImages.length === 0 && (
          <Container className="relative aspect-[29/34] w-full overflow-hidden bg-ui-bg-subtle flex items-center justify-center">
            <p className="text-ui-fg-muted">No images available</p>
          </Container>
        )}
      </div>
    </div>
  )
}

export default ImageGallery
