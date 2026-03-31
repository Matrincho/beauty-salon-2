'use client'

import { useEffect, useState, type ReactNode } from 'react'

export function ClientWrapper({ children }: { children: ReactNode }) {
  const [hasMounted, setHasMounted] = useState(true)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  return <>{children}</>
}
