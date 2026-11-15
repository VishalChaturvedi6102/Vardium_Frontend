import { capitalGainsTax } from '@/features/calculators/parameters/taxYear2026'

export type SavingsPlanInput = {
  initialCapital: number
  monthlySavings: number
  termYears: number
  annualReturnPercent: number
  annualFundCostsPercent: number
  hasTaxApplied: boolean
}

export type SavingsPlanResult = {
  finalCapital: number
  totalDeposits: number
  totalGains: number
  estimatedTax: number
  finalCapitalAfterTax: number
}

// Equity-fund tax on sale at the end of the term (partial exemption, allowance, flat tax + solidarity).
function calculateCapitalGainsTax(totalGains: number): number {
  const {
    flatTaxRate,
    solidaritySurchargeRate,
    savingsAllowance,
    equityFundPartialExemption,
  } = capitalGainsTax
  const taxableGains = Math.max(
    0,
    totalGains * (1 - equityFundPartialExemption) - savingsAllowance,
  )
  return taxableGains * flatTaxRate * (1 + solidaritySurchargeRate)
}

// Deposits at the start of each month; monthly rate equivalent to the net annual return.
export function calculateSavingsPlan({
  initialCapital,
  monthlySavings,
  termYears,
  annualReturnPercent,
  annualFundCostsPercent,
  hasTaxApplied,
}: SavingsPlanInput): SavingsPlanResult {
  const months = termYears * 12
  const netAnnualReturn = (annualReturnPercent - annualFundCostsPercent) / 100
  const monthlyRate = (1 + netAnnualReturn) ** (1 / 12) - 1
  const growthFactor = (1 + monthlyRate) ** months

  const savingsPlanValue =
    monthlyRate === 0
      ? monthlySavings * months
      : monthlySavings * ((growthFactor - 1) / monthlyRate) * (1 + monthlyRate)
  const finalCapital = initialCapital * growthFactor + savingsPlanValue

  const totalDeposits = initialCapital + monthlySavings * months
  const totalGains = finalCapital - totalDeposits
  const estimatedTax = hasTaxApplied ? calculateCapitalGainsTax(totalGains) : 0

  return {
    finalCapital,
    totalDeposits,
    totalGains,
    estimatedTax,
    finalCapitalAfterTax: finalCapital - estimatedTax,
  }
}
