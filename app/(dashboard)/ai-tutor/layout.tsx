'use client'
import React from 'react'

export default function AITutorLayout({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    // Lock body scroll only when this layout is active
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      overflow: 'hidden',
      backgroundColor: 'var(--bg-primary)',
      zIndex: 10
    }}>
      <div className="ai-tutor-container" style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  )
}
