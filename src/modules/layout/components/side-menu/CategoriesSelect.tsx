import { StateType } from "@lib/hooks/use-toggle-state"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import React from "react"

type CategoriesSelectProps = {
  toggleState: StateType
  categories?: HttpTypes.StoreProductCategory[]
  closePopover: () => void // Receive Popover close function
}

const CategoriesSelect = ({
  toggleState,
  categories = [],
  closePopover, // Receive Popover close function
}: CategoriesSelectProps) => {
  const { state, close } = toggleState

  return (
    <div>
      {state && categories.length > 0 && (
        <ul className="p-2 mt-2" data-testid="test-menu">
          {categories.slice(0, 4).map((c) => {
            if (c.parent_category) {
              return null
            }
            return (
              <li
                key={c.id}
                className="text-ui-fg-on-color py-2 txt-small hover:text-ui-fg-disabled"
              >
                <LocalizedClientLink
                  className={clx("hover:text-ui-fg-disabled")}
                  href={`/categories/${c.handle}`}
                  data-testid="category-link"
                  onClick={() => {
                    close()
                    closePopover()
                  }}
                >
                  {c.name}
                </LocalizedClientLink>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default CategoriesSelect
