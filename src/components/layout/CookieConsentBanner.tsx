import { Cookie } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useConsentPreference } from '@/hooks/useConsentPreference'
import { useI18n } from '@/i18n/useI18n'

export function CookieConsentBanner() {
  const [consentPreference, setConsentPreference] = useConsentPreference()
  const { cookieBanner } = useI18n().messages

  if (consentPreference !== null) return null

  return (
    <aside
      aria-labelledby="cookie-consent-title"
      className="fixed inset-x-3 bottom-3 z-40 rounded-sm border-b-[1.5px] border-b-gray-300 bg-white p-4 shadow-overlay sm:inset-x-auto sm:right-4 sm:w-[26rem] sm:p-5 lg:right-6 lg:bottom-6"
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand/12 text-brand"
        >
          <Cookie className="size-5" />
        </span>
        <div>
          <h2
            id="cookie-consent-title"
            className="text-body-lg leading-snug font-bold text-navy"
          >
            {cookieBanner.title}
          </h2>
          <p className="mt-1.5 text-body-sm text-slate-navy">
            {cookieBanner.description}
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Button
          variant="cta"
          size="lg"
          className="h-11 sm:flex-1"
          onClick={() => setConsentPreference('all')}
        >
          {cookieBanner.acceptAll}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="h-11 sm:flex-1"
          onClick={() => setConsentPreference('necessary')}
        >
          {cookieBanner.necessaryOnly}
        </Button>
      </div>
    </aside>
  )
}
