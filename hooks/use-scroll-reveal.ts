'use client'

import { useEffect, useRef } from 'react'

/**
 * Attaches an IntersectionObserver to a container ref.
 * All children with class `reveal` or `reveal-fade` inside that container
 * receive `is-visible` when they enter the viewport.
 *
 * @param margin  rootMargin offset, default "-80px"
 * @param once    stop observing after first trigger (default true)
 */
export function useScrollReveal(margin = '-80px', once = true) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const container = ref.current
    if (!container || typeof IntersectionObserver === 'undefined') return

    const targets = container.querySelectorAll<HTMLElement>(
      '.reveal, .reveal-fade'
    )

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            if (once) observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: margin, threshold: 0 }
    )

    targets.forEach((el) => {
      // If the element is already in the viewport on mount, reveal immediately
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('is-visible')
      } else {
        observer.observe(el)
      }
    })

    return () => observer.disconnect()
  }, [margin, once])

  return ref
}
