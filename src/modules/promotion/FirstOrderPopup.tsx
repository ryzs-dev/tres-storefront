"use client"

import { HttpTypes } from "@medusajs/types"
import { useEffect, useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import Link from "next/link"

interface Props {
  customer?: HttpTypes.StoreCustomer | null
}

const POPUP_DISMISSED_KEY = "tres_first_order_popup_dismissed"

const FirstOrderPopup = ({ customer }: Props) => {
  const [showPopup, setShowPopup] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    // Check if user has dismissed the popup before
    const hasBeenDismissed =
      localStorage.getItem(POPUP_DISMISSED_KEY) === "true"

    // Show popup if:
    // 1. User hasn't dismissed it before AND
    // 2. (No customer OR customer has no orders)
    if (!hasBeenDismissed && (!customer || !customer.orders?.length)) {
      setShowPopup(true)
    }
  }, [customer])

  const closePopup = () => {
    setIsClosing(true)
    setTimeout(() => {
      setShowPopup(false)
      setIsClosing(false)
    }, 300)
  }

  const handleOptOut = () => {
    // Save user preference to not show popup again
    localStorage.setItem(POPUP_DISMISSED_KEY, "true")
    closePopup()
  }

  const handleContinue = () => {
    // Just close without saving preference (will show again next time)
    closePopup()
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closePopup()
    }
  }

  if (!showPopup) return null

  return (
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 lg:p-8 transition-all duration-300 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
      onClick={handleOverlayClick}
    >
      <div
        className={`bg-white shadow-2xl max-w-xs sm:max-w-5xl w-full relative overflow-hidden flex flex-col md:flex-row-reverse transition-all duration-300 ease-out rounded-lg ${
          isClosing
            ? "scale-95 opacity-0 translate-y-4"
            : "scale-100 opacity-100 translate-y-0"
        }`}
      >
        {/* Close button */}
        <button
          onClick={closePopup}
          className="absolute top-3 right-3 sm:top-6 sm:right-6 text-gray-400 hover:text-gray-600 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center transition-all duration-200 z-20 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white hover:scale-110 shadow-sm"
          aria-label="Close popup"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Image (top on mobile, right on desktop) */}
        <div className="w-full md:w-1/2 relative h-40 sm:h-96 md:h-auto min-h-[200px] sm:min-h-[300px]">
          <Image
            src="https://storage.tres.my/promotion_banner_1.JPG"
            alt="Fashion models"
            fill
            className="object-cover object-[30%_30%] transition-transform duration-700 hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 50vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-transparent" />
        </div>

        {/* Content (below image on mobile, left on desktop) */}
        <div className="bg-white w-full md:w-1/2 px-4 sm:px-10 lg:px-16 py-6 sm:py-16 flex flex-col justify-center relative text-center">
          {/* Logo */}
          <div className="mb-4 sm:mb-8 flex justify-center">
            <Image
              src="/images/tres-logo-3.svg"
              alt="Tres Triangle Logo"
              width={60}
              height={60}
              className="h-auto sm:w-[100px] sm:h-[100px]"
            />
          </div>

          {/* Main Content */}
          <div className="my-3 sm:my-4 space-y-2 sm:space-y-3">
            <h2 className="font-urw text-lg sm:text-3xl font-bold text-gray-900 leading-tight">
              Welcome to <span className="text-[#99B2DD]">TRES</span>
            </h2>
            <p className="text-sm sm:text-lg text-gray-600 leading-relaxed">
              {customer ? (
                <>
                  Hi {customer.first_name || "there"}! Check your email for your
                  exclusive <strong>10% discount code</strong>.
                </>
              ) : (
                <>
                  Sign up to get <strong>10% off</strong> your first purchase
                  and exclusive <strong>TRES</strong> discounts.
                </>
              )}
            </p>
            <p className="text-xs sm:text-base text-gray-500 italic">
              Don't miss out — be part of something strong.
            </p>
          </div>

          {/* Buttons */}
          <div className="space-y-2 sm:space-y-3">
            <Link
              onClick={handleContinue}
              href={customer ? "/account" : "/account/login"}
            >
              <button className="w-full bg-[#99B2DD] text-white font-urw font-bold text-base sm:text-xl uppercase tracking-wide py-3 sm:py-4 px-6 sm:px-8 transition-all duration-300 hover:bg-[#8AA5D3] hover:shadow-lg active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#99B2DD] focus:ring-offset-2">
                {customer ? "Continue Shopping" : "Sign Up"}
              </button>
            </Link>

            <button
              onClick={handleOptOut}
              className="w-full text-gray-500 font-urw text-sm sm:text-lg py-2 sm:py-3 transition-all duration-200 hover:text-gray-700 underline decoration-1 underline-offset-4 hover:decoration-2"
            >
              Don't show this again
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FirstOrderPopup
