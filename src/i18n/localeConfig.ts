export const SUPPORTED_LOCALES = ['de', 'en'] as const

export type Locale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'de'

export const LOCALE_STORAGE_KEY = 'vardium.locale'

export const isLocale = (candidate: unknown): candidate is Locale =>
  SUPPORTED_LOCALES.some((supportedLocale) => supportedLocale === candidate)

// Endonyms: each language is always named in itself, never translated.
export const LOCALE_NAMES: Record<Locale, string> = { de: 'Deutsch', en: 'English' }

// BCP 47 tags for Intl number formatting
export const LOCALE_FORMAT_TAGS: Record<Locale, string> = { de: 'de-DE', en: 'en-GB' }
