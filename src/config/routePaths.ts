export const ROUTE_PATHS = {
  home: '/',
  aboutUs: '/ueber-uns',
  depotOpening: '/depot-eroeffnen',
  imprint: '/impressum',
  privacyPolicy: '/datenschutz',
  cookieSettings: '/cookie-einstellungen',
  initialInformation: '/erstinformation',
  disclaimer: '/disclaimer',
} as const

const CALCULATOR_BASE_PATH = 'rechner'

export const CALCULATOR_ROUTE_PATTERN = `${CALCULATOR_BASE_PATH}/:calculatorId`

export const getCalculatorPath = (calculatorId: string) =>
  `/${CALCULATOR_BASE_PATH}/${calculatorId}`

export const SECTION_IDS = {
  services: 'leistungen',
  calculators: 'rechner',
  contact: 'kontakt',
} as const

export const SECTION_PATHS = {
  services: `/#${SECTION_IDS.services}`,
  calculators: `/#${SECTION_IDS.calculators}`,
  contact: `/#${SECTION_IDS.contact}`,
} as const
