"use client"

import { Button, Heading, Badge } from "@medusajs/ui"
import { convertToLocale } from "@lib/util/money"

import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart }: SummaryProps) => {
  const step = getCheckoutStep(cart)

  // Calculate bundle savings - ADDED
  const bundleItems = cart?.items?.filter(item => 
    item.metadata?.is_from_bundle === true
  ) || []

  const bundleGroups = bundleItems.reduce((groups, item) => {
    const bundleId = item.metadata?.bundle_id as string
    const bundleTitle = item.metadata?.bundle_title as string
    
    if (!groups[bundleId]) {
      groups[bundleId] = {
        bundleId,
        bundleTitle: bundleTitle || 'Bundle',
        items: [],
        totalSavings: 0,
        discountPercentage: 0,
      }
    }
    
    groups[bundleId].items.push(item)
    
    const originalPriceCents = item.metadata?.original_price_cents as number
    const discountedPriceCents = item.metadata?.discounted_price_cents as number
    const discountPercentage = item.metadata?.bundle_discount_percentage as number
    
    if (originalPriceCents && discountedPriceCents) {
      const itemSavings = ((originalPriceCents - discountedPriceCents) / 100) * item.quantity
      groups[bundleId].totalSavings += itemSavings
      groups[bundleId].discountPercentage = discountPercentage || 0
    }
    
    return groups
  }, {} as Record<string, {
    bundleId: string
    bundleTitle: string
    items: any[]
    totalSavings: number
    discountPercentage: number
  }>)

  const totalBundleSavings = Object.values(bundleGroups).reduce(
    (total, group) => total + group.totalSavings, 0
  )

  return (
    <div className="flex flex-col gap-y-4">
      <Heading level="h2" className="text-[2rem] leading-[2.75rem]">
        Summary
      </Heading>
      
      {/* Bundle Savings Summary - ADDED */}
      {totalBundleSavings > 0 && (
        <>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎉</span>
                <span className="font-semibold text-green-800">Bundle Savings</span>
              </div>
              <Badge className="bg-green-100 text-green-800">
                {convertToLocale({
                  amount: totalBundleSavings * 100,
                  currency_code: cart.currency_code,
                })} saved
              </Badge>
            </div>
            
            <div className="space-y-2">
              {Object.values(bundleGroups).map((group) => (
                <div key={group.bundleId} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-xs">📦</span>
                    <span className="text-green-700">
                      {group.bundleTitle} ({group.items.length} items)
                    </span>
                    <Badge className="text-xs">
                      {group.discountPercentage}% off
                    </Badge>
                  </div>
                  <span className="font-medium text-green-700">
                    {convertToLocale({
                      amount: group.totalSavings * 100,
                      currency_code: cart.currency_code,
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <Divider />
        </>
      )}

      <DiscountCode cart={cart} />
      <Divider />
      <CartTotals totals={cart} />
      <LocalizedClientLink
        href={"/checkout?step=" + step}
        data-testid="checkout-button"
      >
        <Button className="w-full h-10">Go to checkout</Button>
      </LocalizedClientLink>
    </div>
  )
}

export default Summary