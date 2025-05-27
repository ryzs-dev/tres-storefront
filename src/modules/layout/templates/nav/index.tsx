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

  const categories = await listCategories().then((categories) => categories)

  const MenuItems = {
    Home: "/",
    Journey: "/journey",
    Categories: "/store",
  }

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-16 mx-auto border-b duration-200 bg-white border-ui-border-base">
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular nav-link">
          <div className="flex items-center h-ful flex-1">
            <LocalizedClientLink
              href="/"
              className=" font-urw text-xl hover:text-ui-fg-base uppercase"
              data-testid="nav-store-link"
            >
              <div className="flex flex-row items-center">
                <Image
                  src={"/images/tres-logo-3.svg"}
                  alt="Tres Triangle Logo"
                  width={75}
                  height={75}
                />
              </div>
            </LocalizedClientLink>
          </div>

          <div className="basis-0 h-full flex justify-center items-center flex-1">
            <div className="h-full flex flex-row">
              {Object.entries(MenuItems).map(([name, href]) => (
                <LocalizedClientLink
                  key={name}
                  href={href}
                  className="hover:text-ui-fg-base hover:underline text-lg h-full flex flex-row items-center px-4"
                  data-testid={`nav-${name.toLowerCase()}-link`}
                >
                  {name}
                </LocalizedClientLink>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            <div className="hidden small:flex items-center gap-x-6 h-full">
              <LocalizedClientLink
                className="hover:text-ui-fg-base hover:underline text-lg"
                href="/account"
                data-testid="nav-account-link"
              >
                Account
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-ui-fg-base hover:underline flex gap-2 text-lg"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
