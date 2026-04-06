'use client'

import { useLanguage } from '@/lib/i18n/LanguageContext'
import { translations as tr, t } from '@/lib/i18n/translations'

const brands = [
  {
    name: 'Charlotte Tilbury',
    logo: (
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="40" y="40" width="120" height="120" fill="currentColor" fillOpacity="0.8" />
        <text x="100" y="110" dominantBaseline="middle" textAnchor="middle" fontSize="28" fontWeight="bold" fill="white" fontFamily="serif" letterSpacing="2">
          CT
        </text>
      </svg>
    ),
    size: 'lg',
  },
  {
    name: 'La Mer',
    logo: (
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="3" />
        <path d="M 100 50 Q 140 80 140 120 Q 100 150 60 120 Q 60 80 100 50" fill="currentColor" fillOpacity="0.3" />
        <text x="100" y="155" dominantBaseline="middle" textAnchor="middle" fontSize="14" fontWeight="600" fill="currentColor" fontFamily="serif">
          LA MER
        </text>
      </svg>
    ),
    size: 'md',
  },
  {
    name: 'Sisley',
    logo: (
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 60 80 L 140 80 L 140 90 L 60 90 Z" fill="currentColor" />
        <path d="M 65 110 L 135 110 L 135 120 L 65 120 Z" fill="currentColor" />
        <path d="M 60 130 L 140 130 L 140 140 L 60 140 Z" fill="currentColor" />
        <circle cx="100" cy="55" r="8" fill="currentColor" />
      </svg>
    ),
    size: 'lg',
  },
  {
    name: 'SK-II',
    logo: (
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="100" y="85" dominantBaseline="middle" textAnchor="middle" fontSize="24" fontWeight="bold" fill="currentColor" fontFamily="sans-serif" letterSpacing="1">
          SK
        </text>
        <text x="100" y="125" dominantBaseline="middle" textAnchor="middle" fontSize="26" fontWeight="bold" fill="currentColor" fontFamily="serif">
          II
        </text>
      </svg>
    ),
    size: 'lg',
  },
  {
    name: 'Augustinus Bader',
    logo: (
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="50" y="70" width="100" height="60" stroke="currentColor" strokeWidth="2" />
        <text x="100" y="105" dominantBaseline="middle" textAnchor="middle" fontSize="20" fontWeight="600" fill="currentColor" fontFamily="serif">
          AB
        </text>
      </svg>
    ),
    size: 'lg',
  },
  {
    name: 'Dyson',
    logo: (
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 80 100 Q 100 70 120 100 L 120 140 Q 100 160 80 140 Z" fill="currentColor" fillOpacity="0.7" />
        <circle cx="100" cy="100" r="8" fill="white" />
      </svg>
    ),
    size: 'lg',
  },
]

export default function BrandStripSection() {
  const { locale } = useLanguage()

  return (
    <section
      className="bg-[#F9F8F6] py-12 md:py-16 border-y border-[#E5E0D8]"
      aria-label={t(tr.brandStrip.trustedBy, locale)}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <p className="font-sans text-xs uppercase tracking-widest text-[#8C8074]/70 text-center mb-10">
          {t(tr.brandStrip.trustedBy, locale)}
        </p>

        <div
          className="flex items-center justify-center gap-6 md:gap-8 flex-nowrap overflow-x-auto md:overflow-visible pb-2 md:pb-0"
          role="list"
          aria-label={t(tr.brandStrip.ariaLabel, locale)}
        >
          {brands.map((brand) => (
            <div
              key={brand.name}
              role="listitem"
              className="flex items-center gap-2 shrink-0 group hover:opacity-100 opacity-70 transition-opacity duration-300"
            >
              <div className={`flex-shrink-0 flex items-center justify-center text-[#8C8074] group-hover:text-[#D4AF37] transition-colors duration-300 ${
                brand.size === 'md' ? 'w-8 h-8 md:w-10 md:h-10' : 'w-10 h-10 md:w-12 md:h-12'
              }`}>
                {brand.logo}
              </div>
              <span className="font-serif text-xs md:text-sm tracking-[0.08em] text-[#8C8074] whitespace-nowrap">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
