import { Globe } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { isLocale, LOCALE_NAMES, SUPPORTED_LOCALES } from '@/i18n/localeConfig'
import { useI18n } from '@/i18n/useI18n'

const localeItems = SUPPORTED_LOCALES.map((locale) => ({
  value: locale,
  label: LOCALE_NAMES[locale],
}))

export function LanguageSwitcher() {
  const { locale, setLocale, messages } = useI18n()

  return (
    <Select
      items={localeItems}
      value={locale}
      onValueChange={(nextLocale) => isLocale(nextLocale) && setLocale(nextLocale)}
    >
      <SelectTrigger
        aria-label={messages.language.label}
        className="gap-1.5 px-2.5 text-label-md font-semibold data-[size=default]:h-9"
      >
        <Globe aria-hidden className="size-4 text-brand" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end" alignItemWithTrigger={false} className="min-w-36">
        {localeItems.map(({ value, label }) => (
          <SelectItem key={value} value={value} lang={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
