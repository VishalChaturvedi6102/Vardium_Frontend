import { CheckCheck } from 'lucide-react'
import { IconTile } from '@/components/common/IconTile'
import { useI18n } from '@/i18n/useI18n'

export function ContactInquirySuccess() {
  const { success } = useI18n().messages.contact

  return (
    <div role="status" className="flex flex-col items-center gap-2 py-6 text-center">
      <IconTile tone="solid" className="size-12 rounded-full">
        <CheckCheck aria-hidden className="size-7" />
      </IconTile>
      <h3 className="text-headline-sm font-bold text-navy">{success.title}</h3>
      <p className="text-body-sm text-slate-navy">{success.description}</p>
    </div>
  )
}
