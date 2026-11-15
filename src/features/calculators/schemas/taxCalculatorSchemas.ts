import { z } from 'zod'
import { numberField } from '@/features/calculators/schemas/numberField'
import type { CalculatorValidationKey } from '@/features/calculators/types'

const taxClassValues = ['1', '2', '3', '4', '5', '6'] as const
const churchTaxValues = ['none', '8', '9'] as const

// Employee inputs shared by gross-to-net and company pension
const employeeShape = {
  monthlyGross: numberField(2000, 50_000),
  taxClass: z.enum(taxClassValues),
  churchTax: z.enum(churchTaxValues),
  childrenCount: numberField(0, 10, { isInteger: true }),
  childAllowanceCount: numberField(0, 10, { isHalfStep: true }),
  healthAdditionalRatePercent: numberField(0, 6),
  isSaxony: z.boolean(),
}

export const grossToNetSchema = z.object(employeeShape)

const conversionTooHighKey: CalculatorValidationKey = 'conversionTooHigh'

export const companyPensionSchema = z
  .object({
    ...employeeShape,
    monthlyConversion: numberField(0, 2000),
    employerSubsidyPercent: numberField(0, 100),
  })
  // Practical limit: at most half of the gross salary can be converted
  .refine((pension) => pension.monthlyConversion <= pension.monthlyGross / 2, {
    path: ['monthlyConversion'],
    message: conversionTooHighKey,
  })

export const basicPensionSchema = z.object({
  taxableIncome: numberField(0, 5_000_000),
  assessment: z.enum(['single', 'joint']),
  annualContribution: numberField(0, 200_000),
  existingPensionContributions: numberField(0, 200_000),
  churchTax: z.enum(churchTaxValues),
})

export const healthInsuranceSchema = z.object({
  monthlyIncome: numberField(1000, 50_000),
  employmentStatus: z.enum(['employee', 'selfEmployed']),
  healthAdditionalRatePercent: numberField(0, 6),
  childrenCount: numberField(0, 10, { isInteger: true }),
  privateMonthlyPremium: numberField(0, 3000),
})

export const healthFundComparisonSchema = z.object({
  monthlyIncome: numberField(1000, 50_000),
  employmentStatus: z.enum(['employee', 'selfEmployed']),
  currentRatePercent: numberField(0, 6),
  newRatePercent: numberField(0, 6),
})

export type GrossToNetFormValues = z.infer<typeof grossToNetSchema>
export type CompanyPensionFormValues = z.infer<typeof companyPensionSchema>
export type BasicPensionFormValues = z.infer<typeof basicPensionSchema>
export type HealthInsuranceFormValues = z.infer<typeof healthInsuranceSchema>
export type HealthFundComparisonFormValues = z.infer<typeof healthFundComparisonSchema>
