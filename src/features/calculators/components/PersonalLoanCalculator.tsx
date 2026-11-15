import { CalculatorFieldList } from '@/features/calculators/components/CalculatorFieldList'
import { CalculatorPageLayout } from '@/features/calculators/components/CalculatorPageLayout'
import { calculatePersonalLoan } from '@/features/calculators/engine/personalLoan'
import { useCalculatorForm } from '@/features/calculators/hooks/useCalculatorForm'
import { buildLeadMessage } from '@/features/calculators/lib/buildLeadMessage'
import {
  personalLoanSchema,
  type PersonalLoanFormValues,
} from '@/features/calculators/schemas/calculatorSchemas'
import type {
  CalculatorFieldDefinition,
  ResultMetric,
} from '@/features/calculators/types'
import { useFormatters } from '@/hooks/useFormatters'
import { useI18n } from '@/i18n/useI18n'

const defaultPersonalLoanValues: PersonalLoanFormValues = {
  loanAmount: 10_000,
  nominalRatePercent: 6,
  termMonths: 48,
}

const fieldDefinitions: CalculatorFieldDefinition<keyof PersonalLoanFormValues>[] = [
  { kind: 'number', name: 'loanAmount', unit: 'euro' },
  { kind: 'number', name: 'nominalRatePercent', unit: 'percent' },
  { kind: 'number', name: 'termMonths', unit: 'months' },
]

export function PersonalLoanCalculator() {
  const { messages } = useI18n()
  const { calculatorPages } = messages
  const { fields, results } = calculatorPages.privatkredit
  const format = useFormatters()
  const form = useCalculatorForm(personalLoanSchema, defaultPersonalLoanValues)
  const { inputs } = form

  const result = inputs && calculatePersonalLoan(inputs)
  const metrics: ResultMetric[] | null = result && [
    {
      id: 'monthlyPayment',
      label: results.monthlyPayment,
      value: format.currency(result.monthlyPayment, 2),
      isPrimary: true,
    },
    {
      id: 'totalInterest',
      label: results.totalInterest,
      value: format.currency(result.totalInterest),
    },
    {
      id: 'totalRepayment',
      label: results.totalRepayment,
      value: format.currency(result.totalRepayment),
    },
    {
      id: 'effectiveRate',
      label: results.effectiveRate,
      value: format.percent(result.effectiveAnnualRatePercent),
    },
  ]

  const lead =
    inputs && metrics
      ? {
          consultationTopic: 'personal-loan',
          message: buildLeadMessage(messages.calculators.items.privatkredit.title, [
            { label: fields.loanAmount, value: format.currency(inputs.loanAmount) },
            {
              label: fields.nominalRatePercent,
              value: format.percent(inputs.nominalRatePercent),
            },
            {
              label: fields.termMonths,
              value: `${inputs.termMonths} ${calculatorPages.units.months}`,
            },
            ...metrics.slice(0, 1),
          ]),
        }
      : null

  return (
    <CalculatorPageLayout
      calculatorId="privatkredit"
      calculation={form.calculation}
      metrics={metrics}
      lead={lead}
      fields={
        <CalculatorFieldList definitions={fieldDefinitions} labels={fields} form={form} />
      }
    />
  )
}
