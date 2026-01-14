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
        {items.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-md
                 h-32 sm:h-40 lg:h-full
                 w-full sm:w-52 lg:w-full"
          >
            <LocalizedClientLink href={item.href}>
              <Image
                src={item.image}
                alt={`Shop ${item.name}`}
                fill
                className="object-cover transition-transform duration-300 hover-zoom"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <span className="text-white text-sm sm:text-base lg:text-xl font-urw">
                  SHOP {item.name}
                </span>
              </div>
            </LocalizedClientLink>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FeaturedSection
