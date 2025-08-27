// src/lib/util/cart-totals.ts
import { HttpTypes } from "@medusajs/types"
import { calculateCustomDiscount } from "./client-promo-utils"

type ExtendedCart = HttpTypes.StoreCart & {
  metadata?: Record<string, any>
}

/**
 * Server-side utility to calculate cart totals including custom promo discounts
 */
export const getServerCartTotals = async (cart: ExtendedCart) => {
  // Original cart values
  const subtotal = cart.subtotal || 0
  const bundleDiscountTotal = cart.discount_total || 0
  const taxTotal = cart.tax_total || 0
  const shippingTotal = cart.shipping_total || 0
  const giftCardTotal = cart.gift_card_total || 0
  const originalTotal = cart.total || 0

  // Custom promo discount calculation
  const customPromoCode = cart.metadata?.custom_promo_code
  const customDiscountType = cart.metadata?.custom_discount_type as
    | "percentage"
    | "fixed"
  const customDiscountValue = Number(cart.metadata?.custom_discount_value || 0)

  let customPromoDiscount = 0
  if (
    customPromoCode &&
    originalTotal &&
    customDiscountType &&
    customDiscountValue > 0
  ) {
    customPromoDiscount = calculateCustomDiscount(
      originalTotal,
      customDiscountType,
      customDiscountValue
    )
  }

  // Calculate final totals
  const totalDiscounts =
    bundleDiscountTotal + customPromoDiscount + (giftCardTotal || 0)
  const finalTotal = Math.max(0, originalTotal - customPromoDiscount)

  return {
    // Original values
    subtotal,
    bundleDiscountTotal,
    taxTotal,
    shippingTotal,
    giftCardTotal,
    originalTotal,

    // Custom promo values
    customPromoCode,
    customDiscountType,
    customDiscountValue,
    customPromoDiscount,

    // Final calculated values
    totalDiscounts,
    finalTotal,

    // Helper properties
    hasCustomPromo: !!customPromoCode,
    hasBundleDiscount: bundleDiscountTotal > 0,
    totalSavings: bundleDiscountTotal + customPromoDiscount,

    // Currency
    currencyCode: cart.currency_code || "MYR",
  }
}

/**
 * Helper to get just the final total for payment buttons etc.
 */
export const getFinalCartTotal = async (
  cart: ExtendedCart
): Promise<number> => {
  return (await getServerCartTotals(cart)).finalTotal
}

/**
 * Helper to check if cart has any discounts applied
 */
export const hasCartDiscounts = async (
  cart: ExtendedCart
): Promise<boolean> => {
  const { hasBundleDiscount, hasCustomPromo } = await getServerCartTotals(cart)
  return hasBundleDiscount || hasCustomPromo
}
