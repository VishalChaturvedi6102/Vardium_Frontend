import { createContext } from 'react'
import type { Locale } from '@/i18n/localeConfig'
import type { Messages } from '@/i18n/locales/de'

export type I18nContextValue = {
  locale: Locale
  setLocale: (nextLocale: Locale) => void
  messages: Messages
}

export const I18nContext = createContext<I18nContextValue | null>(null)
