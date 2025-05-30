import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import React from "react"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
}

// Define your color values here
const colorMap: Record<string, string> = {
  "sonic pink": "#FF69B4",
  "electric blue": "#7DF9FF",
  pistachio: "#93C572",
  scarlet: "#FF2400",
  violet: "#8F00FF",
  black: "#000000",
  white: "#FFFFFF",
  peach: " #FFDAB9",
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
}) => {
  const filteredOptions = (option.values ?? []).map((v) => v.value)
  const isColorOption = /color|colour/i.test(option.title || "")

  return (
    <div className="flex flex-col gap-y-3">
      <span className="text-sm">Select {title}</span>
      <div
        className="flex flex-row justify-start gap-2"
        data-testid={dataTestId}
      >
        {filteredOptions.map((v) => {
          const isSelected = v === current
          const normalized = v.toLowerCase().trim()
          const color = colorMap[normalized] || "#E5E7EB"

          return (
            <button
              onClick={() => updateOption(option.id, v)}
              key={v}
              className={clx(
                "w-full border-ui-border-base bg-ui-bg-subtle border text-small-regular h-10 rounded-rounded p-2 flex flex-row items-center justify-center gap-2",
                {
                  "border-ui-border-interactive": isSelected,
                  "hover:shadow-elevation-card-rest transition-shadow ease-in-out duration-150":
                    v !== current,
                }
              )}
              disabled={disabled}
              data-testid="option-button"
            >
              {isColorOption && (
                <span
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: color }}
                ></span>
              )}
              <span>{v}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OptionSelect
