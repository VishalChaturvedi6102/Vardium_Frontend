import { Eye, Handshake, MonitorSmartphone, ShieldCheck } from 'lucide-react'
import type { CompanyValue } from '@/features/about/types'

export const companyValues: CompanyValue[] = [
  { id: 'independence', icon: ShieldCheck },
  { id: 'transparency', icon: Eye },
  { id: 'personal', icon: Handshake },
  { id: 'digital', icon: MonitorSmartphone },
]
