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
          typeof variant === "object" &&
          (variant as HttpTypes.StoreProductVariant)?.id ===
            selectedItem.variantId
            ? (variant as HttpTypes.StoreProductVariant)
            : (item.product.variants?.find(
                (v) => v.id === selectedItem.variantId
              ) as HttpTypes.StoreProductVariant | undefined)
      } else {
        initialVariants[item.id] = undefined
      }
    })
    setSelectedVariants(initialVariants)
  }, [bundle.items, selectedItems, getSelectedVariant])

  // Listen for bundle changes via custom event
  useEffect(() => {
    const handleBundleChange = (event: CustomEvent<BundleSelectionDetail>) => {
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
            typeof variant === "object" &&
            (variant as HttpTypes.StoreProductVariant)?.id ===
              selectedItem.variantId
              ? (variant as HttpTypes.StoreProductVariant)
              : (item.product.variants?.find(
                  (v) => v.id === selectedItem.variantId
                ) as HttpTypes.StoreProductVariant)
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

  return (
    <BundleImageGallery bundle={bundle} selectedVariants={selectedVariants} />
  )
}

export default BundleGalleryWrapper
