import type { LucideIcon } from 'lucide-react'
import type { Messages } from '@/i18n/locales/de'

// Labels live in i18n/locales under `navigation`, keyed by this id.
export type NavigationLinkId = keyof Messages['navigation']

export type NavigationLink = { id: NavigationLinkId; to: string }

export type IconNavigationLink = NavigationLink & { icon: LucideIcon }
