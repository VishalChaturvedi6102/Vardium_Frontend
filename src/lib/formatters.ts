export function formatCurrency(
  value: number,
  localeTag: string,
  fractionDigits = 0,
): string {
  return new Intl.NumberFormat(localeTag, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value)
}

export function formatPercent(
  valuePercent: number,
  localeTag: string,
  fractionDigits = 2,
): string {
  return new Intl.NumberFormat(localeTag, {
    style: 'percent',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(valuePercent / 100)
}

export function formatNumber(
  value: number,
  localeTag: string,
  fractionDigits = 1,
): string {
  return new Intl.NumberFormat(localeTag, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value)
}
