import { useEffect, useRef, type ReactNode } from 'react'
import { ArrowLeft, Calculator, Pencil } from 'lucide-react'
import { LinkButton } from '@/components/common/LinkButton'
import { Section } from '@/components/common/Section'
import { SectionHeader } from '@/components/common/SectionHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { FieldGroup } from '@/components/ui/field'
import { SECTION_PATHS } from '@/config/routePaths'
import { CalculatorLeadCta } from '@/features/calculators/components/CalculatorLeadCta'
import { ResultMetricList } from '@/features/calculators/components/ResultMetricList'
import type { useCalculatorForm } from '@/features/calculators/hooks/useCalculatorForm'
import type { CalculatorLead, ResultMetric } from '@/features/calculators/types'
import { useI18n } from '@/i18n/useI18n'
import { isBelowDesktopViewport } from '@/lib/viewport'
import { cn } from '@/lib/utils'
import type { FinanceCalculatorId } from '@/types/calculator'

type CalculatorPageLayoutProps = {
  calculatorId: FinanceCalculatorId
  fields: ReactNode
  calculation: ReturnType<typeof useCalculatorForm>['calculation']
  // null until the first calculation
  metrics: ResultMetric[] | null
  lead: CalculatorLead | null
  note?: string
  // Optional extra block below the metrics (e.g. a comparison table)
  extra?: ReactNode
}

const cardSpacing = '[--card-spacing:--spacing(5)] lg:[--card-spacing:--spacing(8)]'

// Desktop: form and result side by side. Below `lg`: one screen at a time (form -> result).
export function CalculatorPageLayout({
  calculatorId,
  fields,
  calculation,
  metrics,
  lead,
  note,
  extra,
}: CalculatorPageLayoutProps) {
  const { messages } = useI18n()
  const { calculatorPages } = messages
  const { title, description } = messages.calculators.items[calculatorId]
  const { isResultView, isOutdated } = calculation
  const resultHeadingRef = useRef<HTMLDivElement>(null)

  // Move focus to the result when it replaces the form on small screens
  useEffect(() => {
    if (isResultView && isBelowDesktopViewport()) resultHeadingRef.current?.focus()
  }, [isResultView])

  return (
    <Section aria-labelledby="calculator-title">
      <LinkButton to={SECTION_PATHS.calculators} variant="ghost" className="mb-2 -ml-2">
        <ArrowLeft aria-hidden />
        {calculatorPages.backToCalculators}
      </LinkButton>
      <SectionHeader
        title={title}
        titleId="calculator-title"
        headingLevel="h1"
        className="mb-2 lg:mb-3"
      />
      <p className="mx-auto mb-6 max-w-2xl text-center text-body-sm text-slate-navy lg:mb-8 lg:text-body-md">
        {description}
      </p>

      <div className="grid gap-4 lg:grid-cols-[2fr_3fr] lg:items-start lg:gap-8">
        {/* Hidden, not unmounted: typed values survive the trip to the result screen */}
        <Card className={cn(cardSpacing, isResultView && 'max-lg:hidden')}>
          <CardContent>
            <CardTitle className="mb-4 text-headline-sm">
              {calculatorPages.inputsTitle}
            </CardTitle>
            <form noValidate onSubmit={calculation.submit}>
              <FieldGroup className="gap-4">{fields}</FieldGroup>
              <Button type="submit" variant="cta" size="xl" className="mt-6 w-full">
                <Calculator aria-hidden className="size-5" />
                {calculatorPages.calculate}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className={cn(cardSpacing, !isResultView && 'max-lg:hidden')}>
          <CardContent aria-live="polite">
            <CardTitle
              ref={resultHeadingRef}
              tabIndex={-1}
              className="mb-4 text-headline-sm outline-none"
            >
              {calculatorPages.resultsTitle}
            </CardTitle>
            {metrics && lead ? (
              <div className="flex flex-col gap-4">
                <Button
                  type="button"
                  variant="outline"
                  size="xl"
                  className="w-full lg:hidden"
                  onClick={calculation.showForm}
                >
                  <Pencil aria-hidden className="size-4" />
                  {calculatorPages.editInputs}
                </Button>
                {isOutdated && (
                  <p
                    role="status"
                    className="text-label-md font-semibold text-slate-navy"
                  >
                    {calculatorPages.outdatedResult}
                  </p>
                )}
                <div className={cn('flex flex-col gap-4', isOutdated && 'opacity-50')}>
                  <ResultMetricList metrics={metrics} />
                  {extra}
                </div>
                {note && <p className="text-label-sm text-caption normal-case">{note}</p>}
                <p className="text-label-sm font-semibold text-slate-navy normal-case">
                  {calculatorPages.disclaimer}
                </p>
                <CalculatorLeadCta lead={lead} />
              </div>
            ) : (
              <p className="text-body-sm text-slate-navy">
                {calculatorPages.incompleteInputs}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </Section>
  )
}
