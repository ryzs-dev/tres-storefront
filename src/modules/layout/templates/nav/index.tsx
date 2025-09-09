import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import { listCategories } from "@lib/data/categories"
import Image from "next/image"

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)
  const categories = await listCategories()

  const MenuItems = {
    Home: "/",
    Journey: "/journey",
    "Shop All": "/bundles",
  }

  return (
    <div className="sticky top-0 inset-x-0 z-40 group">
      <header className="relative h-16 mx-auto border-b duration-200 bg-white border-ui-border-base">
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular">
          {/* Logo */}
          <div className="flex items-center h-full flex-1">
            <LocalizedClientLink
              href="/"
              className="font-urw text-xl hover:text-ui-fg-base uppercase flex items-center"
              data-testid="nav-store-link"
            >
              <Image
                src="/images/tres-logo-3.svg"
                alt="Tres Triangle Logo"
                width={75}
                height={75}
                className="h-auto"
              />
            </LocalizedClientLink>
          </div>

          {/* Center Nav Links (Desktop only) */}
          <div className="hidden small:flex items-center justify-center text-center flex-1">
            <div className="flex items-center space-x-8">
              {Object.entries(MenuItems).map(([name, href]) => (
                <LocalizedClientLink
                  key={name}
                  href={href}
                  className="hover:text-ui-fg-base font-urw text-center font-semibold hover:underline text-lg transition-colors duration-200 py-2"
                  data-testid={`nav-${name.toLowerCase()}-link`}
                >
                  {name}
                </LocalizedClientLink>
              ))}
            </div>
          </div>

          {/* Right Side Buttons (Desktop only) */}
          <div className="hidden small:flex items-center gap-x-6 h-full w-full justify-end flex-1">
            <LocalizedClientLink
              className="hover:text-ui-fg-base font-semibold font-urw hover:underline text-lg transition-colors duration-200"
              href="/account"
              data-testid="nav-account-link"
            >
              Account
            </LocalizedClientLink>

            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-ui-fg-base font-semibold font-urw hover:underline flex gap-2 text-sm transition-colors duration-200"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              {/* Cart Button */}
              <CartButton />
            </Suspense>
          </div>

          {/* Mobile Menu */}
          <div className="small:hidden flex items-center">
            <SideMenu categories={categories} regions={regions} />
          </div>
        </nav>
      </header>
    </div>
  )
}
