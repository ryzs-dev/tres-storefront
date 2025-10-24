"use client"

import { useCallback, useEffect, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { sdk } from "@lib/config"
import { isStripe as isStripeFunc, paymentInfoMap } from "@lib/constants"
import {
  initiatePaymentSession,
  placeOrder,
  setShippingMethod,
} from "@lib/data/cart"
import { calculatePriceForShippingOption } from "@lib/data/fulfillment"
import { convertToLocale } from "@lib/util/money"
import PaymentContainer, {
  StripeCardContainer,
} from "@modules/checkout/components/payment-container"
import { RadioGroup, Radio } from "@headlessui/react"
import { Loader } from "@medusajs/icons"
import Review from "@modules/checkout/components/review"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import formatAddress from "@lib/util/format-address"
import { clx, Heading, toast } from "@medusajs/ui"

const PICKUP_OPTION_ON = "__PICKUP_ON"
const PICKUP_OPTION_OFF = "__PICKUP_OFF"

type Props = {
  cart: HttpTypes.StoreCart
  customer: HttpTypes.StoreCustomer | null
  availablePaymentMethods: any[]
  availableShippingMethods: HttpTypes.StoreCartShippingOption[]
}

export default function OnePageCheckout({
  cart,
  customer,
  availablePaymentMethods,
  availableShippingMethods,
}: Props) {
  const [email, setEmail] = useState(customer?.email ?? cart.email ?? "")
  const [shipping, setShipping] = useState({
    first_name: cart.shipping_address?.first_name ?? "",
    last_name: cart.shipping_address?.last_name ?? "",
    address_1: cart.shipping_address?.address_1 ?? "",
    address_2: cart.shipping_address?.address_2 ?? "",
    city: cart.shipping_address?.city ?? "",
    postal_code: cart.shipping_address?.postal_code ?? "",
    country_code: cart.shipping_address?.country_code ?? "",
    phone: cart.shipping_address?.phone ?? "",
  })
  const [billing, setBilling] = useState(shipping)
  const [sameAsShipping, setSameAsShipping] = useState(true)
  const [paymentReady, setPaymentReady] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPrices, setIsLoadingPrices] = useState(true)
  const [showPickupOptions, setShowPickupOptions] =
    useState<string>(PICKUP_OPTION_OFF)
  const [calculatedPricesMap, setCalculatedPricesMap] = useState<
    Record<string, number>
  >({})
  const [error, setError] = useState<string | null>(null)
  const [shippingMethodId, setShippingMethodId] = useState<string | null>(
    cart.shipping_methods?.at(-1)?.shipping_option_id || null
  )
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  if (!(window as any).Razorpay) {
    new Promise<void>((resolve, reject) => {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.async = true
      script.onload = () => resolve()
      script.onerror = () => reject(new Error("Failed to load Razorpay SDK"))
      document.body.appendChild(script)
    })
  }

  const _shippingMethods = availableShippingMethods?.filter(
    (sm) => sm.service_zone?.fulfillment_set?.type !== "pickup"
  )
  const _pickupMethods = availableShippingMethods?.filter(
    (sm) => sm.service_zone?.fulfillment_set?.type === "pickup"
  )
  const hasPickupOptions = !!_pickupMethods?.length

  useEffect(() => {
    setIsLoadingPrices(true)
    if (_shippingMethods?.length) {
      const promises = _shippingMethods
        .filter((sm) => sm.price_type === "calculated")
        .map((sm) => calculatePriceForShippingOption(sm.id, cart.id))

      if (promises.length) {
        Promise.allSettled(promises).then((res) => {
          const pricesMap: Record<string, number> = {}
          res
            .filter((r) => r.status === "fulfilled")
            .forEach(
              (p: any) => (pricesMap[p.value?.id || ""] = p.value?.amount!)
            )
          setCalculatedPricesMap(pricesMap)
          setIsLoadingPrices(false)
        })
      }
    }
    if (_pickupMethods?.find((m) => m.id === shippingMethodId)) {
      setShowPickupOptions(PICKUP_OPTION_ON)
    }
  }, [availableShippingMethods])

  const handleSetShippingMethod = async (
    id: string,
    variant: "shipping" | "pickup"
  ) => {
    setError(null)
    if (variant === "pickup") {
      setShowPickupOptions(PICKUP_OPTION_ON)
    } else {
      setShowPickupOptions(PICKUP_OPTION_OFF)
    }

    let currentId: string | null = null
    setIsLoading(true)
    setShippingMethodId((prev) => {
      currentId = prev
      return id
    })

    await setShippingMethod({ cartId: cart.id, shippingMethodId: id })
      .catch((err) => {
        setShippingMethodId(currentId)
        setError(err.message)
      })
      .finally(() => setIsLoading(false))
  }

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("")
  const [cardBrand, setCardBrand] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)

  async function handleSubmit() {
    try {
      setIsLoading(true)
      setError(null)

      await sdk.store.cart.update(cart.id, {
        email,
        shipping_address: shipping,
        billing_address: sameAsShipping ? shipping : billing,
      })

      console.log("✅ Cart info updated.")

      if (!shippingMethodId) throw new Error("Please select a shipping method.")
      await setShippingMethod({ cartId: cart.id, shippingMethodId })

      console.log("✅ Shipping method set.")

      console.log(Math.round(cart.total))

      if (selectedPaymentMethod === "pp_razorpay_razorpay") {
        const { payment_collection } = await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
          data: {
            amount: Math.round(cart.total),
            currency: cart.currency_code,
            metadata: { cart_id: cart.id },
          },
        })

        console.log("✅ Razorpay payment session initiated.")
        console.log("payment_collection", payment_collection)

        const session = payment_collection.payment_sessions?.[0]
        if (!session) {
          throw new Error("Failed to initiate Razorpay payment session.")
        }

        const payment_collection_id = payment_collection.id
        const payment_collection_payment_session_id = session.id

        const razorpay = new (window as any).Razorpay({
          key: session.data.key_id,
          amount: session.data.amount,
          currency: session.data.currency,
          name: "Tres Store",
          description: "Order payment",
          order_id: session.data.order_id,
          handler: async function (response: any) {
            console.log("response", response)
            try {
              const verificationData = {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                payment_collection_id,
                payment_collection_payment_session_id,
              }

              console.log(
                "✅ Razorpay payment verification data:",
                verificationData
              )

              const verifyRes = await fetch(
                `/api/razorpay/update-payment-collection`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(verificationData),
                }
              )

              const data = await verifyRes.json()

              if (verifyRes.ok) {
                console.log("✅ Verification success:", data)
                toast.loading("Payment verified, placing order...", {
                  duration: 3000,
                })

                // Cart before placing order
                console.log("Cart before placing order:", cart)
                await placeOrder(cart.id)
              } else {
                toast.error("Payment verification failed.")
                console.error("❌ Verification failed:", data)
              }
              // // ✅ Step 2: Store verification data in Medusa (so authorizePayment can read it)
              // await sdk.store.paymentCollections.update(cart.id, {
              //   data: verificationData,
              // })
              // await placeOrder(cart.id)
            } catch (err) {
              console.error("❌ SDK error:", err)
              setError("Something went wrong while completing the order.")
            }
          },
          theme: { color: "#99B2DD" },
        })

        razorpay.open()
      } else {
        throw new Error("Unsupported payment method selected.")
      }
    } catch (err: any) {
      console.error("Checkout failed:", err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const renderInput = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    required = true,
    type = "text"
  ) => (
    <div className="relative">
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        className="
      peer
      w-full
      rounded-xl
      border border-gray-300
      px-4 pt-3 pb-3
      text-sm text-gray-900
      bg-white
      focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10
      outline-none
      transition-all
      duration-200
    "
      />
      <label
        className="
      absolute
      left-3
      top-3.5
      text-sm text-gray-500
      bg-white px-1
      transition-all
      duration-200
      pointer-events-none
      peer-focus:-top-0
      peer-focus:text-xs
      peer-focus:left-3
      peer-focus:text-gray-900
      peer-[:not(:placeholder-shown)]:-top-0
      peer-[:not(:placeholder-shown)]:text-xs
      peer-[:not(:placeholder-shown)]:text-gray-600
    "
      >
        {label}
      </label>
    </div>
  )

  return (
    <div className="w-full mx-auto px-4">
      <Heading
        level="h2"
        className="flex flex-row text-3xl-regular items-baseline pb-4"
      >
        Customer Details{" "}
      </Heading>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
        <div className="space-y-8">
          {/* Contact */}
          <section className="space-y-4">
            <h2 className="text-base font-medium text-gray-900">Contact</h2>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                className="
      peer
      w-full
      rounded-xl
      border border-gray-300
      px-4 pt-3 pb-3
      text-sm text-gray-900
      bg-white
      focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10
      outline-none
      transition-all
      duration-200
    "
              />
              <label
                className="
      absolute
      left-3
      top-3.5
      text-sm text-gray-500
      bg-white px-1
      transition-all
      duration-200
      pointer-events-none
      peer-focus:-top-0
      peer-focus:text-xs
      peer-focus:left-3
      peer-focus:text-gray-900
      peer-[:not(:placeholder-shown)]:-top-0
      peer-[:not(:placeholder-shown)]:text-xs
      peer-[:not(:placeholder-shown)]:text-gray-600
    "
              >
                Email
              </label>
            </div>
          </section>

          {/* Delivery */}
          <section className="space-y-4">
            <h2 className="text-base font-medium text-gray-900">Delivery</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {renderInput("First name", shipping.first_name, (v) =>
                  setShipping({ ...shipping, first_name: v })
                )}
                {renderInput("Last name", shipping.last_name, (v) =>
                  setShipping({ ...shipping, last_name: v })
                )}
              </div>
              {renderInput("Address", shipping.address_1, (v) =>
                setShipping({ ...shipping, address_1: v })
              )}
              <div className="grid grid-cols-3 gap-3">
                {renderInput("City", shipping.city, (v) =>
                  setShipping({ ...shipping, city: v })
                )}
                {renderInput("Postal code", shipping.postal_code, (v) =>
                  setShipping({ ...shipping, postal_code: v })
                )}
                {renderInput(
                  "Country",
                  shipping.country_code.toUpperCase(),
                  (v) => setShipping({ ...shipping, country_code: v })
                )}
              </div>
              {renderInput("Phone", shipping.phone, (v) =>
                setShipping({ ...shipping, phone: v })
              )}
            </div>
          </section>

          {/* Shipping Method */}
          <section className="space-y-4">
            <h2 className="text-base font-medium text-gray-900">
              Shipping method
            </h2>
            <div className="border border-gray-300 rounded-lg divide-y divide-gray-200">
              <RadioGroup
                value={shippingMethodId}
                onChange={(v) => v && handleSetShippingMethod(v, "shipping")}
              >
                {_shippingMethods?.map((option) => {
                  const isDisabled =
                    option.price_type === "calculated" &&
                    !isLoadingPrices &&
                    typeof calculatedPricesMap[option.id] !== "number"

                  return (
                    <Radio
                      key={option.id}
                      value={option.id}
                      disabled={isDisabled}
                      className="outline-none"
                    >
                      {({ checked }) => (
                        <div
                          className={clx(
                            "flex justify-between items-center px-4 py-3.5 cursor-pointer transition-colors",
                            {
                              "opacity-50 cursor-not-allowed": isDisabled,
                            }
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={clx(
                                "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                                {
                                  "border-gray-900": checked,
                                  "border-gray-300": !checked,
                                }
                              )}
                            >
                              {checked && (
                                <div className="w-2 h-2 rounded-full bg-gray-900"></div>
                              )}
                            </div>
                            <span className="text-sm text-gray-900">
                              {option.name}
                            </span>
                          </div>
                          <span className="text-sm text-gray-900">
                            {option.price_type === "flat" ? (
                              convertToLocale({
                                amount: option.amount!,
                                currency_code: cart?.currency_code,
                              })
                            ) : calculatedPricesMap[option.id] ? (
                              convertToLocale({
                                amount: calculatedPricesMap[option.id],
                                currency_code: cart?.currency_code,
                              })
                            ) : isLoadingPrices ? (
                              <Loader className="w-4 h-4" />
                            ) : (
                              "—"
                            )}
                          </span>
                        </div>
                      )}
                    </Radio>
                  )
                })}
              </RadioGroup>
            </div>

            {hasPickupOptions && (
              <div className="border border-gray-300 rounded-lg">
                <RadioGroup
                  value={showPickupOptions}
                  onChange={(value) => {
                    const id = _pickupMethods.find(
                      (option) => !option.insufficient_inventory
                    )?.id
                    if (id) handleSetShippingMethod(id, "pickup")
                  }}
                >
                  <Radio value={PICKUP_OPTION_ON} className="outline-none">
                    {({ checked }) => (
                      <div className="flex justify-between items-center px-4 py-3.5 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div
                            className={clx(
                              "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                              {
                                "border-gray-900": checked,
                                "border-gray-300": !checked,
                              }
                            )}
                          >
                            {checked && (
                              <div className="w-2 h-2 rounded-full bg-gray-900"></div>
                            )}
                          </div>
                          <span className="text-sm text-gray-900">Pick up</span>
                        </div>
                        <span className="text-sm text-gray-900">Free</span>
                      </div>
                    )}
                  </Radio>
                </RadioGroup>
              </div>
            )}

            {showPickupOptions === PICKUP_OPTION_ON && (
              <div className="border border-gray-300 rounded-lg divide-y divide-gray-200">
                <RadioGroup
                  value={shippingMethodId}
                  onChange={(v) => v && handleSetShippingMethod(v, "pickup")}
                >
                  {_pickupMethods?.map((option) => (
                    <Radio
                      key={option.id}
                      value={option.id}
                      disabled={option.insufficient_inventory}
                      className="outline-none"
                    >
                      {({ checked }) => (
                        <div
                          className={clx(
                            "flex justify-between items-start px-4 py-3.5 cursor-pointer",
                            {
                              "opacity-50 cursor-not-allowed":
                                option.insufficient_inventory,
                            }
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={clx(
                                "w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5",
                                {
                                  "border-gray-900": checked,
                                  "border-gray-300": !checked,
                                }
                              )}
                            >
                              {checked && (
                                <div className="w-2 h-2 rounded-full bg-gray-900"></div>
                              )}
                            </div>
                            <div>
                              <div className="text-sm text-gray-900">
                                {option.name}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {formatAddress(
                                  option.service_zone?.fulfillment_set?.location
                                    ?.address
                                )}
                              </div>
                            </div>
                          </div>
                          <span className="text-sm text-gray-900">
                            {convertToLocale({
                              amount: option.amount!,
                              currency_code: cart?.currency_code,
                            })}
                          </span>
                        </div>
                      )}
                    </Radio>
                  ))}
                </RadioGroup>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs text-red-700">{error}</p>
              </div>
            )}
          </section>

          {/* Payment */}
          <section className="space-y-4">
            <h2 className="text-base font-medium text-gray-900">Payment</h2>
            <p className="text-xs text-gray-500">
              All transactions are secure and encrypted.
            </p>

            <RadioGroup
              value={selectedPaymentMethod}
              onChange={(value: string) => setSelectedPaymentMethod(value)}
            >
              {availablePaymentMethods.map((method) => (
                <div key={method.id}>
                  {isStripeFunc(method.id) ? (
                    <StripeCardContainer
                      paymentProviderId={method.id}
                      selectedPaymentOptionId={selectedPaymentMethod}
                      paymentInfoMap={paymentInfoMap}
                      setCardBrand={setCardBrand}
                      setError={setError}
                      setCardComplete={setCardComplete}
                    />
                  ) : (
                    <PaymentContainer
                      paymentProviderId={method.id}
                      selectedPaymentOptionId={selectedPaymentMethod}
                      paymentInfoMap={paymentInfoMap}
                    />
                  )}
                </div>
              ))}
            </RadioGroup>
          </section>

          {/* Billing Address */}
          <section className="space-y-4">
            <h2 className="text-base font-medium text-gray-900">
              Billing address
            </h2>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={sameAsShipping}
                onChange={() => setSameAsShipping(!sameAsShipping)}
                className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900 focus:ring-1"
              />
              <span className="text-sm text-gray-700">
                Same as shipping address
              </span>
            </label>

            {!sameAsShipping && (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  {renderInput("First name", billing.first_name, (v) =>
                    setBilling({ ...billing, first_name: v })
                  )}
                  {renderInput("Last name", billing.last_name, (v) =>
                    setBilling({ ...billing, last_name: v })
                  )}
                </div>
                {renderInput("Address", billing.address_1, (v) =>
                  setBilling({ ...billing, address_1: v })
                )}
              </div>
            )}
          </section>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !selectedPaymentMethod}
            className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white py-4 rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed"
          >
            {isLoading ? "Processing..." : "Complete order"}
          </button>
        </div>
      </div>
    </div>
  )
}
