import { lazy, Suspense, type ReactElement, type ReactNode } from 'react'

const SavingsPlanCalculator = lazy(() =>
  import('@/features/calculators/components/SavingsPlanCalculator').then((module) => ({
    default: module.SavingsPlanCalculator,
  })),
)
const MortgageCalculator = lazy(() =>
  import('@/features/calculators/components/MortgageCalculator').then((module) => ({
    default: module.MortgageCalculator,
  })),
)
const PersonalLoanCalculator = lazy(() =>
  import('@/features/calculators/components/PersonalLoanCalculator').then((module) => ({
    default: module.PersonalLoanCalculator,
  })),
)
const GrossToNetCalculator = lazy(() =>
  import('@/features/calculators/components/GrossToNetCalculator').then((module) => ({
    default: module.GrossToNetCalculator,
  })),
)
const CompanyPensionCalculator = lazy(() =>
  import('@/features/calculators/components/CompanyPensionCalculator').then((module) => ({
    default: module.CompanyPensionCalculator,
  })),
)
const BasicPensionCalculator = lazy(() =>
  import('@/features/calculators/components/BasicPensionCalculator').then((module) => ({
    default: module.BasicPensionCalculator,
  })),
)
const HealthInsuranceCalculator = lazy(() =>
  import('@/features/calculators/components/HealthInsuranceCalculator').then(
    (module) => ({
      default: module.HealthInsuranceCalculator,
    }),
  ),
)
const HealthFundComparisonCalculator = lazy(() =>
  import('@/features/calculators/components/HealthFundComparisonCalculator').then(
    (module) => ({ default: module.HealthFundComparisonCalculator }),
  ),
)

// Calculator pages by id. Add an entry when a calculator ships.
const calculatorElements = new Map<string, ReactElement>([
  ['fondssparplan', <SavingsPlanCalculator />],
  ['baufinanzierung', <MortgageCalculator />],
  ['privatkredit', <PersonalLoanCalculator />],
  ['brutto-netto', <GrossToNetCalculator />],
  ['bav', <CompanyPensionCalculator />],
  ['ruerup-steuervorteil', <BasicPensionCalculator />],
  ['gkv-vs-pkv', <HealthInsuranceCalculator />],
  ['gkv-vergleich', <HealthFundComparisonCalculator />],
])

type CalculatorRendererProps = { calculatorId: string; notFound: ReactNode }

export function CalculatorRenderer({ calculatorId, notFound }: CalculatorRendererProps) {
  const calculatorElement = calculatorElements.get(calculatorId)

  if (!calculatorElement) return notFound

  return (
    <Suspense fallback={<div className="min-h-[40rem]" aria-hidden />}>
      {calculatorElement}
    </Suspense>
  )
}
