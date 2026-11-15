import { ChevronRight, CircleCheck, Quote, User } from 'lucide-react'
import advisorPortrait from '@/assets/images/hero_mobile.webp'
import { LinkButton } from '@/components/common/LinkButton'
import { Section } from '@/components/common/Section'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ROUTE_PATHS } from '@/config/routePaths'
import { useI18n } from '@/i18n/useI18n'

export function AdvisorProfileSection() {
  const { advisor } = useI18n().messages

  return (
    <Section aria-labelledby="advisor-title">
      <div className="grid gap-4 lg:grid-cols-2 lg:gap-12">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3.5">
            <Avatar className="size-16 lg:size-20">
              <AvatarImage
                src={advisorPortrait}
                alt=""
                className="object-cover object-top"
              />
              <AvatarFallback className="bg-navy text-primary-foreground">
                <User aria-hidden />
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h2
                id="advisor-title"
                className="text-headline-sm leading-tight font-bold text-navy capitalize"
              >
                {advisor.title}
              </h2>
              <p className="text-label-sm font-semibold text-brand normal-case">
                {advisor.role}
              </p>
              <p className="text-label-sm text-caption normal-case">{advisor.region}</p>
            </div>
          </div>
          <p className="rounded-xl bg-surface-muted p-3.5 text-body-sm text-slate-navy lg:p-5 lg:text-body-md">
            {advisor.biography}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <blockquote className="flex items-start gap-2.5 rounded-xl bg-brand/12 p-3.5 text-navy lg:p-5">
            <Quote aria-hidden className="size-6 shrink-0 text-brand" />
            <p className="text-body-sm leading-snug font-medium italic lg:text-body-md">
              {advisor.quote}
            </p>
          </blockquote>
          <ul className="flex flex-col gap-2">
            {advisor.credentials.map((credential) => (
              <li key={credential} className="flex items-center gap-2 text-slate-navy">
                <CircleCheck aria-hidden className="size-[18px] shrink-0 text-brand" />
                <span className="text-label-sm font-medium normal-case">
                  {credential}
                </span>
              </li>
            ))}
          </ul>
          <LinkButton
            to={ROUTE_PATHS.aboutUs}
            variant="secondary"
            size="xl"
            className="mt-auto w-full lg:w-fit"
          >
            {advisor.learnMore}
            <ChevronRight aria-hidden />
          </LinkButton>
        </div>
      </div>
    </Section>
  )
}
