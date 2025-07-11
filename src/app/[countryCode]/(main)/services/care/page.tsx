"use client"

import Image from "next/image"
import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

const TresCare = () => {
  const [openSections, setOpenSections] = useState<string[]>([])

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    )
  }

  const isOpen = (section: string) => openSections.includes(section)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="max-w-2xl mx-auto px-6 pt-16 pb-12 text-center">
        <h1 className="font-urw text-2xl font-bold text-gray-900">TRES CARE</h1>
        <p className="text-gray-600 mt-4">
          Everything you need to know about caring for your sportswear
        </p>
      </div>

      {/* Dropdown Sections */}
      <div className="max-w-2xl mx-auto px-6 pb-20">
        {/* Washing Instructions */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection("washing-instructions")}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🧼</span>
              <span className="font-semibold text-gray-900">
                Washing Instructions to Extend the Lifespan of Your Sportswear
              </span>
            </div>
            {isOpen("washing-instructions") ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          {isOpen("washing-instructions") && (
            <div className="p-6 bg-white border border-gray-200 rounded-b-lg">
              <p className="text-gray-700 leading-relaxed">
                Think of your sportswear as your workout partner—it performs
                best when you treat it right. Whether it's a tank top, gym
                shorts, or your favorite pair of running tights, caring for it
                properly helps retain shape, performance, and freshness.
              </p>
            </div>
          )}
        </div>

        {/* Read the Label */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection("read-label")}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🏷️</span>
              <span className="font-semibold text-gray-900">
                Read the Label First
              </span>
            </div>
            {isOpen("read-label") ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          {isOpen("read-label") && (
            <div className="p-6 bg-white border border-gray-200 rounded-b-lg">
              <p className="text-gray-700 leading-relaxed">
                Every garment comes with a story—and a care tag. That small
                white label inside your activewear? It holds the key to washing
                it right. Look out for symbols that tell you whether you can
                bleach, tumble dry, or iron your apparel. Don't ignore it—your
                sportswear will thank you.
              </p>
            </div>
          )}
        </div>

        {/* Key Washing Tips */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection("washing-tips")}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">💡</span>
              <span className="font-semibold text-gray-900">
                Key Washing Tips for Activewear
              </span>
            </div>
            {isOpen("washing-tips") ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          {isOpen("washing-tips") && (
            <div className="p-6 bg-white border border-gray-200 rounded-b-lg">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <span className="text-green-600 font-bold">✔</span>
                  <div>
                    <strong>Use a gentle detergent</strong> — Harsh detergents
                    break down the elastic fibres in nylon and polyester. Keep
                    it light and soft.
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="text-red-600 font-bold">❌</span>
                  <div>
                    <strong>Skip the fabric softener</strong> — It might smell
                    nice, but it coats technical fabrics and reduces
                    breathability and stretch.
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="text-blue-600 font-bold">🧺</span>
                  <div>
                    <strong>
                      Use a laundry bag (especially in machine washes)
                    </strong>{" "}
                    — It prevents snags from zippers, Velcro, and rogue hooks.
                    And yes, it keeps your gym gear in its own little spa
                    bubble.
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="text-red-600 font-bold">🚫</span>
                  <div>
                    <strong>Don't overload the machine</strong> — Your
                    sportswear needs room to breathe and get thoroughly cleaned.
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="text-blue-600 font-bold">🧼</span>
                  <div>
                    <strong>Hand washing?</strong> — Avoid hot water soaks.
                    Quick rinse and gentle swish is all you need.
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="text-green-600 font-bold">🧴</span>
                  <div>
                    <strong>Wash after every use</strong> — Sweat can weaken
                    elastic over time and build odor. The sooner you wash, the
                    fresher your gear stays.
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex gap-3">
                  <span>👜</span>
                  <div>
                    <strong>Bonus gym tip:</strong> Going from workout to work?
                    Air dry your sweaty gear before stuffing it in your bag.
                    Trust us—this prevents stubborn smells from settling in.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drying */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection("drying")}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🌬️</span>
              <span className="font-semibold text-gray-900">
                Tumble Drying vs Air Drying
              </span>
            </div>
            {isOpen("drying") ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          {isOpen("drying") && (
            <div className="p-6 bg-white border border-gray-200 rounded-b-lg">
              <p className="text-gray-700 leading-relaxed">
                Both are fine <em>if</em> you do it right. Always{" "}
                <strong>dry in low heat</strong>, whether you're tumble drying
                or hanging it out. For air drying, avoid direct sunlight—UV rays
                can break down the fabric over time. High heat? That's a hard
                no.
              </p>
            </div>
          )}
        </div>

        {/* Storage */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection("storage")}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">📦</span>
              <span className="font-semibold text-gray-900">
                Aftercare & Storage
              </span>
            </div>
            {isOpen("storage") ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          {isOpen("storage") && (
            <div className="p-6 bg-white border border-gray-200 rounded-b-lg">
              <p className="text-gray-700 leading-relaxed">
                Once dry, <strong>fold your gear</strong>. Hanging it can
                stretch out the fabric, especially over time. Neat drawers {">"}{" "}
                stretched shoulders.
              </p>
            </div>
          )}
        </div>

        {/* FAQs */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection("faqs")}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🧠</span>
              <span className="font-semibold text-gray-900">
                FAQs on Sportswear Care
              </span>
            </div>
            {isOpen("faqs") ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          {isOpen("faqs") && (
            <div className="p-6 bg-white border border-gray-200 rounded-b-lg">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Q1: Can I wash my activewear with regular clothes?
                  </h3>
                  <p className="text-gray-700">
                    <strong>A1:</strong> Best not to. Keep it separate from
                    heavy jeans or delicate fabrics like wool. Mixed materials =
                    messy results.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Q2: There's no activewear setting on my machine—what now?
                  </h3>
                  <p className="text-gray-700">
                    <strong>A2:</strong> Use the{" "}
                    <strong>delicate or cold wash</strong> cycle. Your gear
                    likes gentle movement and cool temps.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Q3: How do I treat stains on my activewear?
                  </h3>
                  <p className="text-gray-700">
                    <strong>A3:</strong> Spot clean with warm water depending on
                    the stain. Don't soak the whole item—focus on the area that
                    needs attention.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center pt-8 mt-8 border-t border-gray-200">
          <p className="text-gray-600">
            Take care of your <strong>TRES</strong> gear, and it'll take care of
            you.
          </p>
        </div>
      </div>
    </div>
  )
}

export default TresCare
