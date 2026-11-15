import { CircleCheck } from 'lucide-react'
import { Section } from '@/components/common/Section'
import { SectionHeader } from '@/components/common/SectionHeader'
import { Card, CardContent } from '@/components/ui/card'
import { useI18n } from '@/i18n/useI18n'

export function CredentialsSection() {
  const { aboutPage, advisor } = useI18n().messages

  return (
    <Section tone="muted" aria-labelledby="credentials-title">
      <SectionHeader title={aboutPage.credentials.title} titleId="credentials-title" />
      <Card className="mx-auto max-w-2xl [--card-spacing:--spacing(5)] md:[--card-spacing:--spacing(8)]">
        <CardContent>
          <ul className="flex flex-col gap-3">
            {advisor.credentials.map((credential) => (
              <li key={credential} className="flex items-start gap-2.5 text-navy">
                <CircleCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-brand" />
                <span className="text-body-sm font-medium md:text-body-md">
                  {credential}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </Section>
  )
}
