import { IconFeatureCard } from '@/components/common/IconFeatureCard'
import { Section } from '@/components/common/Section'
import { SectionHeader } from '@/components/common/SectionHeader'
import { companyValues } from '@/features/about/data/companyValues'
import { useI18n } from '@/i18n/useI18n'

export function CompanyValuesSection() {
  const { values } = useI18n().messages.aboutPage

  return (
    <Section tone="muted" aria-labelledby="values-title">
      <SectionHeader title={values.title} titleId="values-title" />
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-6">
        {companyValues.map(({ id, icon }) => (
          <li key={id}>
            <IconFeatureCard
              icon={icon}
              title={values.items[id].title}
              description={values.items[id].description}
            />
          </li>
        ))}
      </ul>
    </Section>
  )
}
