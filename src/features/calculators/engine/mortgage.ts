import {
  calculateMonthsToRepay,
  calculateRemainingDebt,
  toMonthlyRate,
} from '@/features/calculators/engine/annuityLoan'

export type MortgageInput = {
  purchasePrice: number
  equity: number
  closingCostPercent: number
  nominalRatePercent: number
  initialRepaymentPercent: number
  fixedRatePeriodYears: number
}

export type MortgageResult = {
  loanAmount: number
  monthlyPayment: number
  remainingDebtAfterFixedPeriod: number
  interestPaidDuringFixedPeriod: number
  yearsToFullRepayment: number
}

export const calculateLoanAmount = ({
  purchasePrice,
  equity,
  closingCostPercent,
}: Pick<MortgageInput, 'purchasePrice' | 'equity' | 'closingCostPercent'>): number =>
  purchasePrice * (1 + closingCostPercent / 100) - equity

export function calculateMortgage(input: MortgageInput): MortgageResult {
  const loanAmount = calculateLoanAmount(input)
  const monthlyRate = toMonthlyRate(input.nominalRatePercent)
  // Rate = loan × (interest + initial repayment) / 12
  const monthlyPayment =
    (loanAmount * (input.nominalRatePercent + input.initialRepaymentPercent)) / 100 / 12

  const monthsToFullRepayment = calculateMonthsToRepay(
    loanAmount,
    monthlyRate,
    monthlyPayment,
  )
  const fixedRateMonths = Math.min(input.fixedRatePeriodYears * 12, monthsToFullRepayment)
  const remainingDebtAfterFixedPeriod =
    fixedRateMonths >= monthsToFullRepayment
      ? 0
      : calculateRemainingDebt(loanAmount, monthlyRate, monthlyPayment, fixedRateMonths)

  return {
    loanAmount,
    monthlyPayment,
    remainingDebtAfterFixedPeriod,
    interestPaidDuringFixedPeriod:
      monthlyPayment * fixedRateMonths - (loanAmount - remainingDebtAfterFixedPeriod),
    yearsToFullRepayment: monthsToFullRepayment / 12,
  }
}
