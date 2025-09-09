"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"
import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import {
  getAuthHeaders,
  getCacheOptions,
  getCacheTag,
  getCartId,
  removeCartId,
  setCartId,
} from "./cookies"
import { getRegion } from "./regions"

/**
 * Retrieves a cart by its ID. If no ID is provided, it will use the cart ID from the cookies.
 * @param cartId - optional - The ID of the cart to retrieve.
 * @returns The cart object if found, or null if not found.
 */
export async function retrieveCart(cartId?: string) {
  const id = cartId || (await getCartId())

  if (!id) {
    return null
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("carts")),
  }

  return await sdk.client
    .fetch<HttpTypes.StoreCartResponse>(`/store/carts/${id}`, {
      method: "GET",
      query: {
        fields:
          "*items, *region, *items.product, *items.variant, *items.thumbnail, *items.metadata, +items.total, *promotions, +shipping_methods.name",
      },
      headers,
      next,
      // cache: "",
    })
    .then(({ cart }) => cart)
    .catch(() => null)
}

export async function getOrSetCart(countryCode: string) {
  const region = await getRegion(countryCode)

  if (!region) {
    throw new Error(`Region not found for country code: ${countryCode}`)
  }

  let cart = await retrieveCart()

  const headers = {
    ...(await getAuthHeaders()),
  }

  if (!cart) {
    const cartResp = await sdk.store.cart.create(
      { region_id: region.id },
      {},
      headers
    )
    cart = cartResp.cart

    await setCartId(cart.id)

    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)
  }

  if (cart && cart?.region_id !== region.id) {
    await sdk.store.cart.update(cart.id, { region_id: region.id }, {}, headers)
    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)
  }

  return cart
}

export async function updateCart(data: HttpTypes.StoreUpdateCart) {
  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("No existing cart found, please create one before updating")
  }

  console.log("🔍 updateCart called with:", data)

  const headers = {
    ...(await getAuthHeaders()),
  }

  // STEP 1: Capture bundle discount info before update
  const currentCart = await retrieveCart(cartId)
  const bundleItems =
    currentCart?.items?.filter(
      (item) => item.metadata?.is_from_bundle && item.metadata?.discount_applied
    ) || []

  console.log(
    "📦 Bundle items before update:",
    bundleItems.map((item) => ({
      id: item.id,
      unit_price: item.unit_price,
      original_price: item.metadata?.original_price_cents,
      discounted_price: item.metadata?.discounted_price_cents,
    }))
  )

  // STEP 2: Update cart (this resets prices)
  const updatedCart = await sdk.store.cart
    .update(cartId, data, {}, headers)
    .then(({ cart }) => cart)

  console.log("💰 Cart after Medusa update (prices reset):", {
    total: updatedCart.total,
    items: updatedCart.items?.map((item) => ({
      id: item.id,
      unit_price: item.unit_price,
    })),
  })

  // STEP 3: Restore bundle discounts using custom endpoint
  if (bundleItems.length > 0) {
    console.log("🔄 Restoring bundle discounts via custom API...")

    const itemsToRestore = bundleItems.map((item) => ({
      id: item.id,
      unit_price: item.unit_price, // Use the discounted price
      metadata: item.metadata,
    }))

    try {
      const response = await fetch(
        `${process.env.MEDUSA_BACKEND_URL}/store/carts/${cartId}/restore-bundle-discounts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key":
              process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
            ...(headers?.authorization && {
              authorization: headers.authorization,
            }),
          },
          body: JSON.stringify({
            items: itemsToRestore,
          }),
        }
      )

      if (response.ok) {
        const result = await response.json()
        console.log("✅ Bundle discounts restored successfully:", result)
      } else {
        console.error("❌ Failed to restore bundle discounts:", response.status)
      }
    } catch (error) {
      console.error("❌ Error calling restore bundle discounts API:", error)
    }
  }

  const cartCacheTag = await getCacheTag("carts")
  revalidateTag(cartCacheTag)

  return updatedCart
}

export async function addToCart({
  variantId,
  quantity,
  countryCode,
}: {
  variantId: string
  quantity: number
  countryCode: string
}) {
  if (!variantId) {
    throw new Error("Missing variant ID when adding to cart")
  }

  const cart = await getOrSetCart(countryCode)

  if (!cart) {
    throw new Error("Error retrieving or creating cart")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.store.cart
    .createLineItem(
      cart.id,
      {
        variant_id: variantId,
        quantity,
      },
      {},
      headers
    )
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)

      const fulfillmentCacheTag = await getCacheTag("fulfillment")
      revalidateTag(fulfillmentCacheTag)
    })
    .catch(medusaError)
}

export async function updateLineItem({
  lineId,
  quantity,
}: {
  lineId: string
  quantity: number
}) {
  if (!lineId) {
    throw new Error("Missing lineItem ID when updating line item")
  }

  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("Missing cart ID when updating line item")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.store.cart
    .updateLineItem(cartId, lineId, { quantity }, {}, headers)
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)

      const fulfillmentCacheTag = await getCacheTag("fulfillment")
      revalidateTag(fulfillmentCacheTag)
    })
    .catch(medusaError)
}

export async function deleteLineItem(lineId: string) {
  if (!lineId) {
    throw new Error("Missing lineItem ID when deleting line item")
  }

  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("Missing cart ID when deleting line item")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  console.log("🗑️ About to delete line item:", lineId, "from cart:", cartId)

  await sdk.store.cart
    .deleteLineItem(cartId, lineId, headers)
    .then(async () => {
      console.log("✅ Line item deleted successfully, invalidating cache...")

      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)

      const fulfillmentCacheTag = await getCacheTag("fulfillment")
      revalidateTag(fulfillmentCacheTag)

      console.log("📢 Cache invalidated, cart.updated event should fire now")
    })
    .catch(medusaError)
}

export async function setShippingMethod({
  cartId,
  shippingMethodId,
}: {
  cartId: string
  shippingMethodId: string
}) {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.cart
    .addShippingMethod(cartId, { option_id: shippingMethodId }, {}, headers)
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
    })
    .catch(medusaError)
}

export async function initiatePaymentSession(
  cart: HttpTypes.StoreCart,
  data: HttpTypes.StoreInitializePaymentSession
) {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.payment
    .initiatePaymentSession(cart, data, {}, headers)
    .then(async (resp) => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
      return resp
    })
    .catch(medusaError)
}

export async function applyPromotions(codes: string[]) {
  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("No existing cart found")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.cart
    .update(cartId, { promo_codes: codes }, {}, headers)
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)

      const fulfillmentCacheTag = await getCacheTag("fulfillment")
      revalidateTag(fulfillmentCacheTag)
    })
    .catch(medusaError)
}

export async function applyGiftCard(code: string) {
  //   const cartId = getCartId()
  //   if (!cartId) return "No cartId cookie found"
  //   try {
  //     await updateCart(cartId, { gift_cards: [{ code }] }).then(() => {
  //       revalidateTag("cart")
  //     })
  //   } catch (error: any) {
  //     throw error
  //   }
}

export async function removeDiscount(code: string) {
  // const cartId = getCartId()
  // if (!cartId) return "No cartId cookie found"
  // try {
  //   await deleteDiscount(cartId, code)
  //   revalidateTag("cart")
  // } catch (error: any) {
  //   throw error
  // }
}

export async function removeGiftCard(
  codeToRemove: string,
  giftCards: any[]
  // giftCards: GiftCard[]
) {
  //   const cartId = getCartId()
  //   if (!cartId) return "No cartId cookie found"
  //   try {
  //     await updateCart(cartId, {
  //       gift_cards: [...giftCards]
  //         .filter((gc) => gc.code !== codeToRemove)
  //         .map((gc) => ({ code: gc.code })),
  //     }).then(() => {
  //       revalidateTag("cart")
  //     })
  //   } catch (error: any) {
  //     throw error
  //   }
}

export async function submitPromotionForm(
  currentState: unknown,
  formData: FormData
) {
  const code = formData.get("code") as string
  try {
    await applyPromotions([code])
  } catch (e: any) {
    return e.message
  }
}

// TODO: Pass a POJO instead of a form entity here
export async function setAddresses(currentState: unknown, formData: FormData) {
  try {
    if (!formData) {
      throw new Error("No form data found when setting addresses")
    }
    const cartId = getCartId()
    if (!cartId) {
      throw new Error("No existing cart found when setting addresses")
    }

    const data = {
      shipping_address: {
        first_name: formData.get("shipping_address.first_name"),
        last_name: formData.get("shipping_address.last_name"),
        address_1: formData.get("shipping_address.address_1"),
        address_2: "",
        company: formData.get("shipping_address.company"),
        postal_code: formData.get("shipping_address.postal_code"),
        city: formData.get("shipping_address.city"),
        country_code: formData.get("shipping_address.country_code"),
        province: formData.get("shipping_address.province"),
        phone: formData.get("shipping_address.phone"),
      },
      email: formData.get("email"),
    } as any

    const sameAsBilling = formData.get("same_as_billing")
    if (sameAsBilling === "on") data.billing_address = data.shipping_address

    if (sameAsBilling !== "on")
      data.billing_address = {
        first_name: formData.get("billing_address.first_name"),
        last_name: formData.get("billing_address.last_name"),
        address_1: formData.get("billing_address.address_1"),
        address_2: "",
        company: formData.get("billing_address.company"),
        postal_code: formData.get("billing_address.postal_code"),
        city: formData.get("billing_address.city"),
        country_code: formData.get("billing_address.country_code"),
        province: formData.get("billing_address.province"),
        phone: formData.get("billing_address.phone"),
      }
    await updateCart(data)
  } catch (e: any) {
    return e.message
  }

  redirect(
    `/${formData.get("shipping_address.country_code")}/checkout?step=delivery`
  )
}

/**
 * Places an order for a cart. If no cart ID is provided, it will use the cart ID from the cookies.
 * @param cartId - optional - The ID of the cart to place an order for.
 * @returns The cart object if the order was successful, or null if not.
 */
export async function placeOrder(cartId?: string) {
  const id = cartId || (await getCartId())

  if (!id) {
    throw new Error("No existing cart found when placing an order")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const cartRes = await sdk.store.cart
    .complete(id, {}, headers)
    .then(async (cartRes) => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
      return cartRes
    })
    .catch(medusaError)

  if (cartRes?.type === "order") {
    const countryCode =
      cartRes.order.shipping_address?.country_code?.toLowerCase()
    removeCartId()
    redirect(`/${countryCode}/order/${cartRes?.order.id}/confirmed`)
  }

  return cartRes.cart
}

/**
 * Updates the countrycode param and revalidates the regions cache
 * @param regionId
 * @param countryCode
 */
export async function updateRegion(countryCode: string, currentPath: string) {
  const cartId = await getCartId()
  const region = await getRegion(countryCode)

  if (!region) {
    throw new Error(`Region not found for country code: ${countryCode}`)
  }

  if (cartId) {
    await updateCart({ region_id: region.id })
    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)
  }

  const regionCacheTag = await getCacheTag("regions")
  revalidateTag(regionCacheTag)

  const productsCacheTag = await getCacheTag("products")
  revalidateTag(productsCacheTag)

  redirect(`/${countryCode}${currentPath}`)
}

export async function listCartOptions() {
  const cartId = await getCartId()
  const headers = {
    ...(await getAuthHeaders()),
  }
  const next = {
    ...(await getCacheOptions("shippingOptions")),
  }

  return await sdk.client.fetch<{
    shipping_options: HttpTypes.StoreCartShippingOption[]
  }>("/store/shipping-options", {
    query: { cart_id: cartId },
    next,
    headers,
    cache: "force-cache",
  })
}

export async function addFlexibleBundleToCart({
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
}) {
  if (!bundleId) {
    throw new Error("Missing bundle ID when adding to cart")
  }

  const cart = await getOrSetCart(countryCode)

  if (!cart) {
    throw new Error("Error retrieving or creating cart")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  console.log("=== ADDING BUNDLE TO CART ===")
  console.log("Cart ID:", cart.id)
  console.log("Bundle ID:", bundleId)
  console.log("Selected items:", selectedItems)

  // CHECK FOR EXISTING BUNDLE ITEMS FIRST
  const existingCart = await retrieveCart(cart.id)
  const existingBundleItems =
    existingCart?.items?.filter(
      (item) => item.metadata?.bundle_id === bundleId
    ) || []

  console.log(`🔍 Checking for existing bundle items...`)
  console.log(
    `📊 Found ${existingBundleItems.length} existing items in bundle ${bundleId}`
  )

  if (existingBundleItems.length > 0) {
    console.log("🔄 EXISTING BUNDLE DETECTED - UPGRADING DISCOUNT")
    console.log(
      "Existing items:",
      existingBundleItems.map((item) => ({
        item_id: item.metadata?.bundle_item_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
      }))
    )

    // Merge existing items with new items
    const allBundleItems = [
      // Existing items
      ...existingBundleItems.map((item) => ({
        item_id: item.metadata?.bundle_item_id as string,
        variant_id: item.variant_id as string,
        quantity: item.quantity,
      })),
      // New items
      ...selectedItems,
    ]

    console.log(`📦 Total items after merge: ${allBundleItems.length}`)
    console.log("All items:", allBundleItems)

    // Use update workflow to replace the entire bundle
    console.log("🚀 Calling updateFlexibleBundleInCart...")
    return await updateFlexibleBundleInCart({
      bundleId,
      countryCode,
      selectedItems: allBundleItems,
    })
  }

  console.log("➕ NO EXISTING BUNDLE - PROCEEDING WITH NORMAL ADD")

  // NO EXISTING BUNDLE - PROCEED WITH NORMAL ADD
  await sdk.client
    .fetch<HttpTypes.StoreCartResponse>(
      `/store/carts/${cart.id}/flexible-bundle-items`,
      {
        method: "POST",
        body: {
          bundle_id: bundleId,
          selectedItems,
        },
        headers,
      }
    )
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)

      const fulfillmentCacheTag = await getCacheTag("fulfillment")
      revalidateTag(fulfillmentCacheTag)
    })
    .catch((error) => {
      console.error("Cart API error:", error)
      throw error
    })

  console.log("✅ Bundle items added, waiting for discount processing...")

  // Wait for the subscriber to process discounts (it runs async)
  await new Promise((resolve) => setTimeout(resolve, 1000))

  console.log("🔄 Refreshing cart to get applied discounts...")

  // Force refresh the cart to get the updated prices with discounts
  const cartCacheTag = await getCacheTag("carts")
  revalidateTag(cartCacheTag)

  // Refetch the cart with applied discounts
  const updatedCart = await retrieveCart(cart.id)

  console.log("✅ Cart refreshed with discounts applied")

  return updatedCart
}

export async function removeFlexibleBundleFromCart(bundleId: string) {
  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("No cart found when removing bundle")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.client
    .fetch<HttpTypes.StoreCartResponse>(
      `/store/carts/${cartId}/flexible-bundle-items/${bundleId}`,
      {
        method: "DELETE",
        headers,
      }
    )
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
      const fulfillmentCacheTag = await getCacheTag("fulfillment")
      revalidateTag(fulfillmentCacheTag)
    })
    .catch(medusaError)
}

/**
 * Update bundle in cart - handles three scenarios:
 * 1. Delete bundle: Pass empty selectedItems array
 * 2. Update quantities: Pass same items with different quantities
 * 3. Change items: Pass different items within the bundle
 */
export async function updateFlexibleBundleInCart({
  bundleId,
  countryCode,
  selectedItems = [], // Default to empty array (delete bundle)
}: {
  bundleId: string
  countryCode: string
  selectedItems?: {
    item_id: string
    variant_id: string
    quantity?: number
  }[]
}) {
  if (!bundleId) {
    throw new Error("Missing bundle ID when updating bundle in cart")
  }

  const cart = await getOrSetCart(countryCode)

  if (!cart) {
    throw new Error("Error retrieving cart for bundle update")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    const response = await sdk.client.fetch<{
      cart: HttpTypes.StoreCart
      bundle_id: string
      action: string
      items_count: number
      message: string
    }>(`/store/carts/${cart.id}/flexible-bundle-items/${bundleId}`, {
      method: "PATCH",
      body: {
        selectedItems,
      },
      headers,
    })

    // Clear cart cache to ensure fresh data
    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)
    // window.location.reload() // Force page refresh

    const fulfillmentCacheTag = await getCacheTag("fulfillment")
    revalidateTag(fulfillmentCacheTag)

    await retrieveCart(cart.id) // Refetch to get updated cart state

    return response.cart
  } catch (error) {
    console.error("Bundle update API error:", error)
    throw error
  }
}
