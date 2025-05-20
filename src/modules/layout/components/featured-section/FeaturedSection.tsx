"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

const FeaturedSection = () => {
  return (
    <section className="grid grid-cols-3 gap-2 p-2 bg-gray-100">
      {/* Left Large Image */}
      <div className="col-span-2 relative">
        <LocalizedClientLink href={`/categories/tops`}>
          <Image
            src="https://zhwxnlspudiutanxvunp.supabase.co/storage/v1/object/public/tres-assets/Featured%20Sections/shop_tops.JPG" // Replace with actual image path
            alt="Main Fashion Feature"
            width={1200}
            height={800}
            className="w-full h-full object-cover rounded-md absolute"
          />
          <button className="absolute bottom-8 left-8 text-xl z-10 font-urwSemiCond">
            SHOP TOPS
          </button>
        </LocalizedClientLink>
      </div>

      {/* Right Side - Top Image */}
      <div className="col-span-1 flex flex-col gap-2">
        <div className="relative">
          <LocalizedClientLink href={`/categories/shorts`}>
            <Image
              src="https://zhwxnlspudiutanxvunp.supabase.co/storage/v1/object/public/tres-assets/Featured%20Sections/shop_shorts.JPG" // Replace with actual image path
              alt="Shop Shorts"
              width={600}
              height={400}
              className="w-full h-full object-cover rounded-md relative"
            />
            <button className="absolute bottom-8 left-8 font-urwSemiCond z-10 text-lg">
              SHOP SHORTS
            </button>
          </LocalizedClientLink>
        </div>

        {/* Right Side - Bottom Image */}
        <div className="relative">
          <LocalizedClientLink href={`/categories/leggings`}>
            <Image
              src="https://zhwxnlspudiutanxvunp.supabase.co/storage/v1/object/public/tres-assets/Featured%20Sections/shop_leggings.JPG" // Replace with actual image path
              alt="Leggings"
              width={600}
              height={400}
              className="w-full h-full object-cover rounded-md relative"
            />
            <button className="absolute bottom-8 left-8 font-urwSemiCond z-10 text-lg">
              SHOP LEGGINGS
            </button>
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}

export default FeaturedSection
