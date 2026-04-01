'use client'
import { useEffect, useState } from 'react'

export function GoalRing({ percentage, subtext }: { percentage: number, subtext: string }) {
  const [offset, setOffset] = useState(251.2) // circumference for r=40
  const radius = 40
  const circumference = 2 * Math.PI * radius

  useEffect(() => {
    const timer = setTimeout(() => {
      const progress = percentage / 100
      setOffset(circumference * (1 - progress))
    }, 300)
    return () => clearTimeout(timer)
  }, [percentage, circumference])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <div style={{ position: 'relative', width: 100, height: 100 }}>
        <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle
            cx="50" cy="50" r={radius}
            fill="transparent"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="8"
          />
          {/* Progress */}
          <circle
            cx="50" cy="50" r={radius}
            fill="transparent"
            stroke="#00E5B4"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        </svg>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          fontSize: 18, fontWeight: 700, color: '#F0F2F8'
        }}>
          {percentage}%
        </div>
      </div>
      <p style={{ fontSize: 14, color: '#8B90A0', marginTop: 12, margin: '12px 0 0' }}>
        {subtext}
      </p>
    </div>
  )
}
