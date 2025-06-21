// src/lib/util/get-product-price.ts
import { HttpTypes } from "@medusajs/types"

export const getPercentageDiff = (original: number, calculated: number) => {
  const diff = original - calculated
  const percentage = (diff / original) * 100
  return Math.round(percentage)
}

export const getPricesForVariant = (variant: any) => {
  // Handle our simplified price structure from bundle API
  if (variant.calculated_price_number) {
    return {
      calculated_price_number: variant.calculated_price_number,
      calculated_price: `MYR ${variant.calculated_price_number.toFixed(2)}`,
      original_price: `MYR ${variant.calculated_price_number.toFixed(2)}`,
      currency_code: "MYR",
      price_type: "default",
      percentage_diff: 0,
    }
  }

  // Handle standard Medusa calculated_price structure
  if (variant.calculated_price && variant.calculated_price.calculated_amount) {
    const calculatedAmount = variant.calculated_price.calculated_amount
    const originalAmount = variant.calculated_price.original_amount
    const currencyCode = variant.calculated_price.currency_code || "MYR"

    return {
      calculated_price_number: calculatedAmount,
      calculated_price: `${currencyCode} ${calculatedAmount.toFixed(2)}`,
      original_price: `${currencyCode} ${originalAmount.toFixed(2)}`,
      currency_code: currencyCode,
      price_type:
        variant.calculated_price.calculated_price?.price_list_type || "default",
      percentage_diff: getPercentageDiff(originalAmount, calculatedAmount),
    }
  }

  // Fallback: if we have basic prices, use them
  if (variant.prices && variant.prices.length > 0) {
    const price = variant.prices[0] // Use first price as fallback
    const amount = price.amount // Convert cents to currency units
    const currencyCode = price.currency_code || "MYR"

    return {
      calculated_price_number: amount,
      calculated_price: `${currencyCode} ${amount.toFixed(2)}`,
      original_price: `${currencyCode} ${amount.toFixed(2)}`,
      currency_code: currencyCode,
      price_type: "default",
      percentage_diff: 0,
    }
  }

  return null
}

export const getProductPrice = ({
  product,
  variantId,
}: {
  product: HttpTypes.StoreProduct
  variantId?: string
}) => {
  const getVariant = () => {
    if (!product.variants || product.variants.length === 0) {
      return null
    }

    if (variantId) {
      return product.variants.find((v) => v.id === variantId)
    }

    return product.variants[0]
  }

  const variant = getVariant()

  if (!variant) {
    return null
  }

  return getPricesForVariant(variant)
}

export const getProductTitle = (product: HttpTypes.StoreProduct) => {
  return product.title
}

export const getProductHandle = (product: HttpTypes.StoreProduct) => {
  return product.handle
}

export const getProductDescription = (product: HttpTypes.StoreProduct) => {
  return product.description
}

export const getProductOptionValue = (
  product: HttpTypes.StoreProduct,
  optionId: string
) => {
  const option = product.options?.find((o) => o.id === optionId)

  if (!option) {
    return null
  }

  return option.values
}
