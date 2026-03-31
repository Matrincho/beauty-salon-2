import Image from 'next/image'

interface BeforeAfterCardProps {
  beforeSrc: string
  afterSrc: string
  beforeLabel?: string
  afterLabel?: string
  beforeAlt: string
  afterAlt: string
  animationDelay?: string
}

export default function BeforeAfterCard({
  beforeSrc,
  afterSrc,
  beforeLabel = 'Before',
  afterLabel = 'After',
  beforeAlt,
  afterAlt,
  animationDelay = '',
}: BeforeAfterCardProps) {
  return (
    <article
      className={`group border border-[#E5E0D8] animate-fade-in-up ${animationDelay}`}
      aria-label={`Before and after: ${afterLabel}`}
    >
      <div className="relative grid grid-cols-2">
        {/* Before */}
        <div className="relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
          <Image
            src={beforeSrc}
            alt={beforeAlt}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover object-center grayscale-[30%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1B]/40 to-transparent pointer-events-none" />
          <span className="absolute bottom-3 left-3 font-sans text-xs uppercase tracking-widest text-[#F9F8F6]/80">
            {beforeLabel}
          </span>
        </div>

        {/* Gold centre divider */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#D4AF37]/70 -translate-x-1/2 z-10 pointer-events-none" />

        {/* After */}
        <div className="relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
          <Image
            src={afterSrc}
            alt={afterAlt}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1B]/30 to-transparent pointer-events-none" />
          <span className="absolute bottom-3 left-3 font-sans text-xs uppercase tracking-widest text-[#F9F8F6]/80">
            {afterLabel}
          </span>
        </div>
      </div>
    </article>
  )
}
