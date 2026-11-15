import { LinkButton } from '@/components/common/LinkButton'
import { Section } from '@/components/common/Section'

type PageCtaBannerProps = {
  titleId: string
  title: string
  description: string
  buttonLabel: string
  buttonTo: string
}

// Closing call to action at the bottom of a page
export function PageCtaBanner({
  titleId,
  title,
  description,
  buttonLabel,
  buttonTo,
}: PageCtaBannerProps) {
  return (
    <Section aria-labelledby={titleId}>
      <div className="flex flex-col gap-4 rounded-xl bg-navy p-6 text-primary-foreground shadow-overlay md:flex-row md:items-center md:justify-between md:gap-10 lg:p-10">
        <div className="max-w-2xl">
          <h2
            id={titleId}
            className="text-headline-sm font-semibold capitalize md:text-headline-md"
          >
            {title}
          </h2>
          <p className="mt-2 text-body-sm text-primary-foreground/80 md:text-body-md">
            {description}
          </p>
        </div>
        <LinkButton to={buttonTo} variant="secondary" size="xl" className="shrink-0">
          {buttonLabel}
        </LinkButton>
      </div>
    </Section>
  )
}
