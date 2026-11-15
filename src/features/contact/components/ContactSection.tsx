import { lazy, Suspense } from 'react'
import { useLocation } from 'react-router'
import { Section } from '@/components/common/Section'
import { SectionHeader } from '@/components/common/SectionHeader'
import { Card, CardContent } from '@/components/ui/card'
import { SECTION_IDS } from '@/config/routePaths'
import { ContactChannelList } from '@/features/contact/components/ContactChannelList'
import { useI18n } from '@/i18n/useI18n'
import type { ContactPrefill } from '@/types/contactPrefill'

// Below the fold: keeps zod + react-hook-form out of the initial bundle.
const ContactInquiryForm = lazy(() =>
  import('@/features/contact/components/ContactInquiryForm').then((module) => ({
    default: module.ContactInquiryForm,
  })),
)

export function ContactSection() {
  const { contact } = useI18n().messages
  // Router state set by e.g. a calculator CTA
  const contactPrefill = useLocation().state as ContactPrefill | null

  return (
    <Section id={SECTION_IDS.contact} tone="muted" aria-labelledby="contact-title">
      <SectionHeader title={contact.title} titleId="contact-title" />
      <div className="grid gap-6 lg:grid-cols-[2fr_3fr] lg:gap-10">
        <ContactChannelList />
        <Card className="shadow-none [--card-spacing:--spacing(5)] lg:[--card-spacing:--spacing(8)]">
          <CardContent>
            <Suspense fallback={<div className="min-h-[34rem]" aria-hidden />}>
              <ContactInquiryForm prefill={contactPrefill ?? undefined} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </Section>
  )
}
