import { describe, expect, it } from 'vitest'
import {
  mortgageSchema,
  personalLoanSchema,
  savingsPlanSchema,
} from '@/features/calculators/schemas/calculatorSchemas'
import {
  basicPensionSchema,
  companyPensionSchema,
  grossToNetSchema,
  healthFundComparisonSchema,
  healthInsuranceSchema,
} from '@/features/calculators/schemas/taxCalculatorSchemas'
import { localizeFieldError } from '@/lib/forms'

const employee = {
  monthlyGross: 4000,
  taxClass: '1',
  churchTax: 'none',
  childrenCount: 0,
  childAllowanceCount: 0,
  healthAdditionalRatePercent: 2.9,
  isSaxony: false,
}
const savings = {
  initialCapital: 5000,
  monthlySavings: 200,
  termYears: 20,
  annualReturnPercent: 6,
  annualFundCostsPercent: 0.2,
  hasTaxApplied: false,
}
const mortgage = {
  purchasePrice: 400_000,
  equity: 80_000,
  closingCostPercent: 7.5,
  nominalRatePercent: 3.6,
  initialRepaymentPercent: 2,
  fixedRatePeriodYears: 10,
}

// Messages produced by the schemas for one field (null = valid)
function messageFor(
  result: {
    success: boolean
    error?: { issues: { path: PropertyKey[]; message: string }[] }
  },
  field: string,
): string | null {
  if (result.success) return null
  return result.error?.issues.find((issue) => issue.path[0] === field)?.message ?? null
}

describe('form validation', () => {
  it('rejects empty and non-numeric values as invalid', () => {
    expect(
      messageFor(
        grossToNetSchema.safeParse({ ...employee, monthlyGross: Number.NaN }),
        'monthlyGross',
      ),
    ).toBe('invalid')
    expect(
      messageFor(
        personalLoanSchema.safeParse({
          loanAmount: Number.NaN,
          nominalRatePercent: 5,
          termMonths: 12,
        }),
        'loanAmount',
      ),
    ).toBe('invalid')
  })

  it('carries the allowed range in the message', () => {
    expect(
      messageFor(
        grossToNetSchema.safeParse({ ...employee, monthlyGross: 1999 }),
        'monthlyGross',
      ),
    ).toBe('range|2000|50000')
    expect(
      messageFor(
        personalLoanSchema.safeParse({
          loanAmount: 5000,
          nominalRatePercent: 26,
          termMonths: 12,
        }),
        'nominalRatePercent',
      ),
    ).toBe('range|0|25')
  })

  it('accepts both limits of every range', () => {
    expect(grossToNetSchema.safeParse({ ...employee, monthlyGross: 2000 }).success).toBe(
      true,
    )
    expect(
      grossToNetSchema.safeParse({ ...employee, monthlyGross: 50_000 }).success,
    ).toBe(true)
    expect(
      personalLoanSchema.safeParse({
        loanAmount: 100,
        nominalRatePercent: 0,
        termMonths: 1,
      }).success,
    ).toBe(true)
    expect(
      personalLoanSchema.safeParse({
        loanAmount: 1_000_000,
        nominalRatePercent: 25,
        termMonths: 120,
      }).success,
    ).toBe(true)
  })

  it('requires whole numbers for years, months and children', () => {
    expect(
      messageFor(
        grossToNetSchema.safeParse({ ...employee, childrenCount: 2.5 }),
        'childrenCount',
      ),
    ).toBe('wholeNumber')
    expect(
      messageFor(
        savingsPlanSchema.safeParse({ ...savings, termYears: 2.7 }),
        'termYears',
      ),
    ).toBe('wholeNumber')
    expect(
      messageFor(
        personalLoanSchema.safeParse({
          loanAmount: 5000,
          nominalRatePercent: 5,
          termMonths: 12.5,
        }),
        'termMonths',
      ),
    ).toBe('wholeNumber')
    expect(
      messageFor(
        mortgageSchema.safeParse({ ...mortgage, fixedRatePeriodYears: 7.3 }),
        'fixedRatePeriodYears',
      ),
    ).toBe('wholeNumber')
    expect(
      messageFor(
        healthInsuranceSchema.safeParse({
          monthlyIncome: 7000,
          employmentStatus: 'employee',
          healthAdditionalRatePercent: 2.9,
          childrenCount: 1.5,
          privateMonthlyPremium: 600,
        }),
        'childrenCount',
      ),
    ).toBe('wholeNumber')
  })

  it('requires child allowances in steps of 0.5', () => {
    expect(
      messageFor(
        grossToNetSchema.safeParse({ ...employee, childAllowanceCount: 0.3 }),
        'childAllowanceCount',
      ),
    ).toBe('halfStep')
    for (const valid of [0, 0.5, 1, 2.5]) {
      expect(
        grossToNetSchema.safeParse({ ...employee, childAllowanceCount: valid }).success,
      ).toBe(true)
    }
  })

  it('rejects negative numbers everywhere', () => {
    expect(savingsPlanSchema.safeParse({ ...savings, monthlySavings: -1 }).success).toBe(
      false,
    )
    expect(mortgageSchema.safeParse({ ...mortgage, equity: -1 }).success).toBe(false)
    expect(
      basicPensionSchema.safeParse({
        taxableIncome: -5,
        assessment: 'single',
        annualContribution: 1000,
        existingPensionContributions: 0,
        churchTax: 'none',
      }).success,
    ).toBe(false)
    expect(
      healthFundComparisonSchema.safeParse({
        monthlyIncome: 4000,
        employmentStatus: 'employee',
        currentRatePercent: -1,
        newRatePercent: 2,
      }).success,
    ).toBe(false)
  })

  it('requires money for a savings plan', () => {
    expect(
      messageFor(
        savingsPlanSchema.safeParse({ ...savings, initialCapital: 0, monthlySavings: 0 }),
        'monthlySavings',
      ),
    ).toBe('savingsRequired')
    expect(
      savingsPlanSchema.safeParse({ ...savings, initialCapital: 0, monthlySavings: 50 })
        .success,
    ).toBe(true)
    expect(
      savingsPlanSchema.safeParse({ ...savings, initialCapital: 1000, monthlySavings: 0 })
        .success,
    ).toBe(true)
  })

  it('rejects equity that covers the whole price including costs', () => {
    expect(
      messageFor(mortgageSchema.safeParse({ ...mortgage, equity: 430_000 }), 'equity'),
    ).toBe('equityTooHigh')
    expect(mortgageSchema.safeParse({ ...mortgage, equity: 429_999 }).success).toBe(true)
  })

  it('limits the salary conversion to half of the gross salary', () => {
    const pension = { ...employee, monthlyConversion: 0, employerSubsidyPercent: 15 }
    expect(
      companyPensionSchema.safeParse({ ...pension, monthlyConversion: 2000 }).success,
    ).toBe(true)
    expect(
      messageFor(
        companyPensionSchema.safeParse({ ...pension, monthlyConversion: 2001 }),
        'monthlyConversion',
      ),
    ).toBe('range|0|2000')
    expect(
      messageFor(
        companyPensionSchema.safeParse({
          ...pension,
          monthlyGross: 2500,
          monthlyConversion: 1300,
        }),
        'monthlyConversion',
      ),
    ).toBe('conversionTooHigh')
  })

  it('rejects unknown select values', () => {
    expect(grossToNetSchema.safeParse({ ...employee, taxClass: '7' }).success).toBe(false)
    expect(grossToNetSchema.safeParse({ ...employee, churchTax: '10' }).success).toBe(
      false,
    )
    expect(
      basicPensionSchema.safeParse({
        taxableIncome: 60_000,
        assessment: 'married',
        annualContribution: 1000,
        existingPensionContributions: 0,
        churchTax: 'none',
      }).success,
    ).toBe(false)
  })
})

describe('error message localisation', () => {
  const messages = {
    range: 'Bitte geben Sie einen Wert zwischen {0} und {1} an.',
    wholeNumber: 'Bitte geben Sie eine ganze Zahl an.',
  }
  const error = (message: string) => ({ type: 'custom', message })

  it('fills the range placeholders with locale-formatted limits', () => {
    expect(
      localizeFieldError(error('range|2000|50000'), messages, 'de-DE')?.message,
    ).toBe('Bitte geben Sie einen Wert zwischen 2.000 und 50.000 an.')
    expect(
      localizeFieldError(
        error('range|2000|50000'),
        { range: 'Between {0} and {1}.' },
        'en-GB',
      )?.message,
    ).toBe('Between 2,000 and 50,000.')
  })

  it('translates plain keys and passes missing errors through', () => {
    expect(localizeFieldError(error('wholeNumber'), messages)?.message).toBe(
      messages.wholeNumber,
    )
    expect(localizeFieldError(undefined, messages)).toBeUndefined()
  })
})
