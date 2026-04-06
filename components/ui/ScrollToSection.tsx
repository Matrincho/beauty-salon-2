'use client'

import { useRouter, usePathname } from 'next/navigation'

interface Props {
  targetId: string
  label: string
  className?: string
}

/**
 * Scrolls to a same-page section by ID every time it is clicked.
 * If the user is on a different route, navigates to "/" first,
 * then scrolls once the page has loaded.
 */
export default function ScrollToSection({ targetId, label, className }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  function handleClick() {
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

    if (pathname === '/') {
      // Already on the homepage — scroll directly, always
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => scrollToCenter(targetId), 100)
    } else {
      // Navigate home, then scroll after the page mounts
      // Store the target so the homepage can pick it up
      sessionStorage.setItem('scrollTo', targetId)
      router.push('/')
    }
  }

  return (
    <button onClick={handleClick} className={className} type="button">
      {label}
    </button>
  )
}
