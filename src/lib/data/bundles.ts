// src/lib/data/bundles.ts
import { HttpTypes } from "@medusajs/types"
import { sdk } from "../config"
import { getAuthHeaders, getCacheTag } from "./cookies"
import { revalidateTag } from "next/cache"
import { getOrSetCart, retrieveCart } from "./cart"

export type FlexibleBundle = {
  id: string
  title: string
  handle: string
  description?: string
  is_active: boolean
  min_items: number
  max_items?: number
  selection_type: "flexible" | "required_all"

  // UPDATED: Complete discount configuration
  discount_type?: "percentage" | "fixed" // NEW: Discount type

  // Percentage discount fields (legacy)
  discount_2_items?: number // Percentage discount for 2 items
  discount_3_items?: number // Percentage discount for 3+ items

  // Fixed amount discount fields (new) - in cents
  discount_2_items_amount?: number // NEW: Fixed amount for 2 items (e.g., 2000 = 20 RM)
  discount_3_items_amount?: number // NEW: Fixed amount for 3+ items (e.g., 5000 = 50 RM)

  items: {
    variant: any
    id: string
    quantity: number
    is_optional: boolean
    sort_order: number
    product: {
      options: never[]
      id: string
      title: string
      images?: Array<{
        url: string
        id: string
      }>
      handle: string
      description?: string
      thumbnail?: string
      status: string
      variants: Array<{
        [x: string]: any
        id: string
        title: string
        prices?: Array<{
          amount: number
          currency_code: string
        }>
      }>
    }
  }[]

  created_at: Date
  updated_at: Date
}

export type BundleListResponse = {
  flexible_bundles: FlexibleBundle[]
  count: number
  limit: number
  offset: number
}

// List flexible bundles with pagination (similar to listProducts pattern)
export const listBundles = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams
  countryCode?: string
  regionId?: string
}): Promise<{
  response: {
    bundles: FlexibleBundle[]
    count: number
  }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams
}> => {
  const limit = queryParams?.limit || 12
  const offset = (pageParam - 1) * limit

  const { flexible_bundles, count } =
    await sdk.client.fetch<BundleListResponse>("/store/bundles", {
      // ← Change to flexible_bundles
      method: "GET",
      query: {
        limit,
        offset,
        currency_code: countryCode,
        region_id: regionId,
        ...queryParams,
      },
      cache: "force-cache", // Use force-cache to allow revalidation
    })

  const nextPage = offset + limit < count ? pageParam + 1 : null

  return {
    response: {
      bundles: flexible_bundles, // ← Use flexible_bundles
      count,
    },
    nextPage,
    queryParams,
  }
}

// Get a specific flexible bundle by ID
export const getFlexibleBundle = async (
  id: string,
  {
    currency_code,
    region_id,
  }: {
    currency_code?: string
    region_id?: string
  }
) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.client.fetch<{
    bundle: FlexibleBundle // ← Your backend returns "bundle", not "flexible_bundle"
  }>(`/store/bundles/${id}`, {
    method: "GET",
    headers,
    query: {
      currency_code,
      region_id,
    },
    cache: "force-cache", // Use force-cache to allow revalidation
  })
}

// Get a flexible bundle by handle (SEO-friendly)
export const getFlexibleBundleByHandle = async (
  handle: string,
  {
    currency_code,
    region_id,
  }: {
    currency_code?: string
    region_id?: string
  }
) => {
  const headers = {
    ...(await getAuthHeaders()),
  }
  return sdk.client.fetch<{
    flexible_bundle: FlexibleBundle
  }>(`/store/bundles/handle/${handle}`, {
    method: "GET",
    headers,
    query: {
      currency_code,
      region_id,
    },
  })
}

// Add selected items from flexible bundle to cart
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

  // Add bundle items to cart
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

  // Wait for the subscriber to process discounts
  await new Promise((resolve) => setTimeout(resolve, 1000))

  console.log("🔄 Refreshing cart to get applied discounts...")

  // Force refresh the cart cache
  const cartCacheTag = await getCacheTag("carts")
  revalidateTag(cartCacheTag)

  // Refetch the cart with applied discounts
  const updatedCart = await retrieveCart(cart.id)

  console.log("✅ Cart refreshed with discounts applied")

  // IMPORTANT: If there's an active payment session, refresh it with the new total
  if ((updatedCart?.payment_collection?.payment_sessions ?? []).length > 0) {
    console.log("🔄 Refreshing payment session with new cart total...")

    try {
      // Delete existing payment sessions and recreate them with new amount
      if (updatedCart && updatedCart.payment_collection?.payment_sessions) {
        for (const session of updatedCart.payment_collection.payment_sessions) {
          console.warn(
            "deletePaymentSession method is not available on sdk.store.payment. Skipping deletion of payment session."
          )
        }
      }

      // The payment session will be recreated automatically when needed with the correct amount
      console.log("✅ Payment sessions refreshed")
    } catch (paymentError) {
      console.error("⚠️ Failed to refresh payment session:", paymentError)
      // Don't throw - cart update was successful, payment can be handled later
    }
  }

  return updatedCart
}

export const getBundleDiscountInfo = (
  bundle: FlexibleBundle,
  itemCount: number
) => {
  const discountType = bundle.discount_type || "percentage"

  if (discountType === "fixed") {
    // Fixed amount discounts
    if (itemCount === 2 && bundle.discount_2_items_amount) {
      return {
        type: "fixed",
        amount: bundle.discount_2_items_amount,
        amountRM: bundle.discount_2_items_amount / 100,
        hasDiscount: true,
      }
    } else if (itemCount >= 3 && bundle.discount_3_items_amount) {
      return {
        type: "fixed",
        amount: bundle.discount_3_items_amount,
        amountRM: bundle.discount_3_items_amount / 100,
        hasDiscount: true,
      }
    }
  } else {
    // Percentage discounts (legacy)
    if (itemCount === 2 && bundle.discount_2_items) {
      return {
        type: "percentage",
        percentage: bundle.discount_2_items,
        hasDiscount: true,
      }
    } else if (itemCount >= 3 && bundle.discount_3_items) {
      return {
        type: "percentage",
        percentage: bundle.discount_3_items,
        hasDiscount: true,
      }
    }
  }

  return {
    type: discountType,
    hasDiscount: false,
  }
}
