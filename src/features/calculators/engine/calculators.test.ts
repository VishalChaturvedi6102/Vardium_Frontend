import { describe, expect, it } from 'vitest'
import {
  calculateAnnuityPayment,
  calculateMonthsToRepay,
  calculateRemainingDebt,
  toMonthlyRate,
} from '@/features/calculators/engine/annuityLoan'
import { calculateMortgage } from '@/features/calculators/engine/mortgage'
import { calculatePersonalLoan } from '@/features/calculators/engine/personalLoan'
import { calculateSavingsPlan } from '@/features/calculators/engine/savingsPlan'

describe('annuity loan', () => {
  const monthlyRate = toMonthlyRate(3.6)

  it('matches the known payment for 100,000 € at 3.6 % over 10 years', () => {
    expect(calculateAnnuityPayment(100_000, monthlyRate, 120)).toBeCloseTo(993.4, 0)
  })

  it('is fully repaid after the term', () => {
    const payment = calculateAnnuityPayment(100_000, monthlyRate, 120)
    expect(calculateRemainingDebt(100_000, monthlyRate, payment, 120)).toBeCloseTo(0, 4)
    expect(calculateMonthsToRepay(100_000, monthlyRate, payment)).toBeCloseTo(120, 6)
  })

  it('handles a zero interest rate', () => {
    expect(calculateAnnuityPayment(12_000, 0, 12)).toBe(1000)
    expect(calculateRemainingDebt(12_000, 0, 1000, 6)).toBe(6000)
  })
})

describe('savings plan', () => {
  const baseInput = {
    initialCapital: 0,
    monthlySavings: 0,
    termYears: 10,
    annualReturnPercent: 0,
    annualFundCostsPercent: 0,
    hasTaxApplied: false,
  }

  it('compounds a lump sum annually-equivalent', () => {
    const { finalCapital } = calculateSavingsPlan({
      ...baseInput,
      initialCapital: 10_000,
      annualReturnPercent: 5,
    })
    expect(finalCapital).toBeCloseTo(16_288.95, 2)
  })

  it('adds up deposits without return', () => {
    const result = calculateSavingsPlan({ ...baseInput, monthlySavings: 100 })
    expect(result.finalCapital).toBe(12_000)
    expect(result.totalGains).toBe(0)
  })

  it('deducts fund costs from the return', () => {
    const withCosts = calculateSavingsPlan({
      ...baseInput,
      initialCapital: 10_000,
      annualReturnPercent: 6,
      annualFundCostsPercent: 1,
    })
    expect(withCosts.finalCapital).toBeCloseTo(16_288.95, 2)
  })

  it('applies partial exemption, allowance and flat tax to gains', () => {
    const { estimatedTax } = calculateSavingsPlan({
      ...baseInput,
      initialCapital: 10_000,
      annualReturnPercent: 5,
      hasTaxApplied: true,
    })
    // gains 6,288.95 × 0.7 − 1,000 = 3,402.27 taxable × 25 % × 1.055
    expect(estimatedTax).toBeCloseTo(897.4, 0)
  })
})

describe('mortgage', () => {
  const input = {
    purchasePrice: 400_000,
    equity: 100_000,
    closingCostPercent: 10,
    nominalRatePercent: 3.5,
    initialRepaymentPercent: 2,
    fixedRatePeriodYears: 10,
  }

  it('derives loan amount and monthly payment', () => {
    const result = calculateMortgage(input)
    expect(result.loanAmount).toBeCloseTo(340_000, 6)
    expect(result.monthlyPayment).toBeCloseTo((340_000 * 0.055) / 12, 6)
  })

  it('leaves less debt than the loan after the fixed rate period', () => {
    const result = calculateMortgage(input)
    expect(result.remainingDebtAfterFixedPeriod).toBeLessThan(result.loanAmount)
    expect(result.remainingDebtAfterFixedPeriod).toBeGreaterThan(0)
    expect(result.yearsToFullRepayment).toBeGreaterThan(10)
  })

  it('caps the fixed period at full repayment', () => {
    const result = calculateMortgage({
      ...input,
      initialRepaymentPercent: 10,
      fixedRatePeriodYears: 30,
    })
    expect(result.remainingDebtAfterFixedPeriod).toBe(0)
  })
})

describe('personal loan', () => {
  it('calculates payment, interest and effective rate', () => {
    const result = calculatePersonalLoan({
      loanAmount: 10_000,
      nominalRatePercent: 6,
      termMonths: 48,
    })
    expect(result.monthlyPayment).toBeCloseTo(234.85, 1)
    expect(result.totalInterest).toBeCloseTo(result.monthlyPayment * 48 - 10_000, 6)
    expect(result.effectiveAnnualRatePercent).toBeCloseTo(6.168, 2)
  })
})
