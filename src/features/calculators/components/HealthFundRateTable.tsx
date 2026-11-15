import { calculateHealthFundSavings } from '@/features/calculators/engine/healthFundComparison'
import type { HealthFundSavingsInput } from '@/features/calculators/engine/healthFundComparison'
import {
  healthFundRates,
  HEALTH_FUND_RATES_AS_OF,
} from '@/features/calculators/data/healthFundRates'
import { useFormatters } from '@/hooks/useFormatters'
import { useI18n } from '@/i18n/useI18n'

type HealthFundRateTableProps = {
  comparison: Omit<HealthFundSavingsInput, 'newRatePercent'>
}

// Nationwide funds with their rate and the yearly saving against the user's current fund.
export function HealthFundRateTable({ comparison }: HealthFundRateTableProps) {
  const { table } = useI18n().messages.calculatorPages['gkv-vergleich']
  const format = useFormatters()

  return (
    <div>
      <h3 className="mb-2 text-body-md font-bold text-navy">{table.title}</h3>
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-left text-label-md">
          <thead className="bg-surface-muted text-caption">
            <tr>
              <th scope="col" className="px-3 py-2 font-semibold">
                {table.fundColumn}
              </th>
              <th scope="col" className="px-3 py-2 text-right font-semibold">
                {table.rateColumn}
              </th>
              <th scope="col" className="px-3 py-2 text-right font-semibold">
                {table.savingsColumn}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-navy tabular-nums">
            {healthFundRates.map(({ name, additionalRatePercent }) => {
              const { annualSavings } = calculateHealthFundSavings({
                ...comparison,
                newRatePercent: additionalRatePercent,
              })

              return (
                <tr key={name}>
                  <th scope="row" className="px-3 py-2 font-medium">
                    {name}
                  </th>
                  <td className="px-3 py-2 text-right">
                    {format.percent(additionalRatePercent)}
                  </td>
                  <td className="px-3 py-2 text-right font-semibold">
                    {format.currency(annualSavings)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-label-sm text-caption normal-case">
        {table.asOf} {HEALTH_FUND_RATES_AS_OF}
      </p>
    </div>
  )
}
