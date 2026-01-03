"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/autoplay"
import { Autoplay } from "swiper/modules"

const PromoBanner = () => {
  return (
    <Swiper
      slidesPerView={1}
      loop={true}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      modules={[Autoplay]}
      className="bg-tres-primary text-white text-center font-urw font-medium [&_.swiper-wrapper]:!py-2 [&_.swiper-wrapper]:!m-0"
    >
      <SwiperSlide>
        🔥 20% OFF STOREWIDE until 5th Jan ! SALES END SOON !
      </SwiperSlide>
      <SwiperSlide>🚚 Free Shipping above RM180</SwiperSlide>
      <SwiperSlide>
        🎁 No hesitation! Extra 20% apply on Bundle Deals too!
      </SwiperSlide>
    </Swiper>
  )
}

export default PromoBanner
