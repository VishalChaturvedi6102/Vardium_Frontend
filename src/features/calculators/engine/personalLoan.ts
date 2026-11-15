import {
  calculateAnnuityPayment,
  toMonthlyRate,
} from '@/features/calculators/engine/annuityLoan'

export type PersonalLoanInput = {
  loanAmount: number
  nominalRatePercent: number
  termMonths: number
}

export type PersonalLoanResult = {
  monthlyPayment: number
  totalRepayment: number
  totalInterest: number
  effectiveAnnualRatePercent: number
}

export function calculatePersonalLoan({
  loanAmount,
  nominalRatePercent,
  termMonths,
}: PersonalLoanInput): PersonalLoanResult {
  const monthlyRate = toMonthlyRate(nominalRatePercent)
  const monthlyPayment = calculateAnnuityPayment(loanAmount, monthlyRate, termMonths)
  const totalRepayment = monthlyPayment * termMonths

  return {
    monthlyPayment,
    totalRepayment,
    totalInterest: totalRepayment - loanAmount,
    // Without fees the effective rate is the annualised monthly rate
    effectiveAnnualRatePercent: ((1 + monthlyRate) ** 12 - 1) * 100,
  }
}
