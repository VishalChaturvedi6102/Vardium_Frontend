import { CalculatorFieldList } from '@/features/calculators/components/CalculatorFieldList'
import { CalculatorPageLayout } from '@/features/calculators/components/CalculatorPageLayout'
import { calculateGrossToNet } from '@/features/calculators/engine/grossToNet'
import { useCalculatorForm } from '@/features/calculators/hooks/useCalculatorForm'
import { buildLeadMessage } from '@/features/calculators/lib/buildLeadMessage'
import {
  defaultEmployeeValues,
  employeeFieldDefinitions,
  toGrossToNetInput,
} from '@/features/calculators/lib/employeeInputs'
import { grossToNetSchema } from '@/features/calculators/schemas/taxCalculatorSchemas'
import type { ResultMetric } from '@/features/calculators/types'
import { useFormatters } from '@/hooks/useFormatters'
import { useI18n } from '@/i18n/useI18n'

export function GrossToNetCalculator() {
  const { messages } = useI18n()
  const { calculatorPages } = messages
  const { fields, results, note } = calculatorPages['brutto-netto']
  const format = useFormatters()
  const form = useCalculatorForm(grossToNetSchema, defaultEmployeeValues)
  const { inputs } = form

  const result = inputs && calculateGrossToNet(toGrossToNetInput(inputs))
  const metrics: ResultMetric[] | null = result && [
    {
      id: 'monthlyNet',
      label: results.monthlyNet,
      value: format.currency(result.monthlyNet, 2),
      isPrimary: true,
    },
    {
      id: 'monthlyGross',
      label: results.monthlyGross,
      value: format.currency(result.monthlyGross, 2),
    },
    { id: 'wageTax', label: results.wageTax, value: format.currency(result.wageTax, 2) },
    ...(result.solidaritySurcharge > 0
      ? [
          {
            id: 'solidaritySurcharge',
            label: results.solidaritySurcharge,
            value: format.currency(result.solidaritySurcharge, 2),
          },
        ]
      : []),
    ...(result.churchTax > 0
      ? [
          {
            id: 'churchTax',
            label: results.churchTax,
            value: format.currency(result.churchTax, 2),
          },
        ]
      : []),
    { id: 'pension', label: results.pension, value: format.currency(result.pension, 2) },
    {
      id: 'unemployment',
      label: results.unemployment,
      value: format.currency(result.unemployment, 2),
    },
    { id: 'health', label: results.health, value: format.currency(result.health, 2) },
    { id: 'care', label: results.care, value: format.currency(result.care, 2) },
    {
      id: 'totalDeductions',
      label: results.totalDeductions,
      value: format.currency(result.totalDeductions, 2),
    },
  ]

  const lead =
    inputs && metrics
      ? {
          consultationTopic: 'other',
          message: buildLeadMessage(messages.calculators.items['brutto-netto'].title, [
            { label: fields.monthlyGross, value: format.currency(inputs.monthlyGross) },
            {
              label: fields.taxClass,
              value: calculatorPages.options.taxClass[inputs.taxClass],
            },
            ...metrics.slice(0, 1),
          ]),
        }
      : null

  return (
    <CalculatorPageLayout
      calculatorId="brutto-netto"
      calculation={form.calculation}
      metrics={metrics}
      lead={lead}
      note={note}
      fields={
        <CalculatorFieldList
          definitions={employeeFieldDefinitions}
          labels={fields}
          form={form}
        />
      }
    />
  )
}
