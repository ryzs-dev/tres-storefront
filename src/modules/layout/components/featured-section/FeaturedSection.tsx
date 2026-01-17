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
              className="
    group relative overflow-hidden rounded-md
    h-32 sm:h-40 lg:h-80
    w-full sm:w-52 lg:w-full
  "
            >
              <LocalizedClientLink href={`categories/${item.handle}`}>
                <Image
                  src={image}
                  alt={`Shop ${item.name}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Overlay */}
                <div
                  className="
        pointer-events-none
        absolute inset-0
        bg-black/30
        opacity-0
        transition-opacity duration-300
        hidden md:flex
        md:items-center md:justify-center
        group-hover:opacity-100
      "
                >
                  <span className="text-white text-base lg:text-xl font-urw">
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
