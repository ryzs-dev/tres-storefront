"use client"

import { Transition, Dialog } from "@headlessui/react"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Button, Table } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Item from "@modules/cart/components/item"
import BundleItem from "@modules/cart/components/bundle-item"
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

  const subtotal = (cartState?.subtotal ?? 0) / 100

  // Get total discount per bundle for display
  const bundleDiscounts = cartState?.items?.reduce((acc, item) => {
    const bundleId = item.metadata?.bundle_id as string | undefined
    if (!bundleId) return acc

    // Only set once per bundle (first item found)
    if (!(bundleId in acc)) {
      acc[bundleId] =
        typeof item.metadata?.discount_applied === "number"
          ? item.metadata.discount_applied
          : 0
    }

    return acc
  }, {} as Record<string, number>)

  const totalBundleSavings =
    cartState?.items?.reduce((total, item) => {
      if (item.metadata?.bundle_id) {
        const originalUnitPrice = item.raw_unit_price?.amount || item.unit_price
        const discountedUnitPrice = item.unit_price
        const itemSavings =
          (originalUnitPrice - discountedUnitPrice) * item.quantity
        return total + (itemSavings > 0 ? itemSavings / 100 : 0)
      }
      return total
    }, 0) || 0

  // Group items by bundle
  const groupedItems = cartState?.items?.reduce(
    (acc, item) => {
      if (item.metadata?.bundle_id) {
        const bundleId = item.metadata.bundle_id as string
        const bundleTitle = (item.metadata.bundle_title as string) || "Bundle"

        if (!acc.bundles[bundleId]) {
          acc.bundles[bundleId] = {
            title: bundleTitle,
            items: [],
          }
        }
        acc.bundles[bundleId].items.push(item)
      } else {
        acc.regularItems.push(item)
      }
      return acc
    },
    {
      bundles: {} as Record<
        string,
        { title: string; items: HttpTypes.StoreCartLineItem[] }
      >,
      regularItems: [] as HttpTypes.StoreCartLineItem[],
    }
  ) || { bundles: {}, regularItems: [] }

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
                        <div className="px-4 py-4 space-y-4">
                          {/* Render Bundles */}
                          {Object.entries(groupedItems.bundles).map(
                            ([bundleId, bundle]) => (
                              <BundleItem
                                key={bundleId}
                                bundleId={bundleId}
                                bundleTitle={bundle.title}
                                items={bundle.items}
                                countryCode="my"
                                currencyCode={cartState.currency_code}
                              />
                            )
                          )}

                          {/* Render Regular Items */}
                          {groupedItems.regularItems.length > 0 && (
                            <Table>
                              <Table.Body>
                                {groupedItems.regularItems
                                  .sort((a, b) => {
                                    return (a.created_at ?? "") >
                                      (b.created_at ?? "")
                                      ? -1
                                      : 1
                                  })
                                  .map((item) => (
                                    <Item
                                      key={item.id}
                                      item={item}
                                      type="full"
                                      currencyCode={cartState.currency_code}
                                      cartId={cartState.id}
                                      countryCode="my"
                                      allCartItems={cartState.items || []}
                                    />
                                  ))}
                              </Table.Body>
                            </Table>
                          )}
                        </div>
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
                              amount: subtotal * 100,
                              currency_code: cartState.currency_code,
                            })}
                          </span>
                        </div>

                        <p className="text-sm text-gray-500">
                          Shipping and taxes calculated at checkout.
                        </p>

                        {/* Action buttons */}
                        <div className=" flex w-full items-center gap-2 justify-center">
                          <Button
                            asChild
                            className="w-full flex items-center justify-center  "
                            size="large"
                            variant="secondary"
                            onClick={onClose}
                            data-testid="go-to-cart-button"
                          >
                            <LocalizedClientLink
                              href="/cart"
                              className="w-full flex h-full"
                            >
                              View Cart
                            </LocalizedClientLink>
                          </Button>
                          <Button
                            asChild
                            className="w-full flex items-center justify-center  "
                            size="large"
                            variant="primary"
                            onClick={onClose}
                            data-testid="checkout-button"
                          >
                            <LocalizedClientLink
                              href="/checkout"
                              className="w-full flex h-full"
                            >
                              Checkout
                            </LocalizedClientLink>
                          </Button>
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
