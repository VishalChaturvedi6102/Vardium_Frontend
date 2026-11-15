import { ChevronDown } from 'lucide-react'
import { Section } from '@/components/common/Section'
import { SectionHeader } from '@/components/common/SectionHeader'
import { depotFaqIds } from '@/features/depot/data/depotContent'
import { useI18n } from '@/i18n/useI18n'

// Native <details>: keyboard and screen-reader support without extra code
export function DepotFaqSection() {
  const { faq, riskNote } = useI18n().messages.depotPage

  return (
    <Section aria-labelledby="depot-faq-title">
      <SectionHeader title={faq.title} titleId="depot-faq-title" />
      <div className="mx-auto flex max-w-3xl flex-col gap-3">
        {depotFaqIds.map((id) => (
          <details
            key={id}
            className="group rounded-xl border border-border bg-white p-4 shadow-card md:p-5"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-body-md font-bold text-navy [&::-webkit-details-marker]:hidden">
              {faq.items[id].question}
              <ChevronDown
                aria-hidden
                className="size-5 shrink-0 text-brand transition-transform group-open:rotate-180"
              />
            </summary>
            <p className="mt-3 text-body-sm text-slate-navy md:text-body-md">
              {faq.items[id].answer}
            </p>
          </details>
        ))}
      </div>
      <p className="mx-auto mt-6 max-w-3xl text-label-sm text-caption normal-case">
        {riskNote}
      </p>
    </Section>
  )
}
