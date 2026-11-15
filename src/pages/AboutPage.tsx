import { PageCtaBanner } from '@/components/common/PageCtaBanner'
import { SECTION_PATHS } from '@/config/routePaths'
import { AboutIntroSection } from '@/features/about/components/AboutIntroSection'
import { CompanyFactsSection } from '@/features/about/components/CompanyFactsSection'
import { CompanyValuesSection } from '@/features/about/components/CompanyValuesSection'
import { CredentialsSection } from '@/features/about/components/CredentialsSection'
import { useI18n } from '@/i18n/useI18n'

export function AboutPage() {
  const { cta } = useI18n().messages.aboutPage

  return (
    <>
      <AboutIntroSection />
      <CompanyValuesSection />
      <CompanyFactsSection />
      <CredentialsSection />
      <PageCtaBanner
        titleId="about-cta-title"
        title={cta.title}
        description={cta.description}
        buttonLabel={cta.button}
        buttonTo={SECTION_PATHS.contact}
      />
    </>
  )
}
