import { calculateChurchTax } from '@/features/calculators/engine/incomeTax'
import {
  calculateEmployeeSocialSecurity,
  roundToCents,
} from '@/features/calculators/engine/socialSecurity'
import {
  calculateAnnualWageTax,
  toMonthlyShare,
  type TaxClass,
} from '@/features/calculators/engine/wageTax'

export type GrossToNetInput = {
  monthlyGross: number
  taxClass: TaxClass
  childAllowanceCount: number
  childrenCount: number
  churchTaxRatePercent: number
  healthAdditionalRatePercent: number
  isSaxony: boolean
  // Parts of the gross that are free of wage tax / social security (e.g. company pension)
  taxExemptAmount?: number
  socialSecurityExemptAmount?: number
}

export type GrossToNetResult = {
  monthlyGross: number
  wageTax: number
  solidaritySurcharge: number
  churchTax: number
  pension: number
  unemployment: number
  health: number
  care: number
  totalDeductions: number
  monthlyNet: number
}

// Statutorily insured employee, regular monthly wage (no one-off payments, no mini/midijob).
export function calculateGrossToNet(input: GrossToNetInput): GrossToNetResult {
  const taxableMonthlyGross = input.monthlyGross - (input.taxExemptAmount ?? 0)
  const socialSecurityMonthlyGross =
    input.monthlyGross - (input.socialSecurityExemptAmount ?? 0)

  const annualTax = calculateAnnualWageTax({
    // Whole cents: avoids binary drift right at euro boundaries of the tax tariff
    annualGross: Math.round(taxableMonthlyGross * 12 * 100) / 100,
    taxClass: input.taxClass,
    childAllowanceCount: input.childAllowanceCount,
    childrenCount: input.childrenCount,
    healthAdditionalRatePercent: input.healthAdditionalRatePercent,
    isSaxony: input.isSaxony,
  })
  const socialSecurity = calculateEmployeeSocialSecurity({
    monthlyGross: socialSecurityMonthlyGross,
    healthAdditionalRatePercent: input.healthAdditionalRatePercent,
    childrenCount: input.childrenCount,
    isSaxony: input.isSaxony,
  })

  const wageTax = toMonthlyShare(annualTax.annualWageTax)
  const solidaritySurcharge = toMonthlyShare(annualTax.annualSolidaritySurcharge)
  const churchTax = roundToCents(
    calculateChurchTax(
      toMonthlyShare(annualTax.annualChurchTaxBase),
      input.churchTaxRatePercent,
    ),
  )
  const totalDeductions = wageTax + solidaritySurcharge + churchTax + socialSecurity.total

  return {
    monthlyGross: input.monthlyGross,
    wageTax,
    solidaritySurcharge,
    churchTax,
    pension: socialSecurity.pension,
    unemployment: socialSecurity.unemployment,
    health: socialSecurity.health,
    care: socialSecurity.care,
    totalDeductions,
    monthlyNet: input.monthlyGross - totalDeductions,
  }
}
