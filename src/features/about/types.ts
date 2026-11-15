import type { LucideIcon } from 'lucide-react'
import type { Messages } from '@/i18n/locales/de'

// Copy lives in i18n/locales keyed by these ids; data files hold structure only.
export type CompanyValueId = keyof Messages['aboutPage']['values']['items']
export type CompanyFactId = keyof Messages['aboutPage']['facts']['items']

export type CompanyValue = { id: CompanyValueId; icon: LucideIcon }
// `value` is language-neutral (number or legal reference)
export type CompanyFact = { id: CompanyFactId; value: string }
