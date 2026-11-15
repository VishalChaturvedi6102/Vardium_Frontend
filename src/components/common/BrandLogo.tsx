import websiteLogo from '@/assets/images/website_logo.png'
import { siteConfig } from '@/config/siteConfig'
import { cn } from '@/lib/utils'

type BrandLogoProps = { className?: string }

export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <img
      src={websiteLogo}
      alt={siteConfig.brandName}
      width={600}
      height={410}
      className={cn('h-10 w-auto object-contain', className)}
    />
  )
}
