// app/[countryCode]/(main)/bundles/page.tsx
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listBundles } from "@lib/data/bundles"
import { getRegion, listRegions } from "@lib/data/regions"
import BundlesTemplate from "@modules/bundles/templates"

type Props = {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateStaticParams() {
  try {
    const countryCodes = await listRegions().then((regions) =>
      regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
    )

    if (!countryCodes) {
      return []
    }

    return countryCodes.map((countryCode) => ({
      countryCode,
    }))
  } catch (error) {
    console.error(
      `Failed to generate static paths for bundles pages: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`
    )
    return []
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params

  return {
    title: "Bundles | Tres Store",
    description:
      "Discover our flexible bundles where you can select individual products that suit your needs.",
    openGraph: {
      title: "Bundles | Tres Store",
      description:
        "Discover our flexible bundles where you can select individual products that suit your needs.",
    },
  }
}

export default async function BundlesPage(props: Props) {
  const params = await props.params
  const searchParams = await props.searchParams

  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const page = parseInt(searchParams.page || "1")

  const { response } = await listBundles({
    pageParam: page,
    countryCode: params.countryCode,
    queryParams: {
      limit: 12,
    },
  })

  return (
    <BundlesTemplate
      bundles={response.bundles}
      count={response.count}
      region={region}
      countryCode={params.countryCode}
      currentPage={page}
    />
  )
}
