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
      <div className="flex items-center h-full">
        <Popover className="h-full flex">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <PopoverButton
                  data-testid="nav-menu-button"
                  className="relative h-full flex items-center transition-all ease-out duration-200 focus:outline-none hover:text-ui-fg-base"
                >
                  Menu
                </PopoverButton>
              </div>

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-150"
                enterFrom="opacity-0"
                enterTo="opacity-100 backdrop-blur-2xl"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 backdrop-blur-2xl"
                leaveTo="opacity-0"
              >
                <PopoverPanel className="flex flex-col absolute w-full pr-4 sm:pr-0 sm:w-1/3 2xl:w-1/4 sm:min-w-min h-[calc(100vh-1rem)] z-30 inset-x-0 text-sm text-ui-fg-on-color m-2 backdrop-blur-2xl">
                  <div
                    data-testid="nav-menu-popup"
                    className="flex flex-col h-full bg-[rgba(3,7,18,0.5)] rounded-rounded justify-between p-6"
                  >
                    <div className="flex justify-end" id="xmark">
                      <button data-testid="close-menu-button" onClick={close}>
                        <XMark />
                      </button>
                    </div>
                    <ul className="flex flex-col w-full gap-6 items-start justify-start">
                      {Object.entries(SideMenuItems).map(([name, href]) => {
                        return (
                          <li key={name} className="w-full flex">
                            {name === "Categories" ? (
                              <div
                                className="flex justify-between w-full items-center cursor-pointer"
                                onMouseEnter={categoriesToggleState.open}
                                onMouseLeave={categoriesToggleState.close}
                              >
                                <div className="flex flex-col">
                                  <LocalizedClientLink
                                    className="text-3xl leading-10 hover:text-ui-fg-disabled"
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
                                      closePopover={close} // Pass Popover close function
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
                                className="text-3xl leading-10 hover:text-ui-fg-disabled"
                                onClick={close}
                                data-testid={`${name.toLowerCase()}-link`}
                              >
                                {name}
                              </LocalizedClientLink>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                    <div className="flex flex-col gap-y-6">
                      <div
                        className="flex justify-between"
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
                      <Text className="flex justify-between txt-compact-small">
                        © {new Date().getFullYear()} TRES EXCLUSIVE EMPIRE All
                        rights reserved.
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
