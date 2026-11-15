import { IconFeatureCard } from '@/components/common/IconFeatureCard'
import { Section } from '@/components/common/Section'
import { SectionHeader } from '@/components/common/SectionHeader'
import { depotBenefits } from '@/features/depot/data/depotContent'
import { useI18n } from '@/i18n/useI18n'

export function DepotBenefitsSection() {
  const { benefits } = useI18n().messages.depotPage

  return (
    <Section tone="muted" aria-labelledby="depot-benefits-title">
      <SectionHeader title={benefits.title} titleId="depot-benefits-title" />
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-6">
        {depotBenefits.map(({ id, icon }) => (
          <li key={id}>
            <IconFeatureCard
              icon={icon}
              title={benefits.items[id].title}
              description={benefits.items[id].description}
            />
          </li>
        ))}
      </ul>
    </Section>
  )
}
