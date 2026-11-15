import {
  calculateChurchTax,
  calculateIncomeTax,
  calculateSolidaritySurcharge,
} from '@/features/calculators/engine/incomeTax'
import { basicPension } from '@/features/calculators/parameters/taxYear2026'

export type BasicPensionInput = {
  // Taxable income before the Basisrente deduction
  taxableIncome: number
  isJointAssessment: boolean
  annualContribution: number
  // Statutory pension contributions (employee + employer share) already using the shared cap
  existingPensionContributions: number
  churchTaxRatePercent: number
}

export type BasicPensionResult = {
  deductibleAmount: number
  taxSavings: number
  netCost: number
  savingsRatePercent: number
}

function calculateTotalTax(input: BasicPensionInput, taxableIncome: number): number {
  const incomeTax = calculateIncomeTax(taxableIncome, input.isJointAssessment)
  return (
    incomeTax +
    calculateSolidaritySurcharge(incomeTax, input.isJointAssessment) +
    calculateChurchTax(incomeTax, input.churchTaxRatePercent)
  )
}

// Contributions are 100 % deductible within the shared cap (§ 10 Abs. 3 EStG).
export function calculateBasicPension(input: BasicPensionInput): BasicPensionResult {
  const cap = input.isJointAssessment
    ? basicPension.deductionCapJoint
    : basicPension.deductionCapSingle
  const remainingCap = Math.max(0, cap - input.existingPensionContributions)
  const deductibleAmount = Math.min(input.annualContribution, remainingCap)

  const taxSavings =
    calculateTotalTax(input, input.taxableIncome) -
    calculateTotalTax(input, input.taxableIncome - deductibleAmount)

  return {
    deductibleAmount,
    taxSavings,
    netCost: input.annualContribution - taxSavings,
    savingsRatePercent:
      input.annualContribution === 0 ? 0 : (taxSavings / input.annualContribution) * 100,
  }
}
