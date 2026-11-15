import type { ComponentProps } from 'react'
import type { FieldError as FieldErrorState } from 'react-hook-form'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

type InquiryTextFieldProps = ComponentProps<typeof Input> & {
  id: string
  label: string
  error?: FieldErrorState
}

export function InquiryTextField({
  id,
  label,
  error,
  ...inputProps
}: InquiryTextFieldProps) {
  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input id={id} aria-invalid={Boolean(error)} {...inputProps} />
      <FieldError errors={[error]} />
    </Field>
  )
}
