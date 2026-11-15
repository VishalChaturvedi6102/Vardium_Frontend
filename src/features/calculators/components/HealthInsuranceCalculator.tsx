import { CalculatorFieldList } from '@/features/calculators/components/CalculatorFieldList'
import { CalculatorPageLayout } from '@/features/calculators/components/CalculatorPageLayout'
import { calculateHealthInsuranceComparison } from '@/features/calculators/engine/healthInsuranceComparison'
import { useCalculatorForm } from '@/features/calculators/hooks/useCalculatorForm'
import { buildLeadMessage } from '@/features/calculators/lib/buildLeadMessage'
import { socialSecurity } from '@/features/calculators/parameters/taxYear2026'
import {
  healthInsuranceSchema,
  type HealthInsuranceFormValues,
} from '@/features/calculators/schemas/taxCalculatorSchemas'
import type {
  CalculatorFieldDefinition,
  ResultMetric,
} from '@/features/calculators/types'
import { useFormatters } from '@/hooks/useFormatters'
import { useI18n } from '@/i18n/useI18n'

const defaultHealthInsuranceValues: HealthInsuranceFormValues = {
  monthlyIncome: 7000,
  employmentStatus: 'employee',
  healthAdditionalRatePercent: socialSecurity.averageHealthAdditionalRatePercent,
  childrenCount: 0,
  privateMonthlyPremium: 600,
}

const fieldDefinitions: CalculatorFieldDefinition<keyof HealthInsuranceFormValues>[] = [
  { kind: 'number', name: 'monthlyIncome', unit: 'euro' },
  { kind: 'select', name: 'employmentStatus', optionGroup: 'employmentStatus' },
  { kind: 'number', name: 'healthAdditionalRatePercent', unit: 'percent' },
  { kind: 'number', name: 'childrenCount' },
  { kind: 'number', name: 'privateMonthlyPremium', unit: 'euro' },
]

export function HealthInsuranceCalculator() {
  const { messages } = useI18n()
  const { fields, results, note, notEligibleNote } =
    messages.calculatorPages['gkv-vs-pkv']
  const format = useFormatters()
  const form = useCalculatorForm(healthInsuranceSchema, defaultHealthInsuranceValues)
  const { inputs } = form

  const result = inputs && calculateHealthInsuranceComparison(inputs)
  const metrics: ResultMetric[] | null = result && [
    {
      id: 'monthlyDifference',
      label: results.monthlyDifference,
      value: format.currency(result.monthlyDifference, 2),
      isPrimary: true,
    },
    {
      id: 'statutoryOwnShare',
      label: results.statutoryOwnShare,
      value: format.currency(result.statutoryOwnShare, 2),
    },
    {
      id: 'privateOwnShare',
      label: results.privateOwnShare,
      value: format.currency(result.privateOwnShare, 2),
    },
    {
      id: 'annualDifference',
      label: results.annualDifference,
      value: format.currency(result.annualDifference),
    },
  ]

  const lead =
    inputs && metrics
      ? {
          consultationTopic: 'insurance',
          message: buildLeadMessage(messages.calculators.items['gkv-vs-pkv'].title, [
            { label: fields.monthlyIncome, value: format.currency(inputs.monthlyIncome) },
            {
              label: fields.privateMonthlyPremium,
              value: format.currency(inputs.privateMonthlyPremium),
            },
            ...metrics.slice(0, 3),
          ]),
        }
      : null

  return (
    <CalculatorPageLayout
      calculatorId="gkv-vs-pkv"
      calculation={form.calculation}
      metrics={metrics}
      lead={lead}
      note={
        result?.isEligibleForPrivateInsurance === false
          ? `${notEligibleNote} ${note}`
          : note
      }
      fields={
        <CalculatorFieldList definitions={fieldDefinitions} labels={fields} form={form} />
      }
    />
  )
}
