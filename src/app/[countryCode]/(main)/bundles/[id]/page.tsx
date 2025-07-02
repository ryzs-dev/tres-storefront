// app/[countryCode]/(main)/bundles/[id]/page.tsx
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listBundles, getFlexibleBundle } from "@lib/data/bundles"
import { getRegion, listRegions } from "@lib/data/regions"
import BundleTemplate from "@modules/bundles/templates/bundle-detail"

type Props = {
  params: Promise<{ countryCode: string; id: string }>
}

export async function generateStaticParams() {
  try {
    const countryCodes = await listRegions().then((regions) =>
      regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
    )

    if (!countryCodes) {
      return []
    }

    // Get all bundles to generate static paths
    const bundles = await listBundles({
      countryCode: "MY", // Use a default country to get bundles
      queryParams: { fields: "id", limit: 100 },
    }).then(({ response }) => response.bundles)

    return countryCodes
      .map((countryCode) =>
        bundles.map((bundle) => ({
          countryCode,
          id: bundle.id,
        }))
      )
      .flat()
      .filter((param) => param.id)
  } catch (error) {
    console.error(
      `Failed to generate static paths for bundle pages: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`
    )
    return []
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { id } = params
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  try {
    const { bundle } = await getFlexibleBundle(id, {
      currency_code: region.currency_code,
      region_id: region.id,
    })

    if (!bundle) {
      notFound()
    }

    return {
      title: `${bundle.title} | Tres Store`,
      description:
        bundle.description ||
        `${bundle.title} - Select your preferred products from this flexible bundle.`,
      openGraph: {
        title: `${bundle.title} | Tres Store`,
        description:
          bundle.description ||
          `${bundle.title} - Select your preferred products from this flexible bundle.`,
        images: bundle.items[0]?.product?.thumbnail
          ? [bundle.items[0].product.thumbnail]
          : [],
      },
    }
  } catch (error) {
    notFound()
  }
}

export default async function BundleDetailPage(props: Props) {
  const params = await props.params
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  try {
    const response = await getFlexibleBundle(params.id, {
      currency_code: region.currency_code,
      region_id: region.id,
    })

    const { bundle } = response

    if (!bundle) {
      console.log("❌ No bundle found in response")
      notFound()
    }

    console.log("✅ Bundle fetched successfully:", bundle)

    return (
      <BundleTemplate
        bundle={bundle}
        region={region}
        countryCode={params.countryCode}
      />
    )
  } catch (error) {
    console.error("💥 Error fetching bundle:", error)
    notFound()
  }
}
