import { IconTile } from '@/components/common/IconTile'
import { Card, CardContent } from '@/components/ui/card'

type StepCardProps = { stepNumber: number; title: string; description: string }

// Numbered process step (used in an <ol>)
export function StepCard({ stepNumber, title, description }: StepCardProps) {
  return (
    <Card className="h-full [--card-spacing:--spacing(5)]">
      <CardContent className="flex items-start gap-3.5 md:flex-col md:gap-4">
        <IconTile tone="solid" className="rounded-full text-label-lg" aria-hidden>
          {stepNumber}
        </IconTile>
        <div>
          <h3 className="text-body-md font-bold text-navy lg:text-body-lg">{title}</h3>
          <p className="mt-1 text-body-sm text-slate-navy">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
