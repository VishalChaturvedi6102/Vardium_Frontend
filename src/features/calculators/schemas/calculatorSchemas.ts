import { z } from 'zod'
import { calculateLoanAmount } from '@/features/calculators/engine/mortgage'
import { numberField } from '@/features/calculators/schemas/numberField'
import type { CalculatorValidationKey } from '@/features/calculators/types'

const equityTooHighKey: CalculatorValidationKey = 'equityTooHigh'

const savingsRequiredKey: CalculatorValidationKey = 'savingsRequired'

export const savingsPlanSchema = z
  .object({
    initialCapital: numberField(0, 10_000_000),
    monthlySavings: numberField(0, 100_000),
    termYears: numberField(1, 60, { isInteger: true }),
    annualReturnPercent: numberField(0, 20),
    annualFundCostsPercent: numberField(0, 5),
    hasTaxApplied: z.boolean(),
  })
  // A plan needs money: a start capital, a monthly rate, or both
  .refine((plan) => plan.initialCapital > 0 || plan.monthlySavings > 0, {
    path: ['monthlySavings'],
    message: savingsRequiredKey,
  })

export const mortgageSchema = z
  .object({
    purchasePrice: numberField(10_000, 50_000_000),
    equity: numberField(0, 50_000_000),
    closingCostPercent: numberField(0, 20),
    nominalRatePercent: numberField(0, 15),
    initialRepaymentPercent: numberField(0.1, 20),
    fixedRatePeriodYears: numberField(1, 40, { isInteger: true }),
  })
  .refine((mortgageInput) => calculateLoanAmount(mortgageInput) > 0, {
    path: ['equity'],
    message: equityTooHighKey,
  })

export const personalLoanSchema = z.object({
  loanAmount: numberField(100, 1_000_000),
  nominalRatePercent: numberField(0, 25),
  termMonths: numberField(1, 120, { isInteger: true }),
})

export type SavingsPlanFormValues = z.infer<typeof savingsPlanSchema>
export type MortgageFormValues = z.infer<typeof mortgageSchema>
export type PersonalLoanFormValues = z.infer<typeof personalLoanSchema>
