import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import StrengthSection from "@modules/home/components/banner/StrengthSection"
import FeaturedSection from "@modules/layout/components/featured-section/FeaturedSection"
import { Heading, Text } from "@medusajs/ui"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Welcome to Tres",
  description: "",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params

  const region = await getRegion(countryCode)
  const { collections } = await listCollections(
    {
      fields: "id, handle, title, metadata",
    },
    {
      next: {
        tags: ["collections"],
      },
    }
  )

  if (!collections || !region) return null

  return (
    <div className="flex h-screen w-full justify-center items-center font-urw text-2xl font-semibold">
      {/* <div>
        <div className="h-[50vh] lg:h-[87vh] w-full border-b border-ui-border-base relative">
          <Image
            src="https://storage.tres.my/Hero_Image/DSCF2829.jpg"
            fill
            alt="Hero background"
            className={`object-cover object-[30%_30%]`}
            priority
          />
          <div
            className={`absolute inset-0 z-10 flex flex-col p-8 small:px-32 gap-6 justify-end items-start text-left
        )}`}
          >
            <span className="flex flex-col gap-4">
              <Heading
                level="h1"
                className="text-5xl sm:text-7xl leading-tight text-white font-urw font-normal m-0 p-0"
              >
                Be Tres
              </Heading>
              <Text
                family="sans"
                size="large"
                className="font-urwCond text-3xl text-white"
              >
                From Women For Women
              </Text>
            </span>
          </div>
        </div>
      </div>

      <section className="w-full bg-gray-100 px-4 sm:px-6 lg:px-0 py-10 sm:py-14">
        <div className="mx-auto min-w-full">
          <FeaturedProducts collections={collections} region={region} />
        </div>
      </section>

      <section className="sm:py-14 py-10">
        <div className="container max-w-7xl mx-auto ">
          <Hero
            content="Let's Unbuckle With Us"
            imageUrl="https://storage.tres.my/Hero_Image/new_unbuckle_hero.JPG"
            position="bottom-left"
            objectPosition="30%_40%"
            cta
          />
        </div>
      </section>

      <section className="px- sm:px-0 lg:px-0 py-10 sm:py-14 bg-gray-100">
        <div className=" min-w-full">
          <FeaturedSection />
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-0 py-10 sm:py-14 bg-gray-100">
        <div className=" min-w-full">
          <StrengthSection />
        </div>
      </section> */}
      <h1>We're currently offline for updates.</h1>
    </div>
  )
}
