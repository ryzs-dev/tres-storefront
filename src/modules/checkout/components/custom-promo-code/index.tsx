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
import { Check } from "lucide-react"

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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-1 h-5 bg-gray-900 rounded-full"></div>
        <h3 className="text-base font-medium text-gray-900">Promo Code</h3>
      </div>

      {appliedCode ? (
        /* Applied State */
        <div className="space-y-3 animate-in fade-in duration-200">
          {/* Applied Code Card */}
          <div className="group relative bg-gray-50 hover:bg-gray-100 transition-colors duration-200 rounded-lg p-4 border border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <code className="text-sm font-mono font-semibold text-gray-900 tracking-wide">
                      {appliedCode}
                    </code>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                    <Check size={10} />
                    Applied
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {discountType === "percentage"
                    ? `${discountValue}% discount`
                    : `${convertToLocale({
                        amount: discountValue * 100,
                        currency_code: cart.currency_code || "MYR",
                      })} off`}
                </p>
              </div>
              <button
                onClick={handleRemoveCode}
                disabled={isPending}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md disabled:opacity-50"
              >
                <Trash size={14} />
              </button>
            </div>
          </div>

          {/* Discount Amount */}
          {discountAmount > 0 && (
            <div className="px-4 py-3 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-700">Promo savings</span>
                <span className="text-sm font-semibold text-green-700">
                  −
                  {convertToLocale({
                    amount: discountAmount,
                    currency_code: cart.currency_code || "MYR",
                  })}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Stacks with other discounts
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Input State */
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onKeyDown={handleKeyPress}
                disabled={isPending}
                className="w-full px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
              />
              {isPending && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <button
              onClick={handleApplyCode}
              disabled={isPending || !code.trim()}
              className="px-4 py-2.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors duration-200"
            >
              Apply
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              <div className="w-1 h-1 bg-red-500 rounded-full"></div>
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
export default CustomPromoCode
