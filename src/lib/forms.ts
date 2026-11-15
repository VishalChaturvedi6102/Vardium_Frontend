import type { FieldError } from 'react-hook-form'

// Schemas use i18n keys as error messages ("key" or "key|param|param"); swap them for the active
// language and fill {0}, {1} with the params (numbers formatted for the locale).
export function localizeFieldError(
  error: FieldError | undefined,
  validationMessages: Record<string, string>,
  localeTag = 'de-DE',
): FieldError | undefined {
  if (!error) return undefined

  const [key, ...params] = (error.message ?? '').split('|')
  const message = params.reduce(
    (text, param, index) =>
      text.replace(`{${index}}`, new Intl.NumberFormat(localeTag).format(Number(param))),
    validationMessages[key] ?? '',
  )
  return { ...error, message }
}
