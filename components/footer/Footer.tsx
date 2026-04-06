'use client'

import Link from 'next/link'
import { Instagram } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { translations as tr, t } from '@/lib/i18n/translations'

export default function Footer() {
  const { locale } = useLanguage()

  const serviceLinks = [
    { label: t(tr.footer.svc1, locale), id: 'confidence-session', key: 'svc1' },
    { label: t(tr.footer.svc2, locale), id: 'full-reset', key: 'svc2' },
    { label: t(tr.footer.svc3, locale), id: 'glow-treatment', key: 'svc3' },
  ]

  const companyLinks = [
    { label: t(tr.footer.ourStory, locale), href: '/about'   },
    { label: t(tr.footer.theTeam,  locale), href: '/team'    },
    { label: t(tr.footer.careers,  locale), href: '/careers' },
    { label: t(tr.footer.contact,  locale), href: '/contact' },
  ]

  return (
    <footer className="bg-[#1A1A1B]" aria-label="Site footer">
      {/* Gold top rule */}
      <div className="border-t border-[#D4AF37]" />

      {/* Tier 2 — Link columns */}
      <div className="border-t border-[#F9F8F6]/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

            {/* Column 1 — Brand */}
            <div className="flex flex-col gap-5">
              <span className="font-serif text-base tracking-[0.15em] uppercase text-[#F9F8F6]">
                Maison Élite
              </span>
              <p className="font-sans text-xs leading-relaxed text-[#8C8074]">
                {t(tr.footer.brandTagline, locale)}
              </p>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#F9F8F6]/50 hover:text-[#D4AF37] transition-colors duration-200 w-fit"
                aria-label={t(tr.footer.instagramAria, locale)}
              >
                <Instagram size={16} aria-hidden="true" />
                <span className="font-sans text-xs tracking-wide">@maisonelite</span>
              </a>
            </div>

            {/* Column 2 — Services */}
            <div className="flex flex-col gap-4">
              <h4 className="font-sans text-xs uppercase tracking-widest text-[#F9F8F6]/40 mb-1">
                {t(tr.footer.servicesCol, locale)}
              </h4>
              <ul className="flex flex-col gap-3">
                {serviceLinks.map(({ label, id, key }) => (
                  <li key={key}>
                    <a
                      href={`/#${id}`}
                      className="font-sans text-sm text-[#F9F8F6]/60 hover:text-[#D4AF37] transition-colors duration-200"
                      onClick={(e) => {
                        e.preventDefault()
                        const element = document.getElementById(id)
                        if (element) {
                          const yOffset = -80 // Account for fixed header height
                          const y = element.getBoundingClientRect().top + window.scrollY + yOffset
                          window.scrollTo({ top: y, behavior: 'smooth' })
                        } else {
                          // If on another page, navigate to home with scroll target
                          window.location.href = `/#${id}`
                        }
                      }}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 — Company */}
            <div className="flex flex-col gap-4">
              <h4 className="font-sans text-xs uppercase tracking-widest text-[#F9F8F6]/40 mb-1">
                {t(tr.footer.companyCol, locale)}
              </h4>
              <ul className="flex flex-col gap-3">
                {companyLinks.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="font-sans text-sm text-[#F9F8F6]/60 hover:text-[#D4AF37] transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4 — Visit */}
            <div className="flex flex-col gap-4">
              <h4 className="font-sans text-xs uppercase tracking-widest text-[#F9F8F6]/40 mb-1">
                {t(tr.footer.visitCol, locale)}
              </h4>
              <address className="not-italic flex flex-col gap-3">
                <p className="font-sans text-sm text-[#F9F8F6]/60 whitespace-pre-line">
                  {t(tr.footer.addressLine, locale)}
                </p>
                <a
                  href="tel:+35929000000"
                  className="font-sans text-sm text-[#F9F8F6]/60 hover:text-[#D4AF37] transition-colors duration-200"
                >
                  +359 2 900 0000
                </a>
                <p className="font-sans text-sm text-[#F9F8F6]/60">
                  {t(tr.footer.hours, locale)}
                </p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-xs uppercase tracking-widest text-[#D4AF37]/70 hover:text-[#D4AF37] transition-colors duration-200"
                >
                  {t(tr.footer.openInMaps, locale)}
                </a>
              </address>
            </div>
          </div>
        </div>
      </div>

      {/* Tier 3 — Legal bar */}
      <div className="border-t border-[#F9F8F6]/10 bg-[#0F0F10]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans text-xs text-[#8C8074]">
            {t(tr.footer.copyright, locale)}
          </p>
          <p className="font-sans text-xs text-[#8C8074]">
            ЕИК: 206XXXXXXX
          </p>
          <Link
            href="#"
            className="font-sans text-xs text-[#8C8074] hover:text-[#D4AF37] transition-colors duration-200"
          >
            {t(tr.footer.privacy, locale)}
          </Link>
        </div>
      </div>
    </footer>
  )
}
