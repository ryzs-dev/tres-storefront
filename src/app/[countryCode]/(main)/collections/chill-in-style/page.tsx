import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listBundles } from "@lib/data/bundles"
import { getRegion } from "@lib/data/regions"
import BundlesTemplate from "@modules/bundles/templates"

export const metadata: Metadata = {
  title: "Chill In Style Collection | Tres",
  //   description:
  //     "Explore our Celine, Daz, and Rave bundles from the Unbuckle collection.",
}

export default async function ChillInStyleCollectionPage({
  params,
}: {
  params: { countryCode: string }
}) {
  const region = await getRegion(params.countryCode)
  if (!region) notFound()

  const { response } = await listBundles({
    countryCode: params.countryCode,
    queryParams: {
      limit: 50, // enough to cover those 3 bundles
    },
  })

  // ✅ Hardcode filter by name
  const targetNames = ["mel unitard"]

  const unbuckleBundles = response.bundles.filter((bundle) =>
    targetNames.includes(bundle.title.toLowerCase())
  )

  return (
    <BundlesTemplate
      bundles={unbuckleBundles}
      count={unbuckleBundles.length}
      region={region}
      countryCode={params.countryCode}
      currentPage={1}
    />
  )
}
