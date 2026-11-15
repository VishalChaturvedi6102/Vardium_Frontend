import type { LucideIcon } from 'lucide-react'
import { IconTile } from '@/components/common/IconTile'
import { Card, CardContent } from '@/components/ui/card'

type IconFeatureCardProps = { icon: LucideIcon; title: string; description: string }

// Icon, title and short text: values, benefits and similar feature lists
export function IconFeatureCard({
  icon: FeatureIcon,
  title,
  description,
}: IconFeatureCardProps) {
  return (
    <Card className="h-full [--card-spacing:--spacing(4)] md:[--card-spacing:--spacing(5)]">
      <CardContent className="flex flex-col items-start gap-2 md:gap-3">
        <IconTile>
          <FeatureIcon aria-hidden />
        </IconTile>
        <h3 className="text-body-md font-bold text-navy md:text-body-lg">{title}</h3>
        <p className="text-label-md leading-snug text-slate-navy normal-case md:text-body-sm md:leading-normal">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}
