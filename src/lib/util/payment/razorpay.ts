export async function initiateRazorpayOrder(
  cartId: string,
  amount: number,
  currency: string
) {
  const res = await fetch("/api/razorpay-initiate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cartId, amount, currency }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || "Failed to create Razorpay order")
  return data // contains order_id and key
}
