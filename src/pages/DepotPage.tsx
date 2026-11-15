import { PageCtaBanner } from '@/components/common/PageCtaBanner'
import { SECTION_PATHS } from '@/config/routePaths'
import { DepotBenefitsSection } from '@/features/depot/components/DepotBenefitsSection'
import { DepotFaqSection } from '@/features/depot/components/DepotFaqSection'
import { DepotIntroSection } from '@/features/depot/components/DepotIntroSection'
import { DepotOptionsSection } from '@/features/depot/components/DepotOptionsSection'
import { DepotStepsSection } from '@/features/depot/components/DepotStepsSection'
import { useI18n } from '@/i18n/useI18n'

export function DepotPage() {
  const { cta } = useI18n().messages.depotPage

  return (
    <>
      <DepotIntroSection />
      <DepotBenefitsSection />
      <DepotOptionsSection />
      <DepotStepsSection />
      <DepotFaqSection />
      <PageCtaBanner
        titleId="depot-cta-title"
        title={cta.title}
        description={cta.description}
        buttonLabel={cta.button}
        buttonTo={SECTION_PATHS.contact}
      />
    </>
  )
}
