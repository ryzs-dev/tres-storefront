import useSWR from "swr"
import axios from "axios"

const fetcher = (url: string) =>
  axios
    .get(url, {
      headers: {
        "x-publishable-api-key": `${process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY}`, // example
        "Content-Type": "application/json",
      },
    })
    .then((res) => res.data)

export function useVariantAvailability(
  variantId: string,
  salesChannelId?: string
) {
  const { data, error, isLoading } = useSWR(
    variantId
      ? `${
          process.env.NEXT_PUBLIC_BACKEND_URL
        }/store/inventory/${variantId}?sales_channel_id=${salesChannelId || ""}`
      : null,
    fetcher
  )

  return {
    availability: data?.data,
    isLoading,
    error,
  }
}
