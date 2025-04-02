import Image from "next/image"
import { Button, Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type HeroProps = {
  imageUrl: string
  content: string
  cta?: boolean
}

const Hero = ({ imageUrl, content, cta }: HeroProps) => {
  return (
    <div className="h-screen w-full border-b border-ui-border-base relative">
      {/* Background Image */}
      <Image
        src={imageUrl}
        alt="Hero background"
        layout="fill"
        objectFit="cover"
        objectPosition="center"
        priority
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Hero Content */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-start px-6 small:px-32 gap-6">
        <span>
          <Heading
            level="h1"
            className="text-5xl sm:text-7xl leading-tight text-white font-urw font-normal m-0 p-0"
          >
            {content}
          </Heading>
          <Text
            family="urw"
            size="large"
            className="font-urwCond text-xl text-white"
          >
            Strong | Sassy | Solid
          </Text>
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
