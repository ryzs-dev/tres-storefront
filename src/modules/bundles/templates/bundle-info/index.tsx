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
  const hasValidDescriptions = bundle.items.some(
    (item) =>
      item.product.description && item.product.description.trim().length > 0
  )

  const tabs = [
    ...(hasValidDescriptions
      ? [
          {
            label: "Description",
            component: <DescriptionTab bundle={bundle} />,
          },
        ]
      : []),
    {
      label: "Sizing Guide",
      component: <SizingGuideTab bundle={bundle} />,
    },
  ]

  return (
    <div id="bundle-info">
      <div className="flex flex-col gap-y-4 lg:max-w-[500px] mx-auto">
        <h1 className="text-3xl font-semibold">{bundle.title}</h1>

        {bundle.description && (
          <div>
            <Text className="text-ui-fg-subtle text-base font-bold">
              Why You’ll Love It
            </Text>
            <ul className="list-disc list-inside text-ui-fg-subtle text-sm space-y-4 mt-4">
              {bundle.description.split("/n").map((line, index) => (
                <div key={index}>✔️ {line.trim()}</div>
              ))}
            </ul>
          </div>
        )}

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

type DescriptionTabProps = {
  bundle: {
    items: {
      product: {
        title: string
        description?: string
      }
    }[]
  }
}

const DescriptionTab = ({ bundle }: DescriptionTabProps) => {
  const normalizeLineBreaks = (text: string) =>
    text
      .replace(/\u2028|\u2029/g, "\n")
      .replace(/\\n|\/n/g, "\n")
      .replace(/\r/g, "\n")
      .replace(/\n+/g, "\n")
      .trim()

  const parseDescription = (description: string) => {
    const sections: { title?: string; bullets: string[]; rawText?: string }[] =
      []
    description = normalizeLineBreaks(description)

    const hasStructuredSections = /\*(.*?)\:\*/.test(description)
    const hasBullets = /-\s+/.test(description)

    if (hasStructuredSections) {
      const sectionSplit = description.split(/\*(.*?)\:\*/g)

      for (let i = 1; i < sectionSplit.length; i += 2) {
        const title = sectionSplit[i].trim()
        const content = sectionSplit[i + 1] || ""

        const bullets = content
          .split(/-\s+/)
          .map((b) => b.trim())
          .filter((b) => b.length > 0)

        sections.push({ title, bullets })
      }
    } else if (hasBullets) {
      const bullets = description
        .split(/-\s+/)
        .map((b) => b.trim())
        .filter((b) => b.length > 0)

      if (bullets.length > 0) {
        sections.push({ bullets })
      }
    } else {
      const cleaned = description.trim()
      if (cleaned.length > 0) {
        sections.push({ rawText: cleaned, bullets: [] })
      }
    }

    return sections
  }

  const items = bundle.items.filter(
    (item) => item.product.description?.trim().length
  )

  const showTitle = items.length > 1

  return (
    <div className="space-y-8">
      {items.map((item, idx) => {
        const { title, description } = item.product
        const sections = parseDescription(description || "")
        if (sections.length === 0) return null

        return (
          <div key={idx}>
            {showTitle && (
              <p className="font-semibold text-base mb-1">{title}</p>
            )}
            <div className="space-y-4">
              {sections.map((section, i) => (
                <div key={i}>
                  {section.title && (
                    <p className="font-semibold text-base mb-1">
                      {section.title}
                    </p>
                  )}
                  {section.bullets.length > 0 ? (
                    <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                      {section.bullets.map((b, idx) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {section.rawText}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

const SizingGuideTab = ({ bundle }: any) => {
  const fitTip = bundle.title === "Raven"

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
        {fitTip && (
          <p className="pb-4"> Fit Tip: We recommend sizing up for leggings.</p>
        )}
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
