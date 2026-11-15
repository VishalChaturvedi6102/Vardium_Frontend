import { Link } from 'react-router'
import { useI18n } from '@/i18n/useI18n'
import type { NavigationLink } from '@/types/navigation'

type FooterLinkGroupProps = { title: string; links: NavigationLink[] }

export function FooterLinkGroup({ title, links }: FooterLinkGroupProps) {
  const { messages } = useI18n()

  return (
    <nav aria-label={title}>
      <h2 className="text-label-md font-bold tracking-wider text-navy uppercase">
        {title}
      </h2>
      <ul className="mt-3 flex flex-col gap-2">
        {links.map((footerLink) => (
          <li key={footerLink.id}>
            <Link
              to={footerLink.to}
              className="text-body-sm text-slate-navy transition-colors hover:text-navy"
            >
              {messages.navigation[footerLink.id]}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
