import type { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const iconTileVariants = cva('flex shrink-0 items-center justify-center rounded-lg', {
  variants: {
    tone: {
      brand: 'bg-brand/15 text-brand',
      muted: 'bg-surface-muted text-navy',
      solid: 'bg-brand font-bold text-white',
    },
    size: {
      sm: 'size-8 [&_svg]:size-5',
      md: 'size-10 [&_svg]:size-[22px]',
    },
  },
  defaultVariants: { tone: 'brand', size: 'md' },
})

type IconTileProps = ComponentProps<'div'> & VariantProps<typeof iconTileVariants>

export function IconTile({ tone, size, className, ...rest }: IconTileProps) {
  return <div className={cn(iconTileVariants({ tone, size }), className)} {...rest} />
}
