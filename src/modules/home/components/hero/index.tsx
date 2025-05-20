import Image from "next/image"
import { Button, Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type HeroProps = {
  imageUrl: string
  content: string
  cta?: boolean
  subtitle?: string
  position?:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "center"
    | "top"
    | "bottom"
}

const getPositionClasses = (position: HeroProps["position"]) => {
  switch (position) {
    case "top-left":
      return "justify-start items-start text-left"
    case "top-right":
      return "justify-start items-end text-right"
    case "bottom-left":
      return "justify-end items-start text-left"
    case "bottom-right":
      return "justify-end items-end text-right"
    case "center":
      return "justify-center items-center text-center"
    case "top":
      return "justify-start items-center text-center"
    case "bottom":
      return "justify-end items-center text-center"
    default:
      return "justify-center items-center text-center" // fallback
  }
}

const Hero = ({ imageUrl, content, cta, subtitle, position }: HeroProps) => {
  return (
    <div className="h-screen w-full border-b border-ui-border-base relative">
      <Image
        src={imageUrl}
        fill
        alt="Hero background"
        className="object-cover object-[75%_20%]"
        priority
      />
      <div
        className={`absolute inset-0 z-10 flex flex-col p-8 small:px-32 gap-6 ${getPositionClasses(
          position
        )}`}
      >
        <span className="flex flex-col gap-4">
          {subtitle && (
            <Text
              family="urw"
              size="large"
              className="font-urwCond text-3xl text-white"
            >
              {subtitle}
            </Text>
          )}
          <Heading
            level="h1"
            className="text-5xl sm:text-7xl leading-tight text-white font-urw font-normal m-0 p-0"
          >
            {content}
          </Heading>
        </span>
        {cta && (
          <LocalizedClientLink href={`/store`}>
            <Button variant="secondary" size="large">
              Shop Now
            </Button>
          </LocalizedClientLink>
        )}
      </div>
    </div>
  )
}

export default Hero
