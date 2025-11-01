"use client"

import { createContext, useContext, useEffect } from "react"
import useSWR from "swr"
import { HttpTypes } from "@medusajs/types"
import { useRegion } from "./RegionContext"
import {
  addFlexibleBundleToCart,
  getOrSetCart,
  removeFlexibleBundleFromCart,
  updateFlexibleBundleInCart,
} from "@lib/data/cart"

type CartContextType = {
  cart?: HttpTypes.StoreCart
  setCart: (cart: HttpTypes.StoreCart) => void
  addToCart: (args: {
    bundleId: string
    countryCode: string
    selectedItems: {
      item_id: string
      variant_id: string
      quantity?: number
    }[]
  }) => Promise<void>
  refreshCart: () => Promise<void>
  updateToCart: (args: {
    bundleId: string
    selectedItems: {
      item_id: string
      variant_id: string
      quantity?: number
    }[]
    countryCode: string
  }) => Promise<HttpTypes.StoreCart>
  removeFromCart: (
    bundleId: string,
    bundleItemId?: string,
    variant_id?: string
  ) => Promise<HttpTypes.StoreCart | undefined>
}

const CartContext = createContext<CartContextType | null>(null)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { region } = useRegion()
  const regionCode = region?.countries?.[0]?.iso_2 || ""

  // ✅ SWR Fetcher with logging
  const fetchCart = async () => {
    if (!regionCode) {
      return undefined
    }
    const cart = await getOrSetCart(regionCode)
    localStorage.setItem("cart_id", cart.id)
    return cart
  }

  // ✅ SWR Hook (only fetches when regionCode available)
  const {
    data: cart,
    mutate,
    isValidating,
    error,
  } = useSWR(regionCode ? ["cart", regionCode] : null, fetchCart, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  })

  // 🔄 Re-fetch when region changes
  useEffect(() => {
    if (regionCode) {
      mutate()
    }
  }, [regionCode])

  const setCart = (newCart: HttpTypes.StoreCart) => {
    mutate(newCart, false) // Optimistic update, skip fetch
  }

  const refreshCart = async () => {
    await mutate() // Force SWR re-fetch
  }

  const addToCart = async ({
    bundleId,
    countryCode,
    selectedItems,
  }: {
    bundleId: string
    countryCode: string
    selectedItems: {
      item_id: string
      variant_id: string
      quantity?: number
    }[]
  }) => {
    if (!cart?.id) {
      console.error("🚫 Cart not initialized yet.")
      return
    }

    try {
      const { cart: updatedCart } = await addFlexibleBundleToCart({
        cartId: cart.id,
        bundleId,
        countryCode,
        selectedItems,
      })
      if (updatedCart) {
        mutate(updatedCart, false)
      }
    } catch (error) {
      console.error("❌ Error adding to cart:", error)
    }
  }

  const updateToCart = async ({
    bundleId,
    selectedItems,
    countryCode,
  }: {
    bundleId: string
    selectedItems: {
      item_id: string
      variant_id: string
      quantity?: number
    }[]
    countryCode: string
  }) => {
    if (!cart?.id) {
      console.warn("⚠️ Cart not initialized yet")
      throw new Error("Cart not initialized") // <-- important
    }

    try {
      const { cart: updatedCart } = await updateFlexibleBundleInCart({
        cartId: cart.id,
        bundleId,
        countryCode,
        selectedItems,
      })

      if (!updatedCart) {
        console.error(
          "❌ updateFlexibleBundleInCart() returned no updated cart"
        )
        throw new Error("No cart returned from updateFlexibleBundleInCart")
      }

      // Update your local cart state
      mutate(updatedCart, false)

      console.info("✅ Bundle updated in cart:", updatedCart.id)
      return updatedCart // <-- ✅ return the updated cart for chaining
    } catch (error: any) {
      console.error("❌ Failed to update bundle in cart:", error)

      // Re-throw so that handleAddToCart can catch it
      throw new Error(
        error?.response?.data?.message ||
          error?.message ||
          "Unknown error updating cart"
      )
    }
  }

  const removeFromCart = async (
    bundleId: string,
    bundleItemId?: string,
    variant_id?: string
  ) => {
    if (!bundleId) {
      console.warn("Missing bundleId for removal")
      return undefined
    }

    try {
      const { cart: updatedCart } = await removeFlexibleBundleFromCart(
        bundleId,
        bundleItemId,
        variant_id
      )
      if (updatedCart) {
        mutate(updatedCart, false)
        return updatedCart
      }
    } catch (error) {
      console.error("❌ Failed to remove from cart:", error)
      return undefined
    }
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        refreshCart,
        updateToCart,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
