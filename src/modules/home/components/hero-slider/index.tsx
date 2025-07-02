"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import "swiper/css"
import Hero from "../hero"

type HeroSliderProps = {
  slides: {
    imageUrl: string
    content: string
    cta?: boolean
    subtitle?: string
    position?:
      | "top-left"
      | "top-right"
      | "bottom-left"
      | "bottom-right"
      | "center"
      | "top"
      | "bottom"
    objectPosition?: string
    textColor?: string
  }[]
}

const HeroSlider = ({ slides }: HeroSliderProps) => {
  return (
    <Swiper
      modules={[Autoplay]}
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      loop
      slidesPerView={1}
      pagination={false}
      navigation={false}
    >
      {slides.map((slide, idx) => (
        <SwiperSlide key={idx}>
          <Hero {...slide} />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

export default HeroSlider
