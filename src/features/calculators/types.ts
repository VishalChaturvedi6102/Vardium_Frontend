import type { Messages } from '@/i18n/locales/de'

export type CalculatorUnit = 'euro' | 'percent' | 'years' | 'months'

export type CalculatorOptionGroup = keyof Messages['calculatorPages']['options']

export type CalculatorFieldDefinition<Name extends string> =
  | { kind: 'number'; name: Name; unit?: CalculatorUnit }
  | { kind: 'select'; name: Name; optionGroup: CalculatorOptionGroup }
  | { kind: 'checkbox'; name: Name }

export type ResultMetric = {
  id: string
  label: string
  value: string
  isPrimary?: boolean
}

// Lead handed to the contact form: topic value + readable summary of inputs and result.
export type CalculatorLead = {
  consultationTopic: string
  message: string
}

export type CalculatorValidationKey = keyof Messages['calculatorPages']['validation']
