"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Heading, Button } from "@medusajs/ui"
import {
  XCircle,
  RefreshCcw,
  Home,
  Mail,
  ArrowRight,
  ArrowLeft,
} from "lucide-react"

export default function PaymentFailedPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const error = searchParams.get("error")
  const cartId = searchParams.get("cart_id")

  const getErrorMessage = () => {
    switch (error) {
      case "verification_failed":
        return "Payment verification failed. The payment could not be authenticated."
      case "missing_cart":
        return "Cart information is missing. Please try adding items to your cart again."
      case "unexpected":
        return "An unexpected error occurred while processing your payment."
      default:
        return "Your payment could not be processed at this time."
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
        </div>

        {/* Error Card */}
        <div className="p-8">
          <Heading
            level="h1"
            className="text-2xl text-center mb-4 text-gray-900"
          >
            Payment Failed
          </Heading>

          <p className="text-center text-gray-600 mb-6">{getErrorMessage()}</p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-xs text-red-700">
                <strong>Error Code:</strong> {error}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => router.push("/checkout")}
              variant="transparent"
              className="w-full py-3 rounded-lg flex items-center justify-center gap-2"
            >
              Return to checkout
            </Button>
          </div>
        </div>

        {/* Help Section */}
        <div className="text-center flex justify-between items-center">
          <p className="text-sm text-gray-600">Need help with your order?</p>
          <a
            href="mailto:admin@tres.my"
            className="text-sm text-gray-900 hover:underline flex items-center justify-center "
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  )
}
