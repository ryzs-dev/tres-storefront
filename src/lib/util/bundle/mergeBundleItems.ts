import { getOrSetCart } from "@lib/data/cart"

export async function mergeBundleItems(
  bundleId: string,
  countryCode: string,
  newItems: any[]
) {
  const cart = await getOrSetCart(countryCode)
  if (!cart) throw new Error("Error retrieving cart")

  // Get existing items in this bundle
  const existingBundleItems = cart.items?.filter(
    (item) => item.metadata?.bundle_id === bundleId
  )

  // Normalize both
  const normalizedExisting =
    existingBundleItems?.map((item) => ({
      item_id: item.metadata?.bundle_item_id as string,
      variant_id: item.variant_id as string,
      quantity: item.quantity,
    })) || []

  const normalizedNew = newItems.map((item) => ({
    item_id: item.itemId || item.item_id,
    variant_id: item.variantId || item.variant_id,
    quantity: item.quantity || 1,
  }))

  // 🧩 Merge quantities for items with the same variant
  const mergedMap = new Map<
    string,
    { item_id: string; variant_id: string; quantity: number }
  >()

  for (const item of [...normalizedExisting, ...normalizedNew]) {
    const key = item.variant_id
    if (mergedMap.has(key)) {
      mergedMap.get(key)!.quantity += item.quantity // add quantities
    } else {
      mergedMap.set(key, { ...item })
    }
  }

  // Return merged as array
  return Array.from(mergedMap.values())
}
