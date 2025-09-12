"use client"

import { useCallback, useEffect, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { sdk } from "@lib/config"
import { isStripe as isStripeFunc, paymentInfoMap } from "@lib/constants"
import { initiatePaymentSession, setShippingMethod } from "@lib/data/cart"
import { calculatePriceForShippingOption } from "@lib/data/fulfillment"
import { convertToLocale } from "@lib/util/money"
import PaymentContainer, {
  StripeCardContainer,
} from "@modules/checkout/components/payment-container"
import { RadioGroup, Radio } from "@headlessui/react"
import { Button, Heading, Text, clx } from "@medusajs/ui"
import { CheckCircleSolid, Loader } from "@medusajs/icons"
import ErrorMessage from "@modules/checkout/components/error-message"
import Divider from "@modules/common/components/divider"
import MedusaRadio from "@modules/common/components/radio"
import PaymentButton from "@modules/checkout/components/payment-button"
import Review from "@modules/checkout/components/review"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

const PICKUP_OPTION_ON = "__PICKUP_ON"
const PICKUP_OPTION_OFF = "__PICKUP_OFF"

type Props = {
  cart: HttpTypes.StoreCart
  customer: HttpTypes.StoreCustomer | null
  availablePaymentMethods: any[]
  availableShippingMethods: HttpTypes.StoreCartShippingOption[]
}

function formatAddress(address: any) {
  if (!address) return ""
  let ret = ""
  if (address.address_1) ret += ` ${address.address_1}`
  if (address.address_2) ret += `, ${address.address_2}`
  if (address.postal_code) ret += `, ${address.postal_code} ${address.city}`
  if (address.country_code) ret += `, ${address.country_code.toUpperCase()}`
  return ret
}

export default function OnePageCheckout({
  cart,
  customer,
  availablePaymentMethods,
  availableShippingMethods,
}: Props) {
  // Contact + address state
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

  // Shipping state
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

  const handlePreparePayment = async () => {
    if (!cart) return
    setError(null)

    try {
      // Update cart addresses
      await sdk.store.cart.update(cart.id, {
        email,
        shipping_address: shipping,
        billing_address: sameAsShipping ? shipping : billing,
      })

      // Ensure shipping method is set
      if (!shippingMethodId) throw new Error("Please select a shipping method.")
      await setShippingMethod({ cartId: cart.id, shippingMethodId })

      await initiatePaymentSession(cart, {
        provider_id: selectedPaymentMethod,
        data: {
          amount: Math.round(cart.total * 100), // Use current cart total with discounts
          currency: cart.currency_code,
        },
      })

      console.log("✅ Payment session initiated")
      console.log("Cart", cart)

      // ✅ Navigate to review step after successful preparation
      setPaymentReady(true)
      router.push(pathname + "?" + createQueryString("step", "review"), {
        scroll: false,
      })
    } catch (err: any) {
      setError(err.message)
    }
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

  // Payment state
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("")
  const [cardBrand, setCardBrand] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cart) return
    setLoading(true)

    try {
      // 1. Update cart with addresses
      await sdk.store.cart.update(cart.id, {
        email,
        shipping_address: shipping,
        billing_address: sameAsShipping ? shipping : billing,
      })

      // 2. Init payment session
      if (selectedPaymentMethod) {
        await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
          data: {
            amount: Math.round(cart.total * 100), // Use current cart total with discounts
            currency: cart.currency_code,
          },
        })
      }
    } catch (err: any) {
      console.error("❌ Checkout error", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const renderInput = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    required = true,
    type = "text"
  ) => (
    <div className="space-y-1">
      <label className="text-xs font-medium text-gray-700 uppercase tracking-wide">
        {label}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-50 border-0 rounded-lg px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
  )

  return (
    <div className="max-w-full mx-auto bg-white">
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Contact */}
        <section className="space-y-4">
          <h2 className="text-3xl font-medium text-gray-900">Contact</h2>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700 uppercase tracking-wide">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 border-0 rounded-lg px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all"
              placeholder="your@email.com"
            />
          </div>
        </section>

        {/* Shipping Address */}
        <section className="space-y-4">
          <h2 className="text-3xl font-medium text-gray-900">
            Shipping Address
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {renderInput("First Name", shipping.first_name, (v) =>
              setShipping({ ...shipping, first_name: v })
            )}
            {renderInput("Last Name", shipping.last_name, (v) =>
              setShipping({ ...shipping, last_name: v })
            )}
          </div>

          <div className="space-y-4">
            {renderInput("Street Address", shipping.address_1, (v) =>
              setShipping({ ...shipping, address_1: v })
            )}

            <div className="grid grid-cols-3 gap-4">
              {renderInput("City", shipping.city, (v) =>
                setShipping({ ...shipping, city: v })
              )}
              {renderInput("Postal Code", shipping.postal_code, (v) =>
                setShipping({ ...shipping, postal_code: v })
              )}
              {renderInput("Country", shipping.country_code, (v) =>
                setShipping({ ...shipping, country_code: v })
              )}
            </div>

            {renderInput("Phone Number", shipping.phone, (v) =>
              setShipping({ ...shipping, phone: v })
            )}
          </div>
        </section>

        {/* Billing Address */}
        <section className="space-y-4">
          <h2 className="text-3xl font-medium text-gray-900">
            Billing Address
          </h2>

          <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <input
              type="checkbox"
              checked={sameAsShipping}
              onChange={() => setSameAsShipping(!sameAsShipping)}
              className="w-4 h-4 text-gray-900 bg-gray-100 border-gray-300 rounded focus:ring-gray-900 focus:ring-2"
            />
            <span className="text-sm font-medium text-gray-700">
              Same as shipping address
            </span>
          </label>

          {!sameAsShipping && (
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                {renderInput("First Name", billing.first_name, (v) =>
                  setBilling({ ...billing, first_name: v })
                )}
                {renderInput("Last Name", billing.last_name, (v) =>
                  setBilling({ ...billing, last_name: v })
                )}
              </div>
              {renderInput("Street Address", billing.address_1, (v) =>
                setBilling({ ...billing, address_1: v })
              )}
            </div>
          )}
        </section>

        {/* Delivery Options */}
        <section className="space-y-6">
          <h2 className="text-3xl font-medium text-gray-900">Delivery</h2>

          {/* Pickup Option Toggle */}
          {hasPickupOptions && (
            <RadioGroup
              value={showPickupOptions}
              onChange={(value) => {
                const id = _pickupMethods.find(
                  (option) => !option.insufficient_inventory
                )?.id
                if (id) handleSetShippingMethod(id, "pickup")
              }}
              className="space-y-3"
            >
              <Radio value={PICKUP_OPTION_ON} className="outline-none">
                {({ checked }) => (
                  <div
                    className={clx(
                      "flex justify-between items-center p-4 rounded-lg border transition-all cursor-pointer",
                      {
                        "border-gray-900": checked,
                        "border-gray-200 hover:border-gray-400": !checked,
                      }
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <MedusaRadio checked={checked} />
                      <span className="font-medium">Pick up your order</span>
                    </div>
                    <span className="text-sm font-medium">Free</span>
                  </div>
                )}
              </Radio>
            </RadioGroup>
          )}

          {/* Shipping Methods */}
          <RadioGroup
            value={shippingMethodId}
            onChange={(v) => handleSetShippingMethod(v, "shipping")}
            className="space-y-3"
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
                        "flex justify-between items-center p-4 rounded-lg border transition-all cursor-pointer",
                        {
                          "border-gray-900": checked,
                          "border-gray-200 hover:border-gray-400":
                            !checked && !isDisabled,
                          "opacity-50 cursor-not-allowed": isDisabled,
                        }
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <MedusaRadio checked={checked} />
                        <span className="font-medium">{option.name}</span>
                      </div>
                      <span className="text-sm font-medium">
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
                          <Loader />
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

          {/* Pickup Locations */}
          {showPickupOptions === PICKUP_OPTION_ON && (
            <div className="space-y-3">
              <h3 className="text-xl font-medium text-gray-900">
                Pickup Locations
              </h3>
              <RadioGroup
                value={shippingMethodId}
                onChange={(v) => handleSetShippingMethod(v, "pickup")}
                className="space-y-3"
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
                          "flex justify-between items-start p-4 rounded-lg border transition-all cursor-pointer",
                          {
                            "border-gray-900": checked,
                            "border-gray-200 hover:border-gray-400":
                              !checked && !option.insufficient_inventory,
                            "opacity-50 cursor-not-allowed":
                              option.insufficient_inventory,
                          }
                        )}
                      >
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-3">
                            <MedusaRadio checked={checked} />
                            <span className="font-medium">{option.name}</span>
                          </div>
                          <span className="text-xs opacity-70">
                            {formatAddress(
                              option.service_zone?.fulfillment_set?.location
                                ?.address
                            )}
                          </span>
                        </div>
                        <span className="text-sm font-medium">
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

          <ErrorMessage error={error} />
        </section>

        {/* Payment Method */}
        <section className="space-y-4">
          <h2 className="text-3xl font-medium text-gray-900">Payment</h2>
          <RadioGroup
            value={selectedPaymentMethod}
            onChange={(value: string) => setSelectedPaymentMethod(value)}
            className="space-y-3"
          >
            {availablePaymentMethods.map((method) => (
              <div key={method.id} className="space-y-2">
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

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </section>

        {/* Review + PaymentButton */}
        <section className="space-y-4">
          {!paymentReady && (
            <Button
              onClick={handlePreparePayment}
              disabled={loading || !selectedPaymentMethod}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-4 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
              Proceed To Review
            </Button>
          )}
        </section>

        <section className="space-y-4">
          <Review cart={cart} />
        </section>
      </form>
    </div>
  )
}
