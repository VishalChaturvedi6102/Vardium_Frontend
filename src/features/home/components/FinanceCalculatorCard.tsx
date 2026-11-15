import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import { IconTile } from '@/components/common/IconTile'
import { Card, CardContent } from '@/components/ui/card'
import { getCalculatorPath } from '@/config/routePaths'
import type { FinanceCalculator } from '@/features/home/types'
import { useI18n } from '@/i18n/useI18n'

type FinanceCalculatorCardProps = { financeCalculator: FinanceCalculator }

export function FinanceCalculatorCard({ financeCalculator }: FinanceCalculatorCardProps) {
  const { calculators } = useI18n().messages
  const { id, icon: CalculatorIcon } = financeCalculator
  const { title, description, shortDescription, category } = calculators.items[id]

  return (
    <Link
      to={getCalculatorPath(id)}
      className="block h-full rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Card
        interactive
        className="h-full [--card-spacing:--spacing(3)] md:[--card-spacing:--spacing(6)]"
      >
        <CardContent className="flex h-full flex-col justify-between gap-3">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:gap-3">
              <IconTile>
                <CalculatorIcon aria-hidden />
              </IconTile>
              <h3 className="min-w-0 text-body-sm font-bold text-navy md:truncate md:text-body-md">
                {title}
              </h3>
            </div>
            <p className="text-label-md leading-snug text-slate-navy normal-case md:hidden">
              {shortDescription}
            </p>
            <p className="hidden min-h-16.5 text-body-sm text-slate-navy md:block">
              {description}
            </p>
          </div>
          <div className="flex items-center justify-between gap-2 pt-1 max-md:justify-start md:pt-3">
            <span className="min-w-0 truncate text-label-sm text-caption normal-case max-md:hidden">
              {category}
            </span>
            <span className="flex shrink-0 items-center gap-0.5 text-label-md font-semibold whitespace-nowrap text-brand">
              {calculators.startCalculator}
              <ChevronRight aria-hidden className="size-4" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
