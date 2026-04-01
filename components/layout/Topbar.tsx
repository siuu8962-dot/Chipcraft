'use client'
import React from 'react'
import { Search, Bell, Menu } from 'lucide-react'
import { ThemeSwitcher } from '@/components/shared/ThemeSwitcher'
import { useNavigation } from '@/lib/contexts'

import { usePathname } from 'next/navigation'

export function Topbar({ user, profile }: { user: any, profile: any }) {
  const pathname = usePathname()
  const { setSidebarOpen } = useNavigation()
  const isAITutor = pathname.includes('ai-tutor')

  return (
    <header style={{
      height: 'var(--header-height)',
      minHeight: 'var(--header-height)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      gap: '12px',
      borderBottom: '1px solid var(--border)',
      backgroundColor: 'var(--bg-secondary)',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      zIndex: 20
    }}>
      {/* Mobile Menu Toggle */}
      <button 
        onClick={() => setSidebarOpen(true)}
        className="mobile-only"
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          padding: '4px'
        }}
      >
        <Menu size={24} />
      </button>

      {/* Search - centered, fluid width */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }} className="desktop-only">
        <div style={{ position: 'relative', width: '100%', maxWidth: '480px' }}>
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#475569' }} />
          <input style={{
            width: '100%',
            height: '36px',
            borderRadius: '10px',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--bg-surface)',
            padding: '0 12px 0 36px',
            color: 'var(--text-primary)',
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.15s'
          }} placeholder="Tìm kiếm khóa học, bài lab..." />
        </div>
      </div>

      <div className="mobile-only" style={{ flex: 1 }} />

      {/* Right icons — no wrapping */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        <button className="desktop-only" style={{ color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'color 0.15s' }}>
          <Bell size={20} />
        </button>
        <ThemeSwitcher />
        
        <div className="w-[1px] h-6 bg-border desktop-only" />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="desktop-only" data-theme-area="main" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {profile?.full_name?.split(' ').pop() || user?.email?.split('@')[0] || 'Bubi'}
            </span>
            <span style={{ fontSize: '11px', color: '#7C3AED', fontWeight: 700 }}>LEVEL {profile?.level || 1}</span>
          </div>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            borderRadius: '50%',
            backgroundColor: '#7C3AED', 
            display: 'flex',
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '14px', 
            fontWeight: 700,
            color: 'white',
            flexShrink: 0
          }}>
            {(profile?.full_name?.[0] || user?.email?.[0] || 'B').toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  )
}
