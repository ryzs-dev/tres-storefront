import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import StrengthSection from "@modules/home/components/banner/StrengthSection"
import FeaturedSection from "@modules/layout/components/featured-section/FeaturedSection"

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
    <>
      {/* Hero Section 1 */}
      <div>
        <Hero
          content="Be Tres"
          imageUrl="https://zhwxnlspudiutanxvunp.supabase.co/storage/v1/object/public/tres-assets/Hero_Image/DSCF2829.jpg"
          subtitle="From Women For Women"
          position="bottom-left"
          objectPosition="30%_30%"
        />
      </div>

      {/* Featured Products Section */}
      <section className="w-full bg-gray-100 px-4 sm:px-6 lg:px-0 py-10 sm:py-14">
        <div className="mx-auto min-w-full">
          <FeaturedProducts collections={collections} region={region} />
        </div>
      </section>

      {/* Hero Section 2 */}
      <Hero
        content="Let's Unbuckle With Us"
        imageUrl="https://zhwxnlspudiutanxvunp.supabase.co/storage/v1/object/public/tres-assets/Hero_Image/new_unbuckle_hero.JPG"
        position="center"
        objectPosition="30%_40%"
      />

      {/* Featured Section */}
      <section className="px-4 sm:px-6 lg:px-0 py-10 sm:py-14">
        <div className=" min-w-full">
          <FeaturedSection />
        </div>
      </section>

      {/* Strength Section */}
      <section className="px-4 sm:px-6 lg:px-0 py-10 sm:py-14 bg-white">
        <div className=" min-w-full">
          <StrengthSection />
        </div>
      </section>
    </>
  )
}
