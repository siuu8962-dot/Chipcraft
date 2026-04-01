'use client'
import React from 'react'

/* ─── FeatureCard ─── */
function FeatureCard({
  title, desc, icon, delay, accentColor
}: {
  title: string
  desc: string
  icon: React.ReactNode
  delay: string
  accentColor?: string
}) {
  const color = accentColor ?? '#a78bfa'
  return (
    <div
      className="group relative rounded-2xl border transition-all duration-500 cursor-pointer overflow-hidden p-6 md:px-7 md:py-6"
      style={{
        animationDelay: delay,
        background: 'rgba(20, 16, 40, 0.8)',
        border: `1px solid rgba(139,92,246,0.2)`,
        backdropFilter: 'blur(16px)',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget
        el.style.borderColor = `${color}55`
        el.style.background = 'rgba(30, 22, 55, 0.95)'
        el.style.transform = 'translateY(-3px)'
        el.style.boxShadow = `0 12px 40px -12px ${color}40`
      }}
      onMouseLeave={e => {
        const el = e.currentTarget
        el.style.borderColor = 'rgba(139,92,246,0.2)'
        el.style.background = 'rgba(20, 16, 40, 0.8)'
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = 'none'
      }}
    >
      {/* Icon */}
      <div style={{
        width: 36, height: 36, borderRadius: 10, marginBottom: 14,
        background: `${color}18`,
        border: `1px solid ${color}35`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: color,
      }}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none">{icon}</svg>
      </div>

      {/* Text */}
      <div style={{ fontSize: 14, fontWeight: 700, color: '#E2E8F0', marginBottom: 6, letterSpacing: '-0.01em' }}>
        {title}
      </div>
      <div style={{ fontSize: 12.5, color: 'rgba(148,163,184,0.7)', lineHeight: 1.6 }}>
        {desc}
      </div>

      {/* Connector dot on the right edge */}
      <div style={{
        position: 'absolute', right: -5, top: '50%', transform: 'translateY(-50%)',
        width: 9, height: 9, borderRadius: '50%',
        background: color, boxShadow: `0 0 8px ${color}`,
        opacity: 0.85,
      }} />
    </div>
  )
}

/* ─── SpecBox ─── */
function SpecBox({ label, value, position }: { label: string; value: string; position: React.CSSProperties }) {
  return (
    <div style={{
      position: 'absolute', ...position,
      background: 'rgba(8, 6, 20, 0.9)',
      border: '1px solid rgba(167,139,250,0.4)',
      borderRadius: 10, padding: '10px 16px',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 0 20px rgba(167,139,250,0.1)',
    }}>
      <div style={{ fontSize: 9, fontFamily: '"DM Mono"', letterSpacing: '0.15em', color: 'rgba(167,139,250,0.6)', marginBottom: 3, textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF', fontFamily: '"DM Mono"', letterSpacing: '-0.02em' }}>
        {value}
      </div>
    </div>
  )
}

/* ─── Main Section ─── */
export function UnifiedPlatform() {
  return (
    <section style={{ padding: '120px 0', position: 'relative', overflow: 'hidden', background: 'transparent' }}>
      <style jsx global>{`
        @keyframes photon-run {
          0%   { stroke-dashoffset: 800; opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }
        @keyframes chip-pulse-purple {
          0%, 100% { box-shadow: 0 0 30px rgba(139,92,246,0.25), inset 0 0 20px rgba(139,92,246,0.15); }
          50%       { box-shadow: 0 0 70px rgba(167,139,250,0.55), inset 0 0 35px rgba(167,139,250,0.3); }
        }
        @keyframes scan-v {
          0%   { transform: translateY(-110%); opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { transform: translateY(110%); opacity: 0; }
        }
        @keyframes corner-blink {
          0%, 100% { opacity: 1; } 50% { opacity: 0.2; }
        }
        .photon-a { animation: photon-run 3.5s linear infinite; }
        .photon-b { animation: photon-run 3.5s linear infinite 1.2s; }
        .photon-c { animation: photon-run 3.5s linear infinite 2.4s; }
        .scan-line { animation: scan-v 3s linear infinite; }
        .corner-led { animation: corner-blink 2.2s ease-in-out infinite; }
      `}</style>

      {/* Subtle background grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(139,92,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.03) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      {/* Top separator line */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '80%', height: 1,
        background: 'linear-gradient(to right, transparent, rgba(167,139,250,0.6), transparent)',
      }} className="hidden md:block" />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px' }} className="md:px-10">

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: 48 }} className="md:mb-20">
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
            fontFamily: '"DM Mono"', color: '#8B5CF6', marginBottom: 12,
          }} className="md:text-xs">
            Hệ sinh thái
          </div>
          <h2 style={{
            fontSize: 'clamp(28px, 5vw, 60px)', fontWeight: 900, color: '#FFFFFF',
            lineHeight: 1.2, letterSpacing: '-0.03em', margin: 0,
          }}>
            Chip bán dẫn{' '}
            <span style={{
              background: 'linear-gradient(to right, #c4b5fd, #7c3aed)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>thế hệ mới</span>
          </h2>
          <p style={{ marginTop: 16, color: 'rgba(148,163,184,0.6)', fontSize: 14, lineHeight: 1.7, maxWidth: 560, margin: '16px auto 0' }} className="md:text-base">
            Nền tảng đào tạo AI-Native tiên phong, kết nối lộ trình học thuật với môi trường mô phỏng công nghiệp.
          </p>
        </div>

        {/* ─── SIDE BY SIDE LAYOUT ─── */}
        <div style={{
          display: 'grid',
          gap: '40px',
          alignItems: 'center',
        }} className="grid-cols-1 lg:grid-cols-[1fr_auto_1fr]">

          {/* LEFT: 2x2 Feature Cards */}
          <div style={{ display: 'grid', gap: 16 }} className="grid-cols-1 md:grid-cols-2">
            <FeatureCard
              delay="0s"
              title="Khóa học"
              desc="Lộ trình từ cơ bản đến chuyên sâu"
              accentColor="#a78bfa"
              icon={<><path d="M4 6h16M4 10h16M4 14h10M4 18h16" strokeWidth="1.5" stroke="currentColor"/></>}
            />
            <FeatureCard
              delay="0.08s"
              title="AI Mentor"
              desc="Trợ lý AI giải đáp tức thì 24/7"
              accentColor="#7c3aed"
              icon={<><path d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" strokeWidth="1.5" stroke="currentColor" fill="none"/></>}
            />
            <FeatureCard
              delay="0.16s"
              title="Lab thực hành"
              desc="Mô phỏng mạch số tương tác"
              accentColor="#a78bfa"
              icon={<><path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" strokeWidth="1.5" stroke="currentColor" fill="none"/></>}
            />
            <FeatureCard
              delay="0.24s"
              title="Chứng chỉ"
              desc="Được ngành bán dẫn toàn cầu công nhận"
              accentColor="#7c3aed"
              icon={<><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeWidth="1.5" stroke="currentColor" fill="none"/></>}
            />
          </div>

          {/* CENTER: SVG connector lines */}
          <div style={{ width: 120, alignItems: 'center', justifyContent: 'center', position: 'relative', height: 340 }} className="hidden lg:flex">
            <svg width="120" height="340" viewBox="0 0 120 340" fill="none" style={{ overflow: 'visible', imageRendering: 'crisp-edges' }}>
              {/* 4 connection lines from cards (left) to chip (right) */}
              {[60, 130, 210, 280].map((y, i) => (
                <g key={i}>
                  <path d={`M 0 ${y} C 50 ${y} 70 170 120 170`} stroke="rgba(139,92,246,0.2)" strokeWidth="1.5" fill="none" />
                  <path d={`M 0 ${y} C 50 ${y} 70 170 120 170`} stroke="rgba(167,139,250,0.8)" strokeWidth="1.5" fill="none"
                    strokeDasharray="20 80" className={`photon-${['a','b','c','a'][i]}`}
                  />
                  {/* Node dot at start */}
                  <circle cx="0" cy={y} r="3" fill="rgba(167,139,250,0.6)" />
                </g>
              ))}
              {/* Converging dot at right */}
              <circle cx="120" cy="170" r="5" fill="#a78bfa" style={{ filter: 'drop-shadow(0 0 6px #a78bfa)' }} />
            </svg>
          </div>

          {/* RIGHT: AI Chip */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }} className="lg:justify-start">

            {/* Floating spec boxes */}
            <SpecBox label="Compute Unit" value="1.2 PETAFLOPS" position={{ top: -20, right: -10 }} />
            <SpecBox label="Inference Time" value="0.024ms" position={{ bottom: -20, left: -10 }} />

            {/* Purple ambient glow */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 350, height: 350, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)',
              filter: 'blur(30px)', pointerEvents: 'none',
            }} />

            {/* Main chip container */}
            <div style={{
              width: 280, height: 280, position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }} className="scale-90 md:scale-100">
              {/* Circuit SVG background */}
              <svg width="280" height="280" viewBox="0 0 280 280" fill="none" style={{ position: 'absolute', inset: 0, imageRendering: 'crisp-edges' }}>
                <defs>
                  <filter id="upNeonGlow">
                    <feGaussianBlur stdDeviation="0.5" result="b" />
                    <feComposite in="SourceGraphic" in2="b" operator="over" />
                  </filter>
                </defs>
                {/* Subtle grid */}
                <g stroke="rgba(167,139,250,0.06)" strokeWidth="0.5">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <React.Fragment key={i}>
                      <line x1={i * 20} y1="0" x2={i * 20} y2="280" />
                      <line x1="0" y1={i * 20} x2="280" y2={i * 20} />
                    </React.Fragment>
                  ))}
                </g>
                {/* Traces */}
                <g stroke="#a78bfa" strokeWidth="1" fill="none" filter="url(#upNeonGlow)" opacity="0.5">
                  <path d="M140 40V10H40V0" strokeDasharray="30 120" className="photon-a" />
                  <path d="M140 240V270H240V280" strokeDasharray="30 120" className="photon-b" />
                  <path d="M40 140H10V240" strokeDasharray="20 80" className="photon-c" />
                  <path d="M240 140H270V40" strokeDasharray="20 80" className="photon-a" />
                </g>
                {/* Corner circuit dots */}
                {[[40, 40], [240, 40], [40, 240], [240, 240]].map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r="3" fill="rgba(167,139,250,0.5)" />
                ))}
                {/* Energy ring */}
                <circle cx="140" cy="140" r="75" fill="none" stroke="rgba(139,92,246,0.12)" strokeWidth="1" />
                <circle cx="140" cy="140" r="90" fill="none" stroke="rgba(139,92,246,0.07)" strokeWidth="1" />
              </svg>

              {/* Chip body */}
              <div
                style={{
                  width: 160, height: 160, borderRadius: 20, position: 'relative',
                  background: 'rgba(8, 5, 25, 0.97)',
                  border: '2px solid rgba(167,139,250,0.75)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden',
                  zIndex: 2,
                }}
                className="animate-[chip-pulse-purple_4s_ease-in-out_infinite]"
              >
                {/* Corner brackets */}
                {[['top-2 left-2', 'borderTop borderLeft'], ['top-2 right-2', 'borderTop borderRight'], ['bottom-2 left-2', 'borderBottom borderLeft'], ['bottom-2 right-2', 'borderBottom borderRight']].map(([pos], i) => (
                  <div key={i} className={`absolute ${pos} w-4 h-4`} style={{
                    borderColor: 'rgba(167,139,250,0.6)',
                    borderTopWidth: i < 2 ? '1.5px' : 0,
                    borderBottomWidth: i >= 2 ? '1.5px' : 0,
                    borderLeftWidth: i % 2 === 0 ? '1.5px' : 0,
                    borderRightWidth: i % 2 === 1 ? '1.5px' : 0,
                  }} />
                ))}

                {/* Scanline */}
                <div
                  className="scan-line absolute left-0 right-0 h-8"
                  style={{ background: 'linear-gradient(to bottom, transparent, rgba(167,139,250,0.2), transparent)' }}
                />

                {/* Dot grid overlay */}
                <div style={{
                  position: 'absolute', inset: 0, opacity: 0.06,
                  backgroundImage: 'radial-gradient(circle, rgba(167,139,250,0.8) 1px, transparent 1px)',
                  backgroundSize: '10px 10px',
                }} />

                {/* Text */}
                <div style={{ fontSize: 52, fontWeight: 900, color: '#a78bfa', lineHeight: 1, letterSpacing: '-0.04em', textShadow: '0 0 30px rgba(167,139,250,0.8)', position: 'relative', zIndex: 1 }}>
                  AI
                </div>
                <div style={{ fontSize: 7.5, fontFamily: '"DM Mono"', color: 'rgba(167,139,250,0.55)', letterSpacing: '0.25em', marginTop: 8, textAlign: 'center', position: 'relative', zIndex: 1 }}>
                  NEURAL CORE<br />
                  <span style={{ opacity: 0.6 }}>X-SERIES PROTOTYPE<br />REV. 4.0</span>
                </div>

                {/* Corner LED */}
                <div className="corner-led" style={{
                  position: 'absolute', top: 10, left: 10,
                  width: 5, height: 5, borderRadius: '50%',
                  background: '#a78bfa', boxShadow: '0 0 6px rgba(167,139,250,0.8)',
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
