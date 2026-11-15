import { LinkButton } from '@/components/common/LinkButton'
import { SECTION_PATHS } from '@/config/routePaths'
import type { CalculatorLead } from '@/features/calculators/types'
import { useI18n } from '@/i18n/useI18n'
import type { ContactPrefill } from '@/types/contactPrefill'

type CalculatorLeadCtaProps = { lead: CalculatorLead }

// Turns the calculation into a lead: opens the contact form pre-filled with inputs and result.
export function CalculatorLeadCta({ lead }: CalculatorLeadCtaProps) {
  const { requestConsultation } = useI18n().messages.calculatorPages
  const contactPrefill: ContactPrefill = lead

  return (
    <LinkButton
      to={SECTION_PATHS.contact}
      state={contactPrefill}
      variant="cta"
      size="xl"
      className="w-full"
    >
      {requestConsultation}
    </LinkButton>
  )
}
