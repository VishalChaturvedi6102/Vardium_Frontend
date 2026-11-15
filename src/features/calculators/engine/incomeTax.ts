import {
  incomeTaxTariff as tariff,
  solidaritySurcharge,
} from '@/features/calculators/parameters/taxYear2026'

// Epsilon guards against binary rounding (e.g. 77.35 stored as 77.3499…)
const roundDownToCents = (amount: number): number => Math.floor(amount * 100 + 1e-9) / 100

// § 32a EStG for a single person; input in full euros, result rounded down to full euros.
export function calculateTariffTax(taxableIncome: number): number {
  const income = Math.floor(taxableIncome)

  if (income <= tariff.basicAllowance) return 0
  if (income < tariff.zoneTwoStart + 1) {
    const y = (income - tariff.basicAllowance) / 10_000
    return Math.floor((y * tariff.zoneOneFactor + tariff.zoneOneConstant) * y)
  }
  if (income <= tariff.zoneThreeStart) {
    const z = (income - tariff.zoneTwoStart) / 10_000
    return Math.floor(
      (z * tariff.zoneTwoFactor + tariff.zoneTwoConstant) * z + tariff.zoneTwoBase,
    )
  }
  if (income <= tariff.zoneFourStart) {
    return Math.floor(income * tariff.zoneThreeRate - tariff.zoneThreeSubtrahend)
  }
  return Math.floor(income * tariff.zoneFourRate - tariff.zoneFourSubtrahend)
}

// Splitting tariff for joint assessment: tax on half the income, doubled.
export function calculateIncomeTax(
  taxableIncome: number,
  isJointAssessment: boolean,
): number {
  const splittingFactor = isJointAssessment ? 2 : 1
  const income = Math.max(0, Math.floor(taxableIncome / splittingFactor))
  return calculateTariffTax(income) * splittingFactor
}

// Soli with exemption limit and phase-in zone (SolzG), rounded down to cents.
export function calculateSolidaritySurcharge(
  incomeTax: number,
  isJointAssessment: boolean,
): number {
  const exemptionLimit = solidaritySurcharge.exemptionLimit * (isJointAssessment ? 2 : 1)
  if (incomeTax <= exemptionLimit) return 0

  const fullSurcharge = roundDownToCents(incomeTax * solidaritySurcharge.rate)
  const phaseInSurcharge = (incomeTax - exemptionLimit) * solidaritySurcharge.phaseInRate
  return Math.min(fullSurcharge, roundDownToCents(phaseInSurcharge))
}

export const calculateChurchTax = (
  incomeTax: number,
  churchTaxRatePercent: number,
): number => roundDownToCents((incomeTax * churchTaxRatePercent) / 100)
