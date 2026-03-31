'use client'

import SectionLabel from '@/components/ui/SectionLabel'
import ServiceCard from '@/components/ui/ServiceCard'
import CtaButton from '@/components/ui/CtaButton'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { translations as tr, t } from '@/lib/i18n/translations'

const delayClasses = ['delay-200', 'delay-300', 'delay-400']

export default function ServicesSection() {
  const { locale } = useLanguage()

  const services = [
    {
      id:       'confidence-session',
      name:     t(tr.services.s1name,    locale),
      duration: t(tr.services.s1dur,     locale),
      benefit:  t(tr.services.s1benefit, locale),
      price:    t(tr.services.s1price,   locale),
    },
    {
      id:       'full-reset',
      name:     t(tr.services.s2name,    locale),
      duration: t(tr.services.s2dur,     locale),
      benefit:  t(tr.services.s2benefit, locale),
      price:    t(tr.services.s2price,   locale),
    },
    {
      id:       'glow-treatment',
      name:     t(tr.services.s3name,    locale),
      duration: t(tr.services.s3dur,     locale),
      benefit:  t(tr.services.s3benefit, locale),
      price:    t(tr.services.s3price,   locale),
    },
  ]

  return (
    <section
      id="services"
      className="bg-[#F0EDE8] py-24 md:py-32 lg:py-40"
      aria-label={t(tr.services.label, locale)}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-14 md:mb-16">
          <div className="animate-fade-in-up">
            <SectionLabel text={t(tr.services.label, locale)} color="stone" />
          </div>
          <h2 className="font-serif text-[clamp(1.75rem,4vw,3rem)] text-[#1A1A1B] max-w-xl text-balance animate-fade-in-up delay-100">
            {t(tr.services.heading, locale)}
          </h2>
          <p className="font-sans text-sm leading-relaxed text-[#8C8074] max-w-sm animate-fade-in-up delay-200">
            {t(tr.services.subtext, locale)}
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <div key={service.id} id={service.id} className="scroll-margin-top-20">
              <ServiceCard
                index={i}
                name={service.name}
                duration={service.duration}
                benefit={service.benefit}
                price={service.price}
                animationDelay={delayClasses[i]}
              />
            </div>
          ))}
        </div>

        {/* Section-level CTA */}
        <div className="mt-12 md:mt-16 flex justify-center animate-fade-in-up delay-400">
          <CtaButton size="lg" label={t(tr.cta.bookNow, locale)} />
        </div>
      </div>
    </section>
  )
}
