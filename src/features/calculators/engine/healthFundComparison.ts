import type { EmploymentStatus } from '@/features/calculators/engine/healthInsuranceComparison'
import { socialSecurity } from '@/features/calculators/parameters/taxYear2026'

export type HealthFundSavingsInput = {
  monthlyIncome: number
  employmentStatus: EmploymentStatus
  currentRatePercent: number
  newRatePercent: number
}

export type HealthFundSavingsResult = {
  monthlySavings: number
  annualSavings: number
}

// Employees split the additional contribution with the employer; the self-employed pay all of it.
export function calculateHealthFundSavings({
  monthlyIncome,
  employmentStatus,
  currentRatePercent,
  newRatePercent,
}: HealthFundSavingsInput): HealthFundSavingsResult {
  const base = Math.min(monthlyIncome, socialSecurity.healthCareCeilingYear / 12)
  const ownShare = employmentStatus === 'employee' ? 0.5 : 1
  const monthlySavings = (base * (currentRatePercent - newRatePercent) * ownShare) / 100

  return { monthlySavings, annualSavings: monthlySavings * 12 }
}
