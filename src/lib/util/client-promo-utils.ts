// src/lib/util/promo-utils.ts
// Shared utility functions that can be used in both server and client components
// NOTE: No "use server" directive - this is a shared utility

/**
 * Calculate custom promo discount amount
 * Pure function with no server/client dependencies
 */
export function calculateCustomDiscount(
  cartTotal: number,
  discountType: "percentage" | "fixed",
  discountValue: number
): number {
  // Add debug logging to see what values are being passed
  console.log("🔧 calculateCustomDiscount inputs:", {
    cartTotal,
    discountType,
    discountValue,
  })

  // Validate inputs
  if (!cartTotal || cartTotal <= 0 || !discountValue || discountValue <= 0) {
    console.log("❌ Invalid inputs, returning 0")
    return 0
  }

  if (
    !discountType ||
    (discountType !== "percentage" && discountType !== "fixed")
  ) {
    console.log("❌ Invalid discount type, returning 0")
    return 0
  }

  let discountAmount = 0

  if (discountType === "percentage") {
    // Calculate percentage discount - use Math.floor for currency to avoid rounding up
    const exactDiscount = (cartTotal * discountValue) / 100
    discountAmount = Math.floor(exactDiscount) // Always round down for currency
    console.log(
      `✅ Percentage calc: ${cartTotal} * ${discountValue} / 100 = ${exactDiscount} → rounded down to ${discountAmount}`
    )
  } else if (discountType === "fixed") {
    // Fixed amount - convert to cents if needed (Medusa usually stores amounts in cents)
    discountAmount = Math.min(discountValue * 100, cartTotal) // Don't exceed cart total
    console.log(
      `✅ Fixed calc: min(${
        discountValue * 100
      }, ${cartTotal}) = ${discountAmount}`
    )
  }

  const finalDiscount = Math.max(0, discountAmount) // Ensure non-negative
  console.log(`🎯 Final discount amount: ${finalDiscount}`)

  return finalDiscount
}
/**
 * Extract promo code information from cart metadata
 */
export function getPromoCodeInfo(cart: any) {
  const customPromoCode = cart.metadata?.custom_promo_code
  const customDiscountType = cart.metadata?.custom_discount_type as
    | "percentage"
    | "fixed"
  const customDiscountValue = Number(cart.metadata?.custom_discount_value || 0)

  return {
    code: customPromoCode,
    type: customDiscountType,
    value: customDiscountValue,
    hasPromo: !!customPromoCode,
  }
}

/**
 * Calculate final cart total with custom promo applied
 */
export function calculateFinalCartTotal(cart: any): number {
  const promoInfo = getPromoCodeInfo(cart)

  let customPromoDiscount = 0
  if (
    promoInfo.hasPromo &&
    cart.total &&
    promoInfo.type &&
    promoInfo.value > 0
  ) {
    customPromoDiscount = calculateCustomDiscount(
      cart.total,
      promoInfo.type,
      promoInfo.value
    )
  }

  return Math.max(0, (cart.total || 0) - customPromoDiscount)
}
