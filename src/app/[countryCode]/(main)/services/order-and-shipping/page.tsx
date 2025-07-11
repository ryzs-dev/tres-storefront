"use client"

import Image from "next/image"

const TresShipping = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="max-w-2xl mx-auto px-6 pt-16 pb-12 text-center">
        <h1 className="font-urw text-2xl font-bold text-gray-900">
          SHIPPING & ORDERS
        </h1>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 pb-20">
        {/* Processing Time */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            How long does it take to ship out my item after payment?
          </h2>
          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span className="text-gray-700">
                <strong>Order Processing:</strong> Your order will be processed
                within <strong>24 hours</strong> of payment confirmation.
              </span>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span className="text-gray-700">
                <strong>Order Shipment:</strong> Items will be shipped out{" "}
                <strong>within the next 24 hours</strong> after processing.
              </span>
            </div>
          </div>
        </div>

        {/* Delivery Time */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Estimated Delivery Time
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 font-semibold text-gray-900">
                    Delivery Location
                  </th>
                  <th className="text-left py-3 font-semibold text-gray-900">
                    Courier
                  </th>
                  <th className="text-left py-3 font-semibold text-gray-900">
                    Estimated Time
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 text-gray-700">
                    <strong>Malaysia</strong>
                  </td>
                  <td className="py-3 text-gray-700">Ninja Van</td>
                  <td className="py-3 text-gray-700">
                    <strong>1–2 working days</strong>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 text-gray-700">
                    <strong>International</strong>
                  </td>
                  <td className="py-3 text-gray-700">Various</td>
                  <td className="py-3 text-gray-700">
                    <strong>3–8 working days</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Track Order */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Track Your Order
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            You can check your order status by logging into your account:
          </p>
          <div className="space-y-2">
            <p className="text-gray-700">
              1. Click <strong>"Account"</strong> at the top right corner of the
              page.
            </p>
            <p className="text-gray-700">
              2. Select your <strong>Order Number</strong> to view its current
              status.
            </p>
          </div>
        </div>

        {/* Order Amendments */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Can I Amend My Order?
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Due to <strong>security reasons</strong>, we are{" "}
            <strong>unable to make any amendments</strong> once your order has
            been confirmed.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Our warehouse operates swiftly to ensure your parcels are shipped
            out as quickly as possible—often within hours—so changes cannot be
            guaranteed in time.
          </p>
          <p className="text-gray-700 leading-relaxed">
            If you have an <strong>urgent request</strong>, please email us
            immediately at: <br />
            <a
              href="mailto:support@tres.my"
              className="text-blue-600 font-semibold hover:underline"
            >
              support@tres.my
            </a>
          </p>
          <p className="text-gray-600 text-sm mt-2">
            We will <strong>try our best</strong> to assist, but amendments are{" "}
            <strong>not guaranteed</strong>.
          </p>
        </div>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-gray-200">
          <p className="text-gray-600">
            Questions? Contact us at{" "}
            <a
              href="mailto:support@tres.my"
              className="text-blue-600 font-semibold hover:underline"
            >
              support@tres.my
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default TresShipping
