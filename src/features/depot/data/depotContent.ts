import { Landmark, Leaf, PiggyBank, ShieldCheck, Wallet } from 'lucide-react'
import type {
  DepotBenefit,
  DepotFaqId,
  DepotHighlightId,
  DepotOption,
  DepotStepId,
} from '@/features/depot/types'

export const depotHighlightIds: DepotHighlightId[] = ['fees', 'savingsPlan', 'funds']

export const depotBenefits: DepotBenefit[] = [
  { id: 'lowCost', icon: Wallet },
  { id: 'flexible', icon: PiggyBank },
  { id: 'curated', icon: ShieldCheck },
  { id: 'sustainable', icon: Leaf },
]

export const depotOptions: DepotOption[] = [
  { id: 'basic', icon: Landmark },
  { id: 'savings', icon: PiggyBank, isPopular: true },
  { id: 'sustainable', icon: Leaf },
]

export const depotStepIds: DepotStepId[] = ['choose', 'verify', 'invest']

export const depotFaqIds: DepotFaqId[] = ['cost', 'minimum', 'duration', 'safety']
