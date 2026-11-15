import { Calculator, Info, Mail, ShieldCheck, TrendingUp } from 'lucide-react'
import { ROUTE_PATHS, SECTION_PATHS } from '@/config/routePaths'
import type { IconNavigationLink, NavigationLink } from '@/types/navigation'

export const primaryNavigationLinks: IconNavigationLink[] = [
  { id: 'about-us', to: ROUTE_PATHS.aboutUs, icon: Info },
  { id: 'services', to: SECTION_PATHS.services, icon: ShieldCheck },
  { id: 'calculators', to: SECTION_PATHS.calculators, icon: Calculator },
  { id: 'depot-opening', to: ROUTE_PATHS.depotOpening, icon: TrendingUp },
  { id: 'contact', to: SECTION_PATHS.contact, icon: Mail },
]

export const legalNavigationLinks: NavigationLink[] = [
  { id: 'imprint', to: ROUTE_PATHS.imprint },
  { id: 'privacy-policy', to: ROUTE_PATHS.privacyPolicy },
  { id: 'cookie-settings', to: ROUTE_PATHS.cookieSettings },
  { id: 'initial-information', to: ROUTE_PATHS.initialInformation },
  { id: 'disclaimer', to: ROUTE_PATHS.disclaimer },
]
