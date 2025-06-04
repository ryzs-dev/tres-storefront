"use client"

import { HttpTypes } from "@medusajs/types"
import { useEffect, useState } from "react"
import Image from "next/image"
import { X, Copy, CheckCircle2 } from "lucide-react"
import Link from "next/link"

interface Props {
  customer?: HttpTypes.StoreCustomer | null
}

interface Promotion {
  id: string
  code: string
  type: string
  value: number
  is_automatic: boolean
  campaign?: {
    name: string
    description?: string
  }
}

const BASE_URL = process.env.MEDUSA_BACKEND_URL || "https://admin.tres.my"

const FirstOrderPopup = ({ customer }: Props) => {
  const [showPopup, setShowPopup] = useState(false)
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [copied, setCopied] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  useEffect(() => {
    if (!customer) {
      console.log("User not signed in — showing popup")
      setShowPopup(true)
      return
    }

    if (!customer.orders || customer.orders.length === 0) {
      console.log("Signed in with no orders — showing popup")
      setShowPopup(true)
    } else {
      console.log("Signed in with orders — not showing popup")
    }
  }, [customer])

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await fetch(`${BASE_URL}/store/promotions`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key":
              process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
          },
        })

        if (response.ok) {
          const data = await response.json()
          console.log("Fetched promotions:", data)
          setPromotions(data.promotions || data || [])
        }
      } catch (err) {
        console.error("Error fetching promotions:", err)
      }
    }

    fetchPromotions()
  }, [])

  const closePopup = () => {
    setIsClosing(true)
    setTimeout(() => {
      setShowPopup(false)
      setIsClosing(false)
    }, 300)
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closePopup()
    }
  }

  if (!showPopup) return null

  const firstPromotion = promotions[0]

  return (
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-all duration-300 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
      onClick={handleOverlayClick}
    >
      <div
        className={`bg-white shadow-2xl max-w-5xl w-full relative overflow-hidden flex h-[700px] transition-all duration-300 ease-out ${
          isClosing
            ? "scale-95 opacity-0 translate-y-4"
            : "scale-100 opacity-100 translate-y-0"
        }`}
      >
        {/* Close button */}
        <button
          onClick={closePopup}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center transition-all duration-200 z-20 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white hover:scale-110 shadow-sm"
          aria-label="Close popup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Content Section */}
        <div className="bg-white flex-1 px-8 sm:px-12 lg:px-16 py-12 sm:py-16 flex flex-col justify-center relative text-center">
          {/* Brand Name */}
          <div className="mb-6 sm:mb-8 flex justify-center">
            {/* <h1 className="font-urw text-3xl sm:text-4xl font-bold tracking-[0.25em] text-gray-900 uppercase">
              TRES
            </h1> */}
            <Image
              src="/images/tres-logo-3.svg"
              alt="Tres Triangle Logo"
              width={100}
              height={100}
              className="h-auto"
            />
          </div>

          {/* Main Content */}
          <div className="my-8">
            {firstPromotion && (
              <>
                <h2 className="font-urw text-xl sm:text-2xl text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                  Want
                </h2>
                <h3 className="font-urw text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 uppercase leading-none mb-4 sm:mb-6">
                  20% off
                </h3>
                {/* <h2 className="font-urw text-xl sm:text-2xl text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                  your order?
                </h2> */}
                <h2 className="font-urw text-xl sm:text-2xl text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                  WE'VE GOT YOU COVERED!
                </h2>
              </>
            )}
          </div>

          {/* Promotion Code Display */}
          {customer && firstPromotion && (
            <div className="mb-8">
              <div className="bg-gray-50/80 backdrop-blur-sm rounded-lg p-4 border border-gray-100">
                {/* <p className="text-sm text-gray-500 mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Use code at checkout
                </p> */}
                <div
                  className="font-mono text-base sm:text-lg font-semibold bg-white px-4 py-3 rounded-md border border-gray-200 flex flex-row justify-center items-center gap-3 text-gray-800 cursor-pointer hover:bg-gray-50 transition-all duration-200 hover:shadow-sm"
                  onClick={() => copyToClipboard(firstPromotion.code)}
                >
                  <span className="select-all">{firstPromotion.code}</span>
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </>
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link onClick={closePopup} href={"/account"}>
              <button className="w-full bg-[#99B2DD] text-white font-urw font-bold text-lg sm:text-xl uppercase tracking-wide py-4 px-8 transition-all duration-300 hover:bg-[#8AA5D3] hover:shadow-lg active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#99B2DD] focus:ring-offset-2">
                Yes Please
              </button>
            </Link>

            <button
              onClick={closePopup}
              className="w-full text-gray-500 font-urw text-base sm:text-lg py-3 transition-all duration-200 hover:text-gray-700 underline decoration-1 underline-offset-4 hover:decoration-2"
            >
              No thanks, I don't want a discount
            </button>
          </div>
        </div>

        {/* Right Image Section */}
        <div className="flex-1 relative h-[700px] hidden md:block">
          <Image
            src="https://storage.tres.my/promotion_banner_1.JPG"
            alt="Fashion models"
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
            sizes="50vw"
            priority
          />

          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-transparent" />
        </div>
      </div>
    </div>
  )
}

export default FirstOrderPopup
