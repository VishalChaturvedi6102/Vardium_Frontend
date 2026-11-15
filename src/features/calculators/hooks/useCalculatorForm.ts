import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type DefaultValues, type FieldValues } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router'
import type { z } from 'zod'
import { isBelowDesktopViewport } from '@/lib/viewport'

type CalculatorLocationState = { calculatorView?: 'result' } | null

// Submit-driven calculator form. `inputs` holds the values of the last calculation (null before).
// The result screen is a history step, so the phone Back button returns to the form.
export function useCalculatorForm<Values extends FieldValues>(
  schema: z.ZodType<Values, Values>,
  defaultValues: DefaultValues<Values>,
) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues })
  const [inputs, setInputs] = useState<Values | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const isResultView =
    inputs !== null &&
    (location.state as CalculatorLocationState)?.calculatorView === 'result'

  const submit = handleSubmit((values) => {
    setInputs(values)
    // Re-baseline so edits after calculating mark the result as outdated
    reset(values)
    navigate(location.pathname, {
      state: { calculatorView: 'result' } satisfies CalculatorLocationState,
      replace: isResultView,
      preventScrollReset: true,
    })
    if (isBelowDesktopViewport()) window.scrollTo({ top: 0 })
  })

  return {
    register,
    control,
    errors,
    inputs,
    calculation: {
      submit,
      isOutdated: isDirty && inputs !== null,
      isResultView,
      showForm: () => navigate(-1),
    },
  }
}
