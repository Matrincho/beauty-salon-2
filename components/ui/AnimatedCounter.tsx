'use client'

import { useEffect, useRef, useState } from 'react'

interface AnimatedCounterProps {
  value: string
  label: string
  variant?: 'dark' | 'light'
}

export default function AnimatedCounter({ value, label, variant = 'dark' }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState('0')
  const hasAnimated = useRef(false)

  const textColor = variant === 'light' ? 'text-[#F9F8F6]' : 'text-[#1A1A1B]'
  const labelColor = variant === 'light' ? 'text-[#F9F8F6]/60' : 'text-[#8C8074]'

  useEffect(() => {
    if (hasAnimated.current) return

    // Extract the numeric part from value (e.g., "98%" -> 98, "500+" -> 500, "15 min" -> 15)
    const numericValue = parseInt(value.replace(/\D/g, ''), 10)
    if (isNaN(numericValue)) {
      setDisplayValue(value)
      return
    }

    hasAnimated.current = true

    // Get the suffix (%, +, etc.)
    const suffix = value.replace(/\d/g, '')

    let current = 0
    const increment = Math.ceil(numericValue / 50) // Animate over ~50 frames
    const duration = 2000 // 2 seconds total
    const frameTime = duration / 50

    const interval = setInterval(() => {
      current += increment
      if (current >= numericValue) {
        setDisplayValue(numericValue + suffix)
        clearInterval(interval)
      } else {
        setDisplayValue(current + suffix)
      }
    }, frameTime)

    return () => clearInterval(interval)
  }, [value])

  return (
    <div className="flex flex-col gap-0.5">
      <span className={`font-serif text-2xl ${textColor}`}>{displayValue}</span>
      <span className={`font-sans text-xs uppercase tracking-widest ${labelColor}`}>
        {label}
      </span>
    </div>
  )
}
