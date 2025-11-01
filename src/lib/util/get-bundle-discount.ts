import { HttpTypes } from "@medusajs/types"

/**
 * Calculates bundle-level discounts dynamically based on total quantity in each bundle
 */
export function getBundleDiscounts(
  cart: HttpTypes.StoreCart
): Record<string, { title: string; discount: number }> {
  if (!cart?.items?.length) return {}

  const bundles: Record<
    string,
    { title: string; totalQty: number; discount: number }
  > = {}

  for (const item of cart.items) {
    const metadata = (item.metadata || {}) as Record<string, any>
    const bundleId = metadata.bundle_id as string | undefined
    const title = metadata.bundle_title as string

    if (!bundleId) continue

    if (!bundles[bundleId]) {
      bundles[bundleId] = { title, totalQty: 0, discount: 0 }
    }

    // Sum all quantities for this bundle
    bundles[bundleId].totalQty += item.quantity ?? 0
  }

  // 🎯 Apply your discount logic based on total quantity
  for (const [bundleId, bundle] of Object.entries(bundles)) {
    const q = bundle.totalQty

    if (q >= 3) bundle.discount = 3000 // RM30 off
    else if (q >= 2) bundle.discount = 2000 // RM20 off
    else bundle.discount = 0
  }

  // Return in same format expected by Summary.tsx
  return Object.fromEntries(
    Object.entries(bundles).map(([id, b]) => [
      id,
      { title: b.title, discount: b.discount },
    ])
  )
}
