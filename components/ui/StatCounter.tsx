'use client'

import { useState, useEffect } from 'react'

interface StatCounterProps {
  value: string
  label: string
  index?: number
}

export default function StatCounter({ value, label, index = 0 }: StatCounterProps) {
  const [displayValue, setDisplayValue] = useState('0')
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    // Only animate on first page load
    if (hasAnimated) {
      setDisplayValue(value)
      return
    }

    const numericValue = parseInt(value.replace(/\D/g, ''), 10)
    if (isNaN(numericValue)) {
      setDisplayValue(value)
      setHasAnimated(true)
      return
    }

    // Use fixed duration for all stats (1.2 seconds) with staggered start
    const duration = 1200
    const startDelay = index * 100
    
    setTimeout(() => {
      let current = 0
      const increment = Math.ceil(numericValue / (duration / 20))
      const interval = setInterval(() => {
        current += increment
        if (current >= numericValue) {
          setDisplayValue(value)
          setHasAnimated(true)
          clearInterval(interval)
        } else {
          setDisplayValue(current.toString())
        }
      }, 20)

      return () => clearInterval(interval)
    }, startDelay)
  }, [value, hasAnimated, index])

  return (
    <div className="flex flex-col gap-1">
      <span className="font-serif text-3xl md:text-4xl text-[#D4AF37]">
        {displayValue}
      </span>
      <span className="font-sans text-xs uppercase tracking-widest text-[#8C8074] whitespace-nowrap">
        {label}
      </span>
    </div>
  )
}
