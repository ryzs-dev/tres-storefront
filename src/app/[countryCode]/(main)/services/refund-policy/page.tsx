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
        {/* Return Window */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Return Window
          </h2>
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

        {/* One-Time Return Policy */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            One-Time Return Policy
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Returns are allowed <strong>only once per order number</strong>.
            Orders made using <strong>return credit</strong>{" "}
            <strong>cannot</strong> be returned again.
          </p>
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

        {/* Required Documents */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Required Documents
          </h2>
          <p className="text-gray-700 leading-relaxed">
            <strong>Invoice Slip must be included</strong> in the return
            package. If lost, you may <strong>reprint</strong> it under your
            Account.
          </p>
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
                A <strong>credit voucher</strong> will be emailed to you once
                the return is approved.
              </span>
            </div>
          </div>
        </div>

        {/* Declined Returns */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Declined Returns
          </h2>
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-gray-700">
              Returns that <strong>do not meet</strong> all the above conditions
              will be <strong>strictly declined and forfeited</strong>.
            </p>
          </div>
        </div>

        {/* Shipping Responsibility */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Shipping Responsibility
          </h2>
          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span className="text-gray-700">
                The item is your responsibility until it reaches us.
              </span>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span className="text-gray-700">
                For your protection, we recommend using a delivery service that{" "}
                <strong>insures the value of the goods</strong>.
              </span>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span className="text-gray-700">
                Keep the <strong>tracking code</strong> for reference.
              </span>
            </div>
          </div>
        </div>

        {/* Points & Vouchers */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Points & Vouchers
          </h2>
          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span className="text-gray-700">
                Any{" "}
                <strong>used/credited reward points or discount codes</strong>{" "}
                from the returned order will be <strong>voided</strong> and{" "}
                <strong>non-refundable/reusable</strong>.
              </span>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span className="text-gray-700">
                <strong>No additional points</strong> will be awarded for points
                spent on returned orders.
              </span>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span className="text-gray-700">
                <strong>Vouchers/Gift Cards</strong> are valid for{" "}
                <strong>1 year</strong> by default.
              </span>
            </div>
          </div>
        </div>

        {/* Additional Terms */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Additional Terms
          </h2>
          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span className="text-gray-700">
                TRES <strong>reserves the right</strong> to{" "}
                <strong>reject any request</strong> to mail return items{" "}
                <strong>alongside a new order</strong>.
              </span>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span className="text-gray-700">
                <strong>
                  All returns are final. Further requests will be denied.
                </strong>
              </span>
            </div>
          </div>
        </div>

        {/* Product Disclaimer */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Product Disclaimer
          </h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <div>
                <strong>Color Variation</strong>: Product color may vary due to{" "}
                <strong>studio lighting</strong>. Allow up to{" "}
                <strong>20% color difference</strong>.{" "}
                <em>Exchanges due to this reason will incur a </em>
                <strong>
                  <em>processing fee</em>
                </strong>
                <em>.</em>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <div>
                <strong>Measurement Difference</strong>: Allow a{" "}
                <strong>1–2cm difference</strong> in measurements due to fabric
                stretch.{" "}
                <em>
                  Please compare with your existing clothes for best fit or
                  email us your measurements.
                </em>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <div>
                <strong>Printed Items</strong>: Each printed item may vary in{" "}
                <strong>print symmetry, alignment, or slight patches</strong>.{" "}
                <em>Returns due to this reason are </em>
                <strong>
                  <em>not considered defects</em>
                </strong>
                <em>.</em>
              </div>
            </div>
          </div>
        </div>

        {/* Refund Policy Table */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Full Refund & Return Policy Table
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 border-b border-gray-200">
                    Category
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 border-b border-gray-200">
                    Reason (i): Unsatisfactory Items
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 border-b border-gray-200">
                    Reason (ii): Defective Items
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-700 font-medium">
                    Examples / Descriptions
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    - Item does not fit
                    <br />
                    - Do not like the item
                    <br />
                    - Quality not up to expectation
                    <br />- And all reasons listed under (iii) below
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    - Item torn
                    <br />- Item big stained
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-700 font-medium">
                    Return Shipping Costs
                  </td>
                  <td className="py-3 px-4 text-gray-700">Borne by Buyer</td>
                  <td className="py-3 px-4 text-gray-700">
                    Reimbursed by TRES in terms of <strong>credit note</strong>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-700 font-medium">
                    Exchange Shipping Costs
                  </td>
                  <td className="py-3 px-4 text-gray-700">Borne by Buyer</td>
                  <td className="py-3 px-4 text-gray-700">Borne by TRES</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-700 font-medium">
                    Initial Shipping Costs (processing fees)
                  </td>
                  <td className="py-3 px-4 text-gray-700">Borne by Buyer</td>
                  <td className="py-3 px-4 text-gray-700">Borne by TRES</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-700 font-medium">
                    Buyer Receives
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    Return <strong>Credit Note</strong> (
                    <strong>NO CASH REFUND</strong>) = Item price minus Initial
                    Shipping Costs and Processing Fee
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    TRES will send a <strong>brand new exact piece</strong> to
                    the buyer once the defective item is received
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-700 font-medium">
                    Store Credit Validity
                  </td>
                  <td className="py-3 px-4 text-gray-700">300 days</td>
                  <td className="py-3 px-4 text-gray-700">Not applicable</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-700 font-medium">
                    Processing Fee
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    RM5 (West Malaysia) / RM9 (Sabah & Sarawak){" "}
                    <strong>per item</strong>
                  </td>
                  <td className="py-3 px-4 text-gray-700">Not applicable</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Not Considered Defects */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            (iii) Not Considered Defects
          </h2>
          <p className="text-gray-700 mb-4">
            The following are <strong>NOT</strong> considered defects and
            returns will not be accepted:
          </p>
          <div className="space-y-2">
            <p className="text-gray-700">
              a) Color variation from product photos (e.g., fuchsia vs red).
            </p>
            <p className="text-gray-700">
              b) Slight design variation from product photos (e.g., print
              patterns and arrangements, lace arrangements, etc).
            </p>
            <p className="text-gray-700">
              c) Slight size variation within ±3cm on measurements.
            </p>
            <p className="text-gray-700">
              d) Minor imperfections, e.g., loose threads, crease marks, etc.
            </p>
            <p className="text-gray-700">
              e) Self-inflicted damage or cut to the product.
            </p>
            <p className="text-gray-700">
              f) Customer's subjective opinions on product quality and
              preference (e.g., inner lining torn, inner ribbon loop torn, etc).
            </p>
          </div>
          <p className="text-gray-600 text-sm mt-3 italic">
            *Proof of defect must be verified by TRES Return team to be
            eligible.*
          </p>
        </div>

        {/* Return Address */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Return Address
          </h2>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700 font-medium">TRES Return Department</p>
            <p className="text-gray-700">JELUTONG</p>
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
              support@tres.my
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default TresRefund
