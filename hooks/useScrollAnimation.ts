'use client'
import { useEffect } from 'react'

export function useScrollAnimation() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        })
      },
      { threshold: 0.05, rootMargin: '0px 0px 0px 0px' }
    )

    const targets = document.querySelectorAll('.animate-target')
    targets.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])
}
