"use client"

import { FlexibleBundle } from "@lib/data/bundles"
import { Text } from "@medusajs/ui"
import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"
import Accordion from "@modules/products/components/product-tabs/accordion"

type BundleInfoProps = {
  bundle: FlexibleBundle
}

const BundleInfo = ({ bundle }: BundleInfoProps) => {
  const tabs = [
    {
      label: "Description",
      component: <DescriptionTab bundle={bundle} />,
    },
  ]

  return (
    <div id="bundle-info">
      <div className="flex flex-col gap-y-4 lg:max-w-[500px] mx-auto">
        {/* Bundle Title */}
        <h1 className="text-3xl font-semibold">{bundle.title}</h1>

        <div>
          <Text className="text-ui-fg-subtle text-base font-bold">
            Why You’ll Love It
          </Text>
          <ul className="list-disc list-inside text-ui-fg-subtle text-sm space-y-4 mt-4">
            {bundle.description?.split("/n").map((line, index) => (
              <div key={index}>✔️ {line.trim()}</div>
            ))}
          </ul>
        </div>

        {/* Bundle Subtitle / Description */}
        {/* <div className="w-full">
          <Accordion type="multiple">
            {tabs.map((tab, i) => (
              <Accordion.Item
                key={i}
                title={tab.label}
                headingSize="medium"
                value={tab.label}
              >
                {tab.component}
              </Accordion.Item>
            ))}
          </Accordion>
        </div> */}
        <DescriptionTab bundle={bundle} />
      </div>
    </div>
  )
}

const DescriptionTab = ({ bundle }: BundleInfoProps) => {
  return (
    <div className="text-small-regular py-8">
      <Accordion type="multiple">
        {bundle.items.map((item, index) => (
          <Accordion.Item
            key={index}
            title={item.product.title || `Product ${index + 1}`}
            headingSize="small"
            value={`description-${index}`}
            className="space-y-4"
          >
            <ul className="list-disc list-inside text-sm font-urw font-medium text-ui-fg-subtle space-y-1">
              {(item.product.description || "")
                .replace(/[\u2028\u2029]/g, " ") // Handle invisible Unicode line breaks
                .replace(/\n/g, " ") // Handle soft line breaks
                .split(/-\s+/) // Split by dash bullets like "- "
                .map((line) => line.trim())
                .filter((line) => line.length > 0)
                .map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
            </ul>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const ShippingInfoTab = () => {
  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-1 gap-y-8">
        <div className="flex items-start gap-x-2">
          <FastDelivery />
          <div>
            <span className="font-semibold">Fast delivery</span>
            <p className="max-w-sm">
              Your package will arrive in 3-5 business days at your pick up
              location or in the comfort of your home.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Refresh />
          <div>
            <span className="font-semibold">Simple exchanges</span>
            <p className="max-w-sm">
              Is the fit not quite right? No worries - we'll exchange your
              product for a new one.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Back />
          <div>
            <span className="font-semibold">Easy returns</span>
            <p className="max-w-sm">
              Just return your product and we'll refund your money. No questions
              asked – we'll do our best to make sure your return is hassle-free.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BundleInfo
