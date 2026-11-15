import { describe, expect, it } from 'vitest'
import {
  calculateAnnuityPayment,
  calculateMonthsToRepay,
  calculateRemainingDebt,
  toMonthlyRate,
} from '@/features/calculators/engine/annuityLoan'
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
import { calculateMortgage } from '@/features/calculators/engine/mortgage'
import { calculatePersonalLoan } from '@/features/calculators/engine/personalLoan'
import { calculateSavingsPlan } from '@/features/calculators/engine/savingsPlan'
import { calculateEmployeeSocialSecurity } from '@/features/calculators/engine/socialSecurity'
import type { TaxClass } from '@/features/calculators/engine/wageTax'
import bmfCases from '@/features/calculators/engine/fixtures/bmfWageTax2026.json'
import {
  basicPensionSchema,
  companyPensionSchema,
  grossToNetSchema,
  healthFundComparisonSchema,
  healthInsuranceSchema,
} from '@/features/calculators/schemas/taxCalculatorSchemas'
import {
  mortgageSchema,
  personalLoanSchema,
  savingsPlanSchema,
} from '@/features/calculators/schemas/calculatorSchemas'

// Independent cross-checks: every engine is compared with a second method (month-by-month
// simulation, root finding, hand-written arithmetic or the official BMF answers).

// ---- reproducible random numbers ----
function createRandom(seed: number) {
  let state = seed
  const next = () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  return {
    between: (min: number, max: number) => min + next() * (max - min),
    integer: (min: number, max: number) => min + Math.floor(next() * (max - min + 1)),
    chance: (probability: number) => next() < probability,
  }
}

const relativeError = (actual: number, expected: number): number =>
  Math.abs(actual - expected) / Math.max(1, Math.abs(expected))

// ---- loans: payment schedules simulated month by month ----
function simulateLoan(
  principal: number,
  monthlyRate: number,
  payment: number,
  months: number,
) {
  let balance = principal
  let interestPaid = 0
  for (let month = 1; month <= months && balance > 1e-9; month += 1) {
    const interest = balance * monthlyRate
    interestPaid += interest
    balance = Math.max(0, balance + interest - payment)
  }
  return { balance, interestPaid }
}

// Root finding instead of the closed formula: payment that leaves no debt after `months`
function findPaymentByBisection(
  principal: number,
  monthlyRate: number,
  months: number,
): number {
  let low = 0
  let high = principal * (1 + monthlyRate) + 1
  for (let iteration = 0; iteration < 200; iteration += 1) {
    const middle = (low + high) / 2
    const { balance } = simulateLoan(principal, monthlyRate, middle, months)
    if (balance > 1e-7) low = middle
    else high = middle
  }
  return high
}

// Internal rate of return of the loan cash flows (+principal, -payment per month)
function findMonthlyIrr(principal: number, payment: number, months: number): number {
  let low = 0
  let high = 1
  for (let iteration = 0; iteration < 200; iteration += 1) {
    const middle = (low + high) / 2
    let presentValue = -principal
    for (let month = 1; month <= months; month += 1)
      presentValue += payment / (1 + middle) ** month
    if (presentValue > 0) low = middle
    else high = middle
  }
  return (low + high) / 2
}

describe('annuity loans vs. month-by-month simulation', () => {
  const random = createRandom(11)
  const cases = Array.from({ length: 300 }, () => ({
    principal: random.between(1000, 800_000),
    annualRatePercent: random.chance(0.05) ? 0 : random.between(0.1, 14),
    months: random.integer(6, 480),
  }))

  it('payment matches a bisection-found payment that clears the debt', () => {
    for (const { principal, annualRatePercent, months } of cases) {
      const monthlyRate = toMonthlyRate(annualRatePercent)
      const closedForm = calculateAnnuityPayment(principal, monthlyRate, months)
      const bisected = findPaymentByBisection(principal, monthlyRate, months)
      expect(relativeError(closedForm, bisected)).toBeLessThan(1e-7)
    }
  })

  it('remaining debt matches the simulated balance at any month', () => {
    for (const { principal, annualRatePercent, months } of cases) {
      const monthlyRate = toMonthlyRate(annualRatePercent)
      const payment = calculateAnnuityPayment(principal, monthlyRate, months)
      const checkpoint = random.integer(1, months)
      const simulated = simulateLoan(principal, monthlyRate, payment, checkpoint).balance
      const calculated = calculateRemainingDebt(
        principal,
        monthlyRate,
        payment,
        checkpoint,
      )
      expect(Math.abs(simulated - calculated)).toBeLessThan(1e-4)
    }
  })

  it('months to repay lie between the last month with debt and the first without', () => {
    for (const { principal, annualRatePercent } of cases) {
      const monthlyRate = toMonthlyRate(annualRatePercent)
      const payment = principal * (monthlyRate + random.between(0.002, 0.03))
      const months = calculateMonthsToRepay(principal, monthlyRate, payment)
      const before = simulateLoan(
        principal,
        monthlyRate,
        payment,
        Math.floor(months),
      ).balance
      const after = simulateLoan(
        principal,
        monthlyRate,
        payment,
        Math.ceil(months) + 1,
      ).balance
      expect(after).toBe(0)
      expect(Math.floor(months) === 0 || before > 0).toBe(true)
    }
  })
})

describe('mortgage vs. simulation', () => {
  const random = createRandom(12)

  it('matches loan, payment, interest and remaining debt in 300 random mortgages', () => {
    for (let run = 0; run < 300; run += 1) {
      const purchasePrice = random.between(80_000, 2_000_000)
      const closingCostPercent = random.between(0, 14)
      const total = purchasePrice * (1 + closingCostPercent / 100)
      const input = {
        purchasePrice,
        closingCostPercent,
        equity: random.between(0, total * 0.9),
        nominalRatePercent: random.between(0.5, 8),
        initialRepaymentPercent: random.between(1, 4),
        fixedRatePeriodYears: random.integer(5, 20),
      }
      const result = calculateMortgage(input)
      const monthlyRate = toMonthlyRate(input.nominalRatePercent)
      const loan = total - input.equity
      const payment =
        (loan * (input.nominalRatePercent + input.initialRepaymentPercent)) / 1200

      expect(result.loanAmount).toBeCloseTo(loan, 6)
      expect(result.monthlyPayment).toBeCloseTo(payment, 6)

      const simulated = simulateLoan(
        loan,
        monthlyRate,
        payment,
        input.fixedRatePeriodYears * 12,
      )
      expect(
        Math.abs(result.remainingDebtAfterFixedPeriod - simulated.balance),
      ).toBeLessThan(1e-3)
      if (simulated.balance > 0) {
        expect(
          Math.abs(result.interestPaidDuringFixedPeriod - simulated.interestPaid),
        ).toBeLessThan(1e-3)
      }
      if (simulated.balance > 0) {
        expect(result.yearsToFullRepayment).toBeGreaterThan(input.fixedRatePeriodYears)
      } else {
        expect(result.yearsToFullRepayment).toBeLessThanOrEqual(
          input.fixedRatePeriodYears + 1 / 12,
        )
      }
    }
  })

  it('reports a fully repaid loan when the repayment outruns the fixed period', () => {
    const result = calculateMortgage({
      purchasePrice: 300_000,
      equity: 150_000,
      closingCostPercent: 0,
      nominalRatePercent: 3,
      initialRepaymentPercent: 15,
      fixedRatePeriodYears: 30,
    })
    expect(result.remainingDebtAfterFixedPeriod).toBe(0)
    expect(result.yearsToFullRepayment).toBeLessThan(30)
  })
})

describe('personal loan vs. simulation', () => {
  const random = createRandom(13)

  it('matches payment, interest and effective rate in 300 random loans', () => {
    for (let run = 0; run < 300; run += 1) {
      const input = {
        loanAmount: random.between(500, 150_000),
        nominalRatePercent: random.between(0.1, 20),
        termMonths: random.integer(3, 120),
      }
      const result = calculatePersonalLoan(input)
      const monthlyRate = toMonthlyRate(input.nominalRatePercent)

      const simulated = simulateLoan(
        input.loanAmount,
        monthlyRate,
        result.monthlyPayment,
        input.termMonths,
      )
      expect(simulated.balance).toBeLessThan(1e-5)
      expect(result.totalInterest).toBeCloseTo(simulated.interestPaid, 4)

      const irr = findMonthlyIrr(
        input.loanAmount,
        result.monthlyPayment,
        input.termMonths,
      )
      expect(result.effectiveAnnualRatePercent).toBeCloseTo(
        ((1 + irr) ** 12 - 1) * 100,
        5,
      )
    }
  })
})

// ---- savings plan: month by month ----
describe('savings plan vs. simulation', () => {
  const random = createRandom(14)

  it('matches the simulated balance and tax in 300 random plans', () => {
    for (let run = 0; run < 300; run += 1) {
      const input = {
        initialCapital: random.between(0, 200_000),
        monthlySavings: random.between(0, 3000),
        termYears: random.integer(1, 50),
        annualReturnPercent: random.between(0, 12),
        annualFundCostsPercent: random.between(0, 2),
        hasTaxApplied: random.chance(0.5),
      }
      const result = calculateSavingsPlan(input)

      const netReturn = (input.annualReturnPercent - input.annualFundCostsPercent) / 100
      const monthlyRate = (1 + netReturn) ** (1 / 12) - 1
      let balance = input.initialCapital
      for (let month = 0; month < input.termYears * 12; month += 1) {
        balance = (balance + input.monthlySavings) * (1 + monthlyRate)
      }
      expect(relativeError(result.finalCapital, balance)).toBeLessThan(1e-9)

      const deposits = input.initialCapital + input.monthlySavings * input.termYears * 12
      expect(result.totalDeposits).toBeCloseTo(deposits, 6)
      expect(result.totalGains).toBeCloseTo(balance - deposits, 3)

      const taxableGains = Math.max(0, (balance - deposits) * 0.7 - 1000)
      const expectedTax = input.hasTaxApplied ? taxableGains * 0.25 * 1.055 : 0
      expect(result.estimatedTax).toBeCloseTo(expectedTax, 3)
      expect(result.finalCapitalAfterTax).toBeCloseTo(balance - expectedTax, 3)
    }
  })

  it('grows with the return and shrinks with the costs', () => {
    const base = {
      initialCapital: 10_000,
      monthlySavings: 300,
      termYears: 25,
      annualReturnPercent: 5,
      annualFundCostsPercent: 0.5,
      hasTaxApplied: false,
    }
    const higherReturn = calculateSavingsPlan({ ...base, annualReturnPercent: 7 })
    const higherCosts = calculateSavingsPlan({ ...base, annualFundCostsPercent: 1.5 })
    expect(higherReturn.finalCapital).toBeGreaterThan(
      calculateSavingsPlan(base).finalCapital,
    )
    expect(higherCosts.finalCapital).toBeLessThan(calculateSavingsPlan(base).finalCapital)
  })
})

// ---- income tax and solidarity surcharge ----
describe('income tax tariff 2026', () => {
  it('never decreases and has a marginal rate between 0 and 45 %', () => {
    let previous = 0
    for (let income = 0; income <= 400_000; income += 250) {
      const tax = calculateTariffTax(income)
      expect(tax).toBeGreaterThanOrEqual(previous)
      // +1 € tolerance: both tax values are rounded down to full euros
      expect(tax - previous).toBeLessThanOrEqual(250 * 0.45 + 1)
      previous = tax
    }
  })

  it('has zero tax up to the basic allowance and starts at 14 %', () => {
    expect(calculateTariffTax(12_348)).toBe(0)
    expect(calculateTariffTax(12_349)).toBe(0)
    expect(calculateTariffTax(12_400)).toBeLessThan(10)
  })

  it('is exactly 42 % / 45 % linear in the top zones', () => {
    expect(calculateTariffTax(100_000)).toBe(Math.floor(100_000 * 0.42 - 11_135.63))
    expect(calculateTariffTax(300_000)).toBe(Math.floor(300_000 * 0.45 - 19_470.38))
  })

  it('splitting equals twice the tax on half the income', () => {
    const random = createRandom(21)
    for (let run = 0; run < 200; run += 1) {
      const income = random.between(0, 500_000)
      expect(calculateIncomeTax(income, true)).toBe(
        calculateTariffTax(Math.floor(income / 2)) * 2,
      )
    }
  })

  it('solidarity surcharge: zero below the limit, phased in, then 5.5 %', () => {
    expect(calculateSolidaritySurcharge(20_350, false)).toBe(0)
    expect(calculateSolidaritySurcharge(40_700, true)).toBe(0)
    // 11.9 % of the excess applies until it reaches 5.5 % of the tax (tax = 20,350 × 1.859…)
    const crossover = 20_350 * (0.119 / (0.119 - 0.055))
    expect(calculateSolidaritySurcharge(crossover - 100, false)).toBeLessThan(
      (crossover - 100) * 0.055,
    )
    expect(calculateSolidaritySurcharge(crossover + 100, false)).toBeCloseTo(
      (crossover + 100) * 0.055,
      1,
    )
    expect(calculateSolidaritySurcharge(100_000, false)).toBe(5500)
  })
})

// ---- employee social security: hand-written cents arithmetic ----
describe('employee social security vs. hand calculation', () => {
  const random = createRandom(31)

  it('matches independent arithmetic in 500 random cases', () => {
    for (let run = 0; run < 500; run += 1) {
      const monthlyGross = random.between(1000, 30_000)
      const additionalRate = random.between(0.5, 4.5)
      const childrenCount = random.integer(0, 6)
      const isSaxony = random.chance(0.15)

      const gross = Math.round(monthlyGross * 100)
      const rvBase = Math.min(gross, 845_000)
      const kvBase = Math.min(gross, 581_250)
      const careRate =
        (isSaxony ? 2.3 : 1.8) / 100 +
        (childrenCount === 0 ? 0.006 : -0.0025 * Math.min(childrenCount - 1, 4))

      const expected = {
        pension: Math.round(rvBase * 0.093) / 100,
        unemployment: Math.round(rvBase * 0.013) / 100,
        health: Math.round(kvBase * (0.073 + additionalRate / 200)) / 100,
        care: Math.round(kvBase * careRate) / 100,
      }
      const actual = calculateEmployeeSocialSecurity({
        monthlyGross: gross / 100,
        healthAdditionalRatePercent: additionalRate,
        childrenCount,
        isSaxony,
      })

      expect(actual.pension).toBeCloseTo(expected.pension, 2)
      expect(actual.unemployment).toBeCloseTo(expected.unemployment, 2)
      expect(Math.abs(actual.health - expected.health)).toBeLessThanOrEqual(0.011)
      expect(Math.abs(actual.care - expected.care)).toBeLessThanOrEqual(0.011)
    }
  })
})

// ---- gross to net: official BMF taxes + hand-written social security ----
type BmfCase = {
  stkl: number
  re4: number
  kvz: number
  pvz: number
  pva: number
  pvs: number
  zkf: number
  r: number
  lstlzz: number
  solzlzz: number
  bk: number
}

describe('gross to net vs. official BMF answers', () => {
  const cases = bmfCases as BmfCase[]

  it('reproduces wage tax, surcharge and church tax of all 608 BMF cases', () => {
    for (const testCase of cases) {
      const result = calculateGrossToNet({
        monthlyGross: testCase.re4 / 100,
        taxClass: testCase.stkl as TaxClass,
        childAllowanceCount: testCase.zkf,
        childrenCount: testCase.pvz === 1 ? 0 : testCase.pva + 1,
        churchTaxRatePercent: testCase.r > 0 ? 9 : 0,
        healthAdditionalRatePercent: testCase.kvz,
        isSaxony: testCase.pvs === 1,
      })

      expect(Math.round(result.wageTax * 100)).toBe(testCase.lstlzz)
      expect(Math.round(result.solidaritySurcharge * 100)).toBe(testCase.solzlzz)
      // 9 % of the official church-tax base (BK), to the cent
      expect(Math.abs(result.churchTax - (testCase.bk * 0.09) / 100)).toBeLessThanOrEqual(
        0.011,
      )
      expect(result.monthlyNet).toBeCloseTo(
        result.monthlyGross - result.totalDeductions,
        6,
      )
    }
  })

  it('never pays out more than the gross and keeps net positive', () => {
    for (const testCase of cases) {
      const result = calculateGrossToNet({
        monthlyGross: testCase.re4 / 100,
        taxClass: testCase.stkl as TaxClass,
        childAllowanceCount: 0,
        childrenCount: 0,
        churchTaxRatePercent: 0,
        healthAdditionalRatePercent: 2.9,
        isSaxony: false,
      })
      expect(result.monthlyNet).toBeGreaterThan(0)
      expect(result.monthlyNet).toBeLessThan(result.monthlyGross)
    }
  })
})

// ---- company pension ----
describe('company pension', () => {
  const base = {
    taxClass: 1 as TaxClass,
    childAllowanceCount: 0,
    childrenCount: 0,
    churchTaxRatePercent: 0,
    healthAdditionalRatePercent: 2.9,
    isSaxony: false,
  }

  it('equals the difference of two gross-to-net runs with the legal exemptions', () => {
    const random = createRandom(41)
    for (let run = 0; run < 200; run += 1) {
      const monthlyGross = random.between(2000, 12_000)
      const monthlyConversion = random.between(0, 900)
      const result = calculateCompanyPension({
        ...base,
        monthlyGross,
        monthlyConversion,
        employerSubsidyPercent: 15,
      })

      const without = calculateGrossToNet({ ...base, monthlyGross })
      const withConversion = calculateGrossToNet({
        ...base,
        monthlyGross,
        taxExemptAmount: Math.min(monthlyConversion, 676),
        socialSecurityExemptAmount: Math.min(monthlyConversion, 338),
      })
      expect(result.netCost).toBeCloseTo(
        without.monthlyNet - (withConversion.monthlyNet - monthlyConversion),
        6,
      )
      expect(result.netCost).toBeGreaterThanOrEqual(0)
      expect(result.netCost).toBeLessThanOrEqual(monthlyConversion + 1e-9)
      expect(result.employerSubsidy).toBeCloseTo(
        Math.min(monthlyConversion, 338) * 0.15,
        6,
      )
    }
  })

  it('costs nothing for no conversion', () => {
    const result = calculateCompanyPension({
      ...base,
      monthlyGross: 4000,
      monthlyConversion: 0,
      employerSubsidyPercent: 15,
    })
    expect(result.netCost).toBe(0)
    expect(result.totalContribution).toBe(0)
  })

  it('saves more tax in higher income brackets', () => {
    const lowIncome = calculateCompanyPension({
      ...base,
      monthlyGross: 2500,
      monthlyConversion: 300,
      employerSubsidyPercent: 15,
    })
    const highIncome = calculateCompanyPension({
      ...base,
      monthlyGross: 8000,
      monthlyConversion: 300,
      employerSubsidyPercent: 15,
    })
    expect(highIncome.netCost).toBeLessThan(lowIncome.netCost)
  })
})

// ---- Rürup ----
describe('basic pension (Rürup)', () => {
  const random = createRandom(51)

  it('equals the tax difference computed with the BMF-verified tariff', () => {
    for (let run = 0; run < 300; run += 1) {
      const input = {
        taxableIncome: random.between(15_000, 300_000),
        isJointAssessment: random.chance(0.4),
        annualContribution: random.between(0, 40_000),
        existingPensionContributions: random.between(0, 25_000),
        churchTaxRatePercent: random.chance(0.4) ? 9 : 0,
      }
      const cap = input.isJointAssessment ? 61_652 : 30_826
      const deductible = Math.min(
        input.annualContribution,
        Math.max(0, cap - input.existingPensionContributions),
      )
      const totalTax = (income: number) => {
        const incomeTax = calculateIncomeTax(income, input.isJointAssessment)
        return (
          incomeTax +
          calculateSolidaritySurcharge(incomeTax, input.isJointAssessment) +
          (incomeTax * input.churchTaxRatePercent) / 100
        )
      }
      const result = calculateBasicPension(input)

      expect(result.deductibleAmount).toBeCloseTo(deductible, 6)
      expect(result.taxSavings).toBeCloseTo(
        totalTax(input.taxableIncome) - totalTax(input.taxableIncome - deductible),
        1,
      )
      // Savings can never exceed the top rate incl. surcharge and church tax
      expect(result.taxSavings).toBeLessThanOrEqual(deductible * 0.45 * 1.055 * 1.09 + 1)
      expect(result.netCost).toBeCloseTo(input.annualContribution - result.taxSavings, 6)
    }
  })

  it('gives a joint assessment the double cap', () => {
    const single = calculateBasicPension({
      taxableIncome: 200_000,
      isJointAssessment: false,
      annualContribution: 50_000,
      existingPensionContributions: 0,
      churchTaxRatePercent: 0,
    })
    const joint = calculateBasicPension({
      taxableIncome: 200_000,
      isJointAssessment: true,
      annualContribution: 50_000,
      existingPensionContributions: 0,
      churchTaxRatePercent: 0,
    })
    expect(single.deductibleAmount).toBe(30_826)
    expect(joint.deductibleAmount).toBe(50_000)
  })
})

// ---- health insurance: hand-derived numbers ----
describe('GKV vs. PKV hand-derived values', () => {
  it('computes the statutory share of a 5,000 € employee', () => {
    const result = calculateHealthInsuranceComparison({
      monthlyIncome: 5000,
      employmentStatus: 'employee',
      healthAdditionalRatePercent: 2.9,
      childrenCount: 0,
      privateMonthlyPremium: 700,
    })
    // 5,000 × (7.3 % + 1.45 % + 1.8 % + 0.6 %) = 557.50
    expect(result.statutoryOwnShare).toBeCloseTo(557.5, 2)
    // subsidy = min(700 / 2, 5,812.50 × (8.75 % + 1.8 %) = 613.22)
    expect(result.privateOwnShare).toBeCloseTo(350, 2)
    expect(result.monthlyDifference).toBeCloseTo(207.5, 2)
  })

  it('caps the subsidy at the employer share of the maximum contribution', () => {
    const result = calculateHealthInsuranceComparison({
      monthlyIncome: 9000,
      employmentStatus: 'employee',
      healthAdditionalRatePercent: 2.9,
      childrenCount: 2,
      privateMonthlyPremium: 1500,
    })
    expect(result.privateOwnShare).toBeCloseTo(1500 - 5812.5 * (0.0875 + 0.018), 2)
  })

  it('switches eligibility exactly above 77,400 € per year', () => {
    const at = (monthlyIncome: number) =>
      calculateHealthInsuranceComparison({
        monthlyIncome,
        employmentStatus: 'employee',
        healthAdditionalRatePercent: 2.9,
        childrenCount: 0,
        privateMonthlyPremium: 500,
      }).isEligibleForPrivateInsurance
    expect(at(6450)).toBe(false)
    expect(at(6450.01)).toBe(true)
  })
})

describe('health fund comparison hand-derived values', () => {
  it('computes employee savings: 4,000 € × 0.5 × (3.4 % - 2.4 %) = 20 € per month', () => {
    const result = calculateHealthFundSavings({
      monthlyIncome: 4000,
      employmentStatus: 'employee',
      currentRatePercent: 3.4,
      newRatePercent: 2.4,
    })
    expect(result.monthlySavings).toBeCloseTo(20, 8)
    expect(result.annualSavings).toBeCloseTo(240, 8)
  })
})

// ---- robustness: schema ranges, boundaries and random draws through the UI schemas ----
describe('robustness at the edges of every form', () => {
  const finite = (value: unknown): boolean =>
    typeof value === 'number' ? Number.isFinite(value) : true
  const allFinite = (result: object): boolean => Object.values(result).every(finite)

  it('keeps savings plans finite at all schema extremes', () => {
    for (const initialCapital of [0, 10_000_000]) {
      for (const monthlySavings of [0, 100_000]) {
        for (const termYears of [1, 60]) {
          for (const annualReturnPercent of [0, 20]) {
            for (const annualFundCostsPercent of [0, 5]) {
              const input = {
                initialCapital,
                monthlySavings,
                termYears,
                annualReturnPercent,
                annualFundCostsPercent,
                hasTaxApplied: true,
              }
              // A plan without any money is rejected by the form
              expect(savingsPlanSchema.safeParse(input).success).toBe(
                initialCapital > 0 || monthlySavings > 0,
              )
              expect(allFinite(calculateSavingsPlan(input))).toBe(true)
            }
          }
        }
      }
    }
  })

  it('keeps mortgages and loans finite at schema extremes', () => {
    const mortgage = {
      purchasePrice: 10_000,
      equity: 0,
      closingCostPercent: 20,
      nominalRatePercent: 0,
      initialRepaymentPercent: 0.1,
      fixedRatePeriodYears: 40,
    }
    expect(mortgageSchema.safeParse(mortgage).success).toBe(true)
    expect(allFinite(calculateMortgage(mortgage))).toBe(true)
    expect(
      allFinite(
        calculateMortgage({
          ...mortgage,
          nominalRatePercent: 15,
          initialRepaymentPercent: 20,
        }),
      ),
    ).toBe(true)

    for (const loanAmount of [100, 1_000_000]) {
      for (const nominalRatePercent of [0, 25]) {
        for (const termMonths of [1, 120]) {
          const input = { loanAmount, nominalRatePercent, termMonths }
          expect(personalLoanSchema.safeParse(input).success).toBe(true)
          const result = calculatePersonalLoan(input)
          expect(allFinite(result)).toBe(true)
          expect(result.totalInterest).toBeGreaterThanOrEqual(-1e-6)
        }
      }
    }
  })

  it('rejects invalid input in every schema', () => {
    expect(savingsPlanSchema.safeParse({ termYears: Number.NaN }).success).toBe(false)
    expect(
      mortgageSchema.safeParse({
        purchasePrice: 400_000,
        equity: 500_000,
        closingCostPercent: 0,
        nominalRatePercent: 3,
        initialRepaymentPercent: 2,
        fixedRatePeriodYears: 10,
      }).success,
    ).toBe(false)
    expect(
      personalLoanSchema.safeParse({
        loanAmount: -5,
        nominalRatePercent: 5,
        termMonths: 12,
      }).success,
    ).toBe(false)
    expect(grossToNetSchema.safeParse({ monthlyGross: 1999 }).success).toBe(false)
    expect(
      healthFundComparisonSchema.safeParse({
        monthlyIncome: 4000,
        employmentStatus: 'employee',
        currentRatePercent: 9,
        newRatePercent: 2,
      }).success,
    ).toBe(false)
  })

  it('stays finite and plausible across 2,000 random tax-calculator inputs', () => {
    const random = createRandom(99)
    for (let run = 0; run < 2000; run += 1) {
      const employee = {
        monthlyGross: random.between(2000, 50_000),
        taxClass: random.integer(1, 6) as TaxClass,
        childAllowanceCount: random.integer(0, 6) / 2,
        childrenCount: random.integer(0, 6),
        churchTaxRatePercent: [0, 8, 9][random.integer(0, 2)],
        healthAdditionalRatePercent: random.between(0, 6),
        isSaxony: random.chance(0.15),
      }
      const net = calculateGrossToNet(employee)
      expect(allFinite(net)).toBe(true)
      expect(net.monthlyNet).toBeGreaterThan(0)
      expect(net.monthlyNet).toBeLessThan(employee.monthlyGross)

      const pension = calculateCompanyPension({
        ...employee,
        monthlyConversion: random.between(0, 2000),
        employerSubsidyPercent: random.between(0, 100),
      })
      expect(allFinite(pension)).toBe(true)

      const basic = calculateBasicPension({
        taxableIncome: random.between(0, 800_000),
        isJointAssessment: random.chance(0.5),
        annualContribution: random.between(0, 200_000),
        existingPensionContributions: random.between(0, 200_000),
        churchTaxRatePercent: employee.churchTaxRatePercent,
      })
      expect(allFinite(basic)).toBe(true)
      expect(basic.taxSavings).toBeGreaterThanOrEqual(0)

      const health = calculateHealthInsuranceComparison({
        monthlyIncome: random.between(1000, 50_000),
        employmentStatus: random.chance(0.5) ? 'employee' : 'selfEmployed',
        healthAdditionalRatePercent: random.between(0, 6),
        childrenCount: random.integer(0, 10),
        privateMonthlyPremium: random.between(0, 3000),
      })
      expect(allFinite(health)).toBe(true)
    }
  })

  it('accepts the default values of the tax calculators', () => {
    expect(
      grossToNetSchema.safeParse({
        monthlyGross: 4000,
        taxClass: '1',
        churchTax: 'none',
        childrenCount: 0,
        childAllowanceCount: 0,
        healthAdditionalRatePercent: 2.9,
        isSaxony: false,
      }).success,
    ).toBe(true)
    expect(
      companyPensionSchema.safeParse({
        monthlyGross: 4000,
        taxClass: '1',
        churchTax: 'none',
        childrenCount: 0,
        childAllowanceCount: 0,
        healthAdditionalRatePercent: 2.9,
        isSaxony: false,
        monthlyConversion: 200,
        employerSubsidyPercent: 15,
      }).success,
    ).toBe(true)
    expect(
      basicPensionSchema.safeParse({
        taxableIncome: 60_000,
        assessment: 'single',
        annualContribution: 3000,
        existingPensionContributions: 0,
        churchTax: 'none',
      }).success,
    ).toBe(true)
    expect(
      healthInsuranceSchema.safeParse({
        monthlyIncome: 7000,
        employmentStatus: 'employee',
        healthAdditionalRatePercent: 2.9,
        childrenCount: 0,
        privateMonthlyPremium: 600,
      }).success,
    ).toBe(true)
  })
})
