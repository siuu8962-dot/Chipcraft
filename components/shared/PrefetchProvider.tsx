'use client'

import React, { useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface PrefetchProviderProps {
  children: React.ReactNode
  hoverDelay?: number
  maxConcurrent?: number
}

export const PrefetchProvider: React.FC<PrefetchProviderProps> = ({ 
  children, 
  hoverDelay = 80,
  maxConcurrent = 5
}) => {
  const router = useRouter()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const prefetchedUrls = useRef<Set<string>>(new Set())
  const queue = useRef<string[]>([])
  const activeCount = useRef(0)

  // IntersectionObserver for viewport preloading
  const observer = useRef<IntersectionObserver | null>(null)

  const triggerPrefetch = useCallback((url: string) => {
    if (prefetchedUrls.current.has(url)) return
    
    router.prefetch(url)
    prefetchedUrls.current.add(url)
  }, [router])

  const handleMouseEnter = useCallback((e: MouseEvent) => {
    const target = (e.target as HTMLElement).closest('a')
    if (!target) return

    const href = target.getAttribute('href')
    // Only internal links, not external or anchors
    if (!href || !href.startsWith('/') || href.startsWith('//') || prefetchedUrls.current.has(href)) return

    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => {
      const doPrefetch = () => {
        triggerPrefetch(href)
      }

      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(doPrefetch)
      } else {
        doPrefetch()
      }
      timeoutRef.current = null
    }, hoverDelay)
  }, [hoverDelay, triggerPrefetch])

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  useEffect(() => {
    // Global mouse event listeners
    document.addEventListener('mouseover', handleMouseEnter)
    document.addEventListener('mouseout', handleMouseLeave)

    // Viewport observer
    observer.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const href = entry.target.getAttribute('href')
          if (href && href.startsWith('/') && !prefetchedUrls.current.has(href)) {
            triggerPrefetch(href)
            observer.current?.unobserve(entry.target)
          }
        }
      })
    }, { rootMargin: '100px' })

    // Initial scan for links to observe
    const scanLinks = () => {
      document.querySelectorAll('a[href^="/"]').forEach(link => {
        if (!prefetchedUrls.current.has(link.getAttribute('href') || '')) {
          observer.current?.observe(link)
        }
      })
    }

    scanLinks()
    
    return () => {
      document.removeEventListener('mouseover', handleMouseEnter)
      document.removeEventListener('mouseout', handleMouseLeave)
      observer.current?.disconnect()
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [handleMouseEnter, handleMouseLeave, triggerPrefetch])

  return <>{children}</>
}
