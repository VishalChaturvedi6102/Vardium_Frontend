import { Banknote, HeartPulse, House, PiggyBank, TrendingUp } from 'lucide-react'
import type { ServiceOffering } from '@/features/home/types'

export const serviceOfferings: ServiceOffering[] = [
  { id: 'insurance', icon: HeartPulse },
  { id: 'retirement-provision', icon: PiggyBank },
  { id: 'investments', icon: TrendingUp },
  { id: 'property-financing', icon: House },
  { id: 'personal-loan', icon: Banknote },
]
