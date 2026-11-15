import { useState } from 'react'
import { Link } from 'react-router'
import { Menu, User } from 'lucide-react'
import { BrandLogo } from '@/components/common/BrandLogo'
import { LinkButton } from '@/components/common/LinkButton'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { primaryNavigationLinks } from '@/config/navigationLinks'
import { ROUTE_PATHS, SECTION_PATHS } from '@/config/routePaths'
import { siteConfig } from '@/config/siteConfig'
import { useI18n } from '@/i18n/useI18n'

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { messages } = useI18n()

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-white/90 backdrop-blur-xl">
      <div className="relative container-page flex h-16 items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-lg"
                  className="-ml-2 size-11 lg:hidden"
                  aria-label={messages.layout.openMenu}
                />
              }
            >
              <Menu aria-hidden className="size-6" />
            </SheetTrigger>
            <SheetContent side="left" closeLabel={messages.layout.closeMenu}>
              <SheetHeader>
                <SheetTitle>{siteConfig.brandName}</SheetTitle>
              </SheetHeader>
              <nav aria-label={messages.layout.mobileNavigation} className="px-4">
                <ul className="flex flex-col gap-1">
                  {primaryNavigationLinks.map((navigationLink) => (
                    <li key={navigationLink.id}>
                      <SheetClose
                        nativeButton={false}
                        render={
                          <Link
                            to={navigationLink.to}
                            className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-label-lg font-semibold text-navy hover:bg-surface-muted"
                          />
                        }
                      >
                        <navigationLink.icon aria-hidden className="size-5 text-brand" />
                        {messages.navigation[navigationLink.id]}
                      </SheetClose>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="mt-auto flex flex-col items-start gap-2 border-t border-border p-4">
                <span className="text-label-md font-semibold text-slate-navy">
                  {messages.language.label}
                </span>
                <LanguageSwitcher />
              </div>
            </SheetContent>
          </Sheet>

          {/* Centred between menu button and CTA on small screens */}
          <Link
            to={ROUTE_PATHS.home}
            className="max-lg:absolute max-lg:left-1/2 max-lg:-translate-x-1/2"
          >
            <BrandLogo className="h-15" />
          </Link>
        </div>

        <nav aria-label={messages.layout.desktopNavigation} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {primaryNavigationLinks.map((navigationLink) => (
              <li key={navigationLink.id}>
                <Link
                  to={navigationLink.to}
                  className="rounded-lg px-4 py-2 text-label-lg font-semibold text-slate-navy transition-colors hover:bg-surface-muted hover:text-navy"
                >
                  {messages.navigation[navigationLink.id]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <div className="max-lg:hidden">
            <LanguageSwitcher />
          </div>
          <LinkButton to={SECTION_PATHS.contact} variant="cta" className="h-9 px-4">
            {messages.layout.appointment}
          </LinkButton>
          <Avatar aria-hidden className="hidden sm:flex">
            <AvatarFallback className="bg-navy text-primary-foreground">
              <User className="size-[18px]" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
