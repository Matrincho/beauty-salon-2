'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Runs at the layout level to handle cross-page scroll navigation.
 * Triggered when sessionStorage contains 'scrollTo' after navigation.
 * Runs outside the LanguageProvider hydration shield.
 */
export function ScrollToSectionHandler() {
  const pathname = usePathname()
  const hasRun = useRef(false)

  useEffect(() => {
    // Only run on homepage
    if (pathname !== '/') return
    
    // Prevent running multiple times
    if (hasRun.current) return
    
    const scrollToCenter = (id: string) => {
      // Wait for the section to be fully rendered
      const checkAndScroll = () => {
        const element = document.getElementById(id)
        if (element) {
          const elementRect = element.getBoundingClientRect()
          const elementCenter = elementRect.top + elementRect.height / 2
          const windowCenter = window.innerHeight / 2
          const scrollOffset = window.scrollY + (elementCenter - windowCenter)
          
          window.scrollTo({
            top: scrollOffset,
            behavior: 'smooth'
          })
          hasRun.current = true
        } else {
          // Element not found yet, retry
          setTimeout(checkAndScroll, 100)
        }
      }
      
      checkAndScroll()
    }

    const targetId = sessionStorage.getItem('scrollTo')
    if (!targetId) return
    
    sessionStorage.removeItem('scrollTo')
    
    // Wait for page to fully hydrate and render
    // Increased delay to account for Hydration Shield + Next.js transitions
    setTimeout(() => scrollToCenter(targetId), 500)
  }, [pathname])

  return null
}
