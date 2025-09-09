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

  const bundles = response.bundles

  // IDs of bundles you want at the top
  const topBundles = [
    "01JYXDEGQVDT5QPS0MFZZKF11R",
    "01JZ055N4Q8SFDGWD0R2XF6K1D",
    "01JZ057ZB0WNXHSWVYVSYNQJEK",
    "01JZ0AP8RMKSV9PDTN0KT0GNR7",
  ]

  // Separate top bundles and the rest
  const top = bundles.filter((b) => topBundles.includes(b.id))
  const rest = bundles.filter((b) => !topBundles.includes(b.id))

  // Sort top bundles according to your desired order
  const sortedTop = top.sort(
    (a, b) => topBundles.indexOf(a.id) - topBundles.indexOf(b.id)
  )

  // Merge sorted top bundles with the rest (original order)
  const rearrangedBundles = [...sortedTop, ...rest]

  return (
    <BundlesTemplate
      bundles={rearrangedBundles}
      count={response.count}
      region={region}
      countryCode={params.countryCode}
      currentPage={page}
    />
  )
}
