"use client"

import { useState } from "react"
import Image from "next/image"
import { colorMap } from "../product-actions/option-select"

export default function ColorSelector({
  colors,
  defaultImage,
}: {
  colors: {
    color: string
    thumbnail: string
    variantId: string
  }[]
  defaultImage: string
}) {
  const [image, setImage] = useState(defaultImage)

  return (
    <div>
      <Image
        src={image}
        alt="Product image"
        width={600}
        height={600}
        className="rounded"
      />

      <div className="flex gap-2 mt-2">
        {colors.map((c) => (
          <button
            key={c.variantId}
            onClick={() => setImage(c.thumbnail)}
            className={`w-6 h-6 rounded-full border ${
              image === c.thumbnail
                ? "border-2 border-black"
                : "border border-black"
            }`}
            title={c.color}
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
