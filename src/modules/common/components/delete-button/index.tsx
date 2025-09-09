"use client"

import {
  deleteLineItem,
  removeFlexibleBundleFromCart,
  updateFlexibleBundleInCart,
} from "@lib/data/cart"
import { Spinner, Trash } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { useRouter } from "next/navigation"
import { useState } from "react"

const DeleteButton = ({
  id,
  children,
  className,
  bundle_id,
  bundle_item_id, // Add this prop
  allCartItems, // Add this prop
  countryCode, // Add this prop
  remove_entire_bundle = false, // Changed default to false
}: {
  id: string
  children?: React.ReactNode
  className?: string
  bundle_id?: string
  bundle_item_id?: string // Bundle item ID for removing specific item
  allCartItems?: any[] // All cart items to find other bundle items
  countryCode?: string
  remove_entire_bundle?: boolean
}) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async (id: string) => {
    setIsDeleting(true)

    try {
      if (bundle_id && remove_entire_bundle) {
        await removeFlexibleBundleFromCart(bundle_id)

        window.dispatchEvent(
          new CustomEvent("cart-updated", {
            detail: {
              action: "bundle-removed",
              bundleId: bundle_id,
            },
          })
        )
      } else if (bundle_id && bundle_item_id && allCartItems && countryCode) {
        // Find all other bundle items (excluding the one being removed)
        const otherBundleItems = allCartItems
          .filter(
            (item) =>
              item.metadata?.bundle_id === bundle_id &&
              item.metadata?.bundle_item_id !== bundle_item_id
          )
          .map((item) => ({
            item_id: item.metadata?.bundle_item_id as string,
            variant_id: item.variant_id as string,
            quantity: item.quantity,
          }))

        // Update bundle with remaining items (this will recalculate discounts)
        await updateFlexibleBundleInCart({
          bundleId: bundle_id,
          countryCode,
          selectedItems: otherBundleItems,
        })

        window.dispatchEvent(
          new CustomEvent("cart-updated", {
            detail: {
              action: "bundle-item-removed",
              itemId: id,
              bundleId: bundle_id,
              remainingItems: otherBundleItems.length,
            },
          })
        )
      } else {
        await deleteLineItem(id)

        window.dispatchEvent(
          new CustomEvent("cart-updated", {
            detail: {
              action: "item-removed",
              itemId: id,
            },
          })
        )
      }

      // Small delay for processing then refresh
      await new Promise((resolve) => setTimeout(resolve, 500))
      router.refresh()
    } catch (err) {
      console.error("Failed to delete item:", err)
      setIsDeleting(false)
    }
  }

  return (
    <div className={clx("flex items-center gap-2", className)}>
      <button
        className="flex gap-x-1 text-ui-fg-subtle hover:text-ui-fg-base cursor-pointer disabled:opacity-50"
        onClick={() => handleDelete(id)}
        disabled={isDeleting}
      >
        {isDeleting ? <Spinner className="animate-spin" /> : <Trash />}
        <span>{children}</span>
      </button>
    </div>
  )
}

export default DeleteButton
