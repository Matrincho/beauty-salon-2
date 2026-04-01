'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import SectionLabel from '@/components/ui/SectionLabel'
import TestimonialCard from '@/components/ui/TestimonialCard'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { translations as tr, t } from '@/lib/i18n/translations'

export default function TestimonialsSection() {
  const { locale } = useLanguage()
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  const testimonials = [
    { quote: t(tr.testimonials.t1quote, locale), name: t(tr.testimonials.t1name, locale), title: t(tr.testimonials.t1title, locale) },
    { quote: t(tr.testimonials.t2quote, locale), name: t(tr.testimonials.t2name, locale), title: t(tr.testimonials.t2title, locale) },
    { quote: t(tr.testimonials.t3quote, locale), name: t(tr.testimonials.t3name, locale), title: t(tr.testimonials.t3title, locale) },
    { quote: t(tr.testimonials.t4quote, locale), name: t(tr.testimonials.t4name, locale), title: t(tr.testimonials.t4title, locale) },
    { quote: t(tr.testimonials.t5quote, locale), name: t(tr.testimonials.t5name, locale), title: t(tr.testimonials.t5title, locale) },
  ]

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1,
    dragFree: true,
  })

  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(true)
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [isPaused, setIsPaused] = useState(false)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const updateButtons = useCallback(() => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', updateButtons)
    emblaApi.on('reInit', updateButtons)
    updateButtons()
  }, [emblaApi, updateButtons])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (isPaused || !emblaApi || prefersReducedMotion) return
    autoPlayRef.current = setInterval(() => emblaApi.scrollNext(), 4000)
    return () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current) }
  }, [emblaApi, isPaused, prefersReducedMotion])

  return (
    <section
      id="testimonials"
      className="bg-[#1A1A1B] pt-12 md:pt-16 pb-24 md:pb-32 lg:pb-40 scroll-mt-16 md:scroll-mt-20"
      aria-label={t(tr.testimonials.ariaCarousel, locale)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
          <div className="flex flex-col gap-4 animate-fade-in-up">
            <SectionLabel text={t(tr.testimonials.label, locale)} color="gold" />
            <h2 className="font-serif text-[clamp(1.75rem,4vw,3rem)] text-[#F9F8F6] text-balance">
              {t(tr.testimonials.heading, locale)}
            </h2>
          </div>

          {/* Scroll controls */}
          <div className="flex gap-3 animate-fade-in-up delay-100" aria-label={t(tr.testimonials.ariaControls, locale)}>
            <button
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className="flex items-center justify-center w-11 h-11 border border-[#D4AF37]/40
                text-[#D4AF37] hover:border-[#D4AF37] hover:bg-[#D4AF37]/10
                disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              aria-label={t(tr.testimonials.prev, locale)}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={scrollNext}
              disabled={!canScrollNext}
              className="flex items-center justify-center w-11 h-11 border border-[#D4AF37]/40
                text-[#D4AF37] hover:border-[#D4AF37] hover:bg-[#D4AF37]/10
                disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              aria-label={t(tr.testimonials.next, locale)}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Embla carousel */}
        <div
          className="overflow-hidden animate-fade-in-up delay-200"
          ref={emblaRef}
          aria-roledescription="carousel"
          aria-label={t(tr.testimonials.ariaCarousel, locale)}
        >
          <div className="flex gap-6 md:gap-8">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                role="group"
                aria-roledescription="slide"
                aria-label={`${t(tr.testimonials.slideOf, locale)} ${i + 1} ${t(tr.testimonials.of, locale)} ${testimonials.length}`}
              >
                <TestimonialCard
                  quote={testimonial.quote}
                  name={testimonial.name}
                  title={testimonial.title}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
