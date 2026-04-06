'use client'

import Link from 'next/link'

type CtaVariant = 'primary' | 'outline-gold' | 'outline-gold-fill'

interface CtaButtonProps {
  label?: string
  href?: string
  variant?: CtaVariant
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
}

/**
 * Reusable CTA button with three variants:
 * - primary: solid charcoal fill, gold border+text on hover
 * - outline-gold: gold border + gold text (for use on dark backgrounds)
 * - outline-gold-fill: gold border, fills solid gold on hover (dark bg hero variant)
 */
export default function CtaButton({
  label = 'Secure Your Transformation',
  href = '/booking',
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
}: CtaButtonProps) {
  const sizeClasses = {
    sm: 'px-5 py-2.5 text-xs tracking-widest min-h-[40px]',
    md: 'px-7 py-3.5 text-sm tracking-widest min-h-[44px]',
    lg: 'px-10 py-4 text-sm tracking-widest min-h-[52px]',
  }

  const variantClasses = {
    primary: [
      'bg-[#1A1A1B] text-[#F9F8F6] border border-[#1A1A1B] shadow-lg',
      'hover:bg-transparent hover:border-[#D4AF37] hover:text-[#D4AF37] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]',
    ].join(' '),
    'outline-gold': [
      'bg-transparent text-[#D4AF37] border border-[#D4AF37] shadow-md',
      'hover:bg-[#D4AF37]/10 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]',
    ].join(' '),
    'outline-gold-fill': [
      'bg-transparent text-[#D4AF37] border border-[#D4AF37] shadow-md',
      'hover:bg-[#D4AF37] hover:text-[#1A1A1B] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)]',
    ].join(' '),
  }

  const baseClasses = [
    'inline-flex items-center justify-center',
    'font-sans font-medium uppercase',
    'transition-all duration-300 ease-in-out',
    'cursor-pointer select-none',
    'hover:scale-105',
    sizeClasses[size],
    variantClasses[variant],
    className,
  ].join(' ')

  if (onClick) {
    return (
      <button className={baseClasses} onClick={onClick} type="button">
        {label}
      </button>
    )
  }

  return (
    <Link href={href} className={baseClasses}>
      {label}
    </Link>
  )
}
