import { describe, expect, it } from 'vitest'
import {
  calculateAnnualWageTax,
  toMonthlyShare,
  type TaxClass,
} from '@/features/calculators/engine/wageTax'
import bmfCases from '@/features/calculators/engine/fixtures/bmfWageTax2026.json'

// Golden data: 608 cases answered by the BMF's official external interface (see
// scripts/generateBmfFixtures.mjs). Amounts in cents, monthly wage period (LZZ = 2).
type BmfCase = {
  stkl: number
  re4: number
  kvz: number
  pvz: number
  pva: number
  pvs: number
  zkf: number
  r: number
  lstlzz: number
  solzlzz: number
  bk: number
}

const toCents = (euros: number): number => Math.round(euros * 100)

function calculateWithEngine(testCase: BmfCase) {
  const annual = calculateAnnualWageTax({
    annualGross: (testCase.re4 * 12) / 100,
    taxClass: testCase.stkl as TaxClass,
    childAllowanceCount: testCase.zkf,
    // PVZ = 1: childless surcharge; otherwise PVA discounts start with the second child
    childrenCount: testCase.pvz === 1 ? 0 : testCase.pva + 1,
    healthAdditionalRatePercent: testCase.kvz,
    isSaxony: testCase.pvs === 1,
  })

  return {
    lstlzz: toCents(toMonthlyShare(annual.annualWageTax)),
    solzlzz: toCents(toMonthlyShare(annual.annualSolidaritySurcharge)),
    bk: testCase.r > 0 ? toCents(toMonthlyShare(annual.annualChurchTaxBase)) : 0,
  }
}

const describeCase = (testCase: BmfCase): string =>
  `class ${testCase.stkl}, ${testCase.re4 / 100} €/month, KVZ ${testCase.kvz}, PVZ ${testCase.pvz}, PVA ${testCase.pva}, Sachsen ${testCase.pvs}, ZKF ${testCase.zkf}`

describe('wage tax vs. official BMF interface (608 cases)', () => {
  const cases = bmfCases as BmfCase[]

  it('has the full set of reference cases', () => {
    expect(cases).toHaveLength(608)
  })

  it('matches the monthly wage tax (LSTLZZ) in every case', () => {
    const mismatches = cases
      .map((testCase) => ({ testCase, actual: calculateWithEngine(testCase).lstlzz }))
      .filter(({ testCase, actual }) => actual !== testCase.lstlzz)
      .map(
        ({ testCase, actual }) =>
          `${describeCase(testCase)}: BMF ${testCase.lstlzz}, ours ${actual}`,
      )
    expect(mismatches).toEqual([])
  })

  it('matches the monthly solidarity surcharge (SOLZLZZ) in every case', () => {
    const mismatches = cases
      .map((testCase) => ({ testCase, actual: calculateWithEngine(testCase).solzlzz }))
      .filter(({ testCase, actual }) => actual !== testCase.solzlzz)
      .map(
        ({ testCase, actual }) =>
          `${describeCase(testCase)}: BMF ${testCase.solzlzz}, ours ${actual}`,
      )
    expect(mismatches).toEqual([])
  })

  it('matches the church tax base (BK) in every case', () => {
    const mismatches = cases
      .map((testCase) => ({ testCase, actual: calculateWithEngine(testCase).bk }))
      .filter(({ testCase, actual }) => actual !== testCase.bk)
      .map(
        ({ testCase, actual }) =>
          `${describeCase(testCase)}: BMF ${testCase.bk}, ours ${actual}`,
      )
    expect(mismatches).toEqual([])
  })
})
