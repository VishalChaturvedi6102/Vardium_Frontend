import { CalculatorFieldList } from '@/features/calculators/components/CalculatorFieldList'
import { CalculatorPageLayout } from '@/features/calculators/components/CalculatorPageLayout'
import { calculateMortgage } from '@/features/calculators/engine/mortgage'
import { useCalculatorForm } from '@/features/calculators/hooks/useCalculatorForm'
import { buildLeadMessage } from '@/features/calculators/lib/buildLeadMessage'
import {
  mortgageSchema,
  type MortgageFormValues,
} from '@/features/calculators/schemas/calculatorSchemas'
import type {
  CalculatorFieldDefinition,
  ResultMetric,
} from '@/features/calculators/types'
import { useFormatters } from '@/hooks/useFormatters'
import { useI18n } from '@/i18n/useI18n'

// Closing costs default: 5.5 % Hamburg property transfer tax + ~2 % notary and land registry.
const defaultMortgageValues: MortgageFormValues = {
  purchasePrice: 400_000,
  equity: 80_000,
  closingCostPercent: 7.5,
  nominalRatePercent: 3.6,
  initialRepaymentPercent: 2,
  fixedRatePeriodYears: 10,
}

const fieldDefinitions: CalculatorFieldDefinition<keyof MortgageFormValues>[] = [
  { kind: 'number', name: 'purchasePrice', unit: 'euro' },
  { kind: 'number', name: 'equity', unit: 'euro' },
  { kind: 'number', name: 'closingCostPercent', unit: 'percent' },
  { kind: 'number', name: 'nominalRatePercent', unit: 'percent' },
  { kind: 'number', name: 'initialRepaymentPercent', unit: 'percent' },
  { kind: 'number', name: 'fixedRatePeriodYears', unit: 'years' },
]

export function MortgageCalculator() {
  const { messages } = useI18n()
  const { calculatorPages } = messages
  const { fields, results } = calculatorPages.baufinanzierung
  const format = useFormatters()
  const form = useCalculatorForm(mortgageSchema, defaultMortgageValues)
  const { inputs } = form

  const result = inputs && calculateMortgage(inputs)
  const metrics: ResultMetric[] | null = result && [
    {
      id: 'monthlyPayment',
      label: results.monthlyPayment,
      value: format.currency(result.monthlyPayment, 2),
      isPrimary: true,
    },
    {
      id: 'loanAmount',
      label: results.loanAmount,
      value: format.currency(result.loanAmount),
    },
    {
      id: 'interestPaid',
      label: results.interestPaid,
      value: format.currency(result.interestPaidDuringFixedPeriod),
    },
    {
      id: 'remainingDebt',
      label: results.remainingDebt,
      value: format.currency(result.remainingDebtAfterFixedPeriod),
    },
    {
      id: 'yearsToRepay',
      label: results.yearsToRepay,
      value: `${format.number(result.yearsToFullRepayment)} ${calculatorPages.units.years}`,
    },
  ]

  const lead =
    inputs && metrics
      ? {
          consultationTopic: 'property-financing',
          message: buildLeadMessage(messages.calculators.items.baufinanzierung.title, [
            { label: fields.purchasePrice, value: format.currency(inputs.purchasePrice) },
            { label: fields.equity, value: format.currency(inputs.equity) },
            {
              label: fields.nominalRatePercent,
              value: format.percent(inputs.nominalRatePercent),
            },
            {
              label: fields.initialRepaymentPercent,
              value: format.percent(inputs.initialRepaymentPercent),
            },
            ...metrics.slice(0, 2),
          ]),
        }
      : null

  return (
    <CalculatorPageLayout
      calculatorId="baufinanzierung"
      calculation={form.calculation}
      metrics={metrics}
      lead={lead}
      fields={
        <CalculatorFieldList definitions={fieldDefinitions} labels={fields} form={form} />
      }
    />
  )
}
