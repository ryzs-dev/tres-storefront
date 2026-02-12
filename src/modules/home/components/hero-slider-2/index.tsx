"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import "swiper/css"
import Hero from "../hero"
import HeroSlider from "../hero-slider"
import Hero2 from "./hero2"

type HeroSlider2Props = {
  slides: {
    imageUrl: string
    title: string
    subtitle?: string
    ctaText?: string
    ctaLink?: string
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

const HeroSlider2 = ({ slides }: HeroSlider2Props) => {
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
          <Hero2 {...slide} />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

export default HeroSlider2
