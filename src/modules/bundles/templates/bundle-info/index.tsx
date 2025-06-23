import { FlexibleBundle } from "@lib/data/bundles"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type BundleInfoProps = {
  bundle: FlexibleBundle
}

const BundleInfo = ({ bundle }: BundleInfoProps) => {
  return (
    <div id="bundle-info">
      <div className="flex flex-col gap-y-4 lg:max-w-[500px] mx-auto">
        {/* Bundle Title */}
        <h1 className="text-3xl font-semibold">{bundle.title}</h1>

        {/* Bundle Subtitle / Description */}
        {bundle.description && (
          <Heading
            level="h2"
            className="text-xl text-ui-fg-base"
            data-testid="bundle-subtitle"
          >
            {bundle.description}
          </Heading>
        )}
      </div>
    </div>
  )
}

export default BundleInfo
