import type { ComponentProps } from 'react'
import type { FieldError as FieldErrorState } from 'react-hook-form'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import type { CalculatorUnit } from '@/features/calculators/types'
import { cn } from '@/lib/utils'
import { useI18n } from '@/i18n/useI18n'

type CalculatorNumberFieldProps = Omit<ComponentProps<typeof Input>, 'type'> & {
  id: string
  label: string
  unit?: CalculatorUnit
  error?: FieldErrorState
}

export function CalculatorNumberField({
  id,
  label,
  unit,
  error,
  ...inputProps
}: CalculatorNumberFieldProps) {
  const { units } = useI18n().messages.calculatorPages
  const unitLabels: Record<CalculatorUnit, string> = {
    euro: '€',
    percent: '%',
    years: units.years,
    months: units.months,
  }

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="relative">
        <Input
          id={id}
          type="number"
          inputMode="decimal"
          step="any"
          aria-invalid={Boolean(error)}
          // Scrolling over a focused number input would change its value
          onWheel={(event) => event.currentTarget.blur()}
          className={cn(unit && 'pr-20')}
          {...inputProps}
        />
        {unit && (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-label-md text-caption">
            {unitLabels[unit]}
          </span>
        )}
      </div>
      <FieldError errors={[error]} />
    </Field>
  )
}
