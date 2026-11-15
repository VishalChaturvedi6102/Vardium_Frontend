import { CircleCheck } from 'lucide-react'
import { IconTile } from '@/components/common/IconTile'
import { LinkButton } from '@/components/common/LinkButton'
import { Section } from '@/components/common/Section'
import { SectionHeader } from '@/components/common/SectionHeader'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { SECTION_PATHS } from '@/config/routePaths'
import { depotOptions } from '@/features/depot/data/depotContent'
import { useI18n } from '@/i18n/useI18n'
import { cn } from '@/lib/utils'

export function DepotOptionsSection() {
  const { options } = useI18n().messages.depotPage

  return (
    <Section aria-labelledby="depot-options-title">
      <SectionHeader title={options.title} titleId="depot-options-title" />
      <ul className="grid gap-3 md:grid-cols-3 lg:gap-6">
        {depotOptions.map(({ id, icon: OptionIcon, isPopular }) => {
          const { title, description, features } = options.items[id]

          return (
            <li key={id}>
              <Card
                className={cn(
                  'h-full [--card-spacing:--spacing(5)] lg:[--card-spacing:--spacing(6)]',
                  isPopular && 'ring-2 ring-brand',
                )}
              >
                <CardContent className="flex h-full flex-col gap-4">
                  <div className="flex items-center justify-between gap-3">
                    <IconTile>
                      <OptionIcon aria-hidden />
                    </IconTile>
                    {isPopular && <Badge variant="brand">{options.popularBadge}</Badge>}
                  </div>
                  <div>
                    <h3 className="text-body-lg font-bold text-navy">{title}</h3>
                    <p className="mt-1 text-body-sm text-slate-navy">{description}</p>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-slate-navy"
                      >
                        <CircleCheck
                          aria-hidden
                          className="mt-0.5 size-[18px] shrink-0 text-brand"
                        />
                        <span className="text-body-sm font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <LinkButton
                    to={SECTION_PATHS.contact}
                    variant={isPopular ? 'cta' : 'secondary'}
                    size="xl"
                    className="mt-auto w-full"
                  >
                    {options.cta}
                  </LinkButton>
                </CardContent>
              </Card>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
