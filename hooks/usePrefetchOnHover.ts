'use client'

import { useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Hook to handle prefetching a URL on hover with a delay.
 * @param delay - Delay in milliseconds before prefetching (default: 80ms)
 */
export function usePrefetchOnHover(delay: number = 80) {
  const router = useRouter()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const prefetchedUrls = useRef<Set<string>>(new Set())

  const prefetch = useCallback((url: string) => {
    // Only prefetch internal links and avoid duplicates
    if (!url || !url.startsWith('/') || prefetchedUrls.current.has(url)) return

    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => {
      // Use requestIdleCallback if available for better performance
      const triggerPrefetch = () => {
        router.prefetch(url)
        prefetchedUrls.current.add(url)
      }

      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        window.requestIdleCallback(triggerPrefetch)
      } else {
        triggerPrefetch()
      }
      
      timeoutRef.current = null
    }, delay)
  }, [router, delay])

  const cancelPrefetch = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  return { prefetch, cancelPrefetch }
}
