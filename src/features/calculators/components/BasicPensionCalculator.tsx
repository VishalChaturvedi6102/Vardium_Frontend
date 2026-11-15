import { CalculatorFieldList } from '@/features/calculators/components/CalculatorFieldList'
import { CalculatorPageLayout } from '@/features/calculators/components/CalculatorPageLayout'
import { calculateBasicPension } from '@/features/calculators/engine/basicPension'
import { useCalculatorForm } from '@/features/calculators/hooks/useCalculatorForm'
import { buildLeadMessage } from '@/features/calculators/lib/buildLeadMessage'
import { toChurchTaxRatePercent } from '@/features/calculators/lib/employeeInputs'
import {
  basicPensionSchema,
  type BasicPensionFormValues,
} from '@/features/calculators/schemas/taxCalculatorSchemas'
import type {
  CalculatorFieldDefinition,
  ResultMetric,
} from '@/features/calculators/types'
import { useFormatters } from '@/hooks/useFormatters'
import { useI18n } from '@/i18n/useI18n'

const defaultBasicPensionValues: BasicPensionFormValues = {
  taxableIncome: 60_000,
  assessment: 'single',
  annualContribution: 3000,
  existingPensionContributions: 0,
  churchTax: 'none',
}

const fieldDefinitions: CalculatorFieldDefinition<keyof BasicPensionFormValues>[] = [
  { kind: 'number', name: 'taxableIncome', unit: 'euro' },
  { kind: 'select', name: 'assessment', optionGroup: 'assessment' },
  { kind: 'number', name: 'annualContribution', unit: 'euro' },
  { kind: 'number', name: 'existingPensionContributions', unit: 'euro' },
  { kind: 'select', name: 'churchTax', optionGroup: 'churchTax' },
]

export function BasicPensionCalculator() {
  const { messages } = useI18n()
  const { fields, results, note } = messages.calculatorPages['ruerup-steuervorteil']
  const format = useFormatters()
  const form = useCalculatorForm(basicPensionSchema, defaultBasicPensionValues)
  const { inputs } = form

  const result =
    inputs &&
    calculateBasicPension({
      taxableIncome: inputs.taxableIncome,
      isJointAssessment: inputs.assessment === 'joint',
      annualContribution: inputs.annualContribution,
      existingPensionContributions: inputs.existingPensionContributions,
      churchTaxRatePercent: toChurchTaxRatePercent(inputs.churchTax),
    })
  const metrics: ResultMetric[] | null = result && [
    {
      id: 'taxSavings',
      label: results.taxSavings,
      value: format.currency(result.taxSavings),
      isPrimary: true,
    },
    {
      id: 'deductibleAmount',
      label: results.deductibleAmount,
      value: format.currency(result.deductibleAmount),
    },
    { id: 'netCost', label: results.netCost, value: format.currency(result.netCost) },
    {
      id: 'savingsRate',
      label: results.savingsRate,
      value: format.percent(result.savingsRatePercent, 1),
    },
  ]

  const lead =
    inputs && metrics
      ? {
          consultationTopic: 'retirement-provision',
          message: buildLeadMessage(
            messages.calculators.items['ruerup-steuervorteil'].title,
            [
              {
                label: fields.taxableIncome,
                value: format.currency(inputs.taxableIncome),
              },
              {
                label: fields.annualContribution,
                value: format.currency(inputs.annualContribution),
              },
              ...metrics.slice(0, 1),
            ],
          ),
        }
      : null

  return (
    <CalculatorPageLayout
      calculatorId="ruerup-steuervorteil"
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
