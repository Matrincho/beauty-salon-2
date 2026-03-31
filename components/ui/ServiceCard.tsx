'use client'

import { useLanguage } from '@/lib/i18n/LanguageContext'

interface ServiceCardProps {
  index: number
  name: string
  duration: string
  benefit: string
  price: string
  animationDelay?: string
}

const reserveLabel = { bg: 'Резервирай', en: 'Reserve' }

export default function ServiceCard({
  index,
  name,
  duration,
  benefit,
  price,
  animationDelay = '',
}: ServiceCardProps) {
  const { locale } = useLanguage()

  return (
    <div
      className={`transition-all duration-300 ease-in-out will-change-transform animate-fade-in-up ${animationDelay}`}
      style={{ transform: 'translateZ(0)' }}
    >
      <article
        className="group flex flex-col gap-5 bg-[#FFFFFF] border border-[#E5E0D8] p-8 md:p-10 h-full
          hover:border-[#D4AF37] hover:shadow-[0_4px_12px_rgba(212,175,55,0.2)]
          transition-all duration-300 ease-in-out"
        aria-label={`${locale === 'bg' ? 'Услуга' : 'Service'}: ${name}`}
      >
      {/* Gold accent line */}
      <div className="w-8 h-0.5 bg-[#D4AF37] group-hover:w-12 transition-all duration-300 ease-in-out" aria-hidden="true" />

      {/* Service number */}
      <span className="font-sans text-xs uppercase tracking-widest text-[#8C8074]">
        0{index + 1}
      </span>

      {/* Name */}
      <h3 className="font-serif text-xl md:text-2xl text-[#1A1A1B] leading-snug">
        {name}
      </h3>

      {/* Duration badge */}
      <span className="inline-flex w-fit font-sans text-xs uppercase tracking-widest text-[#D4AF37] border border-[#D4AF37]/50 px-3 py-1">
        {duration}
      </span>

      {/* Benefit copy */}
      <p className="font-sans text-sm leading-relaxed text-[#8C8074] flex-1">
        {benefit}
      </p>

      {/* Price + CTA row */}
      <div className="flex items-center justify-between pt-2 border-t border-[#E5E0D8]">
        <span className="font-serif text-lg text-[#1A1A1B]">{price}</span>
        <a
          href="/booking"
          className="font-sans text-xs uppercase tracking-widest text-[#1A1A1B]
            relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px
            after:bg-[#D4AF37] after:transition-all after:duration-300
            hover:after:w-full hover:text-[#D4AF37] transition-colors duration-200"
          aria-label={`${reserveLabel[locale]} ${name}`}
        >
          {reserveLabel[locale]}
        </a>
      </div>
      </article>
    </div>
  )
}
