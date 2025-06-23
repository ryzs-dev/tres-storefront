// src/lib/data/bundles.ts
import { HttpTypes } from "@medusajs/types"
import { sdk } from "../config"
import { getAuthHeaders } from "./cookies"

export type FlexibleBundle = {
  id: string
  title: string
  handle: string
  description?: string
  is_active: boolean
  min_items: number
  max_items?: number
  selection_type: "flexible" | "required_all"

  // UPDATED: Discount configuration fields from backend
  discount_2_items?: number // Percentage discount for 2 items
  discount_3_items?: number // Percentage discount for 3+ items

  items: {
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
        // Add other variant properties as needed
      }>
    }
  }[]

  created_at: Date
  updated_at: Date
}

export type BundleListResponse = {
  flexible_bundles: FlexibleBundle[] // ← Change from "bundles" to "flexible_bundles"
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
export const addFlexibleBundleToCart = async (
  cartId: string,
  {
    bundle_id,
    selectedItems,
  }: {
    bundle_id: string
    selectedItems: {
      item_id: string
      variant_id: string
      quantity?: number
    }[]
  }
) => {
  const headers = {
    ...(await getAuthHeaders()),
  }
  return sdk.client.fetch<{
    cart: HttpTypes.StoreCart
  }>(`/store/carts/${cartId}/flexible-bundle-items`, {
    method: "POST",
    headers,
    body: {
      bundle_id,
      selectedItems,
    },
  })
}
