import { isRouteErrorResponse, useRouteError } from 'react-router'
import { LinkButton } from '@/components/common/LinkButton'
import { Section } from '@/components/common/Section'
import { ROUTE_PATHS } from '@/config/routePaths'
import { useI18n } from '@/i18n/useI18n'

// Used for unknown URLs (no route error) and as the router error boundary.
export function ErrorPage() {
  const routeError = useRouteError()
  const { errorPage } = useI18n().messages
  const isNotFound =
    routeError === undefined ||
    (isRouteErrorResponse(routeError) && routeError.status === 404)

  return (
    <Section aria-labelledby="error-title" className="text-center">
      <h1
        id="error-title"
        className="text-headline-lg-mobile font-bold text-navy lg:text-headline-lg"
      >
        {isNotFound ? errorPage.notFoundTitle : errorPage.failureTitle}
      </h1>
      <p className="mx-auto mt-3 max-w-md text-body-md text-slate-navy">
        {isNotFound ? errorPage.notFoundDescription : errorPage.failureDescription}
      </p>
      <LinkButton to={ROUTE_PATHS.home} variant="cta" size="xl" className="mt-6">
        {errorPage.backToHome}
      </LinkButton>
    </Section>
  )
}
