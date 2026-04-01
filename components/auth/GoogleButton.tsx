'use client'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function GoogleSignInButton({ label }: { label: string }) {
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
    if (error) {
      console.error('Google OAuth error:', error)
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={isLoading}
      style={{
        width: '100%', height: 52, borderRadius: 12,
        background: '#FFFFFF',
        border: '1.5px solid #E2E8F0',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: 12,
        fontSize: 15, fontWeight: 600, color: '#0F172A',
        transition: 'all 0.15s', boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        opacity: isLoading ? 0.7 : 1,
      }}
      onMouseEnter={e => {
        if (isLoading) return
        const el = e.currentTarget as HTMLButtonElement
        el.style.borderColor = '#CBD5E1'
        el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)'
        el.style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.borderColor = '#E2E8F0'
        el.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)'
        el.style.transform = 'translateY(0)'
      }}
    >
      {/* Google SVG */}
      <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908C16.657 14.333 17.64 11.963 17.64 9.2z" fill="#4285F4"/>
        <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
        <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
      </svg>
      {isLoading ? 'Connecting...' : label}
    </button>
  )
}
