// In /api/razorpay/callback/route.ts
import { completeOrder, placeOrder, retrieveCart } from "@lib/data/cart"
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

    if (!cart_id) {
      console.error("Cart ID is missing")
      return NextResponse.redirect(
        new URL("/payment-failed", process.env.NEXT_PUBLIC_BASE_URL!),
        303
      )
    }

    const cart = await retrieveCart(String(cart_id))
    const payment_collection_id = cart?.payment_collection?.id
    const payment_session_id =
      cart?.payment_collection?.payment_sessions?.[0]?.id

    console.log("Cart ID:", cart_id)
    console.log("Payment Collection ID:", payment_collection_id)
    console.log("Session ID:", payment_session_id)

    // Verify payment
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

    console.log("Verification response status:", verifyRes.status)

    if (verifyRes.ok) {
      console.log("✅ Payment verified, placing order...")

      try {
        const result = await completeOrder(String(cart_id))
        console.log("✅ Order placed successfully:", result.order.id)

        const successUrl = new URL(
          `/${result.countryCode}/order/${result.order.id}/confirmed`,
          process.env.NEXT_PUBLIC_BASE_URL!
        )

        return NextResponse.redirect(successUrl, 303)
      } catch (orderError) {
        console.error("❌ Failed to place order:", orderError)

        const errorUrl = new URL(
          "/payment-failed",
          process.env.NEXT_PUBLIC_BASE_URL!
        )
        errorUrl.searchParams.set("cart_id", String(cart_id))
        errorUrl.searchParams.set("error", "order_placement_failed")

        return NextResponse.redirect(errorUrl, 303)
      }
    } else {
      console.error("Payment verification failed")
      return NextResponse.redirect(
        new URL("/payment-failed", process.env.NEXT_PUBLIC_BASE_URL!),
        303
      )
    }
  } catch (err) {
    console.error("Callback error:", err)
    return NextResponse.redirect(
      new URL("/payment-failed", process.env.NEXT_PUBLIC_BASE_URL!),
      303
    )
  }
}
