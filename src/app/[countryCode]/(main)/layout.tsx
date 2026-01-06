import { Metadata } from "next"

import { listCartOptions, retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getBaseURL } from "@lib/util/env"
import { StoreCartShippingOption } from "@medusajs/types"
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner"
import Footer from "@modules/layout/templates/footer/Footer"
import FirstOrderPopup from "@modules/promotion/FirstOrderPopup"

import Nav from "@modules/layout/templates/nav"
import PromoBanner from "@modules/layout/components/promo-banner/PromoBanner"
import ChristmasPopup from "@modules/promotion/ChritmasPopup"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  const customer = await retrieveCustomer()
  const cart = await retrieveCart()
  let shippingOptions: StoreCartShippingOption[] = []

  if (cart) {
    const { shipping_options } = await listCartOptions()

    shippingOptions = shipping_options
  }

  return (
    <>
      {/* First Order Popup - appears on top of everything */}
      {!customer && <FirstOrderPopup customer={customer} />}
      {/* <ChristmasPopup customer={customer} /> */}

      <PromoBanner />
      <Nav />
      {customer && cart && (
        <CartMismatchBanner customer={customer} cart={cart} />
      )}

      {props.children}
      <Footer />
    </>
  )
}
