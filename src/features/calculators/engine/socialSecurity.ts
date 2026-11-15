import { socialSecurity } from '@/features/calculators/parameters/taxYear2026'

export type CareContributionInput = {
  childrenCount: number
  isSaxony?: boolean
}

export const roundToCents = (amount: number): number => Math.round(amount * 100) / 100

// Employee share of the care insurance rate: childless surcharge or discount for 2nd–5th child.
export function calculateEmployeeCareRate({
  childrenCount,
  isSaxony = false,
}: CareContributionInput): number {
  const baseRate = isSaxony
    ? socialSecurity.careEmployeeRateSaxony
    : socialSecurity.careEmployeeRate

  if (childrenCount === 0) return baseRate + socialSecurity.careChildlessSurcharge

  const discountedChildren = Math.min(
    childrenCount - 1,
    socialSecurity.careMaxDiscountedChildren,
  )
  return baseRate - discountedChildren * socialSecurity.careDiscountPerChild
}

export const calculateHealthEmployeeRate = (additionalRatePercent: number): number =>
  socialSecurity.healthGeneralRate / 2 + additionalRatePercent / 100 / 2

export type EmployeeSocialSecurityInput = CareContributionInput & {
  monthlyGross: number
  healthAdditionalRatePercent: number
}

export type EmployeeSocialSecurityResult = {
  pension: number
  unemployment: number
  health: number
  care: number
  total: number
}

// Monthly employee contributions, capped at the contribution ceilings.
export function calculateEmployeeSocialSecurity(
  input: EmployeeSocialSecurityInput,
): EmployeeSocialSecurityResult {
  const pensionBase = Math.min(
    input.monthlyGross,
    socialSecurity.pensionUnemploymentCeilingYear / 12,
  )
  const healthBase = Math.min(
    input.monthlyGross,
    socialSecurity.healthCareCeilingYear / 12,
  )

  const pension = roundToCents(pensionBase * socialSecurity.pensionEmployeeRate)
  const unemployment = roundToCents(pensionBase * socialSecurity.unemploymentEmployeeRate)
  const health = roundToCents(
    healthBase * calculateHealthEmployeeRate(input.healthAdditionalRatePercent),
  )
  const care = roundToCents(healthBase * calculateEmployeeCareRate(input))

  return {
    pension,
    unemployment,
    health,
    care,
    total: pension + unemployment + health + care,
  }
}
