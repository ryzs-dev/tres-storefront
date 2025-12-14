"use client"

import { HttpTypes } from "@medusajs/types"
import { useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

interface Props {
  customer?: HttpTypes.StoreCustomer | null
}

const ChristmasPopup = ({ customer }: Props) => {
  const [isOpen, setIsOpen] = useState(true)

  const closePopup = () => setIsOpen(false)
  const openPopup = () => setIsOpen(true)

  return (
    <>
      {/* RE-OPEN BUTTON */}
      {!isOpen && (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={openPopup}
          className="
            fixed bottom-6 right-6 z-50
            bg-tres-secondary text-tres-primary font-semibold
            rounded-full shadow-lg px-4 py-2 
            hover:bg-tres-secondary/90 transition
          "
        >
          MERRY CHRISTMAS
        </motion.button>
      )}

      {/* POPUP */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="
              fixed inset-0 bg-black/50 backdrop-blur-sm z-50
              flex items-center justify-center p-3 sm:p-6 lg:p-8
            "
          >
            {/* POPUP CARD */}
            <motion.div
              key="content"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="
                bg-tres-secondary shadow-2xl max-w-xs sm:max-w-5xl w-full 
                relative overflow-hidden flex flex-col md:flex-row-reverse 
                rounded-lg
              "
            >
              {/* Close button */}
              <button
                onClick={closePopup}
                className="absolute top-3 right-3 sm:top-6 sm:right-6 text-[#767154] hover:text-[#354037] w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center transition-all duration-200 z-20 bg-tres-secondary/90 backdrop-blur-sm rounded-full hover:bg-tres-secondary hover:scale-110 shadow-sm"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Image */}
              <div className="w-full md:w-1/2 relative h-40 sm:h-96 md:h-auto min-h-[200px] sm:min-h-[300px]">
                <Image
                  src="https://storage.tres.my/christmas/christmas_banner_1.png"
                  alt="Christmas Banner"
                  fill
                  className="object-cover object-[50%_50%] transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 50vw"
                  priority
                />

                {/* Overlay */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-tres-secondary/10 via-transparent to-transparent
                                flex items-center justify-center"
                >
                  <span className="text-white text-center text-2xl sm:text-4xl md:text-5xl font-bold tracking-wide">
                    HOLIDAY <br /> SALE
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="bg-tres-secondary w-full md:w-1/2 px-4 sm:px-10 lg:px-16 py-6 sm:py-16 flex flex-col justify-center relative text-center">
                <div className="mb-4 sm:mb-8 flex justify-center">
                  <Image
                    src="/images/tres-logo-3.svg"
                    alt="Tres Triangle Logo"
                    width={60}
                    height={60}
                    className="h-auto sm:w-[100px] sm:h-[100px]"
                  />
                </div>

                <div className="my-3 sm:my-4 space-y-2 sm:space-y-3">
                  <h2 className="font-urw text-lg sm:text-3xl font-bold text-[#354037] leading-tight">
                    Merry Christmas !
                  </h2>

                  <p className="text-sm sm:text-lg text-[#767154] leading-relaxed">
                    {customer ? (
                      <>
                        Hi {customer.first_name || "there"}! Enjoy our festive{" "}
                        <strong className="text-tres-primary">20% off</strong>{" "}
                        this holiday season!
                      </>
                    ) : (
                      <>
                        Celebrate the season with{" "}
                        <strong className="text-tres-primary">20% off</strong>{" "}
                        all items. Limited time only!
                      </>
                    )}
                  </p>

                  <p className="text-xs sm:text-base text-tres-beige italic">
                    Spread joy with the perfect gift
                  </p>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <Link
                    onClick={closePopup}
                    href={customer ? "/bundles" : "/account"}
                  >
                    <button className="w-full bg-tres-primary text-tres-secondary font-urw font-bold text-base sm:text-xl uppercase tracking-wide py-3 sm:py-4 px-6 sm:px-8 transition-all duration-300 hover:bg-tres-primary/90 hover:shadow-lg active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-tres-primary focus:ring-offset-2">
                      Shop Now
                    </button>
                  </Link>

                  <p className="text-xs sm:text-sm text-tres-beige italic mt-2">
                    Code auto-applied at checkout
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ChristmasPopup
