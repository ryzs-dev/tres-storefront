"use client"

import { HttpTypes } from "@medusajs/types"
import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { retrieveCart } from "@lib/data/cart"
import CartSidePanel from "../cart-side-panel"

const CartButton = () => {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)
  const [cartState, setCartState] = useState<HttpTypes.StoreCart | null>(null)
  const [isLoadingCart, setIsLoadingCart] = useState(true)

  const totalItems =
    cartState?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0

  const itemRef = useRef<number>(totalItems)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pathname = usePathname()

  const openSidePanel = () => setIsSidePanelOpen(true)
  const closeSidePanel = () => setIsSidePanelOpen(false)

  const timedOpen = () => {
    openSidePanel()
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(closeSidePanel, 5000)
  }

  const openAndCancel = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    openSidePanel()
  }

  const getCartData = async () => {
    try {
      const cart = await retrieveCart()
      setCartState(cart)
    } catch (error) {
      console.error("Error fetching cart:", error)
      setCartState(null)
    } finally {
      setIsLoadingCart(false)
    }
  }

  useEffect(() => {
    getCartData()
  }, [])

  useEffect(() => {
    const handleCartUpdate = () => getCartData()

    window.addEventListener("cart-updated", handleCartUpdate)
    window.addEventListener("storage", handleCartUpdate)

    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate)
      window.removeEventListener("storage", handleCartUpdate)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  useEffect(() => {
    const cartChanged = itemRef.current !== totalItems
    if (
      cartChanged &&
      !pathname.includes("/cart") &&
      !isLoadingCart &&
      !isSidePanelOpen
    ) {
      timedOpen()
    }
    itemRef.current = totalItems
  }, [totalItems, pathname, isLoadingCart, isSidePanelOpen])

  return (
    <>
      <button
        onClick={openAndCancel}
        className="hover:text-ui-fg-base text-lg hover:underline font-urw font-semibold"
        data-testid="nav-cart-button"
      >
        {`Cart (${totalItems})`}
      </button>

      <CartSidePanel
        cart={cartState}
        isOpen={isSidePanelOpen}
        onClose={closeSidePanel}
      />
    </>
  )
}

export default CartButton
