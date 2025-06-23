"use client"

import { HttpTypes } from "@medusajs/types"
import { FlexibleBundle } from "@lib/data/bundles"
import { useState, useEffect } from "react"
import { useBundleSelection } from "./context/bundle-selection-context"
import BundleImageGallery from "./components/bundle-image-gallery"

type BundleGalleryWrapperProps = {
  bundle: FlexibleBundle
}

type BundleSelectionDetail = {
  selectedItems: Array<{
    itemId: string
    variantId: string
    quantity: number
  }>
  promotionalTotal: number
}

const BundleGalleryWrapper = ({ bundle }: BundleGalleryWrapperProps) => {
  const { selectedItems, getSelectedVariant } = useBundleSelection()
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, HttpTypes.StoreProductVariant | undefined>
  >({})

  // Initialize selected variants based on selectedItems
  useEffect(() => {
    const initialVariants: Record<
      string,
      HttpTypes.StoreProductVariant | undefined
    > = {}
    bundle.items.forEach((item) => {
      const selectedItem = selectedItems.find((si) => si.itemId === item.id)
      if (selectedItem) {
        const variant = getSelectedVariant(item.id)
        initialVariants[item.id] =
          typeof variant === "object"
            ? variant
            : (item.product.variants?.[0] as
                | HttpTypes.StoreProductVariant
                | undefined)
      } else {
        initialVariants[item.id] = undefined
      }
    })
    setSelectedVariants(initialVariants)
  }, [bundle.items, selectedItems, getSelectedVariant])

  // Listen for bundle changes via custom event
  useEffect(() => {
    const handleBundleChange = (event: CustomEvent<BundleSelectionDetail>) => {
      console.log(
        "🖼️ BundleGalleryWrapper: Received bundle change:",
        event.detail
      )
      const newVariants: Record<
        string,
        HttpTypes.StoreProductVariant | undefined
      > = {}
      bundle.items.forEach((item) => {
        const selectedItem = event.detail.selectedItems.find(
          (si) => si.itemId === item.id
        )
        if (selectedItem) {
          const variant = getSelectedVariant(item.id)
          newVariants[item.id] =
            typeof variant === "object"
              ? variant
              : (item.product.variants?.[0] as
                  | HttpTypes.StoreProductVariant
                  | undefined)
        } else {
          newVariants[item.id] = undefined
        }
      })
      setSelectedVariants(newVariants)
    }

    window.addEventListener(
      "bundle-changed",
      handleBundleChange as EventListener
    )
    return () => {
      window.removeEventListener(
        "bundle-changed",
        handleBundleChange as EventListener
      )
    }
  }, [bundle.items, getSelectedVariant])

  return <BundleImageGallery bundle={bundle} />
}

export default BundleGalleryWrapper
