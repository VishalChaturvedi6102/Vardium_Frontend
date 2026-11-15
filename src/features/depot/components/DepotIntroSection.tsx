import { LinkButton } from '@/components/common/LinkButton'
import { Section } from '@/components/common/Section'
import { getCalculatorPath, SECTION_PATHS } from '@/config/routePaths'
import { depotHighlightIds } from '@/features/depot/data/depotContent'
import { useI18n } from '@/i18n/useI18n'

const compactButtonClassName = 'max-md:h-10 max-md:px-3 max-md:text-label-md'

export function DepotIntroSection() {
  const { depotPage } = useI18n().messages
  const { intro, highlights } = depotPage

  return (
    <Section aria-labelledby="depot-title">
      <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
        <div className="flex flex-col items-start gap-4">
          <h1
            id="depot-title"
            className="text-headline-lg-mobile font-semibold text-navy capitalize md:text-headline-lg"
          >
            {intro.title}
          </h1>
          <p className="text-body-sm text-slate-navy md:text-body-lg">{intro.lead}</p>
          <div className="flex gap-2 pt-1 md:gap-3">
            <LinkButton
              to={SECTION_PATHS.contact}
              variant="cta"
              size="xl"
              className={compactButtonClassName}
            >
              {intro.primaryCta}
            </LinkButton>
            <LinkButton
              to={getCalculatorPath('fondssparplan')}
              variant="secondary"
              size="xl"
              className={compactButtonClassName}
            >
              {intro.secondaryCta}
            </LinkButton>
          </div>
        </div>

        <dl className="grid grid-cols-3 gap-3 rounded-xl bg-navy p-5 text-primary-foreground shadow-overlay lg:grid-cols-1 lg:gap-6 lg:p-8">
          {depotHighlightIds.map((id) => (
            <div
              key={id}
              className="flex min-w-0 flex-col gap-1 break-words lg:flex-row lg:items-baseline lg:gap-4"
            >
              <dd className="order-first font-heading text-body-lg font-semibold whitespace-nowrap text-brand-light md:text-headline-sm lg:min-w-40 lg:text-headline-lg">
                {highlights.items[id].value}
              </dd>
              <dt className="text-label-sm text-primary-foreground/80 normal-case md:text-body-sm">
                {highlights.items[id].label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  )
}
