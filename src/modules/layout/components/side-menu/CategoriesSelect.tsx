"use client"

import { useState } from "react"
import { StateType } from "@lib/hooks/use-toggle-state"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Transition } from "@headlessui/react"
import { ArrowRightMini } from "@medusajs/icons"

type CategoriesSelectProps = {
  toggleState: StateType
  categories?: HttpTypes.StoreProductCategory[]
  closePopover: () => void
}

const CategoriesSelect = ({
  toggleState,
  categories = [],
  closePopover,
}: CategoriesSelectProps) => {
  const { state, close } = toggleState
  const [openParentId, setOpenParentId] = useState<string | null>(null)

  if (!state || categories.length === 0) {
    return null
  }

  // Build hierarchy
  const parents = categories.filter((c) => !c.parent_category_id)
  const childrenMap = categories.reduce<
    Record<string, HttpTypes.StoreProductCategory[]>
  >((acc, c) => {
    if (c.parent_category_id) {
      acc[c.parent_category_id] ||= []
      acc[c.parent_category_id].push(c)
    }
    return acc
  }, {})

  return (
    <ul className="mt-3 space-y-3" data-testid="category-menu">
      {parents.map((parent) => {
        const isOpen = openParentId === parent.id
        const children = childrenMap[parent.id] || []

        return (
          <li key={parent.id}>
            {/* Parent */}
            <button
              type="button"
              className="w-full flex items-center justify-between text-sm font-medium text-left"
              onClick={() => setOpenParentId(isOpen ? null : parent.id)}
            >
              <span>{parent.name}</span>
              {children.length > 0 && (
                <ArrowRightMini
                  className={clx(
                    "transition-transform duration-200",
                    isOpen ? "rotate-90" : ""
                  )}
                />
              )}
            </button>

            {/* Children (sliding) */}
            <Transition
              show={isOpen}
              enter="transition-all duration-300 ease-out"
              enterFrom="max-h-0 opacity-0 translate-x-2"
              enterTo="max-h-[300px] opacity-100 translate-x-0"
              leave="transition-all duration-200 ease-in"
              leaveFrom="max-h-[300px] opacity-100 translate-x-0"
              leaveTo="max-h-0 opacity-0 translate-x-2"
            >
              <ul className="overflow-hidden ml-4 mt-2 space-y-2">
                {children.map((child) => (
                  <li key={child.id}>
                    <LocalizedClientLink
                      href={`/categories/${child.handle}`}
                      className="text-sm text-ui-fg-muted hover:text-ui-fg-base"
                      onClick={() => {
                        close()
                        closePopover()
                      }}
                    >
                      {child.name}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </Transition>
          </li>
        )
      })}
    </ul>
  )
}

export default CategoriesSelect
