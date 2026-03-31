'use client'

import CtaButton from '@/components/ui/CtaButton'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { translations as tr, t } from '@/lib/i18n/translations'

export default function CtaBannerSection() {
  const { locale } = useLanguage()

  return (
    <section
      className="relative bg-[#0F0F10] py-24 md:py-36 overflow-hidden"
      aria-label={t(tr.ctaBanner.eyebrow, locale)}
    >
      {/* Decorative gold radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(212,175,55,0.12) 0%, transparent 70%)',
        }}
      />

      {/* Thin gold top rule */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-px bg-[#D4AF37]" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 flex flex-col items-center text-center gap-8">
        <p className="font-sans text-xs uppercase tracking-[0.25em] text-[#D4AF37] animate-fade-in-up">
          {t(tr.ctaBanner.eyebrow, locale)}
        </p>
        <h2 className="font-serif text-[clamp(2.25rem,5vw,4rem)] text-[#F9F8F6] text-balance max-w-3xl leading-tight animate-fade-in-up delay-100">
          {t(tr.ctaBanner.headingA, locale)}{' '}
          <span className="italic text-[#D4AF37]">{t(tr.ctaBanner.headingB, locale)}</span>
        </h2>
        <p className="font-sans text-sm md:text-base leading-relaxed text-[#F9F8F6]/50 max-w-md animate-fade-in-up delay-200">
          {t(tr.ctaBanner.subtext, locale)}
        </p>

        <div className="mt-4 animate-fade-in-up delay-300">
          <CtaButton
            label={t(tr.cta.bookNow, locale)}
            variant="outline-gold-fill"
            size="lg"
            className="px-12 py-4 text-sm tracking-[0.2em]"
          />
        </div>

        <p className="font-sans text-xs text-[#F9F8F6]/25 tracking-widest uppercase animate-fade-in-up delay-400">
          {t(tr.ctaBanner.social, locale)}
        </p>
      </div>
    </section>
  )
}
