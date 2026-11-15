import {
  calculateEmployeeCareRate,
  calculateHealthEmployeeRate,
  roundToCents,
} from '@/features/calculators/engine/socialSecurity'
import { socialSecurity } from '@/features/calculators/parameters/taxYear2026'

export type EmploymentStatus = 'employee' | 'selfEmployed'

export type HealthInsuranceComparisonInput = {
  monthlyIncome: number
  employmentStatus: EmploymentStatus
  healthAdditionalRatePercent: number
  childrenCount: number
  // Total private premium (health + care) from the user's quote
  privateMonthlyPremium: number
}

export type HealthInsuranceComparisonResult = {
  statutoryOwnShare: number
  privateOwnShare: number
  monthlyDifference: number
  annualDifference: number
  // Employees may only switch above the mandatory insurance limit
  isEligibleForPrivateInsurance: boolean
}

const healthCareCeilingMonthly = socialSecurity.healthCareCeilingYear / 12

function calculateStatutoryOwnShare(input: HealthInsuranceComparisonInput): number {
  const base = Math.min(input.monthlyIncome, healthCareCeilingMonthly)
  const careRate = calculateEmployeeCareRate({ childrenCount: input.childrenCount })

  if (input.employmentStatus === 'employee') {
    return roundToCents(
      base * (calculateHealthEmployeeRate(input.healthAdditionalRatePercent) + careRate),
    )
  }
  // Self-employed pay both shares
  const healthRate =
    socialSecurity.healthGeneralRate + input.healthAdditionalRatePercent / 100
  const careEmployerRate = socialSecurity.careEmployeeRate
  return roundToCents(base * (healthRate + careRate + careEmployerRate))
}

// Employer subsidy: half of the private premium, capped at the employer share of the maximum statutory contribution.
function calculateEmployerSubsidy(input: HealthInsuranceComparisonInput): number {
  if (input.employmentStatus === 'selfEmployed') return 0
  const maximumSubsidy =
    healthCareCeilingMonthly *
    (calculateHealthEmployeeRate(input.healthAdditionalRatePercent) +
      socialSecurity.careEmployeeRate)
  return Math.min(input.privateMonthlyPremium / 2, maximumSubsidy)
}

export function calculateHealthInsuranceComparison(
  input: HealthInsuranceComparisonInput,
): HealthInsuranceComparisonResult {
  const statutoryOwnShare = calculateStatutoryOwnShare(input)
  const privateOwnShare = input.privateMonthlyPremium - calculateEmployerSubsidy(input)
  const monthlyDifference = statutoryOwnShare - privateOwnShare

  return {
    statutoryOwnShare,
    privateOwnShare,
    monthlyDifference,
    annualDifference: monthlyDifference * 12,
    isEligibleForPrivateInsurance:
      input.employmentStatus === 'selfEmployed' ||
      input.monthlyIncome * 12 > socialSecurity.mandatoryHealthInsuranceLimitYear,
  }
}
