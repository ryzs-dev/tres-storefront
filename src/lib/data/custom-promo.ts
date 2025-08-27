// src/lib/data/custom-promo.ts
"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheTag, getCartId } from "./cookies"
import { revalidateTag } from "next/cache"

export async function validateCustomPromoCode(
  code: string,
  customer_email: string
) {
  try {
    const response = await fetch(
      `${process.env.MEDUSA_BACKEND_URL}/store/promo-codes/validate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key":
            process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ||
            "pk_1aa740894225626c43d7cb6e73d777df8968aa220052961d3c298405c1549e95",
        },
        body: JSON.stringify({ code, customer_email }),
      }
    )

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Error validating promo code:", error)
    throw error
  }
}

export async function applyCustomPromoCode(
  code: string,
  customer_email: string
) {
  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("No cart found")
  }

  try {
    // First validate the code
    const validation = await validateCustomPromoCode(code, customer_email)

    if (!validation.valid) {
      throw new Error(validation.error || "Invalid promo code")
    }

    // Mark the promo code as used
    await fetch(`${process.env.MEDUSA_BACKEND_URL}/store/promo-codes/apply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key":
          process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ||
          "pk_1aa740894225626c43d7cb6e73d777df8968aa220052961d3c298405c1549e95",
      },
      body: JSON.stringify({ code, cart_id: cartId }),
    })

    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)

    return {
      success: true,
      discount: validation.promo_code,
    }
  } catch (error: any) {
    console.error("Error applying promo code:", error)
    throw new Error(error.message || "Failed to apply promo code")
  }
}

export async function removeCustomPromoCode() {
  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("No cart found")
  }

  try {
    const headers = await getAuthHeaders()

    // Remove promo code from cart metadata
    await sdk.store.cart.update(
      cartId,
      {
        metadata: {
          custom_promo_code: null,
          custom_discount_type: null,
          custom_discount_value: null,
        },
      },
      {},
      headers || {}
    )

    return { success: true }
  } catch (error: any) {
    console.error("Error removing promo code:", error)
    throw new Error(error.message || "Failed to remove promo code")
  }
  // REMOVED: revalidateTag - this was causing the cart to refresh and lose bundle pricing
}
