"use client"

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import { ArrowRightMini, XMark } from "@medusajs/icons"
import { Text, clx, useToggleState } from "@medusajs/ui"
import { Fragment } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import { HttpTypes } from "@medusajs/types"
import CategoriesSelect from "./CategoriesSelect"
import { MenuIcon, ShoppingBag } from "lucide-react"

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

  return (
    <div className="h-full">
      <div className="flex items-center h-full gap-4">
        {/* Cart Button */}
        <LocalizedClientLink
          href="/cart"
          className="relative h-full flex items-center transition-all ease-out duration-200 focus:outline-none hover:text-ui-fg-base"
          data-testid="nav-cart-button"
        >
          <ShoppingBag className="w-6 h-6" />
          {/* Optional: Add cart count badge */}
          {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            3
          </span> */}
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
                as={Fragment}
                enter="transition ease-out duration-150"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in duration-150"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
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
                            {name === "Categories" ? (
                              <div
                                className="flex justify-between items-center cursor-pointer"
                                onMouseEnter={categoriesToggleState.open}
                                onMouseLeave={categoriesToggleState.close}
                              >
                                <div className="flex flex-col">
                                  <LocalizedClientLink
                                    className="text-xl font-medium hover:text-ui-fg-muted"
                                    href={href}
                                    onClick={close}
                                    data-testid={`${name.toLowerCase()}-link`}
                                  >
                                    {name}
                                  </LocalizedClientLink>
                                  {categories && (
                                    <CategoriesSelect
                                      toggleState={categoriesToggleState}
                                      categories={categories}
                                      closePopover={close}
                                    />
                                  )}
                                </div>
                                <ArrowRightMini
                                  className={clx(
                                    "transition-transform duration-150",
                                    categoriesToggleState.state
                                      ? "rotate-90"
                                      : ""
                                  )}
                                />
                              </div>
                            ) : (
                              <LocalizedClientLink
                                href={href}
                                className="text-xl font-medium hover:text-ui-fg-muted"
                                onClick={close}
                                data-testid={`${name.toLowerCase()}-link`}
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
