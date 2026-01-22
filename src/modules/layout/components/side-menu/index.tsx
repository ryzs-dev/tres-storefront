"use client"

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import { ArrowRightMini, XMark } from "@medusajs/icons"
import { Text, clx, useToggleState } from "@medusajs/ui"
import { Fragment, useEffect, useState } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import { HttpTypes } from "@medusajs/types"
import CategoriesSelect from "./CategoriesSelect"
import { MenuIcon, ShoppingBag, User } from "lucide-react"
import { retrieveCart } from "@lib/data/cart"
import { open } from "fs"
import SearchModal from "@modules/search/components/modal"

const SideMenuItems = {
  Home: "/",
  Journey: "/journey",
  "Shop All": "/bundles",
  Account: "/account",
  Cart: "/cart",
}

const SideMenu = ({
  regions,
  categories,
}: {
  regions: HttpTypes.StoreRegion[] | null
  categories: HttpTypes.StoreProductCategory[] | null
}) => {
  const regionToggleState = useToggleState()
  const categoriesToggleState = useToggleState()

  // Cart state for badge
  const [cartItemCount, setCartItemCount] = useState<number>(0)
  const [isLoadingCart, setIsLoadingCart] = useState(true)

  // Function to get cart count
  const getCartCount = async () => {
    try {
      const cart = await retrieveCart()
      if (cart?.items) {
        const totalItems = cart.items.reduce(
          (total, item) => total + item.quantity,
          0
        )
        setCartItemCount(totalItems)
      } else {
        setCartItemCount(0)
      }
    } catch (error) {
      console.error("Error fetching cart:", error)
      setCartItemCount(0)
    } finally {
      setIsLoadingCart(false)
    }
  }

  // Load cart count on component mount
  useEffect(() => {
    getCartCount()
  }, [])

  // Listen for cart updates (optional - for real-time updates)
  useEffect(() => {
    const handleCartUpdate = () => {
      getCartCount()
    }

    // Listen for custom cart update events
    window.addEventListener("cart-updated", handleCartUpdate)

    // Also listen for storage events (if cart ID changes)
    window.addEventListener("storage", handleCartUpdate)

    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate)
      window.removeEventListener("storage", handleCartUpdate)
    }
  }, [])

  return (
    <div className="h-full">
      <div className="flex items-center h-full gap-4 text-tres-primary">
        <SearchModal />

        {/* Cart Button with Badge */}
        <LocalizedClientLink
          href="/cart"
          className="relative h-full flex items-center transition-all ease-out duration-200 focus:outline-none hover:text-ui-fg-base"
          data-testid="nav-cart-button"
        >
          <ShoppingBag className="w-6 h-6" />

          {/* Cart Count Badge */}
          {!isLoadingCart && cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 pt-1 font-medium">
              {cartItemCount > 99 ? "99+" : cartItemCount}
            </span>
          )}

          {/* Loading indicator (optional) */}
          {isLoadingCart && (
            <span className="absolute -top-1 -right-1 bg-gray-300 text-white text-xs rounded-full w-3 h-3 animate-pulse"></span>
          )}
        </LocalizedClientLink>

        <LocalizedClientLink
          href="/account"
          className="flex items-center justify-center p-2 rounded-full transition-colors"
          data-testid="nav-account-button"
        >
          <User className="w-6 h-6 " />
        </LocalizedClientLink>

        {/* Hamburger Menu */}
        <Popover className="h-full flex">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <PopoverButton
                  data-testid="nav-menu-button"
                  className="relative h-full flex items-center transition-all ease-out duration-200 focus:outline-none hover:text-ui-fg-base"
                >
                  <MenuIcon className="w-6 h-6" />
                </PopoverButton>
              </div>

              <Transition
                show={open}
                enter="transition-all duration-200"
                enterFrom="opacity-0 translate-x-4"
                enterTo="opacity-100 translate-x-0"
                leave="transition-all duration-150"
                leaveFrom="opacity-100 translate-x-0"
                leaveTo="opacity-0 translate-x-4"
              >
                <PopoverPanel className="fixed top-0 right-0 z-30 w-[75vw] max-w-[480px] h-full bg-white shadow-lg border-l border-gray-200 text-ui-fg-base overflow-y-auto">
                  <div className="flex flex-col justify-between h-full p-6">
                    {/* Top section: Close button + Nav list */}
                    <div>
                      {/* Close button */}
                      <div className="flex justify-end mb-2">
                        <button data-testid="close-menu-button" onClick={close}>
                          <XMark className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Navigation list */}
                      <ul className="flex flex-col divide-y divide-gray-200">
                        {Object.entries(SideMenuItems).map(([name, href]) => (
                          <li key={name} className="py-4">
                            {name === "Shop All" ? (
                              <div>
                                {/* Parent row */}
                                <button
                                  type="button"
                                  className="w-full flex items-center justify-between text-xl font-medium hover:text-ui-fg-muted"
                                  onClick={categoriesToggleState.toggle}
                                >
                                  <span>Shop All</span>
                                  <ArrowRightMini
                                    className={clx(
                                      "transition-transform duration-200",
                                      categoriesToggleState.state
                                        ? "rotate-90"
                                        : ""
                                    )}
                                  />
                                </button>

                                {/* Sliding sub-categories */}
                                <Transition
                                  show={categoriesToggleState.state}
                                  enter="transition-all duration-300 ease-out"
                                  enterFrom="max-h-0 opacity-0 translate-x-2"
                                  enterTo="max-h-[500px] opacity-100 translate-x-0"
                                  leave="transition-all duration-200 ease-in"
                                  leaveFrom="max-h-[500px] opacity-100 translate-x-0"
                                  leaveTo="max-h-0 opacity-0 translate-x-2"
                                >
                                  <div className="overflow-hidden mt-3 ml-4 space-y-2">
                                    {categories && (
                                      <CategoriesSelect
                                        categories={categories}
                                        closePopover={close}
                                        toggleState={categoriesToggleState}
                                      />
                                    )}
                                    <LocalizedClientLink
                                      href="/store"
                                      className="mt-3 pt-4 space-y-10 font-medium hover:text-ui-fg-muted"
                                      onClick={close}
                                    >
                                      View all products
                                    </LocalizedClientLink>
                                  </div>
                                </Transition>
                              </div>
                            ) : (
                              <LocalizedClientLink
                                href={href}
                                className="text-xl font-medium hover:text-ui-fg-muted"
                                onClick={close}
                              >
                                {name}
                              </LocalizedClientLink>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Footer section: at bottom */}
                    <div className="pt-6 border-t border-gray-200 flex flex-col gap-y-6">
                      <div
                        className="flex justify-between items-center"
                        onMouseEnter={regionToggleState.open}
                        onMouseLeave={regionToggleState.close}
                      >
                        {regions && (
                          <CountrySelect
                            toggleState={regionToggleState}
                            regions={regions}
                          />
                        )}
                        <ArrowRightMini
                          className={clx(
                            "transition-transform duration-150",
                            regionToggleState.state ? "-rotate-90" : ""
                          )}
                        />
                      </div>
                      <Text className="text-xs text-ui-fg-muted">
                        © {new Date().getFullYear()} TRES All rights reserved.
                      </Text>
                    </div>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
