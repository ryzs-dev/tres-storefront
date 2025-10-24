import { HttpTypes } from "@medusajs/types"

/**
 * Extract unique bundle discounts from the cart
 * @param cart - Medusa StoreCart object
 * @returns Record of bundle_id → { title, discount }
 */
export function getBundleDiscounts(
  cart: HttpTypes.StoreCart
): Record<string, { title: string; discount: number }> {
  if (!cart?.items?.length) return {}

  return (
    cart.items
      ?.filter(
        (item) => item.metadata?.bundle_id && item.metadata?.discount_applied
      )
      .reduce(
        (
          bundles: Record<string, { title: string; discount: number }>,
          item
        ) => {
          const id = item?.metadata?.bundle_id as string
          const title = item?.metadata?.bundle_title as string
          const discount = Number(item?.metadata?.discount_applied)

          // Only count once per unique bundle_id
          if (!bundles[id]) {
            bundles[id] = { title, discount }
          }

          return bundles
        },
        {}
      ) || {}
  )
}
