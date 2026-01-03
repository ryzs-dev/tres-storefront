import { Metadata } from "next"
import { listCollections } from "@lib/data/collections"
import { listCategories } from "@lib/data/categories"
import { getRegion } from "@lib/data/regions"
import StrengthSection from "@modules/home/components/banner/StrengthSection"
import FeaturedSection from "@modules/layout/components/featured-section/FeaturedSection"
import { Heading, Text } from "@medusajs/ui"
import Image from "next/image"
import HeroSlider from "@modules/home/components/hero-slider"
import CollectionSlider from "@modules/home/components/CollectionSlider"
import { Link } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "TRES | Malaysia's Ladies Activewear",
  description:
    "Malaysia's premier destination for high-quality ladies activewear. Shop stylish and comfortable fitness apparel, workout clothes, sportswear, and yoga wear.",
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

  // const categories = await listCategories()

  // Only pick the categories you want (by handle or metadata)
  // const featuredItems = categories.slice(0, 3).map((cat) => ({
  //   name: cat.name,
  //   href: `/categories/${cat.handle}`,
  //   image:
  //     typeof cat.metadata?.thumbnail === "string" &&
  //     cat.metadata?.thumbnail.trim() !== ""
  //       ? (cat.metadata.thumbnail as string)
  //       : "https://storage.tres.my/placeholder.jpg", // fallback image
  // }))

  const bundleCollections = [
    {
      title: "Pedal & Power",
      slug: "pedal-and-power",
      image: "https://storage.tres.my/pedal/pedal-and-power.JPG",
      hoverImage: "",
    },
    {
      title: "Chill in Style",
      slug: "chill-in-style",
      image: "https://storage.tres.my/chill/chill-in-style.JPG",
      hoverImage: "",
    },
    {
      title: "Cover Me Up",
      slug: "cover-me-up",
      image: "https://storage.tres.my/cover/cover-me-up.JPG",
      hoverImage: "",
    },
    {
      title: "Smash & Swing",
      slug: "smash-and-swing",
      image: "https://storage.tres.my/smash/Smash-and-swing.JPG",
      hoverImage: "",
    },
  ]

  const categories = [
    {
      name: "Tops",
      href: "/categories/tops",
      image: "https://storage.tres.my/Featured%20Sections/shop_tops.JPG",
    },
    {
      name: "Sets",
      href: "/categories/sets",
      image: "https://storage.tres.my/Featured%20Sections/featured_sets.JPG",
    },
    {
      name: "Dresses",
      href: "/categories/dresses",
      image: "https://storage.tres.my/Featured%20Sections/dresses.JPG",
    },
  ]

  return (
    <>
      {/* Hero Section 1 */}
      <div className="h-[50vh] lg:h-[100vh] pt-16 w-full border-b border-ui-border-base relative">
        <Image
          src="https://storage.tres.my/christmas/christmas_banner_1.png"
          fill
          priority
          alt="Hero background"
          className="object-cover object-center"
        />

        {/* Centered content */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6">
          <span className="flex flex-col gap-3">
            <Heading
              level="h1"
              className="text-5xl sm:text-7xl leading-tight text-white font-urw font-normal m-0 p-0"
            >
              HOLIDAY <br />
              SALE
            </Heading>

            <Text
              family="sans"
              size="large"
              className="font-urwCond text-2xl sm:text-3xl text-white"
            >
              All items 20% off
            </Text>
            <Text
              family="sans"
              size="small"
              className="text-white/80 mt-2 sm:mt-3"
            >
              Discount auto-applied at checkout
            </Text>

            {/* 👇 Shop All Button */}
            <div className="mt-6 sm:mt-8">
              <LocalizedClientLink
                href="/bundles"
                className="inline-block px-6 py-2 bg-tres-primary text-tres-secondary font-semibold rounded-md hover:bg-tres-secondary hover:text-tres-primary transition-colors"
              >
                Shop All
              </LocalizedClientLink>
            </div>
          </span>
        </div>
      </div>

      {/* Featured Products Section */}
      {/* <section className="w-full bg-gray-100 px-4 sm:px-6 lg:px-0 py-10 sm:py-14">
        <div className="mx-auto min-w-full">
          <FeaturedProducts collections={collections} region={region} />
        </div>
      </section> */}

      <section className="w-full px-4 sm:px-6 lg:px-0">
        <CollectionSlider
          collections={bundleCollections}
          countryCode={countryCode}
          heading="Our Exclusive Collections"
        />
      </section>

      {/* Hero Section 2 */}
      <section className="sm:py-14 py-10">
        <div className="container max-w-7xl mx-auto">
          <HeroSlider
            slides={[
              {
                content: "Let's Unbuckle With Us",
                imageUrl:
                  "https://storage.tres.my/Hero_Image/unbuckle_hero_2.png",
                position: "bottom",
                objectPosition: "30%_40%",
                cta: true,
              },
              {
                content: "Let's Unbuckle With Us",
                imageUrl:
                  "https://storage.tres.my/Hero_Image/unbuckle_hero_3.png",
                position: "bottom",
                objectPosition: "30%_40%",
                cta: true,
              },
            ]}
          />
        </div>
      </section>

      {/* Featured Section */}
      <section className="px- sm:px-0 lg:px-0 py-10 sm:py-14">
        <div className=" min-w-full">
          <FeaturedSection items={categories} />
        </div>
      </section>

      {/* Strength Section */}
      <section className="px-4 sm:px-6 lg:px-0 py-10 sm:py-14 bg-tres-secondary">
        <div className=" min-w-full">
          <StrengthSection />
        </div>
      </section>
    </>
  )
}
