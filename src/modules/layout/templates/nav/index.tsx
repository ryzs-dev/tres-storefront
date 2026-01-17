import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import { listCategories } from "@lib/data/categories"
import { TresLogo } from "@modules/brand/logo"
import { getCategoryHierarchy } from "@lib/util/category-hiearchy"

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)
  const categories = await listCategories()

  const categoryHierarchy = getCategoryHierarchy(categories)

  return (
    <div className="sticky top-0 inset-x-0 z-40 text-tres-primary">
      <header className="relative bg-tres-secondary border-b border-ui-border-base overflow-visible">
        {/* NAV BAR */}
        <nav className="content-container flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center flex-1">
            <LocalizedClientLink
              href="/"
              className="font-urw text-xl uppercase flex items-center"
            >
              <TresLogo height={75} width={75} color="#99b2dd" />
            </LocalizedClientLink>
          </div>

          {/* Center Nav (Desktop) */}
          <div className="hidden small:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-8">
              <LocalizedClientLink
                href="/"
                className="font-urw text-lg font-semibold hover:underline"
              >
                Home
              </LocalizedClientLink>

              <LocalizedClientLink
                href="/journey"
                className="font-urw text-lg font-semibold hover:underline"
              >
                Journey
              </LocalizedClientLink>

              {/* 👇 SHOP ALL TRIGGER - Now with its own hover group */}
              <div className="relative group/dropdown">
                <span className="font-urw text-lg font-semibold cursor-pointer hover:underline flex items-center gap-1">
                  Shop All
                  <span className="text-xs">▾</span>
                </span>

                {/* 👇 FULL WIDTH SHOP PANEL - Positioned absolutely from this trigger */}
                <div
                  className="
    hidden small:block
    fixed left-0 w-full z-[-15] mt-10
    bg-tres-secondary border-t border-ui-border-base
    opacity-0 invisible
    group-hover/dropdown:opacity-100 group-hover/dropdown:visible
    transition-all duration-300 ease-out
    shadow-lg
  "
                  style={{ top: "4rem" }}
                >
                  <div className="content-container py-10 text-tres-primary mx-auto max-w-4xl">
                    <div className="flex flex-row md:gap-8 gap-12 justify-start items-start">
                      {categoryHierarchy.map((parent) => (
                        <div key={parent.id} className="pr-4">
                          {/* Parent category */}
                          <LocalizedClientLink
                            href={`/categories/${parent.handle}`}
                            className="font-urw text-md font-semibold hover:underline transition-colors"
                          >
                            {parent.name}
                          </LocalizedClientLink>

                          {/* Children categories */}
                          {parent.children.length > 0 && (
                            <ul className="mt-2 space-y-1">
                              {parent.children.map((child: any) => (
                                <li key={child.id}>
                                  <LocalizedClientLink
                                    href={`/categories/${child.handle}`}
                                    className="font-urw text-sm hover:underline transition-colors"
                                  >
                                    {child.name}
                                  </LocalizedClientLink>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Optional bottom CTA */}
                    <div className="mt-10">
                      <LocalizedClientLink
                        href="/bundles"
                        className="font-urw text-sm font-semibold underline"
                      >
                        View All Products
                      </LocalizedClientLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="hidden small:flex items-center gap-x-6 flex-1 justify-end">
            <LocalizedClientLink
              href="/account"
              className="font-urw text-lg font-semibold hover:underline"
            >
              Account
            </LocalizedClientLink>

            <Suspense
              fallback={
                <LocalizedClientLink href="/cart">Cart ()</LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>

          {/* Mobile */}
          <div className="small:hidden">
            <SideMenu categories={categories} regions={regions} />
          </div>
        </nav>
      </header>
    </div>
  )
}
