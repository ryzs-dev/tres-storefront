import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      payment_collection_id,
      payment_collection_payment_session_id,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = body

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      )
    }

    // ✅ Optional: Forward this verified data to your Medusa backend to update the payment collection
    const medusaRes = await fetch(
      `${process.env.MEDUSA_BACKEND_URL}/store/razorpay/update-payment-collection`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": process.env
            .NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY as string,
        },
        body: JSON.stringify({
          payment_collection_id,
          payment_collection_payment_session_id,
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature,
        }),
      }
    )

    const data = await medusaRes.json()

    if (!medusaRes.ok) {
      return NextResponse.json(
        { message: "Failed to update Medusa payment collection", data },
        { status: medusaRes.status }
      )
    }

    return NextResponse.json({
      message: "Payment verified and forwarded successfully",
      data,
    })
  } catch (error: any) {
    console.error("Error verifying Razorpay payment:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
