import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { Heading } from "@medusajs/ui"
import StrengthSection from "@modules/home/components/banner/StrengthSection"
import FeaturedSection from "@modules/layout/components/featured-section/FeaturedSection"

export const metadata: Metadata = {
  title: "Medusa Next.js Starter Template",
  description:
    "A performant frontend ecommerce starter template with Next.js 15 and Medusa.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections(
    {
      fields: "id, handle, title",
    },
    {
      next: {
        tags: ["collections"],
      },
    }
  )

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <Hero
        content="From Women For Women"
        imageUrl="/images/hero.jpeg"
        subtitle="Be Tres"
        position="bottom-left"
      />
      <section className="pt-12 flex w-full flex-col">
        <Heading
          level="h2"
          className="font-urw text-2xl self-center font-semibold"
        >
          Our Featured Collections
        </Heading>
        <div className="flex flex-col">
          <FeaturedProducts collections={collections} region={region} />
        </div>
      </section>
      <StrengthSection />
      <Hero
        content="Let's Unbuckle With Us"
        imageUrl="/images/hero_unbuckle.JPG"
        position="top"
      />
      <FeaturedSection />
    </>
  )
}
