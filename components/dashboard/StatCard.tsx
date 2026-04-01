'use client'
import { useState, useEffect } from 'react'

export function Counter({ value, duration = 800 }: { value: number, duration?: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number | null = null
    const endValue = value

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3)
      
      setCount(Math.floor(easedProgress * endValue))
      
      if (progress < 1) {
        window.requestAnimationFrame(step)
      }
    }

    window.requestAnimationFrame(step)
  }, [value, duration])

  return <span>{count.toLocaleString()}</span>
}

export function StatCard({ 
  label, value, subtext, icon: Icon, iconBg, valueColor, delay = '0ms' 
}: { 
  label: string, value: number, subtext: string, icon: any, iconBg: string, valueColor: string, delay?: string 
}) {
  return (
    <div className="card animate-fade-up" style={{ animationDelay: delay }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18,
        }}>
          <Icon size={20} weight="fill" />
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: '#8B90A0', textTransform: 'uppercase' }}>
          {label}
        </span>
      </div>
      <div>
        <div style={{ fontSize: 32, fontWeight: 700, color: valueColor, lineHeight: 1 }}>
          <Counter value={value} />
        </div>
        <div style={{ fontSize: 12, color: '#545868', marginTop: 4 }}>
          {subtext}
        </div>
      </div>
    </div>
  )
}
