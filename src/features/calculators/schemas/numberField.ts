import { z } from 'zod'
import type { CalculatorValidationKey } from '@/features/calculators/types'

// Error messages are i18n keys (see calculatorPages.validation); empty input is NaN.
// "range|min|max" carries the limits for the message placeholders {0} and {1}.
const validationKey = (key: CalculatorValidationKey) => key
const rangeMessage = (min: number, max: number) =>
  `${validationKey('range')}|${min}|${max}`

type NumberFieldOptions = {
  // Whole numbers only (years, months, children)
  isInteger?: boolean
  // Multiples of 0.5 only (child allowance counter)
  isHalfStep?: boolean
}

export const numberField = (
  min: number,
  max: number,
  options: NumberFieldOptions = {},
) => {
  let field = z.number({ error: validationKey('invalid') })
  if (options.isInteger) field = field.int(validationKey('wholeNumber'))
  field = field.min(min, rangeMessage(min, max)).max(max, rangeMessage(min, max))

  return options.isHalfStep
    ? field.refine((value) => Number.isInteger(value * 2), validationKey('halfStep'))
    : field
}
