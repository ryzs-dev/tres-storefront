// Updated CartSidePanel to match Summary's calculation logic

"use client"

import { Transition, Dialog } from "@headlessui/react"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Button, Table } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Item from "@modules/cart/components/item" // Import the existing Item component
import { Fragment } from "react"
import { XMark } from "@medusajs/icons"

interface CartSidePanelProps {
  cart?: HttpTypes.StoreCart | null
  isOpen: boolean
  onClose: () => void
}

const CartSidePanel = ({
  cart: cartState,
  isOpen,
  onClose,
}: CartSidePanelProps) => {
  const totalItems =
    cartState?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  const subtotal = cartState?.subtotal ?? 0

  // Use the SAME calculation logic as Summary component
  const totalBundleSavings =
    cartState?.items?.reduce((total, item) => {
      // Only calculate for bundle items that have discounts applied
      if (
        item.metadata?.is_from_bundle &&
        item.metadata?.actual_discount_amount
      ) {
        // Use the actual_discount_amount which is already the total discount for this item
        const itemSavings = Number(item.metadata.actual_discount_amount) / 100
        return total + itemSavings
      }
      return total
    }, 0) || 0

  console.log("CartSidePanel Bundle Savings:", totalBundleSavings)

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        {/* Side panel */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-white shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-6 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Shopping Cart ({totalItems})
                      </h2>
                      <button
                        type="button"
                        className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onClick={onClose}
                      >
                        <span className="sr-only">Close panel</span>
                        <XMark className="h-6 w-6" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto">
                      {cartState && cartState.items?.length ? (
                        <>
                          {/* Cart Items using existing Item component */}
                          <div className="px-2 py-4">
                            {/* Custom Table wrapper for sidebar layout */}
                            <Table>
                              <Table.Body>
                                {cartState.items
                                  .sort((a, b) => {
                                    return (a.created_at ?? "") >
                                      (b.created_at ?? "")
                                      ? -1
                                      : 1
                                  })
                                  .map((item) => (
                                    /* Reuse the existing Item component with all its logic */
                                    <Item
                                      key={item.id}
                                      item={item}
                                      type="full" // Use full type to get quantity controls
                                      currencyCode={cartState.currency_code}
                                      cartId={cartState.id}
                                      countryCode="my"
                                      allCartItems={cartState.items || []}
                                    />
                                  ))}
                              </Table.Body>
                            </Table>
                          </div>
                        </>
                      ) : (
                        // Empty cart state
                        <div className="flex flex-col items-center justify-center h-full px-4">
                          <div className="bg-[#99b2dd] text-white flex items-center justify-center w-12 h-12 rounded-full mb-4">
                            <span className="text-lg">0</span>
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Your cart is empty
                          </h3>
                          <p className="text-gray-500 text-center mb-6">
                            Add some items to your cart to get started.
                          </p>
                          <LocalizedClientLink href="/bundles">
                            <Button
                              onClick={onClose}
                              className="w-full bg-[#99b2dd] border-[#99b2dd] text-white hover:bg-[#7a9cd9] hover:border-[#7a9cd9]"
                              variant="transparent"
                            >
                              Explore products
                            </Button>
                          </LocalizedClientLink>
                        </div>
                      )}
                    </div>

                    {/* Footer - only show if cart has items */}
                    {cartState && (cartState.items ?? []).length > 0 && (
                      <div className="border-t border-gray-200 px-4 py-6 space-y-4">
                        {/* Bundle savings summary - now matches Summary component exactly */}
                        {totalBundleSavings > 0 && (
                          <div className="flex items-center justify-between text-[#99b2dd] border-t pt-4">
                            <span className="text-sm font-medium">
                              Bundle Discount :
                            </span>
                            <span className="text-sm font-semibold">
                              -
                              {convertToLocale({
                                amount: totalBundleSavings,
                                currency_code: cartState.currency_code,
                              })}
                            </span>
                          </div>
                        )}

                        {/* Subtotal */}
                        <div className="flex items-center justify-between">
                          <span className="text-base font-medium text-gray-900">
                            Subtotal
                          </span>
                          <span
                            className="text-lg font-semibold text-gray-900"
                            data-testid="cart-subtotal"
                            data-value={subtotal}
                          >
                            {convertToLocale({
                              amount: subtotal,
                              currency_code: cartState.currency_code,
                            })}
                          </span>
                        </div>

                        <p className="text-sm text-gray-500">
                          Shipping and taxes calculated at checkout.
                        </p>

                        {/* Action buttons */}
                        <div className="space-y-3">
                          <LocalizedClientLink href="/cart" className="block">
                            <Button
                              className="w-full"
                              size="large"
                              variant="secondary"
                              onClick={onClose}
                              data-testid="go-to-cart-button"
                            >
                              View Cart
                            </Button>
                          </LocalizedClientLink>
                          <LocalizedClientLink
                            href="/checkout"
                            className="block"
                          >
                            <Button
                              className="w-full"
                              size="large"
                              onClick={onClose}
                              data-testid="checkout-button"
                            >
                              Checkout
                            </Button>
                          </LocalizedClientLink>
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default CartSidePanel
