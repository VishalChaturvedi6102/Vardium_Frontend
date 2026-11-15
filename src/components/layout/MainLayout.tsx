import { Outlet, ScrollRestoration } from 'react-router'
import { CookieConsentBanner } from '@/components/layout/CookieConsentBanner'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { useI18n } from '@/i18n/useI18n'

const MAIN_CONTENT_ID = 'main-content'

export function MainLayout() {
  const { messages } = useI18n()

  return (
    <div className="flex min-h-svh flex-col">
      <a
        href={`#${MAIN_CONTENT_ID}`}
        className="sr-only z-[60] rounded-lg bg-navy px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        {messages.layout.skipToContent}
      </a>
      <SiteHeader />
      <main id={MAIN_CONTENT_ID} className="flex-1 pt-16">
        <Outlet />
      </main>
      <CookieConsentBanner />
      <SiteFooter />
      <ScrollRestoration />
    </div>
  )
}
