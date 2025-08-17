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

// Enhanced currency formatting that matches BundleActions
const formatCurrency = (amount: number, currency: string = "MYR"): string => {
  const formattedAmount = amount.toFixed(2)
  switch (currency.toUpperCase()) {
    case "MYR":
      return `RM${formattedAmount}`
    case "USD":
      return `$${formattedAmount}`
    case "EUR":
      return `€${formattedAmount}`
    default:
      return `${formattedAmount} ${currency}`
  }
}

// Function to calculate item savings - works with the actual metadata structure
const calculateItemSavings = (item: any) => {
  // Get metadata values
  const originalPriceCents = item.metadata?.original_price_cents as number
  const discountedPriceCents = item.metadata?.discounted_price_cents as number
  const bundleDiscountPercentage = item.metadata
    ?.bundle_discount_percentage as number
  const bundleDiscountType = item.metadata?.bundle_discount_type as string
  const fixedDiscountAmount = item.metadata?.fixed_discount_amount as number
  const actualDiscountAmount = item.metadata?.actual_discount_amount as number
  const discountApplied = item.metadata?.discount_applied as boolean

  // Calculate prices and savings
  let originalPrice = 0
  let discountedPrice = 0
  let savings = 0
  let discountText = ""
  let finalDiscountType: "fixed" | "percentage" | "none" = "none"

  // If discount has been applied, use the stored values
  if (discountApplied && originalPriceCents && discountedPriceCents) {
    originalPrice = originalPriceCents / 100
    discountedPrice = discountedPriceCents / 100
    savings = originalPrice - discountedPrice

    if (
      bundleDiscountType === "fixed" &&
      (fixedDiscountAmount > 0 || actualDiscountAmount > 0)
    ) {
      const discountAmountToShow = actualDiscountAmount || fixedDiscountAmount
      discountText = `${formatCurrency(discountAmountToShow / 100)} off` // Convert from cents to currency
      finalDiscountType = "fixed"
    } else if (bundleDiscountPercentage > 0) {
      discountText = `${Math.round(bundleDiscountPercentage)}% off`
      finalDiscountType = "percentage"
    }
  }
  // If discount hasn't been applied yet, but we have the discount info, calculate what it should be
  else if (bundleDiscountType === "fixed" && fixedDiscountAmount > 0) {
    // Current price from item (unit_price is already in correct currency units)
    originalPrice = item.unit_price
    // What the discounted price should be (fixedDiscountAmount is in cents, so divide by 100)
    discountedPrice = Math.max(0, originalPrice - fixedDiscountAmount / 100)
    savings = originalPrice - discountedPrice
    discountText = `${formatCurrency(fixedDiscountAmount / 100)} off`
    finalDiscountType = "fixed"
  } else if (
    bundleDiscountType === "percentage" &&
    bundleDiscountPercentage > 0
  ) {
    originalPrice = item.unit_price
    discountedPrice = originalPrice * (1 - bundleDiscountPercentage / 100)
    savings = originalPrice - discountedPrice
    discountText = `${Math.round(bundleDiscountPercentage)}% off`
    finalDiscountType = "percentage"
  }

  const result = {
    originalPrice,
    discountedPrice,
    savings,
    discountType: finalDiscountType,
    discountText,
    discountApplied: !!discountApplied,
  }

  return result
}

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

  // Enhanced bundle savings calculation with fixed discount support
  const bundleItems =
    cartState?.items?.filter(
      (item) => item.metadata?.is_from_bundle === true
    ) || []

  const totalBundleSavings = bundleItems.reduce((total, item) => {
    const savingsInfo = calculateItemSavings(item)
    return total + savingsInfo.savings * item.quantity
  }, 0)

  // Group bundle items by bundle_id for better display
  const bundleGroups = bundleItems.reduce((groups, item) => {
    const bundleId = item.metadata?.bundle_id as string
    const bundleTitle = item.metadata?.bundle_title as string

    if (!groups[bundleId]) {
      groups[bundleId] = {
        title: bundleTitle || `Bundle ${bundleId}`,
        items: [],
        totalSavings: 0,
      }
    }

    const savingsInfo = calculateItemSavings(item)
    groups[bundleId].items.push(item)
    groups[bundleId].totalSavings += savingsInfo.savings * item.quantity

    return groups
  }, {} as Record<string, { title: string; items: any[]; totalSavings: number }>)

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
                <div className="overflow-y-scroll max-h-[402px] px-4 grid grid-cols-1 gap-y-8 no-scrollbar p-px">
                  {cartState.items
                    .sort((a, b) => {
                      return (a.created_at ?? "") > (b.created_at ?? "")
                        ? -1
                        : 1
                    })
                    .map((item) => {
                      // Enhanced bundle item info with fixed discount support
                      const isBundleItem =
                        item.metadata?.is_from_bundle === true
                      const bundleTitle = item.metadata?.bundle_title as string
                      const savingsInfo = calculateItemSavings(item)

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

                                  {/* Enhanced Bundle Info with Fixed Discount Support */}
                                  {/* {isBundleItem && (
                                    <div className="mt-1 space-y-1">
                                      <Badge className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                        📦 {bundleTitle || "Bundle"}
                                      </Badge>
                                      {savingsInfo.discountType !== "none" && (
                                        <div className="text-xs text-green-600 font-medium flex items-center gap-1">
                                          <span>🎉</span>
                                          <span>
                                            {savingsInfo.discountText}
                                          </span>
                                          {savingsInfo.discountType ===
                                            "fixed" && (
                                            <span className="text-gray-500">
                                              (fixed)
                                            </span>
                                          )}
                                          {!savingsInfo.discountApplied && (
                                            <span className="text-orange-500">
                                              (pending)
                                            </span>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  )} */}

                                  <span
                                    data-testid="cart-item-quantity"
                                    data-value={item.quantity}
                                  >
                                    Quantity: {item.quantity}
                                  </span>
                                </div>
                                <div className="flex flex-col justify-end items-end">
                                  {/* Enhanced pricing display with fixed discount support */}
                                  {savingsInfo.discountType !== "none" &&
                                    savingsInfo.originalPrice > 0 && (
                                      <div className="text-xs text-gray-500 line-through">
                                        {convertToLocale({
                                          amount:
                                            savingsInfo.originalPrice *
                                            item.quantity,
                                          currency_code:
                                            cartState.currency_code,
                                        })}
                                      </div>
                                    )}

                                  <LineItemPrice
                                    item={item}
                                    style="tight"
                                    currencyCode={cartState.currency_code}
                                  />
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

                {/* Enhanced cart summary */}
                <div className="p-4 flex flex-col gap-y-4 text-small-regular">
                  {/* Show bundle savings summary in cart total area */}
                  {totalBundleSavings > 0 && (
                    <div className="flex items-center justify-between text-green-600 border-t pt-2">
                      <span className="text-sm font-medium">
                        Total Bundle Savings:
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
