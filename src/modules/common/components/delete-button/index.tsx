"use client"

import { deleteLineItem, removeFlexibleBundleFromCart } from "@lib/data/cart"
import { Spinner, Trash } from "@medusajs/icons"
import { clx, toast } from "@medusajs/ui"
import { useCart } from "context/CartContext"
import { useRouter } from "next/navigation"
import { useState } from "react"

const DeleteButton = ({
  id,
  children,
  className,
  bundle_id,
  bundle_item_id, // Add this prop
  variant_id,
}: {
  id: string
  children?: React.ReactNode
  className?: string
  bundle_id?: string
  bundle_item_id?: string // Bundle item ID for removing specific item
  variant_id?: string
}) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const { setCart, removeFromCart, refreshCart } = useCart()

  const handleDelete = async (id: string) => {
    setIsDeleting(true)

    try {
      let updatedCart: any

      if (bundle_id) {
        await removeFromCart(bundle_id, bundle_item_id, variant_id)
        toast.success("Bundle removed from cart successfully!")
      } else {
        updatedCart = await deleteLineItem(id)
        toast.success("Item removed from cart successfully!")
      }

      if (updatedCart) {
        setCart(updatedCart)
      }

      refreshCart()
      console.log("Updated Cart after deletion:", updatedCart)
    } catch (err) {
      console.error("Failed to delete item:", err)
      toast.error("Failed to remove item from cart.")
    } finally {
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
