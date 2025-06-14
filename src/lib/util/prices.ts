// src/lib/util/prices.ts
import { HttpTypes } from "@medusajs/types"

type FormatAmountOptions = {
  amount: number
  region: HttpTypes.StoreRegion
  includeTaxes?: boolean
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}

/**
 * Formats a price amount based on the region's currency
 */
export const formatAmount = ({
  amount,
  region,
  includeTaxes = true,
  minimumFractionDigits,
  maximumFractionDigits,
  locale,
}: FormatAmountOptions): string => {
  const currency = region.currency_code?.toUpperCase()

  if (!currency) {
    return amount.toString()
  }

  // Convert from smallest currency unit (cents) to major currency unit
  const majorUnitAmount = amount / 100

  // Use region's default locale or fallback
  const formatLocale = locale || getLocaleFromRegion(region)

  try {
    return new Intl.NumberFormat(formatLocale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits:
        minimumFractionDigits ?? getCurrencyDecimalPlaces(currency),
      maximumFractionDigits:
        maximumFractionDigits ?? getCurrencyDecimalPlaces(currency),
    }).format(majorUnitAmount)
  } catch (error) {
    // Fallback formatting if Intl.NumberFormat fails
    console.warn(`Failed to format amount for currency ${currency}:`, error)
    return `${currency} ${majorUnitAmount.toFixed(2)}`
  }
}

/**
 * Get decimal places for a currency
 */
const getCurrencyDecimalPlaces = (currency: string): number => {
  // Most currencies use 2 decimal places
  const zeroDecimalCurrencies = [
    "BIF",
    "CLP",
    "DJF",
    "GNF",
    "JPY",
    "KMF",
    "KRW",
    "MGA",
    "PYG",
    "RWF",
    "UGX",
    "VND",
    "VUV",
    "XAF",
    "XOF",
    "XPF",
  ]

  const threeDecimalCurrencies = [
    "BHD",
    "IQD",
    "JOD",
    "KWD",
    "LYD",
    "OMR",
    "TND",
  ]

  if (zeroDecimalCurrencies.includes(currency.toUpperCase())) {
    return 0
  }

  if (threeDecimalCurrencies.includes(currency.toUpperCase())) {
    return 3
  }

  return 2
}

/**
 * Get locale from region for proper number formatting
 */
const getLocaleFromRegion = (region: HttpTypes.StoreRegion): string => {
  // Map common currency codes to locales
  const currencyToLocale: Record<string, string> = {
    USD: "en-US",
    EUR: "en-GB", // or "de-DE", "fr-FR" depending on preference
    GBP: "en-GB",
    JPY: "ja-JP",
    CAD: "en-CA",
    AUD: "en-AU",
    CHF: "de-CH",
    CNY: "zh-CN",
    SEK: "sv-SE",
    NOK: "nb-NO",
    DKK: "da-DK",
    PLN: "pl-PL",
    CZK: "cs-CZ",
    HUF: "hu-HU",
    RUB: "ru-RU",
    BRL: "pt-BR",
    MXN: "es-MX",
    INR: "en-IN",
    KRW: "ko-KR",
    SGD: "en-SG",
    HKD: "en-HK",
    MYR: "en-MY",
    THB: "th-TH",
    IDR: "id-ID",
    PHP: "en-PH",
    VND: "vi-VN",
  }

  const currency = region.currency_code?.toUpperCase()

  // Try to get locale from currency
  if (currency && currencyToLocale[currency]) {
    return currencyToLocale[currency]
  }

  // Try to get locale from region countries
  if (region.countries && region.countries.length > 0) {
    const country = region.countries[0]
    if (country.iso_2) {
      return getLocaleFromCountryCode(country.iso_2)
    }
  }

  // Default fallback
  return "en-US"
}

/**
 * Get locale from country ISO code
 */
const getLocaleFromCountryCode = (countryCode: string): string => {
  const countryToLocale: Record<string, string> = {
    US: "en-US",
    GB: "en-GB",
    CA: "en-CA",
    AU: "en-AU",
    DE: "de-DE",
    FR: "fr-FR",
    IT: "it-IT",
    ES: "es-ES",
    JP: "ja-JP",
    CN: "zh-CN",
    KR: "ko-KR",
    MY: "en-MY",
    SG: "en-SG",
    TH: "th-TH",
    ID: "id-ID",
    PH: "en-PH",
    VN: "vi-VN",
    IN: "en-IN",
    BR: "pt-BR",
    MX: "es-MX",
    SE: "sv-SE",
    NO: "nb-NO",
    DK: "da-DK",
    FI: "fi-FI",
    NL: "nl-NL",
    BE: "nl-BE",
    CH: "de-CH",
    AT: "de-AT",
    PL: "pl-PL",
    CZ: "cs-CZ",
    HU: "hu-HU",
    RU: "ru-RU",
    UA: "uk-UA",
    TR: "tr-TR",
    SA: "ar-SA",
    AE: "ar-AE",
    IL: "he-IL",
    ZA: "en-ZA",
    EG: "ar-EG",
    NG: "en-NG",
    KE: "en-KE",
    GH: "en-GH",
    AR: "es-AR",
    CL: "es-CL",
    CO: "es-CO",
    PE: "es-PE",
    VE: "es-VE",
  }

  return countryToLocale[countryCode.toUpperCase()] || "en-US"
}

/**
 * Format price range (for products with multiple variants)
 */
export const formatPriceRange = ({
  minAmount,
  maxAmount,
  region,
  includeTaxes = true,
}: {
  minAmount: number
  maxAmount: number
  region: HttpTypes.StoreRegion
  includeTaxes?: boolean
}): string => {
  if (minAmount === maxAmount) {
    return formatAmount({ amount: minAmount, region, includeTaxes })
  }

  const minFormatted = formatAmount({ amount: minAmount, region, includeTaxes })
  const maxFormatted = formatAmount({ amount: maxAmount, region, includeTaxes })

  return `${minFormatted} - ${maxFormatted}`
}

/**
 * Check if amount should include taxes based on region
 */
export const shouldIncludeTaxes = (region: HttpTypes.StoreRegion): boolean => {
  // This is a simplified example - you might want to implement more complex logic
  // based on your business requirements and regional tax laws
  return region.automatic_taxes || false
}
