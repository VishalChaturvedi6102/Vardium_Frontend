import { Mail, MapPin, Phone } from 'lucide-react'
import { siteConfig } from '@/config/siteConfig'
import type { ContactChannel } from '@/features/contact/types'

export const contactChannels: ContactChannel[] = [
  {
    id: 'phone',
    icon: Phone,
    value: siteConfig.phone.label,
    href: siteConfig.phone.href,
  },
  {
    id: 'email',
    icon: Mail,
    value: siteConfig.email.label,
    href: siteConfig.email.href,
  },
  { id: 'office', icon: MapPin, value: siteConfig.officeAddress },
]
