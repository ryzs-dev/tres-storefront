// src/modules/checkout/components/custom-promo-code/index.tsx
"use client"

import { useState, useTransition, useEffect } from "react"
import { Button, Input, Text } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import Trash from "@modules/common/icons/trash"
import { convertToLocale } from "@lib/util/money"
import { calculateCustomDiscount } from "@lib/util/client-promo-utils"
import {
  applyCustomPromoCode,
  removeCustomPromoCode,
} from "@lib/data/custom-promo"

type CustomPromoCodeProps = {
  cart: HttpTypes.StoreCart & {
    metadata?: Record<string, any>
  }
}

const CustomPromoCode = ({ cart }: CustomPromoCodeProps) => {
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  // Check if custom promo is already applied
  const appliedCode = cart.metadata?.custom_promo_code
  const discountType = cart.metadata?.custom_discount_type as
    | "percentage"
    | "fixed"
  const discountValue = Number(cart.metadata?.custom_discount_value || 0)

  const customer_email = String(cart.email || "")

  console.log(customer_email)

  // Calculate discount amount with validation
  // The promo should apply to the current cart total (after other discounts)
  let discountAmount = 0
  if (appliedCode && cart.total && discountType && discountValue > 0) {
    // Use cart.total which is the final amount after all other discounts
    discountAmount = calculateCustomDiscount(
      cart.total,
      discountType,
      discountValue
    )
  }

  // Debug logging only in development and only when values change
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("🛒 Full cart object:", cart)
    }
  }, [cart, discountType, discountValue, discountAmount])

  const handleApplyCode = () => {
    if (!code.trim()) {
      setError("Please enter a promo code")
      return
    }

    setError("")

    startTransition(async () => {
      try {
        await applyCustomPromoCode(code, customer_email)
        setCode("")
      } catch (err: any) {
        setError("Please Sign In to apply promo code")
      }
    })
  }

  const handleRemoveCode = () => {
    setError("")

    startTransition(async () => {
      try {
        await removeCustomPromoCode()
      } catch (err: any) {
        setError(err.message || "Failed to remove promo code")
      }
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isPending && code.trim()) {
      e.preventDefault()
      handleApplyCode()
    }
  }

  return (
    <div className="bg-white p-4 border border-gray-200 rounded-lg">
      <Text className="text-lg font-semibold mb-3">Promo Code</Text>

      {appliedCode ? (
        // Show applied promo code
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Text className="font-mono font-bold text-green-800">
                  {appliedCode}
                </Text>
                <span className="text-green-600 text-sm">✓ Applied</span>
              </div>
              <Text className="text-sm text-green-700">
                {discountType === "percentage"
                  ? `${discountValue}% off`
                  : `${convertToLocale({
                      amount: discountValue * 100,
                      currency_code: cart.currency_code || "MYR",
                    })} off`}
              </Text>
            </div>
            <Button
              color="ghost"
              size="small"
              onClick={handleRemoveCode}
              disabled={isPending}
              className="text-red-600 hover:text-red-800"
            >
              <Trash size={16} />
            </Button>
          </div>

          {discountAmount > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-green-600">
                <Text>Additional Promo Discount:</Text>
                <Text className="font-semibold">
                  -
                  {convertToLocale({
                    amount: discountAmount,
                    currency_code: cart.currency_code || "MYR",
                  })}
                </Text>
              </div>
              <Text className="text-xs text-green-700">
                Applied to your current cart total (stacks with bundle
                discounts)
              </Text>
            </div>
          )}
        </div>
      ) : (
        // Show promo code input
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Enter promo code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyDown={handleKeyPress}
              className="flex-1"
              disabled={isPending}
            />
            <Button
              onClick={handleApplyCode}
              disabled={isPending || !code.trim()}
              className="whitespace-nowrap"
            >
              {isPending ? "Applying..." : "Apply"}
            </Button>
          </div>

          {error ? (
            <Text className="text-xs text-red-500">{error}</Text>
          ) : (
            <Text className="text-xs text-gray-500">
              Have a first-time buyer code? Enter it above for an additional 10%
              off your total!
            </Text>
          )}
        </div>
      )}
    </div>
  )
}
export default CustomPromoCode
