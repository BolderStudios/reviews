// components/ClientLoadingWrapper.js
'use client'

import { useState, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import LoadingOverlay from './LoadingOverlay'

export default function ClientLoadingWrapper({ children }) {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleRouteChangeStart = () => setIsLoading(true)
    const handleRouteChangeComplete = () => setIsLoading(false)

    handleRouteChangeStart()
    
    // Simulate the end of route change after a short delay
    const timeout = setTimeout(handleRouteChangeComplete, 300)

    return () => clearTimeout(timeout)
  }, [pathname, searchParams])

  return (
    <>
      <LoadingOverlay isLoading={isLoading} />
      {children}
    </>
  )
}