import { Controller, type FieldError, type FieldValues, type Path } from 'react-hook-form'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldLabel } from '@/components/ui/field'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CalculatorNumberField } from '@/features/calculators/components/CalculatorNumberField'
import type { useCalculatorForm } from '@/features/calculators/hooks/useCalculatorForm'
import type { CalculatorFieldDefinition } from '@/features/calculators/types'
import { LOCALE_FORMAT_TAGS } from '@/i18n/localeConfig'
import { localizeFieldError } from '@/lib/forms'
import { useI18n } from '@/i18n/useI18n'

type CalculatorFieldListProps<Values extends FieldValues> = {
  definitions: CalculatorFieldDefinition<Extract<keyof Values, string>>[]
  // Visible label per field name (from the calculator's i18n block)
  labels: Record<string, string>
  form: Pick<
    ReturnType<typeof useCalculatorForm<Values>>,
    'register' | 'control' | 'errors'
  >
}

// Renders number, select and checkbox inputs from field definitions (data-driven forms).
export function CalculatorFieldList<Values extends FieldValues>({
  definitions,
  labels,
  form: { register, control, errors },
}: CalculatorFieldListProps<Values>) {
  const { locale, messages } = useI18n()
  const { calculatorPages } = messages

  return definitions.map((definition) => {
    const { name } = definition
    // Definitions list top-level keys of Values, which are valid RHF paths
    const fieldName = name as unknown as Path<Values>
    const label = labels[name]
    const error = localizeFieldError(
      errors[name] as FieldError | undefined,
      calculatorPages.validation,
      LOCALE_FORMAT_TAGS[locale],
    )

    if (definition.kind === 'number') {
      return (
        <CalculatorNumberField
          key={name}
          id={name}
          label={label}
          unit={definition.unit}
          error={error}
          {...register(fieldName, { valueAsNumber: true })}
        />
      )
    }

    if (definition.kind === 'select') {
      const optionItems = Object.entries(
        calculatorPages.options[definition.optionGroup],
      ).map(([value, optionLabel]) => ({ value, label: optionLabel }))

      return (
        <Controller
          key={name}
          name={fieldName}
          control={control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor={name}>{label}</FieldLabel>
              <Select
                items={optionItems}
                value={field.value as string}
                onValueChange={(value) => field.onChange(value)}
              >
                <SelectTrigger id={name} className="w-full" onBlur={field.onBlur}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {optionItems.map(({ value, label: optionLabel }) => (
                    <SelectItem key={value} value={value}>
                      {optionLabel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
        />
      )
    }

    return (
      <Controller
        key={name}
        name={fieldName}
        control={control}
        render={({ field }) => (
          <Field>
            <Label className="items-start gap-2.5 text-label-md font-normal text-slate-navy">
              <Checkbox
                checked={field.value as boolean}
                onCheckedChange={field.onChange}
                onBlur={field.onBlur}
                className="mt-0.5"
              />
              {label}
            </Label>
          </Field>
        )}
      />
    )
  })
}
