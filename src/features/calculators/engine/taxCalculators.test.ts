import { describe, expect, it } from 'vitest'
import { calculateBasicPension } from '@/features/calculators/engine/basicPension'
import { calculateCompanyPension } from '@/features/calculators/engine/companyPension'
import { calculateGrossToNet } from '@/features/calculators/engine/grossToNet'
import { calculateHealthFundSavings } from '@/features/calculators/engine/healthFundComparison'
import { calculateHealthInsuranceComparison } from '@/features/calculators/engine/healthInsuranceComparison'
import {
  calculateIncomeTax,
  calculateSolidaritySurcharge,
  calculateTariffTax,
} from '@/features/calculators/engine/incomeTax'
import { calculateEmployeeSocialSecurity } from '@/features/calculators/engine/socialSecurity'

describe('income tax tariff 2026', () => {
  it('is zero up to the basic allowance', () => {
    expect(calculateTariffTax(12_348)).toBe(0)
  })

  it('is continuous between the tariff zones', () => {
    expect(calculateTariffTax(17_800)).toBeGreaterThanOrEqual(calculateTariffTax(17_799))
    expect(calculateTariffTax(69_879) - calculateTariffTax(69_878)).toBeLessThanOrEqual(1)
    expect(calculateTariffTax(277_826) - calculateTariffTax(277_825)).toBeLessThanOrEqual(
      1,
    )
  })

  it('doubles the tax on half the income for joint assessment', () => {
    expect(calculateIncomeTax(80_000, true)).toBe(calculateTariffTax(40_000) * 2)
  })

  it('applies the solidarity surcharge only above the exemption limit', () => {
    expect(calculateSolidaritySurcharge(20_350, false)).toBe(0)
    expect(calculateSolidaritySurcharge(40_000, false)).toBe(2200)
    expect(calculateSolidaritySurcharge(21_000, false)).toBeCloseTo(77.35, 2)
  })
})

describe('employee social security 2026', () => {
  const input = {
    monthlyGross: 4000,
    healthAdditionalRatePercent: 2.9,
    childrenCount: 0,
  }

  it('calculates the employee shares below the ceilings', () => {
    const result = calculateEmployeeSocialSecurity(input)
    expect(result.pension).toBe(372)
    expect(result.unemployment).toBe(52)
    expect(result.health).toBeCloseTo(4000 * 0.0875, 2)
    expect(result.care).toBeCloseTo(4000 * 0.024, 2)
  })

  it('caps contributions at the ceilings', () => {
    const capped = calculateEmployeeSocialSecurity({ ...input, monthlyGross: 20_000 })
    expect(capped.pension).toBeCloseTo((101_400 / 12) * 0.093, 2)
    expect(capped.health).toBeCloseTo((69_750 / 12) * 0.0875, 2)
  })

  it('reduces the care rate for the second child onwards', () => {
    const twoChildren = calculateEmployeeSocialSecurity({ ...input, childrenCount: 2 })
    expect(twoChildren.care).toBeCloseTo(4000 * (0.018 - 0.0025), 2)
  })
})

describe('gross to net', () => {
  const input = {
    monthlyGross: 4000,
    taxClass: 1 as const,
    childAllowanceCount: 0,
    childrenCount: 0,
    churchTaxRatePercent: 0,
    healthAdditionalRatePercent: 2.9,
    isSaxony: false,
  }

  it('matches the wage tax check table (48,000 € class I)', () => {
    const result = calculateGrossToNet(input)
    // BMF check table: 50,000 € → 6,788; 45,000 € → 5,570 per year
    expect(result.wageTax * 12).toBeGreaterThan(5_570)
    expect(result.wageTax * 12).toBeLessThan(6_788)
  })

  it('subtracts all deductions from the gross', () => {
    const result = calculateGrossToNet({ ...input, churchTaxRatePercent: 9 })
    expect(result.churchTax).toBeGreaterThan(0)
    expect(result.monthlyNet).toBeCloseTo(
      4000 -
        result.wageTax -
        result.solidaritySurcharge -
        result.churchTax -
        result.pension -
        result.unemployment -
        result.health -
        result.care,
      6,
    )
  })

  it('gives class III a higher net than class I at the same gross', () => {
    expect(calculateGrossToNet({ ...input, taxClass: 3 }).monthlyNet).toBeGreaterThan(
      calculateGrossToNet(input).monthlyNet,
    )
  })
})

describe('company pension', () => {
  const input = {
    monthlyGross: 4000,
    taxClass: 1 as const,
    childAllowanceCount: 0,
    childrenCount: 0,
    churchTaxRatePercent: 0,
    healthAdditionalRatePercent: 2.9,
    isSaxony: false,
    monthlyConversion: 200,
    employerSubsidyPercent: 15,
  }

  it('costs less net than the converted amount', () => {
    const result = calculateCompanyPension(input)
    expect(result.netCost).toBeGreaterThan(0)
    expect(result.netCost).toBeLessThan(200)
    expect(result.totalContribution).toBeCloseTo(230, 6)
  })

  it('pays the employer subsidy only on the social-security-free part', () => {
    const result = calculateCompanyPension({ ...input, monthlyConversion: 600 })
    expect(result.employerSubsidy).toBeCloseTo((4 / 100) * (101_400 / 12) * 0.15, 2)
  })
})

describe('basic pension (Rürup)', () => {
  const input = {
    taxableIncome: 60_000,
    isJointAssessment: false,
    annualContribution: 5000,
    existingPensionContributions: 0,
    churchTaxRatePercent: 0,
  }

  it('saves tax at roughly the marginal rate', () => {
    const result = calculateBasicPension(input)
    expect(result.deductibleAmount).toBe(5000)
    expect(result.savingsRatePercent).toBeGreaterThan(30)
    expect(result.savingsRatePercent).toBeLessThan(45)
  })

  it('limits the deduction to the remaining cap', () => {
    const result = calculateBasicPension({
      ...input,
      existingPensionContributions: 28_000,
    })
    expect(result.deductibleAmount).toBe(2826)
  })
})

describe('health insurance comparison', () => {
  const input = {
    monthlyIncome: 7000,
    employmentStatus: 'employee' as const,
    healthAdditionalRatePercent: 2.9,
    childrenCount: 1,
    privateMonthlyPremium: 600,
  }

  it('splits the statutory contribution for employees', () => {
    const result = calculateHealthInsuranceComparison(input)
    expect(result.statutoryOwnShare).toBeCloseTo((69_750 / 12) * (0.0875 + 0.018), 2)
  })

  it('caps the employer subsidy at half of the premium', () => {
    expect(calculateHealthInsuranceComparison(input).privateOwnShare).toBe(300)
  })

  it('blocks employees below the mandatory insurance limit', () => {
    const result = calculateHealthInsuranceComparison({ ...input, monthlyIncome: 4000 })
    expect(result.isEligibleForPrivateInsurance).toBe(false)
  })

  it('lets the self-employed pay both shares without subsidy', () => {
    const result = calculateHealthInsuranceComparison({
      ...input,
      employmentStatus: 'selfEmployed',
      monthlyIncome: 4000,
    })
    expect(result.isEligibleForPrivateInsurance).toBe(true)
    expect(result.privateOwnShare).toBe(600)
    expect(result.statutoryOwnShare).toBeGreaterThan(600)
  })
})

describe('health fund comparison', () => {
  const input = {
    monthlyIncome: 4000,
    employmentStatus: 'employee' as const,
    currentRatePercent: 3.4,
    newRatePercent: 2.4,
  }

  it('halves the saving for employees', () => {
    expect(calculateHealthFundSavings(input).monthlySavings).toBeCloseTo(20, 6)
  })

  it('gives the self-employed the full saving', () => {
    const result = calculateHealthFundSavings({
      ...input,
      employmentStatus: 'selfEmployed',
    })
    expect(result.annualSavings).toBeCloseTo(480, 6)
  })

  it('caps the income at the contribution ceiling', () => {
    const result = calculateHealthFundSavings({ ...input, monthlyIncome: 20_000 })
    expect(result.monthlySavings).toBeCloseTo((69_750 / 12) * 0.005, 6)
  })

  it('turns negative when the new fund is more expensive', () => {
    expect(
      calculateHealthFundSavings({ ...input, newRatePercent: 4.4 }).annualSavings,
    ).toBeLessThan(0)
  })
})
