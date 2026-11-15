import type { LucideIcon } from 'lucide-react'
import type { Messages } from '@/i18n/locales/de'

// Copy lives in i18n/locales keyed by these ids; data files hold structure only.
type DepotMessages = Messages['depotPage']

export type DepotHighlightId = keyof DepotMessages['highlights']['items']
export type DepotBenefitId = keyof DepotMessages['benefits']['items']
export type DepotOptionId = keyof DepotMessages['options']['items']
export type DepotStepId = keyof DepotMessages['steps']['items']
export type DepotFaqId = keyof DepotMessages['faq']['items']

export type DepotBenefit = { id: DepotBenefitId; icon: LucideIcon }
export type DepotOption = { id: DepotOptionId; icon: LucideIcon; isPopular?: boolean }
