// Official 2026 values. Yearly update: add taxYear20XX.ts and switch the imports in the engines.
// Sources: BMF Programmablaufplan Lohnsteuer 2026 (12.11.2025), SV-Rechengrößenverordnung 2026,
// § 32a, § 10 Abs. 3, § 3 Nr. 63 EStG. Verify every value again before each release.
export const TAX_YEAR = 2026

export const capitalGainsTax = {
  flatTaxRate: 0.25,
  solidaritySurchargeRate: 0.055,
  savingsAllowance: 1000,
  equityFundPartialExemption: 0.3,
} as const

// Income tax tariff § 32a EStG (as used in the wage-tax procedure)
export const incomeTaxTariff = {
  basicAllowance: 12348,
  zoneTwoStart: 17799,
  zoneThreeStart: 69878,
  zoneFourStart: 277825,
  zoneOneFactor: 914.51,
  zoneOneConstant: 1400,
  zoneTwoFactor: 173.1,
  zoneTwoConstant: 2397,
  zoneTwoBase: 1034.87,
  zoneThreeRate: 0.42,
  zoneThreeSubtrahend: 11135.63,
  zoneFourRate: 0.45,
  zoneFourSubtrahend: 19470.38,
} as const

export const solidaritySurcharge = {
  rate: 0.055,
  phaseInRate: 0.119,
  exemptionLimit: 20350,
} as const

// Wage tax classes V / VI (§ 39b Abs. 2 Satz 7 EStG)
export const classFiveSixLimits = {
  first: 14071,
  second: 34939,
  third: 222260,
  upperRate: 0.42,
  topRate: 0.45,
  minimumTaxRate: 0.14,
} as const

export const wageTaxAllowances = {
  employeeLumpSum: 1230,
  specialExpensesLumpSum: 36,
  singleParentRelief: 4260,
  childAllowanceBothParents: 9756,
  childAllowanceOneParent: 4878,
  provisionCeiling: 1900,
} as const

export const socialSecurity = {
  pensionUnemploymentCeilingYear: 101_400,
  healthCareCeilingYear: 69_750,
  mandatoryHealthInsuranceLimitYear: 77_400,
  pensionEmployeeRate: 0.093,
  unemploymentEmployeeRate: 0.013,
  healthGeneralRate: 0.146,
  // Reduced rate (14 % / 2) used for the wage-tax provision allowance
  healthProvisionBaseRate: 0.07,
  careEmployeeRate: 0.018,
  careEmployeeRateSaxony: 0.023,
  careChildlessSurcharge: 0.006,
  careDiscountPerChild: 0.0025,
  careMaxDiscountedChildren: 4,
  averageHealthAdditionalRatePercent: 2.9,
} as const

export const companyPension = {
  taxFreeShareOfCeiling: 0.08,
  socialSecurityFreeShareOfCeiling: 0.04,
  mandatoryEmployerSubsidyPercent: 15,
} as const

export const basicPension = {
  deductionCapSingle: 30_826,
  deductionCapJoint: 61_652,
} as const
