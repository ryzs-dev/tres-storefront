// 2. Updated Payment Button - src/modules/checkout/components/payment-button/index.tsx
"use client"

import { isManual, isStripe, isCustom, isRazorpay } from "@lib/constants"
import { placeOrder } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import React, { useEffect, useState } from "react"
import ErrorMessage from "../error-message"
import { sdk } from "@lib/config"

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart
  "data-testid": string
}

// Declare Razorpay on window object
declare global {
  interface Window {
    Razorpay: any
  }
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  cart,
  "data-testid": dataTestId,
}) => {
  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) < 1

  const paymentSession = cart.payment_collection?.payment_sessions?.[0]

  // Route to appropriate payment button based on provider
  switch (true) {
    case isRazorpay(paymentSession?.provider_id):
      return <RazorpayPaymentButton cart={cart} data-testid={dataTestId} />
    case isCustom(paymentSession?.provider_id):
      return <CustomStripePaymentButton cart={cart} data-testid={dataTestId} />
    case isStripe(paymentSession?.provider_id):
      return (
        <StripePaymentButton
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}
        />
      )
    case isManual(paymentSession?.provider_id):
      return (
        <ManualTestPaymentButton notReady={notReady} data-testid={dataTestId} />
      )
    default:
      return <Button disabled>Select a payment method</Button>
  }
}

// Razorpay Payment Button Component
const RazorpayPaymentButton = ({
  cart,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)

  const paymentSession = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  // Load Razorpay script dynamically
  useEffect(() => {
    if (window.Razorpay) {
      setRazorpayLoaded(true)
      return
    }

    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    script.onload = () => {
      setRazorpayLoaded(true)
      console.log("✅ Razorpay script loaded successfully")
    }
    script.onerror = () => {
      setErrorMessage("Failed to load Razorpay. Please refresh and try again.")
      console.error("❌ Failed to load Razorpay script")
    }
    document.body.appendChild(script)

    // Cleanup function
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  const onPaymentCompleted = async () => {
    try {
      await placeOrder()
      console.log("✅ Order placed successfully")
      // Redirect will be handled by placeOrder function
    } catch (err: any) {
      setErrorMessage(err.message)
      setSubmitting(false)
      console.error("❌ Failed to place order:", err)
    }
  }

  const handlePayment = async () => {
    if (!razorpayLoaded || !window.Razorpay || !paymentSession) {
      setErrorMessage("Razorpay is not ready. Please try again.")
      return
    }

    setSubmitting(true)
    setErrorMessage(null)

    try {
      const options = {
        key: paymentSession.data.key_id,
        amount: paymentSession.data.amount,
        currency: paymentSession.data.currency,
        name: "Tres Malaysia",
        description: "Payment for your order",
        order_id: paymentSession.data.order_id,
        handler: async (response: {
          razorpay_payment_id: any
          razorpay_order_id: any
          razorpay_signature: any
        }) => {
          try {
            // Send verification data to your custom backend route
            const result = await sdk.client.fetch("/store/payments/authorize", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-publishable-api-key":
                  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
              },
              body: JSON.stringify({
                cart_id: cart.id,
                payment_session_id: paymentSession.id,
                payment_id: response.razorpay_payment_id,
                order_id: response.razorpay_order_id,
                signature: response.razorpay_signature,
              }),
            })

            if (result.success) {
              await onPaymentCompleted()
            } else {
              throw new Error(result.message || "Payment confirmation failed")
            }
          } catch (error) {
            setErrorMessage(error.message)
            setSubmitting(false)
          }
        },
      }

      const razorpay = new window.Razorpay(options)

      razorpay.on("payment.failed", (response) => {
        setErrorMessage(`Payment failed: ${response.error.description}`)
        setSubmitting(false)
      })

      razorpay.open()
    } catch (error) {
      setErrorMessage(error.message)
      setSubmitting(false)
    }
  }

  const disabled = !razorpayLoaded || !paymentSession || submitting

  return (
    <>
      <Button
        disabled={disabled}
        onClick={handlePayment}
        size="large"
        isLoading={submitting}
        data-testid={dataTestId}
        className="w-full"
      >
        {submitting ? "Processing Payment..." : "Pay with Razorpay Malaysia"}
      </Button>

      {/* Payment method hints */}
      {!submitting && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          Supports FPX, Credit Cards, Boost, GrabPay, Touch 'n Go & more
        </div>
      )}

      <ErrorMessage
        error={errorMessage}
        data-testid="razorpay-payment-error-message"
      />
    </>
  )
}

// Keep existing Stripe, Manual, and Custom payment buttons
const StripePaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const stripe = useStripe()
  const elements = useElements()
  const card = elements?.getElement("card")

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  const disabled = !stripe || !elements

  const handlePayment = async () => {
    setSubmitting(true)

    if (!stripe || !elements || !card || !cart) {
      setSubmitting(false)
      return
    }

    await stripe
      .confirmCardPayment(session?.data.client_secret as string, {
        payment_method: {
          card: card,
          billing_details: {
            name: `${cart.billing_address?.first_name} ${cart.billing_address?.last_name}`,
            address: {
              city: cart.billing_address?.city ?? undefined,
              country: cart.billing_address?.country_code ?? undefined,
              line1: cart.billing_address?.address_1 ?? undefined,
              line2: cart.billing_address?.address_2 ?? undefined,
              postal_code: cart.billing_address?.postal_code ?? undefined,
              state: cart.billing_address?.province ?? undefined,
            },
            email: cart.email,
            phone: cart.billing_address?.phone ?? undefined,
          },
        },
      })
      .then(({ error, paymentIntent }) => {
        if (error) {
          const pi = error.payment_intent
          if (
            (pi && pi.status === "requires_capture") ||
            (pi && pi.status === "succeeded")
          ) {
            onPaymentCompleted()
          }
          setErrorMessage(error.message || null)
          return
        }

        if (
          (paymentIntent && paymentIntent.status === "requires_capture") ||
          paymentIntent.status === "succeeded"
        ) {
          return onPaymentCompleted()
        }
      })
  }

  return (
    <>
      <Button
        disabled={disabled || notReady}
        onClick={handlePayment}
        size="large"
        isLoading={submitting}
        data-testid={dataTestId}
      >
        Place order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="stripe-payment-error-message"
      />
    </>
  )
}

const ManualTestPaymentButton = ({
  notReady,
  "data-testid": dataTestId,
}: {
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const handlePayment = () => {
    setSubmitting(true)
    onPaymentCompleted()
  }

  return (
    <>
      <Button
        disabled={notReady}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
        data-testid={dataTestId}
      >
        Place order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="manual-payment-error-message"
      />
    </>
  )
}

const CustomStripePaymentButton = ({
  cart,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const stripe = useStripe()
  const elements = useElements()
  const clientSecret = cart?.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )?.data.client_secret

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const handlePayment = async () => {
    setSubmitting(true)

    if (!stripe || !elements || !clientSecret) {
      setSubmitting(false)
      return
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order/confirmed`,
      },
      redirect: "if_required",
    })

    if (error) {
      setErrorMessage(error.message || null)
      setSubmitting(false)
    } else {
      await onPaymentCompleted()
    }
  }

  return (
    <>
      <Button
        disabled={!stripe || !elements}
        onClick={handlePayment}
        size="large"
        isLoading={submitting}
        data-testid={dataTestId}
      >
        Place order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="custom-stripe-payment-error-message"
      />
    </>
  )
}

export default PaymentButton
