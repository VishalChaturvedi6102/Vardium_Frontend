import { CalculatorFieldList } from '@/features/calculators/components/CalculatorFieldList'
import { CalculatorPageLayout } from '@/features/calculators/components/CalculatorPageLayout'
import { calculateSavingsPlan } from '@/features/calculators/engine/savingsPlan'
import { useCalculatorForm } from '@/features/calculators/hooks/useCalculatorForm'
import { buildLeadMessage } from '@/features/calculators/lib/buildLeadMessage'
import {
  savingsPlanSchema,
  type SavingsPlanFormValues,
} from '@/features/calculators/schemas/calculatorSchemas'
import type {
  CalculatorFieldDefinition,
  ResultMetric,
} from '@/features/calculators/types'
import { useFormatters } from '@/hooks/useFormatters'
import { useI18n } from '@/i18n/useI18n'

const defaultSavingsPlanValues: SavingsPlanFormValues = {
  initialCapital: 5000,
  monthlySavings: 200,
  termYears: 20,
  annualReturnPercent: 6,
  annualFundCostsPercent: 0.2,
  hasTaxApplied: false,
}

const fieldDefinitions: CalculatorFieldDefinition<keyof SavingsPlanFormValues>[] = [
  { kind: 'number', name: 'initialCapital', unit: 'euro' },
  { kind: 'number', name: 'monthlySavings', unit: 'euro' },
  { kind: 'number', name: 'termYears', unit: 'years' },
  { kind: 'number', name: 'annualReturnPercent', unit: 'percent' },
  { kind: 'number', name: 'annualFundCostsPercent', unit: 'percent' },
  { kind: 'checkbox', name: 'hasTaxApplied' },
]

export function SavingsPlanCalculator() {
  const { messages } = useI18n()
  const { calculatorPages } = messages
  const { fields, results, taxNote } = calculatorPages.fondssparplan
  const format = useFormatters()
  const form = useCalculatorForm(savingsPlanSchema, defaultSavingsPlanValues)
  const { inputs } = form

  const result = inputs && calculateSavingsPlan(inputs)
  const metrics: ResultMetric[] | null = inputs &&
    result && [
      {
        id: 'finalCapital',
        label: results.finalCapital,
        value: format.currency(result.finalCapital),
        isPrimary: !inputs.hasTaxApplied,
      },
      {
        id: 'totalDeposits',
        label: results.totalDeposits,
        value: format.currency(result.totalDeposits),
      },
      {
        id: 'totalGains',
        label: results.totalGains,
        value: format.currency(result.totalGains),
      },
      ...(inputs.hasTaxApplied
        ? [
            {
              id: 'estimatedTax',
              label: results.estimatedTax,
              value: format.currency(result.estimatedTax),
            },
            {
              id: 'finalCapitalAfterTax',
              label: results.finalCapitalAfterTax,
              value: format.currency(result.finalCapitalAfterTax),
              isPrimary: true,
            },
          ]
        : []),
    ]

  const lead =
    inputs && metrics
      ? {
          consultationTopic: 'investments',
          message: buildLeadMessage(messages.calculators.items.fondssparplan.title, [
            {
              label: fields.initialCapital,
              value: format.currency(inputs.initialCapital),
            },
            {
              label: fields.monthlySavings,
              value: format.currency(inputs.monthlySavings),
            },
            {
              label: fields.termYears,
              value: `${inputs.termYears} ${calculatorPages.units.years}`,
            },
            {
              label: fields.annualReturnPercent,
              value: format.percent(inputs.annualReturnPercent),
            },
            ...metrics.filter(({ isPrimary }) => isPrimary),
          ]),
        }
      : null

  return (
    <CalculatorPageLayout
      calculatorId="fondssparplan"
      calculation={form.calculation}
      metrics={metrics}
      lead={lead}
      note={inputs?.hasTaxApplied ? taxNote : undefined}
      fields={
        <CalculatorFieldList definitions={fieldDefinitions} labels={fields} form={form} />
      }
    />
  )
}
