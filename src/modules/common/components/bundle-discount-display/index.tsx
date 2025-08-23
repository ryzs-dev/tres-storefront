// src/modules/common/components/bundle-discount-display/index.tsx
import { Badge, Text } from "@medusajs/ui"
import { calculateItemSavings, formatCurrency } from "@lib/utils/currency"

interface BundleDiscountDisplayProps {
  item: any
  showSavings?: boolean
  className?: string
}

export const BundleDiscountDisplay = ({
  item,
  showSavings = true,
  className = "",
}: BundleDiscountDisplayProps) => {
  const isBundleItem = item.metadata?.is_from_bundle === true

  if (!isBundleItem) {
    return null
  }

  const bundleTitle = item.metadata?.bundle_title as string
  const savingsInfo = calculateItemSavings(item)

  return (
    <div className={`mt-2 space-y-1 ${className}`}>
      <Badge className="text-xs bg-blue-50 text-blue-700 border-blue-200">
        📦 {bundleTitle || "Bundle Item"}
      </Badge>

      {savingsInfo.discountType !== "none" && (
        <div className="text-xs text-[#99b2dd] font-medium">
          🎉 {savingsInfo.discountText}
        </div>
      )}

      {showSavings && savingsInfo.savings > 0 && (
        <div className="text-xs text-[#99b2dd]">
          Saved: {formatCurrency(savingsInfo.savings)}
        </div>
      )}
    </div>
  )
}

/**
 * Calculate comprehensive bundle savings from cart items
 */
export const calculateBundleSavings = (
  cartItems: any[]
): {
  bundleGroups: Record<string, any>
  totalBundleSavings: number
} => {
  const bundleGroups = cartItems
    .filter((item) => item.metadata?.is_from_bundle === true)
    .reduce((groups, item) => {
      const bundleId = item.metadata?.bundle_id as string
      if (!bundleId) return groups

      if (!groups[bundleId]) {
        groups[bundleId] = {
          bundleId,
          bundleTitle: item.metadata?.bundle_title as string,
          items: [],
          totalSavings: 0,
          discountType:
            (item.metadata?.bundle_discount_type as string) === "fixed"
              ? "fixed"
              : "percentage",
          totalFixedDiscount: item.metadata?.total_bundle_discount as number,
          itemCount: 0,
        }
      }

      groups[bundleId].items.push(item)
      groups[bundleId].itemCount += item.quantity

      // Calculate actual savings
      const itemSavings = calculateItemSavings(item)
      groups[bundleId].totalSavings += itemSavings.savings * item.quantity

      return groups
    }, {} as Record<string, any>)

  const totalBundleSavings = Object.values(bundleGroups).reduce(
    (total: number, group: any) => total + group.totalSavings,
    0
  )

  return {
    bundleGroups,
    totalBundleSavings,
  }
}

interface BundleSavingsSummaryProps {
  cartItems: any[]
  currencyCode: string
  convertToLocale: (params: { amount: number; currency_code: string }) => string
  className?: string
}

export const BundleSavingsSummary = ({
  cartItems,
  currencyCode,
  convertToLocale,
  className = "",
}: BundleSavingsSummaryProps) => {
  const { bundleGroups, totalBundleSavings } = calculateBundleSavings(cartItems)

  if (totalBundleSavings <= 0) {
    return null
  }

  return (
    <div
      className={`bg-green-50 border border-green-200 rounded-lg p-4 ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎉</span>
          <span className="font-semibold text-green-800">Bundle Savings</span>
        </div>
        <Badge className="bg-green-100 text-green-800">
          {convertToLocale({
            amount: totalBundleSavings * 100,
            currency_code: currencyCode,
          })}{" "}
          saved
        </Badge>
      </div>

      {/* Detailed breakdown by bundle */}
      <div className="space-y-2">
        {Object.values(bundleGroups).map((bundle: any) => (
          <div
            key={bundle.bundleId}
            className="flex justify-between items-center text-sm"
          >
            <div className="flex flex-col">
              <span className="text-green-700 font-medium">
                {bundle.bundleTitle}
              </span>
              <span className="text-xs text-green-600">
                {bundle.itemCount} {bundle.itemCount === 1 ? "item" : "items"}
                {bundle.discountType === "fixed"
                  ? " • Fixed discount"
                  : " • Percentage discount"}
              </span>
            </div>
            <div className="text-right">
              <div className="text-green-700 font-medium">
                {convertToLocale({
                  amount: bundle.totalSavings * 100,
                  currency_code: currencyCode,
                })}
              </div>
              <div className="text-xs text-green-600">
                {bundle.discountType === "fixed"
                  ? `${formatCurrency(
                      (bundle.totalFixedDiscount || 0) / 100
                    )} off bundle`
                  : "Bundle discount"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BundleDiscountDisplay
