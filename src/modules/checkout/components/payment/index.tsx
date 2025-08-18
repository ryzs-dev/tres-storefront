"use client"

import { RadioGroup } from "@headlessui/react"
import { isStripe as isStripeFunc, paymentInfoMap } from "@lib/constants"
import { initiatePaymentSession } from "@lib/data/cart"
import { CheckCircleSolid, CreditCard, Loader } from "@medusajs/icons"
import { Button, Container, Heading, Text, clx } from "@medusajs/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
import PaymentContainer, {
  StripeCardContainer,
} from "@modules/checkout/components/payment-container"
import Divider from "@modules/common/components/divider"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

// Helper function to refresh payment session
const refreshPaymentSession = async (cartId: string) => {
  try {
    console.log("🔄 Refreshing payment session for updated cart total...")

    const response = await fetch(`/store/carts/${cartId}/refresh-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (response.ok) {
      const data = await response.json()
      console.log("✅ Payment session refreshed successfully")
      return data.cart
    } else {
      console.error(
        "❌ Failed to refresh payment session:",
        await response.text()
      )
    }
  } catch (error) {
    console.error("❌ Error refreshing payment session:", error)
  }
  return null
}

const Payment = ({
  cart,
  availablePaymentMethods,
}: {
  cart: any
  availablePaymentMethods: any[]
}) => {
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === "pending"
  )

  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshingPayment, setIsRefreshingPayment] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardBrand, setCardBrand] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "payment"

  const isStripe = isStripeFunc(selectedPaymentMethod)

  // Check if cart has bundle discounts
  const hasBundleDiscounts = cart.items?.some(
    (item: any) =>
      item.metadata?.is_from_bundle === true &&
      item.metadata?.discount_applied === true
  )

  // Check if payment session amount matches cart total
  const currentPaymentTotal = activeSession?.amount || 0
  const cartTotal = cart.total || 0
  const paymentMismatch = Math.abs(currentPaymentTotal - cartTotal) > 1 // Allow 1 cent variance for rounding

  // Debug logging
  useEffect(() => {
    if (hasBundleDiscounts) {
      console.log("💰 Payment Debug Info:", {
        cartTotal,
        currentPaymentTotal,
        paymentMismatch,
        hasBundleDiscounts,
        activeSessionId: activeSession?.id,
      })
    }
  }, [cartTotal, currentPaymentTotal, hasBundleDiscounts, activeSession?.id])

  const setPaymentMethod = async (method: string) => {
    setError(null)
    setSelectedPaymentMethod(method)

    if (isStripeFunc(method)) {
      try {
        setIsLoading(true)

        // Always use the current cart total (with discounts applied)
        await initiatePaymentSession(cart, {
          provider_id: method,
          data: {
            amount: Math.round(cartTotal * 100), // Use current cart total with discounts
            currency: cart.currency_code,
          },
        })

        console.log(
          `✅ Payment session initiated with amount: ${cartTotal} (${Math.round(
            cartTotal * 100
          )} cents)`
        )
      } catch (err: any) {
        setError(err.message)
        console.error("❌ Failed to initiate payment session:", err)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const paymentReady =
    (activeSession && cart?.shipping_methods.length !== 0) || paidByGiftcard

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "payment"), {
      scroll: false,
    })
  }

  // Auto-refresh payment session if amount doesn't match
  useEffect(() => {
    if (
      isOpen &&
      paymentMismatch &&
      hasBundleDiscounts &&
      !isRefreshingPayment &&
      activeSession
    ) {
      console.log(
        `🔄 Auto-refreshing payment session: Cart total (${cartTotal}) vs Payment total (${currentPaymentTotal})`
      )

      setIsRefreshingPayment(true)
      refreshPaymentSession(cart.id)
        .then((refreshedCart) => {
          if (refreshedCart) {
            console.log("✅ Payment session auto-refreshed")
            // Optionally refresh the page to get updated cart state
            setTimeout(() => {
              window.location.reload()
            }, 1000)
          }
        })
        .catch((error) => {
          console.error("❌ Failed to auto-refresh payment session:", error)
        })
        .finally(() => {
          setIsRefreshingPayment(false)
        })
    }
  }, [
    isOpen,
    paymentMismatch,
    hasBundleDiscounts,
    cartTotal,
    currentPaymentTotal,
    cart.id,
    activeSession?.id,
  ])

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const shouldInputCard =
        isStripeFunc(selectedPaymentMethod) && !activeSession

      const checkActiveSession =
        activeSession?.provider_id === selectedPaymentMethod

      // If payment session doesn't match cart total, refresh it first
      if (checkActiveSession && paymentMismatch) {
        console.log(
          "🔄 Refreshing payment session before proceeding due to amount mismatch"
        )
        await refreshPaymentSession(cart.id)

        // Give it a moment to process, then reload to get updated cart
        setTimeout(() => {
          window.location.reload()
        }, 1000)
        return
      }

      if (!checkActiveSession) {
        console.log(
          `💳 Initiating payment session with amount: ${cartTotal} (${Math.round(
            cartTotal * 100
          )} cents)`
        )

        await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
          data: {
            amount: Math.round(cartTotal * 100), // Use current cart total with discounts
            currency: cart.currency_code,
          },
        })
      }

      if (!shouldInputCard) {
        return router.push(
          pathname + "?" + createQueryString("step", "review"),
          {
            scroll: false,
          }
        )
      }
    } catch (err: any) {
      setError(err.message)
      console.error("❌ Payment submission error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  return (
    <div className="bg-white">
      {/* Payment Amount Mismatch Warning */}
      {paymentMismatch && hasBundleDiscounts && isOpen && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2">
            {isRefreshingPayment ? (
              <>
                <Loader className="animate-spin h-4 w-4" />
                <span className="text-sm text-yellow-800">
                  Updating payment amount for bundle discounts...
                </span>
              </>
            ) : (
              <span className="text-sm text-yellow-800">
                💰 Payment amount will be updated to reflect bundle discounts (
                {formatCurrency(cartTotal)} instead of{" "}
                {formatCurrency(currentPaymentTotal / 100)})
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none":
                !isOpen && !paymentReady,
            }
          )}
        >
          Payment
          {!isOpen && paymentReady && <CheckCircleSolid />}
        </Heading>
        {!isOpen && paymentReady && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              data-testid="edit-payment-button"
            >
              Edit
            </button>
          </Text>
        )}
      </div>
      <div>
        <div className={isOpen ? "block" : "hidden"}>
          {!paidByGiftcard && availablePaymentMethods?.length && (
            <>
              <RadioGroup
                value={selectedPaymentMethod}
                onChange={(value: string) => setPaymentMethod(value)}
              >
                {availablePaymentMethods.map((paymentMethod) => (
                  <div key={paymentMethod.id}>
                    {isStripeFunc(paymentMethod.id) ? (
                      <StripeCardContainer
                        paymentProviderId={paymentMethod.id}
                        selectedPaymentOptionId={selectedPaymentMethod}
                        paymentInfoMap={paymentInfoMap}
                        setCardBrand={setCardBrand}
                        setError={setError}
                        setCardComplete={setCardComplete}
                      />
                    ) : (
                      <PaymentContainer
                        paymentInfoMap={paymentInfoMap}
                        paymentProviderId={paymentMethod.id}
                        selectedPaymentOptionId={selectedPaymentMethod}
                      />
                    )}
                  </div>
                ))}
              </RadioGroup>
            </>
          )}

          {paidByGiftcard && (
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                Payment method
              </Text>
              <Text
                className="txt-medium text-ui-fg-subtle"
                data-testid="payment-method-summary"
              >
                Gift card
              </Text>
            </div>
          )}

          <ErrorMessage
            error={error}
            data-testid="payment-method-error-message"
          />

          <Button
            size="large"
            className="mt-6"
            onClick={handleSubmit}
            isLoading={isLoading || isRefreshingPayment}
            disabled={
              (isStripe && !cardComplete) ||
              (!selectedPaymentMethod && !paidByGiftcard) ||
              isRefreshingPayment
            }
            data-testid="submit-payment-button"
          >
            {isRefreshingPayment
              ? "Updating payment amount..."
              : !activeSession && isStripeFunc(selectedPaymentMethod)
              ? " Enter card details"
              : "Continue to review"}
          </Button>
        </div>

        <div className={isOpen ? "hidden" : "block"}>
          {cart && paymentReady && activeSession ? (
            <div className="flex items-start gap-x-1 w-full">
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Payment method
                </Text>
                <Text
                  className="txt-medium text-ui-fg-subtle"
                  data-testid="payment-method-summary"
                >
                  {paymentInfoMap[activeSession?.provider_id]?.title ||
                    activeSession?.provider_id}
                </Text>
              </div>
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Payment details
                </Text>
                <div
                  className="flex gap-2 txt-medium text-ui-fg-subtle items-center"
                  data-testid="payment-details-summary"
                >
                  <Container className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
                    {paymentInfoMap[selectedPaymentMethod]?.icon || (
                      <CreditCard />
                    )}
                  </Container>
                  <Text>
                    {isStripeFunc(selectedPaymentMethod) && cardBrand
                      ? cardBrand
                      : "Another step will appear"}
                  </Text>
                </div>
              </div>
            </div>
          ) : paidByGiftcard ? (
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                Payment method
              </Text>
              <Text
                className="txt-medium text-ui-fg-subtle"
                data-testid="payment-method-summary"
              >
                Gift card
              </Text>
            </div>
          ) : null}
        </div>
      </div>
      <Divider className="mt-8" />
    </div>
  )
}

// Helper function for currency formatting
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
  }).format(amount)
}

export default Payment
