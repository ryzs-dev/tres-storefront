import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Heading, Table, Badge } from "@medusajs/ui"
import { convertToLocale } from "@lib/util/money"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items

  // Calculate bundle savings - ADDED
  const bundleItems =
    items?.filter((item) => item.metadata?.is_from_bundle === true) || []

  const totalBundleSavings = bundleItems.reduce((total, item) => {
    const originalPriceCents = item.metadata?.original_price_cents as number
    const discountedPriceCents = item.metadata?.discounted_price_cents as number

    if (originalPriceCents && discountedPriceCents) {
      const itemSavings =
        ((originalPriceCents - discountedPriceCents) / 100) * item.quantity
      return total + itemSavings
    }
    return total
  }, 0)

  return (
    <div>
      <div className="pb-3 flex items-center justify-between">
        <Heading className="text-[2rem] leading-[2.75rem]">Cart</Heading>
      </div>

      <Table>
        <Table.Header className="border-t-0">
          <Table.Row className="text-ui-fg-subtle txt-medium-plus">
            <Table.HeaderCell className="!pl-0">Item</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>Quantity</Table.HeaderCell>
            <Table.HeaderCell className="hidden small:table-cell">
              Price
            </Table.HeaderCell>
            <Table.HeaderCell className="!pr-0 text-right">
              Total
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items
            ? items
                .sort((a, b) => {
                  return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                })
                .map((item) => {
                  return (
                    <Item
                      key={item.id}
                      item={item}
                      currencyCode={cart?.currency_code}
                    />
                  )
                })
            : repeat(5).map((i) => {
                return <SkeletonLineItem key={i} />
              })}
        </Table.Body>
      </Table>
    </div>
  )
}

export default ItemsTemplate
