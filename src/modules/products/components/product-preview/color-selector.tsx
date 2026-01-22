"use client"

import { useState } from "react"
import Image from "next/image"

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

  console.log(colors)

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
            className="w-6 h-6 rounded-full border border-black"
            title={c.color}
            style={{ backgroundColor: c.color.toLowerCase() }}
          />
        ))}
      </div>
    </div>
  )
}
