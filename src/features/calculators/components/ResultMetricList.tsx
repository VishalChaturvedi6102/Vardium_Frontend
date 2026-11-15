import type { ResultMetric } from '@/features/calculators/types'
import { cn } from '@/lib/utils'

type ResultMetricListProps = { metrics: ResultMetric[] }

export function ResultMetricList({ metrics }: ResultMetricListProps) {
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {metrics.map(({ id, label, value, isPrimary }) => (
        <div
          key={id}
          className={cn(
            'rounded-xl p-4',
            isPrimary
              ? 'bg-brand text-white sm:col-span-2'
              : 'bg-surface-muted text-navy',
          )}
        >
          <dt
            className={cn(
              'text-label-md normal-case',
              isPrimary ? 'text-white/80' : 'text-caption',
            )}
          >
            {label}
          </dt>
          <dd
            className={cn(
              'mt-1 font-heading font-semibold tabular-nums',
              isPrimary
                ? 'text-headline-sm sm:text-headline-md'
                : 'text-body-lg sm:text-headline-sm',
            )}
          >
            {value}
          </dd>
        </div>
      ))}
    </dl>
  )
}
