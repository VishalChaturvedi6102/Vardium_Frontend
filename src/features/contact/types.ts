import type { LucideIcon } from 'lucide-react'
import type { Messages } from '@/i18n/locales/de'

export type ConsultationTopicValue = keyof Messages['contact']['topics']
export type ContactChannelId = keyof Messages['contact']['channels']
export type ContactValidationKey = keyof Messages['contact']['validation']

export type ContactChannel = {
  id: ContactChannelId
  icon: LucideIcon
  value: string
  href?: string
}
