import { Section } from '@/components/common/Section'
import { SectionHeader } from '@/components/common/SectionHeader'
import { StepCard } from '@/components/common/StepCard'
import { depotStepIds } from '@/features/depot/data/depotContent'
import { useI18n } from '@/i18n/useI18n'

export function DepotStepsSection() {
  const { steps } = useI18n().messages.depotPage

  return (
    <Section tone="muted" aria-labelledby="depot-steps-title">
      <SectionHeader title={steps.title} titleId="depot-steps-title" />
      <ol className="grid gap-3 md:grid-cols-3 lg:gap-6">
        {depotStepIds.map((id, stepIndex) => (
          <li key={id}>
            <StepCard
              stepNumber={stepIndex + 1}
              title={steps.items[id].title}
              description={steps.items[id].description}
            />
          </li>
        ))}
      </ol>
    </Section>
  )
}
