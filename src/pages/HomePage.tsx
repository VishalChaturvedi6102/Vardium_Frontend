import { ContactSection } from '@/features/contact/components/ContactSection'
import { AdvisorProfileSection } from '@/features/home/components/AdvisorProfileSection'
import { FinanceCalculatorsSection } from '@/features/home/components/FinanceCalculatorsSection'
import { HeroSection } from '@/features/home/components/HeroSection'
import { ProcessStepsSection } from '@/features/home/components/ProcessStepsSection'
import { ServiceOfferingsSection } from '@/features/home/components/ServiceOfferingsSection'

export function HomePage() {
  return (
    <>
      <HeroSection />
      <ServiceOfferingsSection />
      <FinanceCalculatorsSection />
      <AdvisorProfileSection />
      <ProcessStepsSection />
      <ContactSection />
    </>
  )
}
