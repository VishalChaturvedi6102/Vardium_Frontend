import type { LucideIcon } from 'lucide-react'
import type { Messages } from '@/i18n/locales/de'
import type { FinanceCalculatorId } from '@/types/calculator'

// Copy lives in i18n/locales keyed by these ids; data files hold structure only.
export type ServiceOfferingId = keyof Messages['services']['items']
export type ProcessStepId = keyof Messages['process']['items']

export type ServiceOffering = { id: ServiceOfferingId; icon: LucideIcon }
export type FinanceCalculator = { id: FinanceCalculatorId; icon: LucideIcon }
export type ProcessStep = { id: ProcessStepId }
