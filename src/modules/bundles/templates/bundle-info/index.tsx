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
    {
      label: "Sizing Guide",
      component: <SizingGuideTab />,
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
        <div className="w-full">
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
        </div>
      </div>
    </div>
  )
}

const DescriptionTab = ({ bundle }: BundleInfoProps) => {
  const parseDescription = (description: string) => {
    const sections: { title?: string; bullets: string[] }[] = []

    const hasStructuredSections = /\*(.*?)\:\*/.test(description)

    if (hasStructuredSections) {
      const sectionSplit = description.split(/\*(.*?)\:\*/g)

      for (let i = 1; i < sectionSplit.length; i += 2) {
        const title = sectionSplit[i].trim()
        const content = sectionSplit[i + 1] || ""

        const bullets = content
          .split(/-\s+/)
          .flatMap((b) => b.split("/n"))
          .map((b) => b.replace(/\n/g, " ").trim())
          .filter((b) => b.length > 0)

        sections.push({ title, bullets })
      }
    } else {
      const bullets = description
        .split(/-\s+/)
        .flatMap((b) => b.split("/n"))
        .map((b) => b.replace(/\n/g, " ").trim())
        .filter((b) => b.length > 0)

      if (bullets.length > 0) {
        sections.push({ bullets })
      }
    }

    return sections
  }

  const renderWithLineBreaks = (text: string) => {
    return text.split("/n").map((part, index, arr) => (
      <span key={index}>
        {part}
        {index < arr.length - 1 && <br />}
      </span>
    ))
  }

  return (
    <div className="text-small-regular py-8">
      <Accordion type="multiple">
        {bundle.items.map((item, index) => {
          const description = item.product.description || ""
          const parsedSections = parseDescription(description)

          return (
            <Accordion.Item
              key={index}
              title={item.product.title || `Product ${index + 1}`}
              headingSize="medium"
              value={`description-${index}`}
              className="space-y-4"
            >
              {parsedSections.length > 0 ? (
                parsedSections.map((section, sIdx) => (
                  <div key={sIdx} className="space-y-2 mb-5">
                    {section.title && (
                      <h3 className="font-semibold text-base">
                        {section.title}
                      </h3>
                    )}
                    <ul className="list-disc list-inside text-sm font-urw font-medium text-ui-fg-subtle space-y-1">
                      {section.bullets.map((bullet, bIdx) =>
                        bullet.toLowerCase() === "/n" ? (
                          <li key={bIdx} className="list-none h-4" />
                        ) : (
                          <li key={bIdx}>{renderWithLineBreaks(bullet)}</li>
                        )
                      )}
                    </ul>
                  </div>
                ))
              ) : (
                <p className="text-sm text-ui-fg-muted">
                  No description provided.
                </p>
              )}
            </Accordion.Item>
          )
        })}
      </Accordion>
    </div>
  )
}

const SizingGuideTab = () => {
  const sizingData = [
    { size: "S", chest: "34 in", waist: "26 in", hips: "36 in" },
    { size: "M", chest: "36 in", waist: "28 in", hips: "38 in" },
    { size: "L", chest: "38 in", waist: "30 in", hips: "40 in" },
    { size: "XL", chest: "40 in", waist: "32 in", hips: "42 in" },
  ]

  return (
    <div className="py-8">
      <h3 className="text-lg font-semibold mb-4">Sizing Guide</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm border border-gray-200">
          <thead className="bg-gray-100 text-gray-700 font-medium">
            <tr>
              <th className="px-4 py-2 border">Size</th>
              <th className="px-4 py-2 border">Chest</th>
              <th className="px-4 py-2 border">Waist</th>
              <th className="px-4 py-2 border">Hips</th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {sizingData.map((row, index) => (
              <tr key={index} className="even:bg-gray-50">
                <td className="px-4 py-2 border">{row.size}</td>
                <td className="px-4 py-2 border">{row.chest}</td>
                <td className="px-4 py-2 border">{row.waist}</td>
                <td className="px-4 py-2 border">{row.hips}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
