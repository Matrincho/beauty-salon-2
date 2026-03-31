interface TestimonialCardProps {
  quote: string
  name: string
  title: string
}

function StarIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="#D4AF37"
      aria-hidden="true"
    >
      <path d="M7 0.5L8.75 5.25H13.75L9.75 8.25L11.25 13L7 10.25L2.75 13L4.25 8.25L0.25 5.25H5.25L7 0.5Z" />
    </svg>
  )
}

export default function TestimonialCard({ quote, name, title }: TestimonialCardProps) {
  return (
    <article
      className="flex-shrink-0 w-[320px] md:w-[380px] flex flex-col gap-5 border-l-2 border-[#D4AF37]/50 pl-6 py-1"
      aria-label={`Testimonial from ${name}`}
    >
      {/* Stars */}
      <div className="flex gap-1" aria-label="5 out of 5 stars">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon key={i} />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="font-serif italic text-base md:text-lg leading-relaxed text-[#F9F8F6]/90 flex-1">
        &ldquo;{quote}&rdquo;
      </blockquote>

      {/* Attribution */}
      <footer className="flex flex-col gap-0.5">
        <cite className="font-sans text-sm font-semibold text-[#F9F8F6] not-italic">
          {name}
        </cite>
        <span className="font-sans text-xs text-[#8C8074]">{title}</span>
      </footer>
    </article>
  )
}
