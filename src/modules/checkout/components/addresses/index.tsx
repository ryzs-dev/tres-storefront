"use client"

import { setAddresses } from "@lib/data/cart"
import compareAddresses from "@lib/util/compare-addresses"
import {
  CheckCircle,
  CheckCircleSolid,
  CreditCard,
  MapPin,
  Phone,
} from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text, useToggleState } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import Spinner from "@modules/common/icons/spinner"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useActionState } from "react"
import BillingAddress from "../billing_address"
import ErrorMessage from "../error-message"
import ShippingAddress from "../shipping-address"
import { SubmitButton } from "../submit-button"
import { Edit2, Mail } from "lucide-react"

const Addresses = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "address"

  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  )

  const handleEdit = () => {
    router.push(pathname + "?step=address")
  }

  const [message, formAction] = useActionState(setAddresses, null)

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-medium text-gray-900">
            Shipping Address
          </h2>
        </div>

        {!isOpen && cart?.shipping_address && (
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200 self-start sm:self-center"
            data-testid="edit-address-button"
          >
            <Edit2 size={14} />
            Edit
          </button>
        )}
      </div>

      {isOpen ? (
        /* Form State */
        <form action={formAction}>
          <div className="space-y-8">
            <ShippingAddress
              customer={customer}
              checked={sameAsBilling}
              onChange={toggleSameAsBilling}
              cart={cart}
            />

            {!sameAsBilling && (
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-6">
                  Billing address
                </h3>
                <BillingAddress cart={cart} />
              </div>
            )}

            <div className="pt-6 border-t border-gray-100">
              <SubmitButton
                className="w-full sm:w-auto px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors duration-200"
                data-testid="submit-address-button"
              >
                Continue to delivery
              </SubmitButton>
              <ErrorMessage
                error={message}
                data-testid="address-error-message"
              />
            </div>
          </div>
        </form>
      ) : (
        /* Summary State */
        <div>
          {cart && cart.shipping_address ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Shipping Address */}
              <div className="space-y-3" data-testid="shipping-address-summary">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-medium text-gray-900">
                    Shipping Address
                  </h3>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p className="font-medium text-gray-900">
                    {cart.shipping_address.first_name}{" "}
                    {cart.shipping_address.last_name}
                  </p>
                  <p>
                    {cart.shipping_address.address_1}{" "}
                    {cart.shipping_address.address_2}
                  </p>
                  <p>
                    {cart.shipping_address.postal_code},{" "}
                    {cart.shipping_address.city}
                  </p>
                  <p className="uppercase">
                    {cart.shipping_address.country_code}
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-3" data-testid="shipping-contact-summary">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-medium text-gray-900">Contact</h3>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <p>{cart.shipping_address.phone}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p>{cart.email}</p>
                  </div>
                </div>
              </div>

              {/* Billing Address */}
              <div className="space-y-3" data-testid="billing-address-summary">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-medium text-gray-900">Billing Address</h3>
                </div>

                {sameAsBilling ? (
                  <p className="text-sm text-gray-600 italic">
                    Same as shipping address
                  </p>
                ) : (
                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="font-medium text-gray-900">
                      {cart.billing_address?.first_name}{" "}
                      {cart.billing_address?.last_name}
                    </p>
                    <p>
                      {cart.billing_address?.address_1}{" "}
                      {cart.billing_address?.address_2}
                    </p>
                    <p>
                      {cart.billing_address?.postal_code},{" "}
                      {cart.billing_address?.city}
                    </p>
                    <p className="uppercase">
                      {cart.billing_address?.country_code}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <Spinner />
            </div>
          )}
        </div>
      )}

      <Divider className="mt-8" />
    </div>
  )
}

export default Addresses
