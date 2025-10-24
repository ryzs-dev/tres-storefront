"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import CartSidePanel from "../cart-side-panel"
import { useCart } from "context/CartContext"

const CartButton = () => {
  const pathname = usePathname()
  const { cart } = useCart()

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)
  const [isLoadingCart, setIsLoadingCart] = useState(true)

  const totalItems =
    cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0
  const itemRef = useRef<number>(totalItems)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  useEffect(() => {
    setIsLoadingCart(false)
  }, [cart])

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

  if (!cart) {
    return <span className="text-lg font-urw font-semibold">Cart (…)</span>
  }

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
        cart={cart}
        isOpen={isSidePanelOpen}
        onClose={closeSidePanel}
      />
    </>
  )
}

export default CartButton
