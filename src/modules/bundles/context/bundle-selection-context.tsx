"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import { FlexibleBundle } from "@lib/data/bundles"

type SelectedItem = {
  itemId: string
  variantId: string
  quantity: number
}

type BundleSelectionContextType = {
  bundle: FlexibleBundle | null
  selectedItems: SelectedItem[]
  isItemSelected: (itemId: string) => boolean
  getSelectedVariant: (itemId: string) => string | undefined
  toggleItem: (itemId: string, variantId?: string, quantity?: number) => void
  updateItemQuantity: (
    itemId: string,
    quantity: number,
    variantId?: string
  ) => void
  clearSelection: () => void
  canAddToCart: () => boolean
  getSelectionSummary: () => {
    totalItems: number
    isValidSelection: boolean
    violatesRules: string | null
  }
}

const BundleSelectionContext = createContext<
  BundleSelectionContextType | undefined
>(undefined)

type BundleSelectionProviderProps = {
  children: React.ReactNode
  bundle: FlexibleBundle
}

export const BundleSelectionProvider = ({
  children,
  bundle,
}: BundleSelectionProviderProps) => {
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([])

  const isItemSelected = useCallback(
    (itemId: string) => {
      return selectedItems.some((item) => item.itemId === itemId)
    },
    [selectedItems]
  )

  const getSelectedVariant = useCallback(
    (itemId: string) => {
      const item = selectedItems.find((item) => item.itemId === itemId)
      return item?.variantId
    },
    [selectedItems]
  )

  const toggleItem = useCallback(
    (itemId: string, variantId?: string, quantity?: number) => {
      setSelectedItems((prev) => {
        const existingIndex = prev.findIndex((item) => item.itemId === itemId)

        if (existingIndex >= 0) {
          // Item is already selected
          if (variantId) {
            // Update variant/quantity
            const updated = [...prev]
            updated[existingIndex] = {
              ...updated[existingIndex],
              variantId,
              quantity: quantity || updated[existingIndex].quantity,
            }
            return updated
          } else {
            // Remove item
            return prev.filter((item) => item.itemId !== itemId)
          }
        } else {
          // Add new item
          if (!variantId) {
            console.warn("Cannot add item without variant")
            return prev
          }

          const bundleItem = bundle.items.find((item) => item.id === itemId)
          const defaultQuantity = quantity || bundleItem?.quantity || 1

          return [
            ...prev,
            {
              itemId,
              variantId,
              quantity: defaultQuantity,
            },
          ]
        }
      })
    },
    [bundle.items]
  )

  const updateItemQuantity = useCallback(
    (itemId: string, quantity: number, variantId?: string) => {
      setSelectedItems((prev) =>
        prev.map((item) => {
          if (item.itemId === itemId) {
            return {
              ...item,
              quantity,
              // If variantId is provided, update it, otherwise keep the old one
              variantId: variantId || item.variantId,
            }
          }
          return item
        })
      )
    },
    [] // No dependencies are needed for this useCallback
  )

  const clearSelection = useCallback(() => {
    setSelectedItems([])
  }, [])

  const getSelectionSummary = useCallback(() => {
    const totalItems = selectedItems.length
    let isValidSelection = true
    let violatesRules: string | null = null

    // Check minimum items
    if (totalItems < bundle.min_items) {
      isValidSelection = false
      violatesRules = `You must select at least ${bundle.min_items} items`
    }

    // Check maximum items
    if (bundle.max_items && totalItems > bundle.max_items) {
      isValidSelection = false
      violatesRules = `You can select at most ${bundle.max_items} items`
    }

    // Check required all
    if (
      bundle.selection_type === "required_all" &&
      totalItems !== bundle.items.length
    ) {
      isValidSelection = false
      violatesRules = "You must select all items from this bundle"
    }

    // Check if all selected items have valid variants
    const hasInvalidSelections = selectedItems.some((selectedItem) => {
      const bundleItem = bundle.items.find(
        (item) => item.id === selectedItem.itemId
      )
      if (!bundleItem) return true

      const hasVariant = bundleItem.product.variants?.some(
        (v) => v.id === selectedItem.variantId
      )
      return !hasVariant
    })

    if (hasInvalidSelections) {
      isValidSelection = false
      violatesRules = "Please select valid variants for all items"
    }

    return {
      totalItems,
      isValidSelection,
      violatesRules,
    }
  }, [selectedItems, bundle])

  const canAddToCart = useCallback(() => {
    const summary = getSelectionSummary()
    return summary.isValidSelection && summary.totalItems > 0
  }, [getSelectionSummary])

  const value: BundleSelectionContextType = {
    bundle,
    selectedItems,
    isItemSelected,
    getSelectedVariant,
    toggleItem,
    updateItemQuantity,
    clearSelection,
    canAddToCart,
    getSelectionSummary,
  }

  return (
    <BundleSelectionContext.Provider value={value}>
      {children}
    </BundleSelectionContext.Provider>
  )
}

export const useBundleSelection = () => {
  const context = useContext(BundleSelectionContext)
  if (context === undefined) {
    throw new Error(
      "useBundleSelection must be used within a BundleSelectionProvider"
    )
  }
  return context
}
