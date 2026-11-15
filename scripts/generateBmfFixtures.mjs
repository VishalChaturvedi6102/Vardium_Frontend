// Builds golden test data for the wage-tax engine from the BMF's official external interface
// (bmf-steuerrechner.de, "nur für die Überprüfung Ihrer Rechnung"). Run: npm run fixtures:bmf
// Yearly update: change YEAR and the interface code, regenerate, then run `npm test`.
import { writeFileSync } from 'node:fs'

const YEAR = 2026
const ENDPOINT = `https://www.bmf-steuerrechner.de/interface/${YEAR}Version1.xhtml?code=LSt${YEAR}ext`
const OUTPUT_PATH = new URL(
  `../src/features/calculators/engine/fixtures/bmfWageTax${YEAR}.json`,
  import.meta.url,
)
const CONCURRENCY = 4

// Fixed grid: monthly gross in cents, around the ceilings and tax-zone borders
const grossGridCents = [
  200_000, 234_567, 250_000, 300_000, 350_000, 400_000, 450_000, 500_000, 581_250,
  650_000, 750_000, 845_000, 950_000, 1_200_000, 2_000_000, 3_500_000, 5_000_000,
]
const taxClasses = [1, 2, 3, 4, 5, 6]
const variants = [
  { kvz: 2.9, pvz: 1, pva: 0, pvs: 0, zkf: 0, r: 0 },
  { kvz: 1.5, pvz: 1, pva: 0, pvs: 0, zkf: 0, r: 0 },
  { kvz: 3.4, pvz: 0, pva: 2, pvs: 0, zkf: 1, r: 1 },
  { kvz: 2.9, pvz: 0, pva: 0, pvs: 1, zkf: 0.5, r: 1 },
]

// Seeded PRNG so the random cases are reproducible
function mulberry32(seed) {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const cases = []
for (const taxClass of taxClasses) {
  for (const variant of variants) {
    for (const re4 of grossGridCents) cases.push({ stkl: taxClass, re4, ...variant })
  }
}

const random = mulberry32(2026)
for (let index = 0; index < 200; index += 1) {
  const hasChildren = random() < 0.5
  cases.push({
    stkl: 1 + Math.floor(random() * 6),
    re4: 200_000 + Math.floor(random() * 4_800_000),
    kvz: Math.round((1 + random() * 3.5) * 100) / 100,
    pvz: hasChildren ? 0 : 1,
    pva: hasChildren ? Math.floor(random() * 5) : 0,
    pvs: random() < 0.15 ? 1 : 0,
    zkf: Math.floor(random() * 5) / 2,
    r: random() < 0.4 ? 1 : 0,
  })
}

const readOutput = (xml, name) => {
  const match = xml.match(new RegExp(`<ausgabe name="${name}" value="(-?\\d+)"`))
  if (!match) throw new Error(`Output ${name} missing`)
  return Number(match[1])
}

async function queryBmf(testCase) {
  const query = new URLSearchParams({
    LZZ: '2',
    RE4: String(testCase.re4),
    STKL: String(testCase.stkl),
    KVZ: String(testCase.kvz),
    PVZ: String(testCase.pvz),
    PVA: String(testCase.pva),
    PVS: String(testCase.pvs),
    ZKF: String(testCase.zkf),
    R: String(testCase.r),
    ALV: '0',
    KRV: '0',
    PKV: '0',
  })

  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      const response = await fetch(`${ENDPOINT}&${query}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(30_000),
      })
      const xml = await response.text()
      return {
        ...testCase,
        lstlzz: readOutput(xml, 'LSTLZZ'),
        solzlzz: readOutput(xml, 'SOLZLZZ'),
        bk: readOutput(xml, 'BK'),
      }
    } catch (error) {
      if (attempt === 4) throw error
      await new Promise((resolve) => setTimeout(resolve, 800 * attempt))
    }
  }
}

const results = new Array(cases.length)
let nextIndex = 0
async function worker() {
  while (nextIndex < cases.length) {
    const index = nextIndex
    nextIndex += 1
    results[index] = await queryBmf(cases[index])
    if (index % 50 === 0) console.log(`${index}/${cases.length}`)
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker))

writeFileSync(OUTPUT_PATH, `${JSON.stringify(results)}\n`)
console.log(`Wrote ${results.length} BMF reference cases`)
