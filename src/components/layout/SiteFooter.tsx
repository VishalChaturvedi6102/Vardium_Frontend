import { BrandLogo } from '@/components/common/BrandLogo'
import { FooterLinkGroup } from '@/components/layout/FooterLinkGroup'
import { legalNavigationLinks, primaryNavigationLinks } from '@/config/navigationLinks'
import { siteConfig } from '@/config/siteConfig'
import { useI18n } from '@/i18n/useI18n'

export function SiteFooter() {
  const { footer } = useI18n().messages

  return (
    <footer className="mt-auto border-t border-border bg-white">
      <div className="container-page grid gap-8 py-8 lg:grid-cols-2 lg:gap-16 lg:py-10">
        <div className="flex max-w-md flex-col items-start gap-4">
          <BrandLogo className="h-16" />
          <p className="text-body-sm text-slate-navy">{footer.companyDescription}</p>
        </div>
        <div className="grid grid-cols-2 gap-8 lg:justify-items-end">
          <FooterLinkGroup
            title={footer.navigationTitle}
            links={primaryNavigationLinks}
          />
          <FooterLinkGroup title={footer.legalTitle} links={legalNavigationLinks} />
        </div>
      </div>
      <div className="border-t border-border">
        <p className="container-page py-4 text-label-sm text-caption">
          © {siteConfig.copyrightYear} {siteConfig.brandName}. {footer.rightsReserved}
        </p>
      </div>
    </footer>
  )
}
