"use client"

import { ArrowRightMini, ChevronDown, XMark } from "@medusajs/icons"
import { Text, clx, useToggleState } from "@medusajs/ui"
import { Fragment } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import { HttpTypes } from "@medusajs/types"
import CategoriesSelect from "../side-menu/CategoriesSelect"

const SideMenuItems = {
  Home: "/",
  Journey: "/journey",
  Categories: "/store",
  Account: "/account",
  Cart: "/cart",
}

const TopMenu = ({
  regions,
  categories,
}: {
  regions: HttpTypes.StoreRegion[] | null
  categories: HttpTypes.StoreProductCategory[] | null
}) => {
  const regionToggleState = useToggleState()
  const categoriesToggleState = useToggleState()

  return (
    <div className="w-full bg-white shadow-md z-50">
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        {/* Left side: logo or brand */}
        <div className="text-xl font-bold">© TRES</div>

        {/* Center menu items */}
        <ul className="flex gap-6 items-center">
          {Object.entries(SideMenuItems).map(([name, href]) => (
            <li key={name} className="relative group">
              {name === "Categories" && categories ? (
                <div
                  className="flex items-center gap-1 cursor-pointer"
                  onMouseEnter={categoriesToggleState.open}
                  onMouseLeave={categoriesToggleState.close}
                >
                  <LocalizedClientLink
                    href={href}
                    className="text-base font-medium hover:text-gray-600"
                    data-testid={`${name.toLowerCase()}-link`}
                  >
                    {name}
                  </LocalizedClientLink>
                  <ChevronDown
                    className={clx(
                      "transition-transform",
                      categoriesToggleState.state ? "rotate-180" : ""
                    )}
                  />
                  {/* Dropdown on hover */}
                  <div className="absolute top-full left-0 bg-white shadow-lg mt-2 rounded-md z-10">
                    <CategoriesSelect
                      toggleState={categoriesToggleState}
                      categories={categories}
                      closePopover={categoriesToggleState.close}
                    />
                  </div>
                </div>
              ) : (
                <LocalizedClientLink
                  href={href}
                  className="text-base font-medium hover:text-gray-600"
                  data-testid={`${name.toLowerCase()}-link`}
                >
                  {name}
                </LocalizedClientLink>
              )}
            </li>
          ))}
        </ul>

        {/* Right side: region selector */}
        <div
          className="relative"
          onMouseEnter={regionToggleState.open}
          onMouseLeave={regionToggleState.close}
        >
          {regions && (
            <CountrySelect toggleState={regionToggleState} regions={regions} />
          )}
        </div>
      </div>
    </div>
  )
}

export default TopMenu
