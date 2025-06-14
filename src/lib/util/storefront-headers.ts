// src/lib/util/storefront-headers.ts

export const getStorefrontHeaders = () => {
  const headers: Record<string, string> = {}

  // Add publishable API key if available
  if (process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY) {
    headers["x-publishable-api-key"] =
      process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
  }

  return headers
}
