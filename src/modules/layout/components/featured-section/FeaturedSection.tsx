"use client"

import { Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

type FeaturedItem = {
  name: string
  href: string
  image: string
}

const FeaturedSection = ({ items }: { items: FeaturedItem[] }) => {
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
            className="relative overflow-hidden rounded-md sm:w-52 sm:h-40 lg:w-full lg:h-full"
          >
            <LocalizedClientLink href={item.href}>
              <Image
                src={item.image}
                alt={`Shop ${item.name}`}
                width={200}
                height={300}
                className="w-full h-full object-cover transition-transform duration-300 hover-zoom"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 overlay-fade flex items-center justify-center">
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
