import { retrieveCustomer } from "@lib/data/customer"
import FirstOrderPopup from "@modules/promotion/FirstOrderPopup"
import React from "react"

const Page = async () => {
  const customer = await retrieveCustomer()

  return (
    <div className="p-6">
      <FirstOrderPopup customer={customer} />

      <h1 className="text-xl font-semibold">Medusa Test Page</h1>
      <p>
        This page checks the customer's order history and shows a popup if
        needed.
      </p>
    </div>
  )
}

export default Page
