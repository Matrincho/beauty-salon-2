'use client'

import CtaButton from '@/components/ui/CtaButton'
import Footer from '@/components/footer/Footer'
import SubpageHeader from '@/components/navigation/SubpageHeader'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { translations as tr, t } from '@/lib/i18n/translations'

export default function TeamPage() {
  const { locale } = useLanguage()

  const team = [
    {
      name:      t(tr.team.m1name,     locale),
      role:      t(tr.team.m1role,     locale),
      bio:       t(tr.team.m1bio,      locale),
      specialty: t(tr.team.m1specialty,locale),
      initials:  'IM',
    },
    {
      name:      t(tr.team.m2name,     locale),
      role:      t(tr.team.m2role,     locale),
      bio:       t(tr.team.m2bio,      locale),
      specialty: t(tr.team.m2specialty,locale),
      initials:  'SA',
    },
    {
      name:      t(tr.team.m3name,     locale),
      role:      t(tr.team.m3role,     locale),
      bio:       t(tr.team.m3bio,      locale),
      specialty: t(tr.team.m3specialty,locale),
      initials:  'ND',
    },
    {
      name:      t(tr.team.m4name,     locale),
      role:      t(tr.team.m4role,     locale),
      bio:       t(tr.team.m4bio,      locale),
      specialty: t(tr.team.m4specialty,locale),
      initials:  'EG',
    },
  ]

  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      <SubpageHeader />

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-28">

        {/* Page heading */}
        <div className="mb-16 md:mb-24 max-w-3xl">
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-[#D4AF37] mb-5">
            {t(tr.team.eyebrow, locale)}
          </p>
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] leading-tight text-[#1A1A1B] text-balance mb-8">
            {t(tr.team.headingA, locale)}<br />
            <em className="italic text-[#8C8074]">{t(tr.team.headingB, locale)}</em>
          </h1>
          <p className="font-sans text-base md:text-lg leading-relaxed text-[#8C8074]">
            {t(tr.team.intro, locale)}
          </p>
        </div>

        {/* Gold rule */}
        <div className="w-12 h-px bg-[#D4AF37] mb-20" />

        {/* Team grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {team.map(({ name, role, bio, specialty, initials }) => (
            <div
              key={name}
              className="flex flex-col gap-6 border border-[#E5E0D8] p-8 hover:border-[#D4AF37]/40 transition-colors duration-300"
            >
              {/* Avatar + name */}
              <div className="flex items-center gap-5">
                <div
                  className="w-16 h-16 shrink-0 bg-[#1A1A1B] flex items-center justify-center"
                  aria-hidden="true"
                >
                  <span className="font-serif text-lg text-[#D4AF37]">{initials}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="font-serif text-xl text-[#1A1A1B]">{name}</h2>
                  <p className="font-sans text-xs uppercase tracking-widest text-[#D4AF37]">
                    {role}
                  </p>
                </div>
              </div>

              {/* Bio */}
              <p className="font-sans text-sm leading-relaxed text-[#8C8074]">{bio}</p>

              {/* Specialty tag */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-[#E5E0D8]">
                <span className="font-sans text-xs uppercase tracking-widest text-[#8C8074]">
                  {t(tr.team.specialty, locale)}
                </span>
                <span className="font-sans text-xs text-[#1A1A1B]">{specialty}</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="relative overflow-hidden bg-[#0F0F10] p-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{ background: 'radial-gradient(ellipse 70% 60% at 0% 100%, rgba(212,175,55,0.12) 0%, transparent 70%)' }}
          />
          <div className="absolute top-0 left-10 w-8 h-px bg-[#D4AF37]" aria-hidden="true" />
          <div className="relative flex flex-col gap-2">
            <h3 className="font-serif text-xl text-[#F9F8F6]">{t(tr.team.ctaHeading, locale)}</h3>
            <p className="font-sans text-sm text-[#F9F8F6]/50">
              {t(tr.team.ctaBody, locale)}
            </p>
          </div>
          <div className="relative shrink-0">
            <CtaButton variant="outline-gold-fill" size="md" label={t(tr.cta.bookNow, locale)} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
