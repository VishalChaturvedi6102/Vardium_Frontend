import {
  calculateGrossToNet,
  type GrossToNetInput,
} from '@/features/calculators/engine/grossToNet'
import {
  companyPension,
  socialSecurity,
} from '@/features/calculators/parameters/taxYear2026'

export type CompanyPensionInput = Omit<
  GrossToNetInput,
  'taxExemptAmount' | 'socialSecurityExemptAmount'
> & {
  monthlyConversion: number
  employerSubsidyPercent: number
}

export type CompanyPensionResult = {
  netWithoutConversion: number
  netWithConversion: number
  netCost: number
  employerSubsidy: number
  totalContribution: number
  taxAndSocialSecuritySavings: number
}

const monthlyCeiling = socialSecurity.pensionUnemploymentCeilingYear / 12

// Salary conversion (§ 3 Nr. 63 EStG): tax-free up to 8 %, social-security-free up to 4 % of the ceiling.
export function calculateCompanyPension(
  input: CompanyPensionInput,
): CompanyPensionResult {
  const { monthlyConversion, employerSubsidyPercent, ...grossToNetInput } = input
  const taxFreeLimit = monthlyCeiling * companyPension.taxFreeShareOfCeiling
  const socialSecurityFreeLimit =
    monthlyCeiling * companyPension.socialSecurityFreeShareOfCeiling
  const socialSecurityFreeConversion = Math.min(
    monthlyConversion,
    socialSecurityFreeLimit,
  )

  const withoutConversion = calculateGrossToNet(grossToNetInput)
  const withConversion = calculateGrossToNet({
    ...grossToNetInput,
    taxExemptAmount: Math.min(monthlyConversion, taxFreeLimit),
    socialSecurityExemptAmount: socialSecurityFreeConversion,
  })

  const netWithConversion = withConversion.monthlyNet - monthlyConversion
  const netCost = withoutConversion.monthlyNet - netWithConversion
  // Mandatory employer subsidy on the share that saves social security contributions
  const employerSubsidy = (socialSecurityFreeConversion * employerSubsidyPercent) / 100

  return {
    netWithoutConversion: withoutConversion.monthlyNet,
    netWithConversion,
    netCost,
    employerSubsidy,
    totalContribution: monthlyConversion + employerSubsidy,
    taxAndSocialSecuritySavings: monthlyConversion - netCost,
  }
}
