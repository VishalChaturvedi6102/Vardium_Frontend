import { Section } from '@/components/common/Section'
import { SectionHeader } from '@/components/common/SectionHeader'
import { SECTION_IDS } from '@/config/routePaths'
import { FinanceCalculatorCard } from '@/features/home/components/FinanceCalculatorCard'
import { financeCalculators } from '@/features/home/data/financeCalculators'
import { useI18n } from '@/i18n/useI18n'

export function FinanceCalculatorsSection() {
  const { calculators } = useI18n().messages

  return (
    <Section
      id={SECTION_IDS.calculators}
      tone="muted"
      aria-labelledby="calculators-title"
    >
      <SectionHeader title={calculators.title} titleId="calculators-title" />
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-6">
        {financeCalculators.map((financeCalculator) => (
          <li key={financeCalculator.id}>
            <FinanceCalculatorCard financeCalculator={financeCalculator} />
          </li>
        ))}
      </ul>
    </Section>
  )
}
