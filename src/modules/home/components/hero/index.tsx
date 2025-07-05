import Image from "next/image"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ChevronRight } from "lucide-react"

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
  objectPosition?: string
  textColor?: string
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
      return "justify-center items-center text-center"
  }
}

const Hero = ({
  imageUrl,
  content,
  cta,
  subtitle,
  position,
  objectPosition = "center",
  textColor = "text-white",
}: HeroProps) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    cta ? (
      <LocalizedClientLink href="/collections/unbuckle" className="block">
        {children}
      </LocalizedClientLink>
    ) : (
      <div>{children}</div>
    )

  return (
    <Wrapper>
      <div className="h-[50vh] lg:h-[60vh] w-full border-b border-ui-border-base relative group">
        <Image
          src={imageUrl}
          fill
          alt="Hero background"
          className={`object-cover object-[${objectPosition}]`}
          priority
        />

        <div
          className={`absolute inset-0 z-10 flex flex-col ${getPositionClasses(
            position
          )}`}
        >
          <div className="w-full mx-auto flex flex-col gap-6">
            <div className="flex flex-row">
              <span className="flex flex-col items-center gap-4">
                <Heading
                  level="h1"
                  className={`text-lg sm:text-4xl leading-tight font-urw font-light p-4 ${textColor}`}
                >
                  {content}
                </Heading>
                {subtitle && (
                  <Text
                    family="sans"
                    size="large"
                    className={`font-urwCond text-3xl ${textColor}`}
                  >
                    {subtitle}
                  </Text>
                )}
              </span>

              {cta && (
                <Text
                  family="sans"
                  size="large"
                  className={`font-urwCond text-lg ${textColor}`}
                >
                  <ChevronRight className="inline ml-4" />
                </Text>
              )}
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  )
}

export default Hero
