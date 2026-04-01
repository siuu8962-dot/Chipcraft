'use client'
import { Loader2, Globe } from 'lucide-react'

interface AgentControlOverlayProps {
  isActive: boolean
  action?: string
}

export function AgentControlOverlay({ isActive, action }: AgentControlOverlayProps) {
  if (!isActive) return null
  
  return (
    <div style={{
      position: 'fixed',
      bottom: '100px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9999,
      backgroundColor: 'rgba(6,182,212,0.95)',
      backdropFilter: 'blur(12px)',
      borderRadius: '40px',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      boxShadow: '0 8px 32px rgba(6,182,212,0.4)',
      color: 'white',
      fontSize: '14px',
      fontWeight: 600,
      pointerEvents: 'none',
      animation: 'slide-up 0.3s ease-out'
    }}>
      <Loader2 size={16} className="animate-spin" />
      <span style={{ whiteSpace: 'nowrap' }}>AI Agent đang điều khiển ứng dụng...</span>
      {action && (
        <>
          <div style={{ width: '1px', height: '16px', backgroundColor: 'rgba(255,255,255,0.3)' }} />
          <span style={{ opacity: 0.9, fontWeight: 400, color: '#E0F2FE' }}>{action}</span>
        </>
      )}
      <style jsx>{`
        @keyframes slide-up {
          from { transform: translate(-50%, 20px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
