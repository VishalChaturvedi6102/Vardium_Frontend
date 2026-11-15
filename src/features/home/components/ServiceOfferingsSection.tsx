import { Section } from '@/components/common/Section'
import { SectionHeader } from '@/components/common/SectionHeader'
import { SECTION_IDS } from '@/config/routePaths'
import { ServiceOfferingCard } from '@/features/home/components/ServiceOfferingCard'
import { serviceOfferings } from '@/features/home/data/serviceOfferings'
import { useI18n } from '@/i18n/useI18n'

export function ServiceOfferingsSection() {
  const { services } = useI18n().messages

  return (
    <Section id={SECTION_IDS.services} aria-labelledby="services-title">
      <SectionHeader title={services.title} titleId="services-title" />
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-6">
        {serviceOfferings.map((serviceOffering) => (
          <li
            key={serviceOffering.id}
            className="max-md:odd:last:col-span-2 max-md:odd:last:mx-auto max-md:odd:last:w-[calc(50%-0.375rem)]"
          >
            <ServiceOfferingCard serviceOffering={serviceOffering} />
          </li>
        ))}
      </ul>
    </Section>
  )
}
