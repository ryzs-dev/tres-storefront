"use client"

import Image from "next/image"

const TresSizing = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="max-w-3xl mx-auto px-6 pt-16 pb-12 text-center">
        <h1 className="font-urw text-2xl font-bold text-gray-900">
          SIZE & FIT GUIDANCE
        </h1>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          A comprehensive sizing guide interface designed for the Tres platform.
          This page showcases intuitive user experience design and clear
          information hierarchy - demonstrating modern e-commerce solutions
          developed for <strong>TRES</strong>.
        </p>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 pb-20">
        {/* Introduction */}
        <div className="mb-16">
          <p className="text-gray-700 leading-relaxed mb-4">
            At TRES, we're committed to helping you find the{" "}
            <strong>perfect fit</strong> every time. While each product includes
            a detailed size guide tailored to its design and fabric, we've also
            provided a general sizing chart for your reference.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            For the most accurate fit, we recommend checking the
            product-specific size guide on each item page before making your
            selection. For the best fit, please allow{" "}
            <strong>2–3cm of extra room</strong> in your measurements to ensure
            ease of movement and comfort.
          </p>
          <p className="text-gray-700 leading-relaxed">
            If you're unsure about your size or need further assistance, our
            team is here to help! Reach out to us at{" "}
            <a
              href="mailto:admin@tres.my"
              className="text-blue-600 font-semibold hover:underline"
            >
              admin@tres.my
            </a>{" "}
            and we'll be happy to guide you through the process.
          </p>
        </div>

        {/* How to Measure */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            How to Measure
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            To get the most accurate sizing, use a soft measuring tape and
            follow these simple steps:
          </p>

          <div className="space-y-6">
            {/* Bust */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Bust</h3>
              <p className="text-gray-700 mb-2">
                Measure around the <strong>fullest part of your chest</strong>,
                keeping the tape <strong>level across your back</strong> and{" "}
                <strong>under your arms</strong>.
              </p>
              <p className="text-blue-600 text-sm">
                <strong>Tip:</strong> Wear a non-padded bra or no bra for best
                accuracy.
              </p>
            </div>

            {/* Waist */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Waist</h3>
              <p className="text-gray-700 mb-2">
                Find your <strong>natural waistline</strong>—this is usually the{" "}
                <strong>narrowest part of your torso</strong>, just above your
                belly button.
              </p>
              <p className="text-blue-600 text-sm">
                <strong>Tip:</strong> Stand relaxed and don't suck in your
                stomach for the truest measurement.
              </p>
            </div>

            {/* Hips */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Hips</h3>
              <p className="text-gray-700 mb-2">
                Stand with your feet together and measure around the{" "}
                <strong>widest part of your hips and buttocks</strong>.
              </p>
              <p className="text-blue-600 text-sm">
                <strong>Tip:</strong> Ensure the tape sits flat and level all
                the way around.
              </p>
            </div>
          </div>
        </div>

        {/* Size Chart */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Standard Size Chart
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200">
              <thead>
                <tr className="bg-yellow-100">
                  <th
                    className="text-center py-3 px-4 font-semibold text-gray-900 border-b border-gray-200"
                    colSpan={5}
                  >
                    Size reference
                  </th>
                </tr>
                <tr className="bg-yellow-200">
                  <th
                    className="text-center py-3 px-4 font-semibold text-gray-900 border-b border-gray-200"
                    colSpan={5}
                  >
                    Bras and tops
                  </th>
                </tr>
                <tr className="bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 border-b border-gray-200">
                    Size
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 border-b border-gray-200">
                    US
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 border-b border-gray-200">
                    Bra Size
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 border-b border-gray-200">
                    Bust (Inches)
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 border-b border-gray-200">
                    Underbust (Inches)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-700 font-medium">XXS</td>
                  <td className="py-3 px-4 text-gray-700">0</td>
                  <td className="py-3 px-4 text-gray-700">30A</td>
                  <td className="py-3 px-4 text-gray-700">28" - 30"</td>
                  <td className="py-3 px-4 text-gray-700">23" - 24"</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-700 font-medium">XS</td>
                  <td className="py-3 px-4 text-gray-700">2</td>
                  <td className="py-3 px-4 text-gray-700">
                    30B, 30C, 32A, 32B
                  </td>
                  <td className="py-3 px-4 text-gray-700">30" - 32"</td>
                  <td className="py-3 px-4 text-gray-700">25" - 26"</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-700 font-medium">S</td>
                  <td className="py-3 px-4 text-gray-700">4</td>
                  <td className="py-3 px-4 text-gray-700">
                    30D, 32C, 34A, 34B
                  </td>
                  <td className="py-3 px-4 text-gray-700">32" - 34"</td>
                  <td className="py-3 px-4 text-gray-700">27" - 28"</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-700 font-medium">M</td>
                  <td className="py-3 px-4 text-gray-700">6</td>
                  <td className="py-3 px-4 text-gray-700">32D, 34C, 36B</td>
                  <td className="py-3 px-4 text-gray-700">34" - 36"</td>
                  <td className="py-3 px-4 text-gray-700">29" - 30"</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-700 font-medium">L</td>
                  <td className="py-3 px-4 text-gray-700">8</td>
                  <td className="py-3 px-4 text-gray-700">
                    34D, 34DD, 36C, 36D, 38B, 38C
                  </td>
                  <td className="py-3 px-4 text-gray-700">36" - 38"</td>
                  <td className="py-3 px-4 text-gray-700">31" - 32"</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-700 font-medium">XL</td>
                  <td className="py-3 px-4 text-gray-700">10</td>
                  <td className="py-3 px-4 text-gray-700">36DD, 38D, 38DD</td>
                  <td className="py-3 px-4 text-gray-700">38" - 40"</td>
                  <td className="py-3 px-4 text-gray-700">33" - 34"</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Measurement Visual Guide */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Measurement Points Reference
          </h2>
          <div className="text-center">
            <div className="inline-block p-4 bg-gray-50 rounded-lg">
              {/* <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center"> */}
              {/* <div className="text-center text-gray-500 ">
                  <p className="text-sm">Model showing measurement points:</p>
                  <p className="text-xs mt-2">• Bust</p>
                  <p className="text-xs">• Waist</p>
                  <p className="text-xs">• Hip</p>
                </div> */}
              <Image
                src="https://storage.tres.my/size-guide.png"
                alt="Measurement Guide"
                width={400}
                height={200}
                className="rounded-lg shadow-md mx-auto"
                priority
              />
              {/* </div> */}
            </div>
          </div>
        </div>

        {/* Additional Tips */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Sizing Tips
          </h2>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="space-y-2">
              <div className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span className="text-gray-700">
                  Always refer to the product-specific size guide for the most
                  accurate fit
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span className="text-gray-700">
                  When in doubt, size up for comfort, especially with fitted
                  items
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span className="text-gray-700">
                  Consider the fabric type - stretchy materials may fit
                  differently than non-stretch
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span className="text-gray-700">
                  Take measurements over the undergarments you plan to wear with
                  the item
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-gray-200">
          <p className="text-gray-600">
            Need help with sizing? Contact us at{" "}
            <a
              href="mailto:admin@tres.my"
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

export default TresSizing
