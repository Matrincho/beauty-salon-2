'use client'

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import CtaButton from '@/components/ui/CtaButton'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { translations as tr, t } from '@/lib/i18n/translations'
import { usePathname } from 'next/navigation'
import { NavbarUserMenuDesktop, NavbarUserMenuMobile } from '@/components/navigation/NavbarUserMenu'

function Navbar() {
  const { locale, toggleLocale } = useLanguage()
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement | null>(null)
  const menuButtonRef = useRef<HTMLButtonElement | null>(null)
  const moreButtonRef = useRef<HTMLButtonElement | null>(null)

  const navLinks = useMemo(() => [
    { label: t(tr.nav.services, locale), href: '#services' },
    { label: t(tr.nav.reviews, locale), href: '#testimonials' },
    { label: t(tr.nav.transformations, locale), href: '#gallery' },
    { label: t(tr.nav.faq, locale), href: '#faq' },
  ], [locale])

  const pageLinks = useMemo(() => [
    { label: t(tr.nav.theTeam, locale), href: '/team' },
    { label: t(tr.nav.about, locale), href: '/about' },
    { label: t(tr.nav.careers, locale), href: '/careers' },
    { label: t(tr.nav.contacts, locale), href: '/contact' },
  ], [locale])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        if (menuButtonRef.current) {
          menuButtonRef.current.focus()
        }
      }

      if (event.key === 'Tab' && mobileMenuRef.current) {
        const focusable = mobileMenuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length === 0) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen])

  const handleNavClick = useCallback(() => setMenuOpen(false), [])
  const handleMenuToggle = useCallback(() => {
    setMenuOpen(prev => !prev)
  }, [])
  const handleBackdropClick = useCallback(() => setMenuOpen(false), [])

  const handleMoreToggle = useCallback(() => {
    setMoreOpen(prev => !prev)
  }, [])

  useEffect(() => {
    if (!moreOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target instanceof Node)) return
      if (moreButtonRef.current && !moreButtonRef.current.parentElement?.contains(event.target)) {
        setMoreOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMoreOpen(false)
        if (moreButtonRef.current) {
          moreButtonRef.current.focus()
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [moreOpen])

  const headerClass = [
    'fixed top-0 left-0 right-0 z-50 overflow-visible',
    'border-b border-[#D4AF37]/20',
    'transition-all duration-300',
    scrolled ? 'bg-[#F9F8F6]/95 backdrop-blur-sm' : 'bg-[#F9F8F6]',
  ].join(' ')

  const mobileDrawerClass = [
    'fixed inset-0 z-40 md:hidden',
    'bg-[#F9F8F6] flex flex-col pt-20',
    'overflow-y-auto',
    'transition-transform duration-300 ease-in-out',
    menuOpen ? 'translate-x-0' : '-translate-x-full',
  ].join(' ')

  return (
    <>
      <header className={headerClass}>
        <div className="w-full px-6 md:px-10 flex items-center justify-between h-16 md:h-20 relative">
          <Link href="/" className="font-serif text-lg md:text-xl tracking-[0.15em] text-[#1A1A1B] uppercase hover:text-[#D4AF37] transition-colors duration-300 hidden md:block">
            Maison&nbsp;Élite
          </Link>
          <div className="md:hidden absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2">
            <Link href="/" className="font-serif text-lg tracking-[0.15em] text-[#1A1A1B] uppercase hover:text-[#D4AF37] transition-colors duration-300 whitespace-nowrap">
              Maison&nbsp;Élite
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6" aria-label="Primary navigation">
            {navLinks.map(link => (
              <a key={link.href} href={link.href} className="font-sans text-xs uppercase tracking-widest text-[#1A1A1B]/60 hover:text-[#D4AF37] transition-colors duration-200">
                {link.label}
              </a>
            ))}
            <span className="w-px h-3 bg-[#E5E0D8]" aria-hidden="true" />
            <div className="relative">
              <button
                ref={moreButtonRef}
                type="button"
                className="font-sans text-xs uppercase tracking-widest text-[#1A1A1B]/60 hover:text-[#D4AF37] transition-colors duration-200 py-2"
                aria-haspopup="true"
                aria-expanded={moreOpen}
                aria-controls="navbar-more-menu"
                onClick={handleMoreToggle}
              >
                {t(tr.nav.more, locale)}
              </button>
              <div
                id="navbar-more-menu"
                role="menu"
                aria-label={t(tr.nav.more, locale)}
                className={`absolute right-0 top-full pt-2 bg-white border border-[#E5E0D8] rounded-md shadow-lg z-50 ${
                  moreOpen ? 'block' : 'hidden'
                }`}
              >
                <div className="flex flex-col gap-0 min-w-40">
                  {pageLinks.map(link => (
                    <Link
                      key={link.href}
                      href={link.href}
                      role="menuitem"
                      className="px-4 py-3 font-sans text-xs uppercase tracking-widest text-[#1A1A1B]/60 hover:text-[#D4AF37] hover:bg-[#F9F8F6] transition-colors duration-200 first:rounded-t-md last:rounded-b-md border-b border-[#E5E0D8] last:border-b-0"
                      onClick={() => setMoreOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <NavbarUserMenuDesktop locale={locale} />
            <span className="w-px h-4 bg-[#E5E0D8]" aria-hidden="true" />
            <button
              type="button"
              onClick={toggleLocale}
              className="flex items-center gap-0.5 font-sans text-xs tracking-widest"
            >
              <span className={locale === 'bg' ? 'text-[#D4AF37] font-semibold' : 'text-[#1A1A1B]/40'}>BG</span>
              <span className="text-[#E5E0D8] mx-1">|</span>
              <span className={locale === 'en' ? 'text-[#D4AF37] font-semibold' : 'text-[#1A1A1B]/40'}>EN</span>
            </button>
            <div className="hidden md:flex">
              <CtaButton size="sm" label={t(tr.cta.bookNow, locale)} />
            </div>
          </div>

          {!isHomePage && (
            <div className="md:hidden absolute left-4 top-1/2 -translate-y-1/2">
              <Link href="/" className="font-sans text-xs uppercase tracking-widest text-[#1A1A1B] hover:text-[#D4AF37] transition-colors duration-200">
                ← {locale === 'bg' ? 'Начало' : 'Home'}
              </Link>
            </div>
          )}
          <button
            ref={menuButtonRef}
            type="button"
            className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 text-[#1A1A1B] hover:text-[#D4AF37] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
            onClick={handleMenuToggle}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu-drawer"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <div
        id="mobile-menu-drawer"
        ref={mobileMenuRef}
        className={mobileDrawerClass}
        role="dialog"
        aria-modal="true"
        aria-hidden={!menuOpen}
      >
        <nav className="flex flex-col items-start gap-1 px-8 pt-8 pb-8" aria-label="Mobile navigation">
          {navLinks.map(link => (
            <a key={link.href} href={link.href} onClick={handleNavClick} className="font-serif text-2xl text-[#1A1A1B] py-3 border-b border-[#E5E0D8] w-full hover:text-[#D4AF37] transition-colors duration-200">
              {link.label}
            </a>
          ))}
          <div className="w-full mt-4">
            <p className="font-sans text-xs uppercase tracking-widest text-[#1A1A1B]/40 px-0 py-2">{t(tr.nav.pages, locale)}</p>
            {pageLinks.map(link => (
              <Link key={link.href} href={link.href} onClick={handleNavClick} className="font-serif text-2xl text-[#1A1A1B] py-3 border-b border-[#E5E0D8] w-full hover:text-[#D4AF37] transition-colors duration-200 block">
                {link.label}
              </Link>
            ))}
          </div>
          <NavbarUserMenuMobile locale={locale} onNavigate={handleNavClick} />
          <div className="w-full mt-6 flex items-center gap-3">
            <span className="font-sans text-xs uppercase tracking-widest text-[#1A1A1B]/40">{locale === 'bg' ? 'Език' : 'Language'}</span>
            <button
              type="button"
              onClick={toggleLocale}
              className="flex items-center gap-0.5 font-sans text-sm tracking-widest"
            >
              <span className={locale === 'bg' ? 'text-[#D4AF37] font-semibold' : 'text-[#1A1A1B]/40'}>BG</span>
              <span className="text-[#E5E0D8] mx-1.5">|</span>
              <span className={locale === 'en' ? 'text-[#D4AF37] font-semibold' : 'text-[#1A1A1B]/40'}>EN</span>
            </button>
          </div>
        </nav>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-30 md:hidden bg-[#1A1A1B]/20" onClick={handleBackdropClick} aria-hidden="true" />
      )}
    </>
  )
}

export default memo(Navbar)
