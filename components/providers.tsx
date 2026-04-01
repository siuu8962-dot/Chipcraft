'use client'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { GlobalProvider } from '@/lib/contexts'
import { PrefetchProvider } from '@/components/shared/PrefetchProvider'

export function ClientProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // @ts-ignore
    if (typeof Lenis !== 'undefined') {
      // @ts-ignore
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
      })

      function raf(time: number) {
        lenis.raf(time)
        requestAnimationFrame(raf)
      }

      requestAnimationFrame(raf)
    } else {
      // Fallback if script hasn't loaded yet
      const checkLenis = setInterval(() => {
        // @ts-ignore
        if (typeof Lenis !== 'undefined') {
          // @ts-ignore
          const lenis = new Lenis({
             duration: 1.2,
             easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          })
          function raf(time: number) {
            lenis.raf(time)
            requestAnimationFrame(raf)
          }
          requestAnimationFrame(raf)
          clearInterval(checkLenis)
        }
      }, 100)
    }
  }, [])

  return (
    <GlobalProvider>
        <PrefetchProvider>
          {children}
          <Toaster 
            position="bottom-right" 
            toastOptions={{
              className: 'chip-toast animate-toast-in',
              success: {
                className: 'chip-toast chip-toast-success animate-toast-in',
                iconTheme: { primary: '#10B981', secondary: '#fff' },
              },
              error: {
                className: 'chip-toast chip-toast-error animate-toast-in',
                iconTheme: { primary: '#EF4444', secondary: '#fff' },
              },
              duration: 4000,
            }}
          />
        </PrefetchProvider>
    </GlobalProvider>
  )
}
