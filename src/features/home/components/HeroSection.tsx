import { Calculator, CalendarDays } from 'lucide-react'
import heroDesktopImage from '@/assets/images/hero_desktop.webp'
import heroMobileImage from '@/assets/images/hero_mobile.webp'
import { LinkButton } from '@/components/common/LinkButton'
import { SECTION_PATHS } from '@/config/routePaths'
import { useI18n } from '@/i18n/useI18n'

export function HeroSection() {
  const { hero } = useI18n().messages

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-144 items-end overflow-hidden bg-navy lg:min-h-160"
    >
      <picture>
        <source media="(min-width: 1024px)" srcSet={heroDesktopImage} />
        <img
          src={heroMobileImage}
          alt={hero.imageAlt}
          width={1254}
          height={1254}
          fetchPriority="high"
          className="absolute inset-0 -z-20 size-full object-cover object-top"
        />
      </picture>
      <div className="container-page py-10 lg:py-14">
        <div className="relative flex max-w-2xl flex-col items-start gap-4 lg:max-w-xl lg:gap-6">
          {/* Faint dark halo behind the copy only, keeps the photo untouched */}
          <div
            aria-hidden
            className="absolute -inset-5 -z-10 rounded-3xl bg-black/35 blur-xl"
          />
          <h1
            id="hero-title"
            className="text-headline-lg-mobile font-bold text-white text-shadow-hero md:text-headline-lg lg:text-display"
          >
            {hero.headlineFirstLine}
            <br />
            {hero.headlineSecondLine}
          </h1>
          <p className="max-w-xl text-body-sm text-white/90 text-shadow-hero md:text-body-md lg:text-body-lg">
            {hero.description}
          </p>
          <div className="flex gap-2 pt-1 md:gap-3">
            <LinkButton
              to={SECTION_PATHS.contact}
              variant="cta"
              size="xl"
              className="max-md:h-10 max-md:px-3 max-md:text-label-md"
            >
              <CalendarDays aria-hidden className="size-5 max-md:hidden" />
              {hero.primaryCta}
            </LinkButton>
            <LinkButton
              to={SECTION_PATHS.calculators}
              variant="secondary"
              size="xl"
              className="max-md:h-10 max-md:px-3 max-md:text-label-md"
            >
              <Calculator aria-hidden className="size-5 max-md:hidden" />
              {hero.secondaryCta}
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  )
}
