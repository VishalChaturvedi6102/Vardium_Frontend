type LeadLine = { label: string; value: string }

export function buildLeadMessage(heading: string, leadLines: LeadLine[]): string {
  return [heading, ...leadLines.map(({ label, value }) => `${label}: ${value}`)].join(
    '\n',
  )
}
