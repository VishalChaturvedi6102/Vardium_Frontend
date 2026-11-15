import type { GrossToNetInput } from '@/features/calculators/engine/grossToNet'
import type { TaxClass } from '@/features/calculators/engine/wageTax'
import type { GrossToNetFormValues } from '@/features/calculators/schemas/taxCalculatorSchemas'
import type { CalculatorFieldDefinition } from '@/features/calculators/types'
import { socialSecurity } from '@/features/calculators/parameters/taxYear2026'

export const toChurchTaxRatePercent = (churchTax: string): number =>
  churchTax === 'none' ? 0 : Number(churchTax)

export const defaultEmployeeValues: GrossToNetFormValues = {
  monthlyGross: 4000,
  taxClass: '1',
  churchTax: 'none',
  childrenCount: 0,
  childAllowanceCount: 0,
  healthAdditionalRatePercent: socialSecurity.averageHealthAdditionalRatePercent,
  isSaxony: false,
}

export const employeeFieldDefinitions: CalculatorFieldDefinition<
  keyof GrossToNetFormValues
>[] = [
  { kind: 'number', name: 'monthlyGross', unit: 'euro' },
  { kind: 'select', name: 'taxClass', optionGroup: 'taxClass' },
  { kind: 'select', name: 'churchTax', optionGroup: 'churchTax' },
  { kind: 'number', name: 'childrenCount' },
  { kind: 'number', name: 'childAllowanceCount' },
  { kind: 'number', name: 'healthAdditionalRatePercent', unit: 'percent' },
  { kind: 'checkbox', name: 'isSaxony' },
]

// Form values (strings for selects) -> engine input
export const toGrossToNetInput = (values: GrossToNetFormValues): GrossToNetInput => ({
  monthlyGross: values.monthlyGross,
  taxClass: Number(values.taxClass) as TaxClass,
  childAllowanceCount: values.childAllowanceCount,
  childrenCount: values.childrenCount,
  churchTaxRatePercent: toChurchTaxRatePercent(values.churchTax),
  healthAdditionalRatePercent: values.healthAdditionalRatePercent,
  isSaxony: values.isSaxony,
})
