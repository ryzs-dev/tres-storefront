import Image from "next/image"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ChevronRight } from "lucide-react"

type HeroProps = {
  imageUrl: string
  title: string
  subtitle?: string
  ctaText?: string
  ctaLink?: string
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

const Hero2 = ({
  imageUrl,
  ctaLink,
  ctaText,
  title,
  subtitle,
  position,
  objectPosition = "center",
  textColor = "text-tres-primary",
}: HeroProps) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    ctaText ? (
      <LocalizedClientLink href="/collections/unbuckle" className="block">
        {children}
      </LocalizedClientLink>
    ) : (
      <div>{children}</div>
    )

  return (
    <Wrapper>
      <div className="h-[30vh] lg:h-[90vh] pt-16 w-full border-b border-ui-border-base relative">
        <Image
          src={imageUrl}
          fill
          priority
          alt="Hero background"
          className="object-cover"
          style={{ objectPosition }}
        />

        {/* Content Overlay */}
        <div className="absolute inset-0 z-10 flex flex-col items-start lg:justify-center justify-end px-6 mb-16 md:mb-0">
          <span className="flex flex-col sm:gap-2">
            {/* Title */}
            <Heading
              level="h1"
              className={`text-5xl md:text-8xl whitespace-pre-line leading-tight font-urw italic font-normal mt-10 p-0 text-start ${
                textColor ?? "text-tres-primary"
              }`}
            >
              {title}
            </Heading>

            {/* Subtitle */}
            {subtitle && (
              <Text
                family="sans"
                size="base"
                className={`font-urwCond text-xs md:text-xl text-start ${
                  textColor ?? "text-tres-primary"
                }`}
              >
                {subtitle}
              </Text>
            )}

            {/* CTA */}
            {ctaText && ctaLink && (
              <div className="mt-2 lg:mt-8 flex">
                <LocalizedClientLink
                  href={ctaLink}
                  className="justify-start inline-block text-center px-6 py-2 bg-tres-primary text-tres-secondary font-semibold hover:bg-tres-secondary hover:text-tres-primary transition-colors"
                >
                  {ctaText}
                </LocalizedClientLink>
              </div>
            )}
          </span>
        </div>
      </div>
    </Wrapper>
  )
}

export default Hero2
