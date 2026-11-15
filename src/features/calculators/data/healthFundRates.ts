// Additional contribution (Zusatzbeitrag) of nationwide open health funds.
// Source: GKV-Spitzenverband list as republished by transparent-beraten.de (January 2026).
// Funds change their rate during the year: refresh from gkv-spitzenverband.de/krankenkassenliste.
export const HEALTH_FUND_RATES_AS_OF = 'Januar 2026'

export type HealthFundRate = {
  name: string
  additionalRatePercent: number
}

export const healthFundRates: HealthFundRate[] = [
  { name: 'BKK firmus', additionalRatePercent: 2.18 },
  { name: 'TUI BKK', additionalRatePercent: 2.5 },
  { name: 'hkk – Handelskrankenkasse', additionalRatePercent: 2.59 },
  { name: 'Audi BKK', additionalRatePercent: 2.6 },
  { name: 'Techniker Krankenkasse', additionalRatePercent: 2.69 },
  { name: 'WMF Betriebskrankenkasse', additionalRatePercent: 2.85 },
  { name: 'HEK – Hanseatische Krankenkasse', additionalRatePercent: 2.89 },
  { name: 'DAK-Gesundheit', additionalRatePercent: 3.2 },
  { name: 'Debeka BKK', additionalRatePercent: 3.25 },
  { name: 'BARMER', additionalRatePercent: 3.29 },
  { name: 'IKK classic', additionalRatePercent: 3.4 },
  { name: 'BIG direkt gesund', additionalRatePercent: 3.69 },
  { name: 'pronova BKK', additionalRatePercent: 3.7 },
  { name: 'VIACTIV Krankenkasse', additionalRatePercent: 4.19 },
  { name: 'KNAPPSCHAFT', additionalRatePercent: 4.3 },
]
