// app/api/razorpay-complete/[cartId]/route.ts
import { retrieveCart } from "@lib/data/cart"
import { sdk } from "@lib/config"
import { NextRequest, NextResponse } from "next/server"

type Params = Promise<{ cartId: string }>

export async function POST(req: NextRequest, { params }: { params: Params }) {
  try {
    const { cartId } = await params
    const {
      payment_id,
      order_id,
      signature,
      country_code = "my",
    } = await req.json()

    const cart = await retrieveCart(cartId)
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 })
    }

    const paymentSession = cart.payment_collection?.payment_sessions?.find(
      (session) => session.provider_id === "pp_razorpay_razorpay"
    )

    if (!paymentSession) {
      return NextResponse.json(
        { error: "Payment session not found" },
        { status: 404 }
      )
    }

    // Update payment session
    await fetch(
      `${process.env.MEDUSA_BACKEND_URL}/store/payment-sessions/${paymentSession.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key":
            process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
        },
        body: JSON.stringify({
          data: { payment_id, order_id, signature },
        }),
      }
    )

    // Complete cart
    const completion = await sdk.store.cart.complete(cartId)

    console.log("Order completed:", completion.order?.id)

    return NextResponse.json({
      success: true,
      order_id: completion.order?.id,
      redirect_url: `/order/${completion.order?.id}/confirmed`,
    })
  } catch (error: any) {
    console.error("Razorpay completion error:", error)
    return NextResponse.json(
      { error: "Payment completion failed" },
      { status: 500 }
    )
  }
}
