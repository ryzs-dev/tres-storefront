import { HttpTypes } from "@medusajs/types"
import { Button, Select } from "@medusajs/ui"
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

  return (
    <div className="flex flex-col gap-y-3">
      <span className="text-sm">Select {title}</span>

      {isColorOption ? (
        <Select
          value={current}
          onValueChange={(value) => updateOption(option.id, value)}
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
                onClick={() => updateOption(option.id, v)}
                key={v}
                className={`w-full text-sm h-10 rounded p-2 flex items-center justify-center gap-2 ${
                  isSelected ? "bg-gray-100" : "hover:shadow-md"
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
