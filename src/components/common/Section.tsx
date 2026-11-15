import type { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const sectionVariants = cva('py-6 md:py-8 lg:py-12', {
  variants: {
    tone: {
      canvas: '',
      muted: 'bg-surface-muted',
    },
  },
  defaultVariants: { tone: 'canvas' },
})

type SectionProps = ComponentProps<'section'> & VariantProps<typeof sectionVariants>

export function Section({ tone, className, children, ...rest }: SectionProps) {
  return (
    <section className={cn(sectionVariants({ tone }), className)} {...rest}>
      <div className="container-page">{children}</div>
    </section>
  )
}
