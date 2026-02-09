"use client"

import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

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
  return (
    <div className="text-small-regular py-8">
      {/* <div className="grid grid-cols-2 gap-x-8">
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold">Material</span>
            <p>{product.material ? product.material : "-"}</p>
          </div>
          <div>
            <span className="font-semibold">Country of origin</span>
            <p>{product.origin_country ? product.origin_country : "-"}</p>
          </div>
          <div>
            <span className="font-semibold">Type</span>
            <p>{product.type ? product.type.value : "-"}</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold">Weight</span>
            <p>{product.weight ? `${product.weight} g` : "-"}</p>
          </div>
          <div>
            <span className="font-semibold">Dimensions</span>
            <p>
              {product.length && product.width && product.height
                ? `${product.length}L x ${product.width}W x ${product.height}H`
                : "-"}
            </p>
          </div>
        </div>
      </div> */}
      <Text
        className="text-sm font-urw font-medium text-ui-fg-subtle whitespace-pre-line text-justify"
        data-testid="product-description"
      >
        {product.description}
      </Text>
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
