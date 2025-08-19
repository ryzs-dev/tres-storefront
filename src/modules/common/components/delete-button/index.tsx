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
}: {
  id: string
  children?: React.ReactNode
  className?: string
  bundle_id?: string
}) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (id: string) => {
    setIsDeleting(true)

    if (bundle_id) {
      await removeFlexibleBundleFromCart(bundle_id)
        .then(() => {
          // Success: Dispatch custom event for immediate UI updates
          window.dispatchEvent(
            new CustomEvent("item-removed", {
              detail: {
                itemId: id,
                bundleId: bundle_id,
                action: "bundle-removed",
              },
            })
          )
        })
        .catch((err) => {
          console.error("Failed to remove bundle from cart:", err)
          setIsDeleting(false)
        })
        .finally(() => {
          // Cart operations handle their own cache invalidation
          // The page will automatically refresh due to revalidateTag
        })
    } else {
      await deleteLineItem(id)
        .then(() => {
          // Success: Dispatch custom event for immediate UI updates
          window.dispatchEvent(
            new CustomEvent("item-removed", {
              detail: {
                itemId: id,
                bundleId: null,
                action: "item-removed",
              },
            })
          )
        })
        .catch((err) => {
          console.error("Failed to remove item from cart:", err)
          setIsDeleting(false)
        })
        .finally(() => {
          // Cart operations handle their own cache invalidation
          // The page will automatically refresh due to revalidateTag
        })
    }
  }

  return (
    <div
      className={clx(
        "flex items-center justify-between text-small-regular",
        className
      )}
    >
      <button
        className="flex gap-x-1 text-ui-fg-subtle hover:text-ui-fg-base cursor-pointer"
        onClick={() => handleDelete(id)}
      >
        {isDeleting ? <Spinner className="animate-spin" /> : <Trash />}
        <span>{children}</span>
      </button>
    </div>
  )
}

export default DeleteButton
