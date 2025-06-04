"use client"

import { Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

const items = [
  {
    name: "TOPS",
    href: "/categories/top",
    image: "https://storage.tres.my/Featured%20Sections/shop_tops.JPG", // Replace with actual image URL
  },
  {
    name: "DRESSES",
    href: "/categories/dresses",
    image: "https://storage.tres.my/Featured%20Sections/shop_bottoms.JPG",
  },
  {
    name: "BOTTOMS",
    href: "/categories/bottom",
    image: "https://storage.tres.my/Featured%20Sections/shop_shorts.JPG",
  },
]

const FeaturedSection = () => {
  return (
    <section>
      <div className="flex justify-center sm:py-0 lg:py-6 pb-4 sm:pb-2 lg:pb-8">
        <Heading>
          <span className="text-2xl sm:text-3xl font-semibold">Shop All</span>
        </Heading>
      </div>

      <div className="grid grid-cols-3 gap-2 p-2">
        {items.map((item) => (
          <div
            key={item.name}
            className="group relative overflow-hidden rounded-md sm:w-52 sm:h-40 lg:w-full lg:h-full"
          >
            <LocalizedClientLink href={item.href}>
              <Image
                src={item.image}
                alt={`Shop ${item.name}`}
                width={200}
                height={300}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white text-m lg:text-xl font-urwSemiCond">{`SHOP ${item.name}`}</span>
              </div>
            </LocalizedClientLink>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FeaturedSection
