import {
  ArrowLeftRight,
  BadgePercent,
  Building2,
  ChartLine,
  CreditCard,
  ReceiptText,
  Wallet,
  Warehouse,
} from 'lucide-react'
import type { FinanceCalculator } from '@/features/home/types'

// `id` doubles as the URL slug of the calculator page.
export const financeCalculators: FinanceCalculator[] = [
  { id: 'brutto-netto', icon: Wallet },
  { id: 'gkv-vs-pkv', icon: ArrowLeftRight },
  { id: 'gkv-vergleich', icon: BadgePercent },
  { id: 'bav', icon: Building2 },
  { id: 'ruerup-steuervorteil', icon: ReceiptText },
  { id: 'fondssparplan', icon: ChartLine },
  { id: 'baufinanzierung', icon: Warehouse },
  { id: 'privatkredit', icon: CreditCard },
]
