'use client'

import { useEffect } from 'react'

/**
 * Reads a pending scroll target from sessionStorage (set by ScrollToSection
 * when navigating from another route) and scrolls to it on mount.
 * Waits for hydration to complete before attempting to scroll.
 */
export default function ScrollOnMount() {
  useEffect(() => {
    const scrollToCenter = (id: string) => {
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
      }
    }

    const targetId = sessionStorage.getItem('scrollTo')
    if (!targetId) return
    sessionStorage.removeItem('scrollTo')
    
    // Wait longer to ensure hydration + DOM rendering is complete
    const timer = setTimeout(() => {
      scrollToCenter(targetId)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  return null
}
