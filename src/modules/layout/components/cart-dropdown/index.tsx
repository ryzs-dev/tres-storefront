"use client"

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Button, Badge } from "@medusajs/ui"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useRef, useState } from "react"

const CartDropdown = ({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(
    undefined
  )
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)

  const open = () => setCartDropdownOpen(true)
  const close = () => setCartDropdownOpen(false)

  const totalItems =
    cartState?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  const subtotal = cartState?.subtotal ?? 0
  const itemRef = useRef<number>(totalItems || 0)

  const timedOpen = () => {
    open()

    const timer = setTimeout(close, 5000)

    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) {
      clearTimeout(activeTimer)
    }

    open()
  }

  // Clean up the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer)
      }
    }
  }, [activeTimer])

  const pathname = usePathname()

  // open cart dropdown when modifying the cart items, but only if we're not on the cart page
  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
      timedOpen()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems, itemRef.current])

  // Calculate bundle savings - ADDED
  const bundleItems = cartState?.items?.filter(item => 
    item.metadata?.is_from_bundle === true
  ) || []

  const totalBundleSavings = bundleItems.reduce((total, item) => {
    const originalPriceCents = item.metadata?.original_price_cents as number
    const discountedPriceCents = item.metadata?.discounted_price_cents as number
    
    if (originalPriceCents && discountedPriceCents) {
      const itemSavings = ((originalPriceCents - discountedPriceCents) / 100) * item.quantity
      return total + itemSavings
    }
    return total
  }, 0)

  return (
    <div
      className="h-full z-50"
      onMouseEnter={openAndCancel}
      onMouseLeave={close}
    >
      <Popover className="relative h-full">
        <PopoverButton className="h-full">
          <LocalizedClientLink
            className="hover:text-ui-fg-base text-lg hover:underline font-urw font-semibold"
            href="/cart"
            data-testid="nav-cart-link"
          >{`Cart (${totalItems})`}</LocalizedClientLink>
        </PopoverButton>
        <Transition
          show={cartDropdownOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <PopoverPanel
            static
            className="hidden small:block absolute top-[calc(100%+1px)] right-0 bg-white border-x border-b border-gray-200 w-[420px] text-ui-fg-base"
            data-testid="nav-cart-dropdown"
          >
            <div className="p-4 flex items-center justify-center">
              <h3 className="text-large-semi">Cart</h3>
            </div>
            {cartState && cartState.items?.length ? (
              <>
                {/* Bundle Savings Summary - ADDED */}
                {totalBundleSavings > 0 && (
                  <div className="mx-4 mb-4 p-3 bg-green-50 border border-green-200 rounded">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-700">🎉 Bundle Savings</span>
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        {convertToLocale({
                          amount: totalBundleSavings * 100,
                          currency_code: cartState.currency_code,
                        })} saved
                      </Badge>
                    </div>
                  </div>
                )}

                <div className="overflow-y-scroll max-h-[402px] px-4 grid grid-cols-1 gap-y-8 no-scrollbar p-px">
                  {cartState.items
                    .sort((a, b) => {
                      return (a.created_at ?? "") > (b.created_at ?? "")
                        ? -1
                        : 1
                    })
                    .map((item) => {
                      // Bundle item info - ADDED
                      const isBundleItem = item.metadata?.is_from_bundle === true
                      const bundleDiscountPercentage = item.metadata?.bundle_discount_percentage as number
                      const bundleTitle = item.metadata?.bundle_title as string
                      const originalPriceCents = item.metadata?.original_price_cents as number
                      const discountedPriceCents = item.metadata?.discounted_price_cents as number
                      
                      const showBundleDiscount = isBundleItem && bundleDiscountPercentage > 0
                      const originalPrice = originalPriceCents ? originalPriceCents / 100 : 0
                      const savings = originalPrice > 0 ? ((originalPriceCents - discountedPriceCents) / 100) * item.quantity : 0

                      return (
                        <div
                          className="grid grid-cols-[122px_1fr] gap-x-4"
                          key={item.id}
                          data-testid="cart-item"
                        >
                          <LocalizedClientLink
                            href={`/products/${item.product_handle}`}
                            className="w-24"
                          >
                            <Thumbnail
                              thumbnail={item.thumbnail}
                              images={item.variant?.product?.images}
                              size="square"
                            />
                          </LocalizedClientLink>
                          <div className="flex flex-col justify-between flex-1">
                            <div className="flex flex-col flex-1">
                              <div className="flex items-start justify-between">
                                <div className="flex flex-col overflow-ellipsis whitespace-nowrap mr-4 w-[180px]">
                                  <h3 className="text-base-regular overflow-hidden text-ellipsis">
                                    <LocalizedClientLink
                                      href={`/products/${item.product_handle}`}
                                      data-testid="product-link"
                                    >
                                      {item.title}
                                    </LocalizedClientLink>
                                  </h3>
                                  <LineItemOptions
                                    variant={item.variant}
                                    data-testid="cart-item-variant"
                                    data-value={item.variant}
                                  />
                                  
                                  {/* Bundle Info - ADDED */}
                                  {isBundleItem && (
                                    <div className="mt-1">
                                      <Badge className="text-xs">
                                        📦 {bundleTitle}
                                      </Badge>
                                      {showBundleDiscount && (
                                        <div className="text-xs text-green-600 mt-1">
                                          🎉 {bundleDiscountPercentage}% off
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  <span
                                    data-testid="cart-item-quantity"
                                    data-value={item.quantity}
                                  >
                                    Quantity: {item.quantity}
                                  </span>
                                </div>
                                <div className="flex flex-col justify-end items-end">
                                  {/* Show original price crossed out - ADDED */}
                                  {showBundleDiscount && originalPrice > 0 && (
                                    <div className="text-xs text-gray-500 line-through">
                                      {convertToLocale({
                                        amount: originalPrice * item.quantity * 100,
                                        currency_code: cartState.currency_code,
                                      })}
                                    </div>
                                  )}
                                  
                                  <LineItemPrice
                                    item={item}
                                    style="tight"
                                    currencyCode={cartState.currency_code}
                                  />
                                  
                                  {/* Show savings - ADDED */}
                                  {showBundleDiscount && savings > 0 && (
                                    <div className="text-xs text-green-600 font-medium">
                                      Saved: {convertToLocale({
                                        amount: savings * 100,
                                        currency_code: cartState.currency_code,
                                      })}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <DeleteButton
                              id={item.id}
                              className="mt-1"
                              data-testid="cart-item-remove-button"
                              bundle_id={item.metadata?.bundle_id as string}
                            >
                              {item.metadata?.bundle_id !== undefined
                                ? "Remove bundle"
                                : "Remove"}
                            </DeleteButton>
                          </div>
                        </div>
                      )
                    })}
                </div>
                <div className="p-4 flex flex-col gap-y-4 text-small-regular">
                  <div className="flex items-center justify-between">
                    <span className="text-ui-fg-base font-semibold">
                      Subtotal{" "}
                      <span className="font-normal">(excl. taxes)</span>
                    </span>
                    <span
                      className="text-large-semi"
                      data-testid="cart-subtotal"
                      data-value={subtotal}
                    >
                      {convertToLocale({
                        amount: subtotal,
                        currency_code: cartState.currency_code,
                      })}
                    </span>
                  </div>
                  <LocalizedClientLink href="/cart" passHref>
                    <Button
                      className="w-full"
                      size="large"
                      data-testid="go-to-cart-button"
                    >
                      Go to cart
                    </Button>
                  </LocalizedClientLink>
                </div>
              </>
            ) : (
              <div>
                <div className="flex py-16 flex-col gap-y-4 items-center justify-center">
                  <div className="bg-gray-900 text-small-regular flex items-center justify-center w-6 h-6 rounded-full text-white">
                    <span>0</span>
                  </div>
                  <span>Your shopping bag is empty.</span>
                  <div>
                    <LocalizedClientLink href="/store">
                      <>
                        <span className="sr-only">Go to all products page</span>
                        <Button onClick={close}>Explore products</Button>
                      </>
                    </LocalizedClientLink>
                  </div>
                </div>
              </div>
            )}
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  )
}

export default CartDropdown