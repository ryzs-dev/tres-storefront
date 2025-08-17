// src/lib/utils/currency.ts
/**
 * Convert cents to currency amount
 */
export const centsToAmount = (cents: number): number => {
  return cents / 100
}

/**
 * Convert currency amount to cents
 */
export const amountToCents = (amount: number): number => {
  return Math.round(amount * 100)
}

/**
 * Format currency amount for display
 */
export const formatCurrency = (
  amount: number,
  currency: string = "MYR",
  includeCurrencySymbol: boolean = true
): string => {
  const formattedAmount = amount.toFixed(2)

  if (!includeCurrencySymbol) {
    return formattedAmount
  }

  switch (currency.toUpperCase()) {
    case "MYR":
      return `RM${formattedAmount}`
    case "USD":
      return `$${formattedAmount}`
    case "EUR":
      return `€${formattedAmount}`
    default:
      return `${formattedAmount} ${currency}`
  }
}

/**
 * Calculate bundle savings from cart item metadata
 */
export const calculateItemSavings = (
  item: any
): {
  originalPrice: number
  discountedPrice: number
  savings: number
  discountType: "fixed" | "percentage" | "none"
  discountText: string
} => {
  const originalPriceCents = item.metadata?.original_price_cents as number
  const discountedPriceCents = item.metadata?.discounted_price_cents as number
  const discountType = item.metadata?.bundle_discount_type as string
  const fixedDiscountAmount = item.metadata?.fixed_discount_amount as number
  const bundleDiscountPercentage = item.metadata
    ?.bundle_discount_percentage as number

  const originalPrice = originalPriceCents
    ? centsToAmount(originalPriceCents)
    : 0
  const discountedPrice = discountedPriceCents
    ? centsToAmount(discountedPriceCents)
    : 0
  const savings =
    originalPrice > 0 && discountedPrice > 0
      ? originalPrice - discountedPrice
      : 0

  let discountText = ""
  let finalDiscountType: "fixed" | "percentage" | "none" = "none"

  if (discountType === "fixed" && fixedDiscountAmount > 0) {
    const amountInCurrency = centsToAmount(fixedDiscountAmount)
    discountText = `${formatCurrency(amountInCurrency)} off`
    finalDiscountType = "fixed"
  } else if (bundleDiscountPercentage > 0) {
    discountText = `${Math.round(bundleDiscountPercentage)}% off`
    finalDiscountType = "percentage"
  }

  return {
    originalPrice,
    discountedPrice,
    savings,
    discountType: finalDiscountType,
    discountText,
  }
}
