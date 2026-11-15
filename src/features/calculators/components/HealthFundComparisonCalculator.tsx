import { CalculatorFieldList } from '@/features/calculators/components/CalculatorFieldList'
import { CalculatorPageLayout } from '@/features/calculators/components/CalculatorPageLayout'
import { HealthFundRateTable } from '@/features/calculators/components/HealthFundRateTable'
import { calculateHealthFundSavings } from '@/features/calculators/engine/healthFundComparison'
import { useCalculatorForm } from '@/features/calculators/hooks/useCalculatorForm'
import { buildLeadMessage } from '@/features/calculators/lib/buildLeadMessage'
import { socialSecurity } from '@/features/calculators/parameters/taxYear2026'
import {
  healthFundComparisonSchema,
  type HealthFundComparisonFormValues,
} from '@/features/calculators/schemas/taxCalculatorSchemas'
import type {
  CalculatorFieldDefinition,
  ResultMetric,
} from '@/features/calculators/types'
import { useFormatters } from '@/hooks/useFormatters'
import { useI18n } from '@/i18n/useI18n'

const defaultHealthFundValues: HealthFundComparisonFormValues = {
  monthlyIncome: 4000,
  employmentStatus: 'employee',
  currentRatePercent: 3.2,
  newRatePercent: socialSecurity.averageHealthAdditionalRatePercent,
}

const fieldDefinitions: CalculatorFieldDefinition<
  keyof HealthFundComparisonFormValues
>[] = [
  { kind: 'number', name: 'monthlyIncome', unit: 'euro' },
  { kind: 'select', name: 'employmentStatus', optionGroup: 'employmentStatus' },
  { kind: 'number', name: 'currentRatePercent', unit: 'percent' },
  { kind: 'number', name: 'newRatePercent', unit: 'percent' },
]

export function HealthFundComparisonCalculator() {
  const { messages } = useI18n()
  const { fields, results, note } = messages.calculatorPages['gkv-vergleich']
  const format = useFormatters()
  const form = useCalculatorForm(healthFundComparisonSchema, defaultHealthFundValues)
  const { inputs } = form

  const result = inputs && calculateHealthFundSavings(inputs)
  const metrics: ResultMetric[] | null = result && [
    {
      id: 'annualSavings',
      label: results.annualSavings,
      value: format.currency(result.annualSavings),
      isPrimary: true,
    },
    {
      id: 'monthlySavings',
      label: results.monthlySavings,
      value: format.currency(result.monthlySavings, 2),
    },
  ]

  const lead =
    inputs && metrics
      ? {
          consultationTopic: 'insurance',
          message: buildLeadMessage(messages.calculators.items['gkv-vergleich'].title, [
            { label: fields.monthlyIncome, value: format.currency(inputs.monthlyIncome) },
            {
              label: fields.currentRatePercent,
              value: format.percent(inputs.currentRatePercent),
            },
            {
              label: fields.newRatePercent,
              value: format.percent(inputs.newRatePercent),
            },
            ...metrics.slice(0, 1),
          ]),
        }
      : null

  return (
    <CalculatorPageLayout
      calculatorId="gkv-vergleich"
      calculation={form.calculation}
      metrics={metrics}
      lead={lead}
      note={note}
      extra={
        inputs && (
          <HealthFundRateTable
            comparison={{
              monthlyIncome: inputs.monthlyIncome,
              employmentStatus: inputs.employmentStatus,
              currentRatePercent: inputs.currentRatePercent,
            }}
          />
        )
      }
      fields={
        <CalculatorFieldList definitions={fieldDefinitions} labels={fields} form={form} />
      }
    />
  )
}
