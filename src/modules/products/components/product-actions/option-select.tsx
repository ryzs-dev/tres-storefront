import { HttpTypes } from "@medusajs/types"
import { Button, Select } from "@medusajs/ui"
import { X } from "lucide-react"
import React from "react"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
}

const colorMap: Record<string, string> = {
  "sonic pink": "#E157B1",
  "electric blue": "#114EB8",
  pistachio: "#798835",
  scarlet: "#E42E3B",
  violet: "#A05F9B",
  black: "#000000",
  white: "#FFFFFF",
  peach: "#FFDAB9",
  grey: "#212326",
  pink: "#BD3C7B",
  green: "#025D40",
  purple: "#802D57",
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  disabled,
  "data-testid": dataTestId,
}) => {
  const filteredOptions = (option.values ?? []).map((v) => v.value)
  const isColorOption = /color|colour/i.test(option.title || "")

  // Handle clearing selection
  const handleClearSelection = () => {
    updateOption(option.id, "")
  }

  return (
    <div className="flex flex-col gap-y-3">
      <span className="text-sm">Select {title}</span>

      {isColorOption ? (
        <div className="relative">
          <Select
            value={current || ""} // Ensure we handle undefined
            onValueChange={(value) => {
              console.log(`🎨 Color option changed:`, {
                optionId: option.id,
                value,
              })
              updateOption(option.id, value)
            }}
            disabled={disabled}
          >
            <Select.Trigger data-testid={dataTestId} className="w-full">
              <Select.Value placeholder="Choose a Color" />
            </Select.Trigger>
            <Select.Content>
              {filteredOptions.map((value) => {
                const normalized = value.toLowerCase().trim()
                const color = colorMap[normalized] || "#E5E7EB"

                return (
                  <Select.Item key={value} value={value}>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: color }}
                      />
                      <span>{value}</span>
                    </div>
                  </Select.Item>
                )
              })}
            </Select.Content>
          </Select>

          {/* Clear button with X icon */}
          {current && (
            <Button
              variant="transparent"
              size="small"
              onClick={handleClearSelection}
              disabled={disabled}
              className="absolute right-8 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100 rounded-full"
            >
              <X className="h-3 w-3 text-gray-500" />
            </Button>
          )}
        </div>
      ) : (
        <div
          className="flex flex-row justify-start gap-2"
          data-testid={dataTestId}
        >
          {filteredOptions.map((v) => {
            const isSelected = v === current
            return (
              <Button
                variant="secondary"
                onClick={() => {
                  console.log(`📏 Size option changed:`, {
                    optionId: option.id,
                    value: v,
                    wasSelected: isSelected,
                  })
                  // If already selected, deselect it (clear selection)
                  if (isSelected) {
                    updateOption(option.id, "")
                  } else {
                    updateOption(option.id, v)
                  }
                }}
                key={v}
                className={`w-full text-sm h-10 rounded p-2 flex items-center justify-center gap-2 ${
                  isSelected
                    ? "bg-gray-100 border-2 border-black"
                    : "hover:shadow-md"
                }`}
                disabled={disabled}
              >
                {v}
              </Button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default OptionSelect
