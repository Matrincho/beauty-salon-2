'use client'

import Image from 'next/image'
import Link from 'next/link'
import CtaButton from '@/components/ui/CtaButton'
import SectionLabel from '@/components/ui/SectionLabel'
import StatCounter from '@/components/ui/StatCounter'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { translations as tr, t } from '@/lib/i18n/translations'

export default function HeroSection() {
  const { locale } = useLanguage()

  return (
    <section
      id="home"
      className="relative min-h-[600px] flex items-center bg-[#F9F8F6] pt-24 md:pt-20"
      aria-label="Hero"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 w-full py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Text Column */}
          <div className="flex flex-col gap-7">
            <div className="animate-fade-in-up">
              <SectionLabel text={t(tr.hero.label, locale)} color="gold" />
            </div>

            <h1 className="font-serif text-[clamp(2.5rem,5.5vw,4.75rem)] leading-[1.08] tracking-tight text-[#1A1A1B] text-balance animate-fade-in-up delay-150">
              {t(tr.hero.headingA, locale)}{' '}
              <em className="not-italic text-[#D4AF37]">{t(tr.hero.headingB, locale)}</em>{' '}
              {t(tr.hero.headingC, locale)}
            </h1>

            <p className="font-sans text-base md:text-lg leading-relaxed text-[#8C8074] max-w-md animate-fade-in-up delay-300">
              {t(tr.hero.subtext, locale)}
            </p>

            {/* Mobile Image */}
            <div className="relative lg:hidden animate-fade-in-up delay-400">
              <div
                className="absolute -top-2 -left-2 w-full h-full border border-[#D4AF37]/30 pointer-events-none"
                aria-hidden="true"
              />
              <div className="relative overflow-hidden w-full max-w-xs h-80 sm:h-96">
                <Image
                  src="/images/hero-salon.jpg"
                  alt={t(tr.hero.imageAlt, locale)}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-8 animate-fade-in-up delay-400">
              <CtaButton size="lg" label={t(tr.cta.bookNow, locale)} className="whitespace-nowrap" />
              <Link
                href="/team"
                className="font-sans text-xs uppercase tracking-widest text-[#8C8074] hover:text-[#D4AF37] transition-colors duration-200 border-b border-transparent hover:border-[#D4AF37]/40 pb-0.5 self-start sm:self-auto"
              >
                {t(tr.hero.meetTeam, locale)}
              </Link>
            </div>

            {/* Stats Row — Responsive Flex */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-8 pt-8 md:pt-12 animate-fade-in-up delay-500 w-full max-w-full overflow-hidden">
              <StatCounter value={t(tr.hero.stat1Val, locale)} label={t(tr.hero.stat1, locale)} index={0} />
              <StatCounter value={t(tr.hero.stat2Val, locale)} label={t(tr.hero.stat2, locale)} index={1} />
              <StatCounter value={t(tr.hero.stat3Val, locale)} label={t(tr.hero.stat3, locale)} index={2} />
            </div>
          </div>

          {/* Image Column */}
          <div className="relative hidden lg:block">
            <div
              className="absolute -top-4 -right-4 w-full h-full border border-[#D4AF37]/30 pointer-events-none"
              aria-hidden="true"
            />
            <div className="relative overflow-hidden w-full h-[560px] xl:h-[640px]">
              <Image
                src="/images/hero-salon.jpg"
                alt={t(tr.hero.imageAlt, locale)}
                fill
                priority
                sizes="(max-width: 1024px) 0vw, 50vw"
                className="object-cover object-center"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Bottom rule */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[#E5E0D8]" aria-hidden="true" />
    </section>
  )
}
