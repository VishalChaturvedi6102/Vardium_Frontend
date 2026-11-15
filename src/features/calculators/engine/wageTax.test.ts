import { describe, expect, it } from 'vitest'
import {
  calculateAnnualWageTax,
  type TaxClass,
  type WageTaxInput,
} from '@/features/calculators/engine/wageTax'

// Reference values: BMF Programmablaufplan Lohnsteuer 2026, Prüftabellen (12.11.2025).
const taxClasses: TaxClass[] = [1, 2, 3, 4, 5, 6]

// "Allgemeine Lohnsteuer": ALV/KRV/PKV = 0, KVZ 2.90; class II without childless surcharge.
const generalTable: Record<number, number[]> = {
  5_000: [0, 0, 0, 0, 372, 558],
  17_500: [51, 0, 0, 51, 1778, 1956],
  30_000: [2248, 1230, 0, 2248, 5588, 6120],
  50_000: [6788, 5580, 2810, 6788, 12_010, 12_542],
  72_500: [13_062, 11_647, 7574, 13_062, 19_681, 20_213],
  110_000: [27_393, 25_779, 18_252, 27_393, 34_302, 34_834],
}

// "Besondere Lohnsteuer": ALV/KRV/PKV = 1; PKPV 300 € (class III 500 €, class VI 0 €) per month.
const specialTable: Record<number, number[]> = {
  5_000: [0, 0, 0, 0, 18, 700],
  30_000: [2886, 1788, 0, 2886, 6615, 8460],
  50_000: [8880, 7487, 3824, 8880, 14_729, 16_773],
  110_000: [33_020, 31_231, 22_062, 33_020, 39_929, 41_973],
}

const baseInput = (annualGross: number, taxClass: TaxClass): WageTaxInput => ({
  annualGross,
  taxClass,
  childAllowanceCount: 0,
  healthAdditionalRatePercent: 2.9,
  childrenCount: taxClass === 2 ? 1 : 0,
})

describe('wage tax 2026 (BMF check tables)', () => {
  for (const [grossText, expectedByClass] of Object.entries(generalTable)) {
    it(`general table at ${grossText} €`, () => {
      taxClasses.forEach((taxClass, index) => {
        const { annualWageTax } = calculateAnnualWageTax(
          baseInput(Number(grossText), taxClass),
        )
        expect(annualWageTax, `class ${taxClass}`).toBe(expectedByClass[index])
      })
    })
  }

  for (const [grossText, expectedByClass] of Object.entries(specialTable)) {
    it(`special table at ${grossText} €`, () => {
      taxClasses.forEach((taxClass, index) => {
        const monthlyPremium = taxClass === 3 ? 500 : taxClass === 6 ? 0 : 300
        const { annualWageTax } = calculateAnnualWageTax({
          ...baseInput(Number(grossText), taxClass),
          privateHealthInsurance: { monthlyPremium, monthlyEmployerSubsidy: 0 },
          isExemptFromPensionInsurance: true,
          isExemptFromUnemploymentInsurance: true,
        })
        expect(annualWageTax, `class ${taxClass}`).toBe(expectedByClass[index])
      })
    })
  }

  it('charges no solidarity surcharge below the exemption limit', () => {
    expect(calculateAnnualWageTax(baseInput(50_000, 1)).annualSolidaritySurcharge).toBe(0)
  })

  it('charges solidarity surcharge above the exemption limit', () => {
    const { annualSolidaritySurcharge, annualWageTax } = calculateAnnualWageTax(
      baseInput(110_000, 1),
    )
    expect(annualSolidaritySurcharge).toBeGreaterThan(0)
    expect(annualSolidaritySurcharge).toBeLessThanOrEqual(annualWageTax * 0.055)
  })
})
