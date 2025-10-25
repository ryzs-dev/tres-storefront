import { placeOrder, retrieveCart } from "@lib/data/cart"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  console.log("Razorpay callback invoked")

  try {
    const formData = await req.formData()
    console.log("Form Data received:", formData)
    const razorpay_payment_id = formData.get("razorpay_payment_id")
    const razorpay_order_id = formData.get("razorpay_order_id")
    const razorpay_signature = formData.get("razorpay_signature")
    const cart_id =
      formData.get("cart_id") || new URL(req.url).searchParams.get("cart_id")

    const cart = await retrieveCart(String(cart_id))

    const payment_collection_id = cart?.payment_collection?.id
    const payment_session_id =
      cart?.payment_collection?.payment_sessions?.[0]?.id

    console.log("Cart ID:", cart_id)
    console.log("Payment Collection ID:", payment_collection_id)
    console.log("Session ID:", payment_session_id)

    const verifyRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/razorpay/update-payment-collection`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_collection_id,
          payment_collection_payment_session_id: payment_session_id,
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature,
        }),
      }
    )

    console.log("Verification response status:", verifyRes)

    if (verifyRes.ok) {
      // await placeOrder(String(cart_id))
      const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?status=authorized&cart_id=${cart_id}&razorpay_payment_id=${razorpay_payment_id}`
      console.log("✅ Redirecting to:", redirectUrl)
      return NextResponse.redirect(redirectUrl)
    } else {
      console.error("Payment verification failed")
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/payment-failed`
      )
    }
  } catch (err) {
    console.error("Callback error:", err)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/payment-failed`
    )
  }
}
