'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Locale } from './translations'

const STORAGE_KEY = 'maison-elite-locale'
const DEFAULT_LOCALE: Locale = 'bg'

interface LanguageContextValue {
  locale: Locale
  toggleLocale: () => void
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: DEFAULT_LOCALE,
  toggleLocale: () => {},
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE)

  // Initialize locale from localStorage after mount.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Locale | null
      if (stored === 'bg' || stored === 'en') {
        queueMicrotask(() => {
          setLocale(stored)
        })
      }
    } catch {
      // localStorage unavailable, keep default locale
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const toggleLocale = useCallback(() => {
    setLocale((prev) => {
      const next: Locale = prev === 'bg' ? 'en' : 'bg'
      try {
        localStorage.setItem(STORAGE_KEY, next)
        document.documentElement.lang = next
      } catch {
        // ignore storage errors
      }
      return next
    })
  }, [])

  const contextValue = useMemo(
    () => ({ locale, toggleLocale }),
    [locale, toggleLocale]
  )

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext)
}
