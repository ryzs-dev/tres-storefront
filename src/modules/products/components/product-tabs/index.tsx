"use client"

import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const tabs = [
    // {
    //   label: "Product Information",
    //   component: <ProductInfoTab product={product} />,
    // },
    {
      label: "Description",
      component: <ProductInfoTab product={product} />,
    },
    {
      label: "Sizing Guide",
      component: <SizingGuideTab />,
    },
  ]

  return (
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
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  // Check if description contains set formatting (e.g., *ProductName:* or Product Name:)
  const isSet =
    /\*?\s*✓?([^:*]+):\s*$/m.test(product.description || "") ||
    /set/i.test(product.title || "")

  const parseSetDescription = (description: string) => {
    const products: { name: string; features: string[] }[] = []

    // Split by lines
    const lines = description
      .split(/[\n*]/)
      .map((line) => line.replace(/^[-✓\s]+/, "").trim())
      .filter((line) => line.length > 0)

    let currentProduct: { name: string; features: string[] } | null = null

    lines.forEach((line) => {
      // Check if this line is a product title (ends with :)
      if (line.endsWith(":")) {
        // Save previous product if exists
        if (currentProduct) {
          products.push(currentProduct)
        }
        // Start new product
        currentProduct = {
          name: line.replace(":", "").trim(),
          features: [],
        }
      } else if (currentProduct && line.length > 0) {
        // Add feature to current product
        currentProduct.features.push(line)
      }
    })

    // Don't forget the last product
    if (currentProduct) {
      products.push(currentProduct)
    }

    return products
  }

  const parseBulletPoints = (description: string) => {
    // Handle various bullet formats: -, *, ✓, or newlines
    return description
      .split(/[\n*]/)
      .map((point) => point.replace(/^[-✓\s]+/, "").trim())
      .filter((point) => point.length > 0)
  }

  if (isSet) {
    const setProducts = parseSetDescription(product.description ?? "")

    return (
      <div className="py-8 space-y-8">
        <div className="space-y-6">
          {setProducts.map((item, index) => (
            <div key={index} className="space-y-3">
              <h3 className="font-urw text-lg font-semibold text-tres-primary">
                {item.name}
              </h3>
              <ul className="space-y-2">
                {item.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className="flex items-start gap-3 text-sm text-ui-fg-subtle font-urw"
                  >
                    <span className="text-tres-primary mt-1 flex-shrink-0">
                      ✓
                    </span>
                    <span className="leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Individual product with bullet points
  const bulletPoints = parseBulletPoints(product.description ?? "")

  return (
    <div className="py-8">
      <ul className="space-y-3">
        {bulletPoints.map((point, index) => (
          <li
            key={index}
            className="flex items-start gap-3 text-sm text-ui-fg-subtle font-urw"
          >
            <span className="text-tres-primary mt-1 flex-shrink-0">✓</span>
            <span className="leading-relaxed">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const SizingGuideTab = () => {
  // const fitTip = bundle.title === "Raven"

  const sizingData = [
    { size: "S", chest: "34 in", waist: "26 in", hips: "36 in" },
    { size: "M", chest: "36 in", waist: "28 in", hips: "38 in" },
    { size: "L", chest: "38 in", waist: "30 in", hips: "40 in" },
    { size: "XL", chest: "40 in", waist: "32 in", hips: "42 in" },
  ]

  return (
    <div className="py-8">
      <div className="overflow-x-auto">
        {/* {fitTip && (
          <p className="pb-4"> Fit Tip: We recommend sizing up for leggings.</p>
        )} */}
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
              Is the fit not quite right? No worries - we&apos;ll exchange your
              product for a new one.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Back />
          <div>
            <span className="font-semibold">Easy returns</span>
            <p className="max-w-sm">
              Just return your product and we&apos;ll refund your money. No
              questions asked – we&apos;ll do our best to make sure your return
              is hassle-free.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
