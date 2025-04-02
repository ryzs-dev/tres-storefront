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
      className="bg-[#99B2DD] text-white text-center font-urw font-medium [&_.swiper-wrapper]:!py-2 [&_.swiper-wrapper]:!m-0"
    >
      <SwiperSlide>🚀 New Collection Arrived!</SwiperSlide>
      <SwiperSlide>🎉 Free Shipping on Orders Above RM50</SwiperSlide>
      <SwiperSlide>💥 Limited Time Offer!</SwiperSlide>
    </Swiper>
  )
}

export default PromoBanner
