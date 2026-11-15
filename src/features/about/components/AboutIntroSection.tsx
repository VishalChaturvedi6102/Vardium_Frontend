import advisorPortrait from '@/assets/images/hero_mobile.webp'
import { LinkButton } from '@/components/common/LinkButton'
import { Section } from '@/components/common/Section'
import { SECTION_PATHS } from '@/config/routePaths'
import { useI18n } from '@/i18n/useI18n'

const compactButtonClassName = 'max-md:h-10 max-md:px-3 max-md:text-label-md'

export function AboutIntroSection() {
  const { aboutPage } = useI18n().messages
  const { intro } = aboutPage

  return (
    <Section aria-labelledby="about-title">
      <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
        <div className="flex flex-col items-start gap-4">
          <h1
            id="about-title"
            className="text-headline-lg-mobile font-semibold text-navy capitalize md:text-headline-lg"
          >
            {intro.title}
          </h1>
          <p className="text-body-md font-semibold text-navy md:text-body-lg">
            {intro.lead}
          </p>
          {intro.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-body-sm text-slate-navy md:text-body-md">
              {paragraph}
            </p>
          ))}
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
              to={SECTION_PATHS.services}
              variant="secondary"
              size="xl"
              className={compactButtonClassName}
            >
              {intro.secondaryCta}
            </LinkButton>
          </div>
        </div>

        <figure className="relative overflow-hidden rounded-xl bg-navy shadow-overlay">
          <img
            src={advisorPortrait}
            alt={intro.imageAlt}
            width={1254}
            height={1254}
            fetchPriority="high"
            className="aspect-[4/3] w-full object-cover object-top lg:aspect-square"
          />
        </figure>
      </div>
    </Section>
  )
}
