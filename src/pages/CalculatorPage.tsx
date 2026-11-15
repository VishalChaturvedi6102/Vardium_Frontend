import { useParams } from 'react-router'
import { CalculatorRenderer } from '@/features/calculators/components/CalculatorRenderer'
import { ErrorPage } from '@/pages/ErrorPage'

// Calculators that are not built yet fall through to the "not found / in progress" page.
export function CalculatorPage() {
  const { calculatorId = '' } = useParams()

  return <CalculatorRenderer calculatorId={calculatorId} notFound={<ErrorPage />} />
}
