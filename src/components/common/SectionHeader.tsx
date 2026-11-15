import { cn } from '@/lib/utils'

type SectionHeaderProps = {
  title: string
  titleId: string
  headingLevel?: 'h1' | 'h2'
  className?: string
}

export function SectionHeader({
  title,
  titleId,
  headingLevel: Heading = 'h2',
  className,
}: SectionHeaderProps) {
  return (
    <header className={cn('mb-4 text-center lg:mb-6', className)}>
      <Heading
        id={titleId}
        className="text-headline-sm font-semibold text-navy capitalize md:text-headline-md lg:text-headline-lg"
      >
        {title}
      </Heading>
    </header>
  )
}
