// src/modules/common/components/delete-button/index.tsx
"use client"

import { deleteLineItem, removeFlexibleBundleFromCart } from "@lib/data/cart"
import { Spinner, Trash } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { useRouter } from "next/navigation"
import { useState } from "react"

const DeleteButton = ({
  id,
  children,
  className,
  bundle_id,
  remove_entire_bundle = true,
}: {
  id: string
  children?: React.ReactNode
  className?: string
  bundle_id?: string
  remove_entire_bundle?: boolean
}) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async (id: string) => {
    setIsDeleting(true)

    try {
      if (bundle_id && remove_entire_bundle) {
        // Remove entire bundle
        console.log("🗑️ Removing entire bundle:", bundle_id)
        await removeFlexibleBundleFromCart(bundle_id)

        window.dispatchEvent(
          new CustomEvent("cart-updated", {
            detail: {
              action: "bundle-removed",
              bundleId: bundle_id,
            },
          })
        )
      } else {
        // Remove single item - the subscriber will handle bundle discount restoration automatically
        console.log(
          "🗑️ Removing single item:",
          id,
          "from bundle:",
          bundle_id || "none"
        )
        await deleteLineItem(id)

        window.dispatchEvent(
          new CustomEvent("cart-updated", {
            detail: {
              action: "item-removed",
              itemId: id,
              bundleId: bundle_id || null,
            },
          })
        )
      }

      // Small delay to let the subscriber process before refreshing
      await new Promise((resolve) => setTimeout(resolve, 300))

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
