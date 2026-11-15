import { CalculatorFieldList } from '@/features/calculators/components/CalculatorFieldList'
import { CalculatorPageLayout } from '@/features/calculators/components/CalculatorPageLayout'
import { calculateCompanyPension } from '@/features/calculators/engine/companyPension'
import { useCalculatorForm } from '@/features/calculators/hooks/useCalculatorForm'
import { buildLeadMessage } from '@/features/calculators/lib/buildLeadMessage'
import {
  defaultEmployeeValues,
  employeeFieldDefinitions,
  toGrossToNetInput,
} from '@/features/calculators/lib/employeeInputs'
import { companyPension } from '@/features/calculators/parameters/taxYear2026'
import {
  companyPensionSchema,
  type CompanyPensionFormValues,
} from '@/features/calculators/schemas/taxCalculatorSchemas'
import type {
  CalculatorFieldDefinition,
  ResultMetric,
} from '@/features/calculators/types'
import { useFormatters } from '@/hooks/useFormatters'
import { useI18n } from '@/i18n/useI18n'

const defaultCompanyPensionValues: CompanyPensionFormValues = {
  ...defaultEmployeeValues,
  monthlyConversion: 200,
  employerSubsidyPercent: companyPension.mandatoryEmployerSubsidyPercent,
}

const fieldDefinitions: CalculatorFieldDefinition<keyof CompanyPensionFormValues>[] = [
  ...employeeFieldDefinitions,
  { kind: 'number', name: 'monthlyConversion', unit: 'euro' },
  { kind: 'number', name: 'employerSubsidyPercent', unit: 'percent' },
]

export function CompanyPensionCalculator() {
  const { messages } = useI18n()
  const { fields, results, note } = messages.calculatorPages.bav
  const format = useFormatters()
  const form = useCalculatorForm(companyPensionSchema, defaultCompanyPensionValues)
  const { inputs } = form

  const result =
    inputs &&
    calculateCompanyPension({
      ...toGrossToNetInput(inputs),
      monthlyConversion: inputs.monthlyConversion,
      employerSubsidyPercent: inputs.employerSubsidyPercent,
    })
  const metrics: ResultMetric[] | null = result && [
    {
      id: 'netCost',
      label: results.netCost,
      value: format.currency(result.netCost, 2),
      isPrimary: true,
    },
    {
      id: 'totalContribution',
      label: results.totalContribution,
      value: format.currency(result.totalContribution, 2),
    },
    {
      id: 'employerSubsidy',
      label: results.employerSubsidy,
      value: format.currency(result.employerSubsidy, 2),
    },
    {
      id: 'savings',
      label: results.savings,
      value: format.currency(result.taxAndSocialSecuritySavings, 2),
    },
    {
      id: 'netWithoutConversion',
      label: results.netWithoutConversion,
      value: format.currency(result.netWithoutConversion, 2),
    },
    {
      id: 'netWithConversion',
      label: results.netWithConversion,
      value: format.currency(result.netWithConversion, 2),
    },
  ]

  const lead =
    inputs && metrics
      ? {
          consultationTopic: 'retirement-provision',
          message: buildLeadMessage(messages.calculators.items.bav.title, [
            { label: fields.monthlyGross, value: format.currency(inputs.monthlyGross) },
            {
              label: fields.monthlyConversion,
              value: format.currency(inputs.monthlyConversion),
            },
            ...metrics.slice(0, 2),
          ]),
        }
      : null

  return (
    <CalculatorPageLayout
      calculatorId="bav"
      calculation={form.calculation}
      metrics={metrics}
      lead={lead}
      note={note}
      fields={
        <CalculatorFieldList definitions={fieldDefinitions} labels={fields} form={form} />
      }
    />
  )
}
