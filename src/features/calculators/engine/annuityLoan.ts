// Shared annuity maths: monthly payments, nominal annual rate / 12 (German bank convention).
export const toMonthlyRate = (annualRatePercent: number): number =>
  annualRatePercent / 100 / 12

export function calculateAnnuityPayment(
  principal: number,
  monthlyRate: number,
  termMonths: number,
): number {
  if (monthlyRate === 0) return principal / termMonths
  return (principal * monthlyRate) / (1 - (1 + monthlyRate) ** -termMonths)
}

export function calculateRemainingDebt(
  principal: number,
  monthlyRate: number,
  monthlyPayment: number,
  elapsedMonths: number,
): number {
  if (monthlyRate === 0) return Math.max(0, principal - monthlyPayment * elapsedMonths)
  const growthFactor = (1 + monthlyRate) ** elapsedMonths
  const remainingDebt =
    principal * growthFactor - (monthlyPayment * (growthFactor - 1)) / monthlyRate
  return Math.max(0, remainingDebt)
}

// Requires monthlyPayment > principal * monthlyRate, otherwise the debt never shrinks.
export function calculateMonthsToRepay(
  principal: number,
  monthlyRate: number,
  monthlyPayment: number,
): number {
  if (monthlyRate === 0) return principal / monthlyPayment
  return (
    Math.log(monthlyPayment / (monthlyPayment - principal * monthlyRate)) /
    Math.log(1 + monthlyRate)
  )
}
