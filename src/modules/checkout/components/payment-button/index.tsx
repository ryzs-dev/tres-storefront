// 2. Updated Payment Button - src/modules/checkout/components/payment-button/index.tsx
"use client"

import { isManual, isStripe, isCustom, isRazorpay } from "@lib/constants"
import { placeOrder } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import React, { useEffect, useState } from "react"
import ErrorMessage from "../error-message"

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
      return (
        <RazorpayPaymentButton
          cart={cart}
          data-testid={dataTestId}
          notReady={false}
          onPaymentCompleted={function (): Promise<void> {
            throw new Error("Function not implemented.")
          }}
        />
      )
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
  notReady,
  "data-testid": dataTestId,
  onPaymentCompleted,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
  onPaymentCompleted: () => Promise<void>
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const paymentSession = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending" && s.provider_id === "razorpay"
  )

  const handlePayment = async () => {
    if (!paymentSession) {
      setErrorMessage("No pending Razorpay session")
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
        notes: {
          cart_id: cart.id,
          session_id: paymentSession.id,
          customer_email: cart.email || "",
        },
        handler: () => {
          // Payment was initiated; we now poll the Medusa backend
          const pollOrderStatus = async () => {
            try {
              const maxRetries = 10
              let retries = 0
              while (retries < maxRetries) {
                const res = await fetch(`/store/orders/${cart.id}`)
                const order = await res.json()
                if (order.payment_status === "captured") {
                  await onPaymentCompleted()
                  return
                } else if (order.payment_status === "failed") {
                  throw new Error("Payment failed")
                }
                retries++
                await new Promise((r) => setTimeout(r, 1000))
              }
              throw new Error("Payment not confirmed after 10 seconds")
            } catch (err: any) {
              setErrorMessage(err.message)
              setSubmitting(false)
            }
          }

          pollOrderStatus()
        },
        prefill: {
          name: `${cart.billing_address?.first_name || ""} ${
            cart.billing_address?.last_name || ""
          }`.trim(),
          email: cart.email || "",
          contact: cart.billing_address?.phone || "",
        },
        theme: { color: "#3B82F6" },
        modal: {
          ondismiss: () => setSubmitting(false),
        },
      }

      const razorpay = new window.Razorpay(options)

      razorpay.on("payment.failed", (response: any) => {
        setErrorMessage(`Payment failed: ${response.error.description}`)
        setSubmitting(false)
      })

      razorpay.open()
    } catch (err: any) {
      console.error("Error initiating Razorpay payment:", err)
      setErrorMessage(err.message)
      setSubmitting(false)
    }
  }

  return (
    <>
      <Button
        disabled={!paymentSession || notReady}
        onClick={handlePayment}
        size="large"
        isLoading={submitting}
        data-testid={dataTestId}
      >
        Place order
      </Button>
      {errorMessage && (
        <ErrorMessage
          error={errorMessage}
          data-testid="razorpay-payment-error"
        />
      )}
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
