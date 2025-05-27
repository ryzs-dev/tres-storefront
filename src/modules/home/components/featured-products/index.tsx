"use client"

import { HttpTypes } from "@medusajs/types"
import InteractiveLink from "@modules/common/components/interactive-link"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import "swiper/css"
import { Heading } from "@medusajs/ui"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

function SlideNavButtons({ swiper }: { swiper: any }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => swiper?.slidePrev()}
        className="w-9 h-9 flex items-center justify-center border rounded-full hover:bg-gray-100 transition"
        aria-label="Previous"
        disabled={!swiper}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => swiper?.slideNext()}
        className="w-9 h-9 flex items-center justify-center border rounded-full hover:bg-gray-100 transition"
        aria-label="Next"
        disabled={!swiper}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}

export default function FeaturedProducts({
  collections,
  region,
}: {
  collections: HttpTypes.StoreCollection[]
  region: HttpTypes.StoreRegion
}) {
  const [swiper, setSwiper] = useState<any>(null)

  if (!collections || collections.length === 0) return null

  return (
    <div className="content-container small:py-24">
      <div className="flex items-center justify-between mb-6">
        <Heading level="h2" className="text-2xl font-semibold">
          Our Featured Collections
        </Heading>
        <SlideNavButtons swiper={swiper} />
      </div>

      <Swiper
        onSwiper={setSwiper}
        modules={[Navigation]}
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1.2 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        loop={collections.length > 4}
      >
        {collections.slice(0, 10).map((collection) => (
          <SwiperSlide key={collection.id}>
            <div className="relative w-full h-[300px] overflow-hidden rounded-xl group">
              <InteractiveLink href={`/collections/${collection.handle}`}>
                <Image
                  src={
                    typeof collection.metadata?.hero_image === "string"
                      ? collection.metadata.hero_image
                      : "/images/placeholder.png"
                  }
                  alt={collection.title}
                  fill
                  className="rounded-xl transition-opacity duration-500 object-cover group-hover:opacity-0"
                />
                {typeof collection.metadata?.secondary_image === "string" && (
                  <Image
                    src={collection.metadata.secondary_image}
                    alt={`${collection.title} Hover`}
                    fill
                    className="rounded-xl absolute top-0 left-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100 object-cover"
                  />
                )}
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4 z-10">
                  <h2 className="text-white text-lg font-semibold">
                    {collection.title}
                  </h2>
                </div>
              </InteractiveLink>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
