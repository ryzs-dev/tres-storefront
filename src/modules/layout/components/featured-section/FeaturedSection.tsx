"use client"

import { getCategoryImage } from "@lib/util/category-hiearchy"
import { Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

type FeaturedItem = {
  name: string
  handle: string
  image: string
}

const FeaturedSection = ({ items }: { items: FeaturedItem[] }) => {
  return (
    <section>
      <div className="text-center sm:py-0 lg:py-6 pb-4 sm:pb-2 lg:pb-8">
        <Heading>
          <span className="text-2xl sm:text-3xl font-semibold">
            Browse by Category
          </span>
        </Heading>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Explore our full range of styles — from everyday tops to elegant
          dresses and matching sets.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        {items.map((item) => {
          const image = getCategoryImage(item)
          return (
            <div
              key={item.name}
              className="group relative w-full h-40 sm:h-40 lg:h-80 overflow-hidden rounded-md"
            >
              <LocalizedClientLink href={`categories/${item.handle}`}>
                <Image
                  src={image} // must be valid
                  alt={`Shop ${item.name}`}
                  fill
                  className="object-cover object-top sm:object-center transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 md:bg-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <span className="text-white text-sm sm:text-base lg:text-xl font-urw">
                    SHOP {item.name}
                  </span>
                </div>
              </LocalizedClientLink>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default FeaturedSection
