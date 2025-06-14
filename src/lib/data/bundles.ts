// src/lib/data/bundles.ts
import { HttpTypes } from "@medusajs/types"
import { sdk } from "../config"

export type FlexibleBundle = {
  id: string
  title: string
  handle: string
  description?: string
  is_active: boolean
  min_items: number
  max_items?: number
  selection_type: "flexible" | "required_all"
  items: {
    id: string
    quantity: number
    is_optional: boolean
    sort_order: number
    product: HttpTypes.StoreProduct
  }[]
  created_at: string
  updated_at: string
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
      bundles: flexible_bundles,
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
  return sdk.client.fetch<{
    flexible_bundle: FlexibleBundle
  }>(`/store/bundles/${id}`, {
    method: "GET",
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
  return sdk.client.fetch<{
    flexible_bundle: FlexibleBundle
  }>(`/store/bundles/handle/${handle}`, {
    method: "GET",
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
  return sdk.client.fetch<{
    cart: HttpTypes.StoreCart
  }>(`/store/carts/${cartId}/flexible-bundle-items`, {
    method: "POST",
    body: {
      bundle_id,
      selectedItems,
    },
  })
}
