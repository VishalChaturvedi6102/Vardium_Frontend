import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { IconTile } from '@/components/common/IconTile'
import { Card, CardContent } from '@/components/ui/card'
import { SECTION_PATHS } from '@/config/routePaths'
import type { ServiceOffering } from '@/features/home/types'
import { useI18n } from '@/i18n/useI18n'

type ServiceOfferingCardProps = { serviceOffering: ServiceOffering }

export function ServiceOfferingCard({ serviceOffering }: ServiceOfferingCardProps) {
  const { services } = useI18n().messages
  const { icon: ServiceIcon, id } = serviceOffering
  const { title, tagline, description, shortDescription } = services.items[id]

  return (
    <Card
      interactive
      className="h-full [--card-spacing:--spacing(3)] md:[--card-spacing:--spacing(5)]"
    >
      <CardContent className="flex h-full flex-col gap-2 md:gap-3">
        <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:gap-3">
          <IconTile tone="muted">
            <ServiceIcon aria-hidden />
          </IconTile>
          <div className="min-w-0">
            <h3 className="text-body-md leading-snug font-bold text-navy md:text-body-lg">
              {title}
            </h3>
            <p className="text-label-sm font-semibold text-brand normal-case max-md:hidden">
              {tagline}
            </p>
          </div>
        </div>
        <p className="text-label-md leading-snug text-slate-navy normal-case md:hidden">
          {shortDescription}
        </p>
        <p className="hidden text-body-sm text-slate-navy md:block">{description}</p>
        <Link
          to={SECTION_PATHS.contact}
          aria-label={`${services.learnMore}: ${title}`}
          className="mt-auto inline-flex items-center gap-1 self-start pt-1 text-label-md font-semibold text-brand hover:underline"
        >
          {services.learnMore}
          <ArrowRight aria-hidden className="size-[18px]" />
        </Link>
      </CardContent>
    </Card>
  )
}
