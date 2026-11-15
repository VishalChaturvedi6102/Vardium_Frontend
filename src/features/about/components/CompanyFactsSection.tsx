import { Section } from '@/components/common/Section'
import { SectionHeader } from '@/components/common/SectionHeader'
import { Card, CardContent } from '@/components/ui/card'
import { companyFacts } from '@/features/about/data/companyFacts'
import { useI18n } from '@/i18n/useI18n'

export function CompanyFactsSection() {
  const { facts } = useI18n().messages.aboutPage

  return (
    <Section aria-labelledby="facts-title">
      <SectionHeader title={facts.title} titleId="facts-title" />
      <dl className="grid grid-cols-3 gap-3 lg:gap-6">
        {companyFacts.map(({ id, value }) => (
          <Card
            key={id}
            className="[--card-spacing:--spacing(3)] md:[--card-spacing:--spacing(6)]"
          >
            <CardContent className="flex flex-col items-center gap-1 text-center md:gap-2">
              <dd className="font-heading text-body-lg font-semibold whitespace-nowrap text-brand tabular-nums md:text-headline-lg">
                {value}
              </dd>
              <dt className="text-label-sm text-slate-navy normal-case md:text-body-sm">
                {facts.items[id]}
              </dt>
            </CardContent>
          </Card>
        ))}
      </dl>
    </Section>
  )
}
