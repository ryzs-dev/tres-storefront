// 5. Updated Payment Wrapper - src/modules/checkout/components/payment-wrapper/index.tsx
"use client"

import { loadStripe } from "@stripe/stripe-js"
import React from "react"
import StripeWrapper from "./stripe-wrapper"
import { HttpTypes } from "@medusajs/types"
import { isCustom, isStripe, isRazorpay } from "@lib/constants"

type PaymentWrapperProps = {
  cart: HttpTypes.StoreCart
  children: React.ReactNode
}

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_KEY
const stripePromise = stripeKey ? loadStripe(stripeKey) : null

const PaymentWrapper: React.FC<PaymentWrapperProps> = ({ cart, children }) => {
  const paymentSession = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  // For Stripe-based payments (both native and custom)
  if (
    (isCustom(paymentSession?.provider_id) ||
      isStripe(paymentSession?.provider_id)) &&
    paymentSession &&
    stripePromise
  ) {
    return (
      <StripeWrapper
        paymentSession={paymentSession}
        stripeKey={stripeKey}
        stripePromise={stripePromise}
      >
        {children}
      </StripeWrapper>
    )
  }

  // For Razorpay payments - no wrapper needed (Razorpay handles its own modal/SDK)
  if (isRazorpay(paymentSession?.provider_id)) {
    return (
      <div className="razorpay-payment-wrapper">
        {/* Razorpay doesn't need a wrapper like Stripe Elements */}
        {/* The payment modal is handled by Razorpay's own checkout.js */}
        {children}
      </div>
    )
  }

  // For other payment methods (manual, PayPal, etc.)
  return <div className="default-payment-wrapper">{children}</div>
}

export default PaymentWrapper
