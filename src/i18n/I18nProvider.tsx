import { useEffect, type ReactNode } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { I18nContext } from '@/i18n/I18nContext'
import { DEFAULT_LOCALE, isLocale, LOCALE_STORAGE_KEY } from '@/i18n/localeConfig'
import type { Locale } from '@/i18n/localeConfig'
import { messagesByLocale } from '@/i18n/messagesByLocale'

export function I18nProvider({ children }: { children: ReactNode }) {
  const [storedLocale, setLocale] = useLocalStorage<Locale>(
    LOCALE_STORAGE_KEY,
    DEFAULT_LOCALE,
  )
  const locale = isLocale(storedLocale) ? storedLocale : DEFAULT_LOCALE
  const messages = messagesByLocale[locale]

  // Sync <html lang>, title and description with the active locale
  useEffect(() => {
    document.documentElement.lang = locale
    document.title = messages.meta.title
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', messages.meta.description)
  }, [locale, messages])

  return <I18nContext value={{ locale, setLocale, messages }}>{children}</I18nContext>
}
