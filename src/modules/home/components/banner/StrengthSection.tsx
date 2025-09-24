import { Heading, Text } from "@medusajs/ui"
import { Dumbbell, Sparkles, Heart, BicepsFlexed } from "lucide-react" // Example icons

const StrengthSection = () => {
  return (
    <section className="w-full py-16 bg-gray-100">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-12 text-center">
        {/* Strong */}
        <div className="flex flex-col items-center">
          <BicepsFlexed strokeWidth={1.5} size={48} className="text-black" />
          <Heading level="h3" className="text-lg font-semibold mt-4 font-urw">
            STRONG
          </Heading>
          <Text className="text-gray-600 font-urwCond">
            Empowering you with confidence and resilience in every step.
          </Text>
        </div>

        {/* Sassy */}
        <div className="flex flex-col items-center">
          <Sparkles strokeWidth={1.5} size={48} className="text-black" />
          <Heading level="h3" className="text-lg font-semibold mt-4 font-urw">
            SASSY
          </Heading>
          <Text className="text-gray-600 font-urwCond">
            Unapologetically bold, stylish, and full of attitude.
          </Text>
        </div>

        {/* Solid */}
        <div className="flex flex-col items-center">
          <Dumbbell strokeWidth={1.5} size={48} className="text-black" />
          <Heading level="h3" className="text-lg font-semibold mt-4 font-urw">
            SOLID
          </Heading>
          <Text className="text-gray-600 font-urwCond">
            Built to last, with quality and durability at its core.
          </Text>
        </div>
      </div>
    </section>
  )
}

export default StrengthSection
