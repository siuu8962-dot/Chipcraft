'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState, useRef } from 'react'
import { Sun, Moon, Monitor, Check } from 'lucide-react'

export function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div style={{
        width: '36px', height: '36px', borderRadius: '8px',
        backgroundColor: 'rgba(255,255,255,0.04)'
      }} />
    )
  }

  const isLight = resolvedTheme === 'light'

  const options = [
    { value: 'light',  label: 'Sáng',      Icon: Sun },
    { value: 'dark',   label: 'Tối',        Icon: Moon },
    { value: 'system', label: 'Hệ thống',   Icon: Monitor },
  ]

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.08)',
          backgroundColor: open
            ? 'rgba(124,58,237,0.15)'
            : 'rgba(255,255,255,0.04)',
          color: isLight ? '#EAB308' : '#94A3B8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
      >
        {isLight
          ? <Sun size={16} strokeWidth={2} />
          : <Moon size={16} strokeWidth={2} />
        }
      </button>

      {/* Dropdown menu */}
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          right: 0,
          backgroundColor: '#1A1A2E',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '6px',
          minWidth: '168px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          zIndex: 9999,
        }}>
          {options.map(({ value, label, Icon }) => {
            const isActive = theme === value
            return (
              <button
                key={value}
                onClick={() => {
                  console.log('Setting theme to:', value)
                  setTheme(value)
                  setOpen(false)
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 400,
                  backgroundColor: isActive
                    ? 'rgba(124,58,237,0.15)'
                    : 'transparent',
                  color: isActive ? '#A855F7' : '#94A3B8',
                  transition: 'all 0.1s',
                  textAlign: 'left',
                }}
              >
                <span style={{ display:'flex', alignItems:'center', gap:'9px' }}>
                  <Icon size={15} strokeWidth={2} />
                  {label}
                </span>
                {isActive && <Check size={13} strokeWidth={2.5} color="#A855F7" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
