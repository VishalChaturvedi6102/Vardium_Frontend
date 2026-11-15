import type { Messages } from '@/i18n/locales/de'

// Doubles as the URL slug; copy lives in i18n `calculators.items`.
export type FinanceCalculatorId = keyof Messages['calculators']['items']
