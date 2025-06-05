// app/categories/page.tsx or wherever you want to use it
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listCategories } from "@lib/data/categories"
import TopCategoriesTemplate from "@modules/categories/TopCategoriesTemplate"

type Params = {
  countryCode: string
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Shop by Category",
    description:
      "Browse our top product categories and find exactly what you're looking for.",
  }
}

export default async function TopCategoriesPage({
  params: { countryCode },
}: {
  params: Params
}) {
  try {
    // Fetch all categories - the component will filter for top-level ones
    const productCategories = await listCategories({
      limit: 100, // Adjust based on your needs
      offset: 0,
    })

    if (!productCategories || productCategories.length === 0) {
      notFound()
    }

    return (
      <TopCategoriesTemplate
        categories={productCategories}
        countryCode={countryCode}
      />
    )
  } catch (error) {
    console.error("Error loading categories:", error)
    notFound()
  }
}
