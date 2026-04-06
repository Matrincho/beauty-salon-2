interface SectionLabelProps {
  text: string
  /** 'gold' for use on dark backgrounds, 'stone' for light backgrounds */
  color?: 'gold' | 'stone'
  className?: string
}

/**
 * Small uppercase eyebrow label used above section headings.
 * Geist Sans, tracking-widest, available in gold or stone variant.
 */
export default function SectionLabel({
  text,
  color = 'stone',
  className = '',
}: SectionLabelProps) {
  const colorClass =
    color === 'gold' ? 'text-[#D4AF37]' : 'text-[#8C8074]'

  return (
    <p
      className={`font-sans text-xs font-medium uppercase tracking-widest ${colorClass} ${className}`}
    >
      {text}
    </p>
  )
}
