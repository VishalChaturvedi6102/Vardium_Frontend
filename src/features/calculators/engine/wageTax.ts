import {
  calculateSolidaritySurcharge,
  calculateTariffTax,
} from '@/features/calculators/engine/incomeTax'
import {
  calculateEmployeeCareRate,
  type CareContributionInput,
} from '@/features/calculators/engine/socialSecurity'
import {
  classFiveSixLimits as limits,
  socialSecurity,
  wageTaxAllowances,
} from '@/features/calculators/parameters/taxYear2026'

// Port of the BMF Programmablaufplan Lohnsteuer 2026 (annual calculation, regular wage only).
export type TaxClass = 1 | 2 | 3 | 4 | 5 | 6

export type PrivateHealthInsurance = {
  monthlyPremium: number
  monthlyEmployerSubsidy: number
}

export type WageTaxInput = CareContributionInput & {
  annualGross: number
  taxClass: TaxClass
  // Kinderfreibetragszähler as on the payslip (only affects solidarity surcharge and church tax)
  childAllowanceCount: number
  healthAdditionalRatePercent: number
  // Undefined = statutory health insurance
  privateHealthInsurance?: PrivateHealthInsurance
  isExemptFromPensionInsurance?: boolean
  isExemptFromUnemploymentInsurance?: boolean
}

export type WageTaxResult = {
  annualWageTax: number
  annualSolidaritySurcharge: number
  // Basis for church tax (Jahreslohnsteuer after child allowances)
  annualChurchTaxBase: number
}

const isSplittingClass = (taxClass: TaxClass): boolean => taxClass === 3
const toCents = (amount: number): number => Math.floor(amount * 100 + 1e-9) / 100
// The PAP rounds the Vorsorgepauschale up to full euros (verified against the BMF interface)
const roundUpToEuros = (amount: number): number => Math.ceil(amount - 1e-9)

// Arbeitnehmer-Pauschbetrag, Sonderausgaben-Pauschbetrag and Entlastungsbetrag (class II)
function calculateTableAllowance(taxClass: TaxClass, annualGross: number): number {
  if (taxClass === 6) return 0
  const employeeLumpSum = Math.min(annualGross, wageTaxAllowances.employeeLumpSum)
  const singleParentRelief = taxClass === 2 ? wageTaxAllowances.singleParentRelief : 0
  return employeeLumpSum + wageTaxAllowances.specialExpensesLumpSum + singleParentRelief
}

// Vorsorgepauschale (UPEVP)
function calculateProvisionAllowance(input: WageTaxInput): number {
  const { annualGross, taxClass, privateHealthInsurance } = input

  const pensionBase = Math.min(annualGross, socialSecurity.pensionUnemploymentCeilingYear)
  const pensionPart = input.isExemptFromPensionInsurance
    ? 0
    : pensionBase * socialSecurity.pensionEmployeeRate

  let healthCarePart: number
  if (privateHealthInsurance) {
    healthCarePart =
      taxClass === 6
        ? 0
        : Math.max(
            0,
            (privateHealthInsurance.monthlyPremium -
              privateHealthInsurance.monthlyEmployerSubsidy) *
              12,
          )
  } else {
    const healthCareBase = Math.min(annualGross, socialSecurity.healthCareCeilingYear)
    const healthRate =
      socialSecurity.healthProvisionBaseRate + input.healthAdditionalRatePercent / 200
    healthCarePart = healthCareBase * (healthRate + calculateEmployeeCareRate(input))
  }

  const provisionAllowance = roundUpToEuros(pensionPart + healthCarePart)
  if (input.isExemptFromUnemploymentInsurance || taxClass === 6) return provisionAllowance

  // Höchstbetragsberechnung: unemployment insurance counts within a 1,900 € cap
  const unemploymentPart = pensionBase * socialSecurity.unemploymentEmployeeRate
  const cappedPart = Math.min(
    wageTaxAllowances.provisionCeiling,
    unemploymentPart + healthCarePart,
  )
  return Math.max(provisionAllowance, roundUpToEuros(pensionPart + cappedPart))
}

// UP5-6: tax on the 1.25 / 0.75 fold income, at least 14 % of the income
function calculateClassFiveSixBase(income: number): number {
  const upperTax = calculateTariffTax(Math.floor(income * 1.25))
  const lowerTax = calculateTariffTax(Math.floor(income * 0.75))
  const difference = (upperTax - lowerTax) * 2
  const minimumTax = Math.floor(income * limits.minimumTaxRate)
  return minimumTax > difference ? minimumTax : difference
}

// MST5-6
function calculateClassFiveSixTax(taxableIncome: number): number {
  if (taxableIncome > limits.second) {
    let tax = calculateClassFiveSixBase(limits.second)
    if (taxableIncome > limits.third) {
      tax += Math.floor((limits.third - limits.second) * limits.upperRate)
      return tax + Math.floor((taxableIncome - limits.third) * limits.topRate)
    }
    return tax + Math.floor((taxableIncome - limits.second) * limits.upperRate)
  }

  const tax = calculateClassFiveSixBase(taxableIncome)
  if (taxableIncome <= limits.first) return tax

  const higherTax =
    calculateClassFiveSixBase(limits.first) +
    Math.floor((taxableIncome - limits.first) * limits.upperRate)
  return higherTax < tax ? higherTax : tax
}

// MLSTJAHR: annual wage tax for the given allowances
function calculateAnnualTax(
  input: WageTaxInput,
  tableAllowance: number,
  provisionAllowance: number,
): number {
  const taxableIncome = Math.max(
    0,
    input.annualGross - tableAllowance - provisionAllowance,
  )
  const splittingFactor = isSplittingClass(input.taxClass) ? 2 : 1
  const income = taxableIncome < 1 ? 0 : Math.floor(taxableIncome / splittingFactor)

  return input.taxClass < 5
    ? calculateTariffTax(income) * splittingFactor
    : calculateClassFiveSixTax(income)
}

function calculateChildAllowance(
  taxClass: TaxClass,
  childAllowanceCount: number,
): number {
  if (taxClass >= 5) return 0
  const perCount =
    taxClass === 4
      ? wageTaxAllowances.childAllowanceOneParent
      : wageTaxAllowances.childAllowanceBothParents
  return childAllowanceCount * perCount
}

export function calculateAnnualWageTax(input: WageTaxInput): WageTaxResult {
  const tableAllowance = calculateTableAllowance(input.taxClass, input.annualGross)
  const provisionAllowance = calculateProvisionAllowance(input)
  const annualWageTax = calculateAnnualTax(input, tableAllowance, provisionAllowance)

  const childAllowance = calculateChildAllowance(
    input.taxClass,
    input.childAllowanceCount,
  )
  const annualChurchTaxBase =
    childAllowance > 0
      ? calculateAnnualTax(input, tableAllowance + childAllowance, provisionAllowance)
      : annualWageTax

  return {
    annualWageTax,
    annualSolidaritySurcharge: calculateSolidaritySurcharge(
      annualChurchTaxBase,
      isSplittingClass(input.taxClass),
    ),
    annualChurchTaxBase,
  }
}

// Monthly share of an annual amount, rounded down to cents (UPANTEIL)
export const toMonthlyShare = (annualAmount: number): number => toCents(annualAmount / 12)
