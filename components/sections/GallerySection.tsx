'use client'

import SectionLabel from '@/components/ui/SectionLabel'
import BeforeAfterCard from '@/components/ui/BeforeAfterCard'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { translations as tr, t } from '@/lib/i18n/translations'

export default function GallerySection() {
  const { locale } = useLanguage()

  const transformations = [
    {
      beforeSrc:   '/images/before-1.jpg',
      afterSrc:    '/images/after-1.jpg',
      beforeLabel: t(tr.gallery.before1Label, locale),
      afterLabel:  t(tr.gallery.after1Label,  locale),
      beforeAlt:   t(tr.gallery.before1Alt,   locale),
      afterAlt:    t(tr.gallery.after1Alt,    locale),
      animDelay:   'delay-200',
    },
    {
      beforeSrc:   '/images/before-2.jpg',
      afterSrc:    '/images/after-2.jpg',
      beforeLabel: t(tr.gallery.before2Label, locale),
      afterLabel:  t(tr.gallery.after2Label,  locale),
      beforeAlt:   t(tr.gallery.before2Alt,   locale),
      afterAlt:    t(tr.gallery.after2Alt,    locale),
      animDelay:   'delay-300',
    },
  ]

  return (
    <section
      id="gallery"
      className="bg-[#F0EDE8] pt-12 md:pt-16 pb-24 md:pb-32 lg:pb-40 scroll-mt-16 md:scroll-mt-20"
      aria-label={t(tr.gallery.label, locale)}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-14 md:mb-16">
          <div className="animate-fade-in-up">
            <SectionLabel text={t(tr.gallery.label, locale)} color="stone" />
          </div>
          <h2 className="font-serif text-[clamp(1.75rem,4vw,3rem)] text-[#1A1A1B] max-w-xl text-balance animate-fade-in-up delay-100">
            {t(tr.gallery.heading, locale)}
          </h2>
          <p className="font-sans text-sm leading-relaxed text-[#8C8074] max-w-sm animate-fade-in-up delay-200">
            {t(tr.gallery.subtext, locale)}
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {transformations.map((item) => (
            <BeforeAfterCard
              key={item.beforeLabel}
              beforeSrc={item.beforeSrc}
              afterSrc={item.afterSrc}
              beforeLabel={item.beforeLabel}
              afterLabel={item.afterLabel}
              beforeAlt={item.beforeAlt}
              afterAlt={item.afterAlt}
              animationDelay={item.animDelay}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
