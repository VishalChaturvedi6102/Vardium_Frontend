import { formatCurrency, formatNumber, formatPercent } from '@/lib/formatters'
import { LOCALE_FORMAT_TAGS } from '@/i18n/localeConfig'
import { useI18n } from '@/i18n/useI18n'

// Locale-aware number formatting for the active language
export function useFormatters() {
  const localeTag = LOCALE_FORMAT_TAGS[useI18n().locale]

  return {
    currency: (value: number, fractionDigits?: number) =>
      formatCurrency(value, localeTag, fractionDigits),
    percent: (valuePercent: number, fractionDigits?: number) =>
      formatPercent(valuePercent, localeTag, fractionDigits),
    number: (value: number, fractionDigits?: number) =>
      formatNumber(value, localeTag, fractionDigits),
  }
}
