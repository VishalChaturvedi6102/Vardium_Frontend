import type { ComponentProps } from 'react'
import { Link, type To } from 'react-router'
import { Button } from '@/components/ui/button'

type LinkButtonProps = Omit<ComponentProps<typeof Button>, 'render' | 'nativeButton'> & {
  to: To
  state?: unknown
}

export function LinkButton({ to, state, ...buttonProps }: LinkButtonProps) {
  return (
    <Button
      render={<Link to={to} state={state} />}
      nativeButton={false}
      {...buttonProps}
    />
  )
}
