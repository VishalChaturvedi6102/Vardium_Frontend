import { Section } from '@/components/common/Section'
import { SectionHeader } from '@/components/common/SectionHeader'
import { StepCard } from '@/components/common/StepCard'
import { processSteps } from '@/features/home/data/processSteps'
import { useI18n } from '@/i18n/useI18n'

export function ProcessStepsSection() {
  const { process } = useI18n().messages

  return (
    <Section aria-labelledby="process-title">
      <SectionHeader title={process.title} titleId="process-title" />
      <ol className="grid gap-3 md:grid-cols-3 lg:gap-6">
        {processSteps.map(({ id }, stepIndex) => (
          <li key={id}>
            <StepCard
              stepNumber={stepIndex + 1}
              title={process.items[id].title}
              description={process.items[id].description}
            />
          </li>
        ))}
      </ol>
    </Section>
  )
}
