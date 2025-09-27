// app/[countryCode]/(main)/bundles/[id]/page.tsx
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listBundles, getFlexibleBundle } from "@lib/data/bundles"
import { getRegion, listRegions } from "@lib/data/regions"
import BundleTemplate from "@modules/bundles/templates/bundle-detail"
import BundleDetailTemplate from "@modules/bundles/templates/bundle-detail"

type Props = {
  params: Promise<{ countryCode: string; id: string }>
}

// helper to fetch inventory for a variant
async function fetchVariantAvailability(
  variant_id: string,
  sales_channel_id?: string
) {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/inventory`
  )
  url.searchParams.append("variant_id", variant_id)
  if (sales_channel_id) {
    url.searchParams.append("sales_channel_id", sales_channel_id)
  }

  const res = await fetch(url.toString(), { cache: "no-store" })
  if (!res.ok) {
    console.error(`❌ Failed to fetch availability for variant ${variant_id}`)
    return null
  }

  const json = await res.json()
  return json.data
}

export async function generateStaticParams() {
  try {
    const countryCodes = await listRegions().then((regions) =>
      regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
    )

    if (!countryCodes) {
      return []
    }

    const bundles = await listBundles({
      countryCode: "MY",
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
    console.error("Failed to generate static paths for bundle pages:", error)
    return []
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { id } = params
  const region = await getRegion(params.countryCode)

  if (!region) notFound()

  try {
    const { bundle } = await getFlexibleBundle(id, {
      currency_code: region.currency_code,
      region_id: region.id,
    })

    if (!bundle) notFound()

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
  } catch {
    notFound()
  }
}

export default async function BundleDetailPage(props: Props) {
  const params = await props.params
  const region = await getRegion(params.countryCode)

  if (!region) notFound()

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

    // 🔥 Fetch inventory for all variants in the bundle
    const stockData = await Promise.all(
      bundle.items.map(async (item) => {
        const variant_id = item?.variant?.id
        if (!variant_id) return null

        const availability = await fetchVariantAvailability(
          variant_id,
          "sc_01JY0GVTDD9V9JQMBZ858ZR8J8" // your fixed sales channel
        )

        return { variant_id, availability }
      })
    ).then((res) =>
      res.filter(
        (item): item is { variant_id: string; availability: any } =>
          item !== null
      )
    )

    return (
      <BundleDetailTemplate
        bundle={bundle}
        region={region}
        countryCode={params.countryCode}
        stockData={stockData} // pass down stock info
      />
    )
  } catch (error) {
    console.error("💥 Error fetching bundle:", error)
    notFound()
  }
}
