"use client"

import { useState } from "react"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { colorMap } from "../product-actions/option-select"

export default function ColorSelector({
  colors,
  defaultImage,
  productHandle,
}: {
  colors: {
    color: string
    thumbnail: string
    variantId: string
  }[]
  defaultImage: string
  productHandle: string
}) {
  const [image, setImage] = useState(defaultImage)

  return (
    <div>
      <LocalizedClientLink
        href={`/products/${productHandle}`}
        className="block relative w-full aspect-[9/16] rounded overflow-hidden group"
      >
        <Image
          src={image}
          alt="Product image"
          fill
          className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
      </LocalizedClientLink>

      <div className="flex gap-2 mt-2">
        {colors.map((c) => (
          <button
            key={c.variantId}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setImage(c.thumbnail)
            }}
            className={`w-6 h-6 rounded-full border ${
              image === c.thumbnail
                ? "border-2 border-tres-primary"
                : "border border-black"
            }`}
            title={c.color}
            aria-label={`Select ${c.color} color`}
            style={{
              backgroundColor:
                colorMap[c.color.toLowerCase()] || c.color.toLowerCase(),
            }}
          />
        ))}
      </div>
    </div>
  )
}
