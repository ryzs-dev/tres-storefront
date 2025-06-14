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
    const { flexible_bundle } = await getFlexibleBundle(id, {
      currency_code: region.currency_code,
      region_id: region.id,
    })

    if (!flexible_bundle) {
      notFound()
    }

    return {
      title: `${flexible_bundle.title} | Medusa Store`,
      description:
        flexible_bundle.description ||
        `${flexible_bundle.title} - Select your preferred products from this flexible bundle.`,
      openGraph: {
        title: `${flexible_bundle.title} | Medusa Store`,
        description:
          flexible_bundle.description ||
          `${flexible_bundle.title} - Select your preferred products from this flexible bundle.`,
        images: flexible_bundle.items[0]?.product?.thumbnail
          ? [flexible_bundle.items[0].product.thumbnail]
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
    const { flexible_bundle } = await getFlexibleBundle(params.id, {
      currency_code: region.currency_code,
      region_id: region.id,
    })

    if (!flexible_bundle) {
      notFound()
    }

    return (
      <BundleTemplate
        bundle={flexible_bundle}
        region={region}
        countryCode={params.countryCode}
      />
    )
  } catch (error) {
    notFound()
  }
}
