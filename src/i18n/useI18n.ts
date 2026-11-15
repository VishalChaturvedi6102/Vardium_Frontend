import { useContext } from 'react'
import { I18nContext, type I18nContextValue } from '@/i18n/I18nContext'

export function useI18n(): I18nContextValue {
  const i18nContext = useContext(I18nContext)
  if (!i18nContext) throw new Error('useI18n must be used inside <I18nProvider>')
  return i18nContext
}
