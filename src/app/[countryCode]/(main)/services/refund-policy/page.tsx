"use client"

import Image from "next/image"

const TresRefund = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="max-w-3xl mx-auto px-6 pt-16 pb-12 text-center">
        <h1 className="font-urw text-2xl font-bold text-gray-900">
          REFUND POLICY
        </h1>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 pb-20">
        {/* How Do I Organise a Return? */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            How Do I Organise a Return?
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>To initiate a return, please follow the steps below:</p>
            <p>
              <strong>Contact Us First:</strong> Email us at{" "}
              <a
                href="mailto:admin@tres.my"
                className="text-blue-600 font-semibold hover:underline"
              >
                admin@tres.my
              </a>{" "}
              using the same email address used to place your order before
              returning any items.
            </p>
            <p>
              <strong>Submit Proof of Issue:</strong> If your item is defective
              or incorrect, please send clear photos of the issue to{" "}
              <a
                href="mailto:admin@tres.my"
                className="text-blue-600 font-semibold hover:underline"
              >
                admin@tres.my
              </a>
              . Photos must be submitted within 2 days of receiving the item(s).
            </p>
            <p>
              <strong>Exchange or Refund:</strong> Once your request is reviewed
              and approved, we will offer an exchange or refund based on the
              issue.
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 mt-2">
              <li>
                We do not refund original shipping fees, except for faulty or
                damaged items.
              </li>
              <li>
                Return postage costs are the responsibility of the customer.
              </li>
              <li>
                Refunds are processed once the returned item(s) have been
                received at our warehouse.
              </li>
              <li>
                Refunds cover the item price only (excluding original shipping
                costs).
              </li>
              <li>
                TRES is not liable for lost returns. We strongly recommend using
                a registered postal service and keeping a tracking number.
              </li>
            </ul>
          </div>
        </div>

        {/* Return Window */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Return</h2>
          <p className="text-gray-900 font-semibold mb-4">
            ALL RETURNS MUST BE SENT BACK WITHIN:
          </p>
          <div className="space-y-2">
            <div className="flex gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span className="text-gray-700">
                <strong>5 working days</strong> (for orders within{" "}
                <strong>Malaysia</strong>)
              </span>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span className="text-gray-700">
                <strong>10 working days</strong> (for orders{" "}
                <strong>outside Malaysia</strong>)
              </span>
            </div>
          </div>
          <p className="text-gray-600 text-sm mt-3">
            ...from the <strong>date of receiving your purchase.</strong>
          </p>
        </div>

        {/* Eligible Items */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Eligible Items for Return
          </h2>
          <p className="text-gray-700 mb-4">
            TRES accepts returns for <strong>all items</strong>{" "}
            <strong>except</strong>:
          </p>
          <div className="space-y-2">
            <div className="flex gap-3">
              <span className="text-red-600 font-bold">✗</span>
              <span className="text-gray-700">
                Best Buy / SALE / Discounted items{" "}
                <em>
                  (e.g., Mother's Day codes, Citibank codes, other special
                  codes)
                </em>
              </span>
            </div>
            <div className="flex gap-3">
              <span className="text-red-600 font-bold">✗</span>
              <span className="text-gray-700">Accessories</span>
            </div>
            <div className="flex gap-3">
              <span className="text-red-600 font-bold">✗</span>
              <span className="text-gray-700">
                Specifically stated <strong>non-returnable items</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Return Requirements */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Return Requirements
          </h2>
          <p className="text-gray-700 mb-4">
            Returned items <strong>must be in original condition</strong>:
          </p>
          <div className="space-y-2">
            <div className="flex gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-gray-700">Tag intact</span>
            </div>
            <div className="flex gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-gray-700">Unworn</span>
            </div>
            <div className="flex gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-gray-700">Unwashed</span>
            </div>
            <div className="flex gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-gray-700">Unaltered</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-gray-700">
              <strong>Do not soak items.</strong> If color runs due to soaking,
              the item is <strong>strictly non-returnable.</strong>
            </p>
          </div>
        </div>

        {/* Return Processing */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Return Processing
          </h2>
          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span className="text-gray-700">
                Once your return is received, our{" "}
                <strong>Return Department</strong> will process it within{" "}
                <strong>2–3 working days.</strong>
              </span>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span className="text-gray-700">
                Refunds will be processed back to the original payment method
                used during checkout.
              </span>
            </div>
          </div>
        </div>

        {/* Exchange Policy */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Exchange Policy
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>We offer exchanges for the following reasons:</p>
            <ul className="list-disc list-inside ml-4">
              <li>Incorrect sizing</li>
              <li>Incorrect item received</li>
              <li>Faulty, damaged, or expired item received</li>
            </ul>

            <p className="font-semibold">⏱ Exchange Timeframe</p>
            <p>
              All exchange requests must be made within <strong>7 days</strong>{" "}
              of receiving your order.
            </p>
            <p className="text-gray-600 italic">
              ⚠️ Note: We do not offer exchanges for international orders
              (outside of Malaysia).
            </p>

            <p className="font-semibold">✅ Exchange Requirements</p>
            <ul className="list-disc list-inside ml-4">
              <li>Be a full-priced item</li>
              <li>
                Be in original condition – unworn, unwashed, and with tags
                intact
              </li>
              <li>Be returned with proof of purchase</li>
            </ul>

            <p className="font-semibold">🚫 Items Not Eligible for Exchange</p>
            <ul className="list-disc list-inside ml-4">
              <li>Sale items</li>
              <li>Intimate items (e.g. underwear, stick-on bras)</li>
              <li>Gifts</li>
              <li>
                Any return that does not meet these requirements will
                unfortunately be declined.
              </li>
            </ul>

            <p className="font-semibold">💳 Refunds & Shipping</p>
            <ul className="list-disc list-inside ml-4">
              <li>
                Refunds will be processed back to the original payment method
                used during checkout.
              </li>
              <li>Shipping fees (original and return) are non-refundable.</li>
              <li>Customers are responsible for all return postage costs.</li>
            </ul>
          </div>
        </div>

        {/* ... keep all the rest of your existing sections (Declined Returns, Shipping Responsibility, Additional Terms, etc.) ... */}

        {/* Return Address */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Return Address
          </h2>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700 font-medium">TRES Return Department</p>
            <p className="text-gray-700">
              Tres Exclusive Empire, 24 Lorong Batu, Jelutong Barat, Jelutong
              Penang 11600, Malaysia
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-gray-200">
          <p className="text-gray-600">
            Questions about returns? Contact us at{" "}
            <a
              href="mailto:support@tres.my"
              className="text-blue-600 font-semibold hover:underline"
            >
              admin@tres.my
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default TresRefund
