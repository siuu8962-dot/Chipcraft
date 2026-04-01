'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  CircuitBoard, 
  List, 
  X,
  Play,
  ArrowRight,
  Github,
  Linkedin,
  Twitter,
  CaretRight,
  Sparkle,
  Terminal,
  Trophy,
  Certificate,
  BookOpen,
  QrCode,
  CreditCard
} from '@/lib/icons'
import { PaymentModal } from '@/components/payment/PaymentModal'
import { cn } from '@/lib/utils'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { UnifiedPlatform } from '@/components/landing/UnifiedPlatform'

const AIChip = () => {
  const [isClient, setIsClient] = useState(false);
  const [traces, setTraces] = useState<{x: number, y: number, l: number}[]>([]);

  useEffect(() => {
    setIsClient(true);
    setTraces(Array.from({ length: 30 }).map(() => ({
      x: Math.random() * 500,
      y: Math.random() * 500,
      l: 20 + Math.random() * 40
    })));
  }, []);

  return (
    <div className="relative flex items-center justify-center w-full max-w-[700px] aspect-square animate-[float_8s_ease-in-out_infinite] scale-105">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-teal/10 blur-[150px] rounded-full animate-[pulseGlow_4s_ease-in-out_infinite]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-blue/10 blur-[100px] rounded-full animate-[pulseGlow_6s_ease-in-out_infinite_1s]" />
      
      {/* Background Mesh Grid */}
      <div className="absolute inset-0 opacity-[0.2] pointer-events-none" 
        style={{ 
          backgroundImage: `linear-gradient(to right, rgba(0,212,180,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,212,180,0.15) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(circle at center, black 40%, transparent 90%)'
        }} 
      />

      {/* Extreme Detail Circuit Board SVG */}
      <svg width="100%" height="100%" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" 
        className="relative z-0 scale-115"
        style={{ imageRendering: 'crisp-edges' }}
      >
        <defs>
          <filter id="circuitGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="0.4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="neonShadow">
            <feGaussianBlur stdDeviation="0.4" result="blur" />
            <feFlood floodColor="#00D4B4" floodOpacity="1" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="shadow" />
            <feOffset dx="0" dy="0" result="offsetShadow" />
            <feComposite in="SourceGraphic" in2="offsetShadow" operator="over" />
          </filter>
        </defs>

        {/* Base Grid Layer (Super Dense) */}
        <g stroke="var(--bg-surface)" strokeWidth="0.4">
          {Array.from({length: 41}).map((_, i) => (
            <React.Fragment key={i}>
              <line x1={i*12.5} y1="0" x2={i*12.5} y2="500" />
              <line x1="0" y1={i*12.5} x2="500" y2={i*12.5} />
            </React.Fragment>
          ))}
        </g>

        {/* Micro Traces Layer (Extreme Detail) */}
        <g stroke="rgba(0,212,180,0.12)" strokeWidth="0.6">
          {isClient && traces.map((t, i) => (
            <path key={i} d={`M${t.x} ${t.y} l${t.l} ${t.l/2} l${t.l/2} 0`} fill="none" />
          ))}
        </g>

        {/* Primary Circuit Paths with Neon Glow */}
        <g stroke="rgba(0,212,180,0.2)" strokeWidth="1.5" strokeLinecap="round">
          <path d="M250 50V450M50 250H450" />
          {[30, 60, 90].map(offset => (
            <React.Fragment key={offset}>
              <path d={`M${250-offset} 80V420`} opacity={0.4 - offset/200} />
              <path d={`M${250+offset} 80V420`} opacity={0.4 - offset/200} />
              <path d={`M80 ${250-offset}H420`} opacity={0.4 - offset/200} />
              <path d={`M80 ${250+offset}H420`} opacity={0.4 - offset/200} />
            </React.Fragment>
          ))}
        </g>

        {/* LAYER 1: NEON LIGHT STREAMS (Teal) */}
        <g stroke="#00D4B4" strokeWidth="2.5" filter="url(#neonShadow)" strokeLinecap="round">
          <path d="M250 180V80H120V30" strokeDasharray="80 300" className="animate-[flowingLight_3s_linear_infinite]" />
          <path d="M250 320V420H380V470" strokeDasharray="100 250" className="animate-[flowingLight_2.5s_linear_infinite_0.4s]" />
          <path d="M180 250H80V120H50" strokeDasharray="80 300" className="animate-[flowingLight_4s_linear_infinite_0.8s]" />
          <path d="M320 250H420V380H470" strokeDasharray="90 280" className="animate-[flowingLight_3.5s_linear_infinite_1.2s]" />
          
          {/* Advanced Parallel Bus Lines */}
          {[10, -10].map(offset => (
            <React.Fragment key={offset}>
               <path d={`M${250+offset} 180V80H${120+offset}V30`} strokeWidth="1" opacity="0.4" strokeDasharray="40 200" className="animate-[flowingLight_3.2s_linear_infinite]" />
               <path d={`M${180} ${250+offset}H80V${120+offset}H50`} strokeWidth="1" opacity="0.4" strokeDasharray="30 180" className="animate-[flowingLight_4.2s_linear_infinite_0.2s]" />
            </React.Fragment>
          ))}
        </g>

        {/* LAYER 2: DATA FLOW (Blue) */}
        <g stroke="#3B82F6" strokeWidth="3" filter="url(#circuitGlow)" opacity="0.8">
          <path d="M250 150V50" strokeDasharray="30 150" className="animate-[flowingLight_2.2s_linear_infinite_2.1s]" />
          <path d="M250 350V450" strokeDasharray="30 150" className="animate-[flowingLight_2.2s_linear_infinite_2.3s]" />
          <path d="M150 250H50" strokeDasharray="30 150" className="animate-[flowingLight_2.2s_linear_infinite_2.5s]" />
          <path d="M350 250H450" strokeDasharray="30 150" className="animate-[flowingLight_2.2s_linear_infinite_2.7s]" />
        </g>

        {/* LAYER 3: CORE BURSTS */}
        <g stroke="#FFF" strokeWidth="1" filter="url(#neonShadow)" opacity="0.6">
          <path d="M250 250L480 20" strokeDasharray="10 200" className="animate-[flowingLight_1.5s_linear_infinite_0.1s]" />
          <path d="M250 250L20 480" strokeDasharray="10 200" className="animate-[flowingLight_1.5s_linear_infinite_0.3s]" />
          <path d="M250 250L480 480" strokeDasharray="10 200" className="animate-[flowingLight_1.5s_linear_infinite_0.5s]" />
          <path d="M250 250L20 20" strokeDasharray="10 200" className="animate-[flowingLight_1.5s_linear_infinite_0.7s]" />
        </g>

        {/* Micro Data Bits */}
        {Array.from({length: 12}).map((_, i) => (
          <circle key={i} r="2" fill={i % 2 === 0 ? "#00D4B4" : "#3B82F6"}>
            <animateMotion 
              dur={`${2 + (i % 4)}s`} 
              repeatCount="indefinite" 
              path={`M${100 + (i*30) % 300} ${100 + (i*50) % 300} L${250} 250`} 
            />
            <animate attributeName="opacity" values="0;1;0" dur={`${2 + (i % 4)}s`} repeatCount="indefinite" />
          </circle>
        ))}

        {/* Glowing Junctions */}
        <g>
          {[
            {x:250,y:100}, {x:250,y:400}, {x:100,y:250}, {x:400,y:250},
            {x:120,y:80}, {x:380,y:80}, {x:120,y:420}, {x:380,y:420}
          ].map((p, i) => (
            <React.Fragment key={i}>
              <circle cx={p.x} cy={p.y} r="3" fill="#00D4B4" opacity="0.2" className="animate-ping" />
              <circle cx={p.x} cy={p.y} r="1.5" fill="#00D4B4" className="animate-pulse" />
            </React.Fragment>
          ))}
        </g>

        {/* High-Speed Data Buffers (Dotted lines) */}
        <g stroke="rgba(59,130,246,0.15)" strokeWidth="1" strokeDasharray="3 6">
          <circle cx="250" cy="250" r="180" />
          <circle cx="250" cy="250" r="220" />
        </g>

        {/* LAYER 1: Faster, Thin Light Streams */}
        <g stroke="#00D4B4" strokeWidth="1.2" opacity="0.6" filter="url(#circuitGlow)">
          <path d="M250 180V80H120V30" strokeDasharray="40 200" className="animate-[flowingLight_4s_linear_infinite]" />
          <path d="M250 320V420H380V470" strokeDasharray="50 180" className="animate-[flowingLight_3.5s_linear_infinite_0.5s]" />
          <path d="M180 250H80V120H50" strokeDasharray="30 220" className="animate-[flowingLight_5s_linear_infinite_1s]" />
          <path d="M320 250H420V380H470" strokeDasharray="45 190" className="animate-[flowingLight_4.2s_linear_infinite_1.5s]" />
        </g>

        {/* LAYER 2: Major Data Packets (Thicker, Slow) */}
        <g stroke="#3B82F6" strokeWidth="2.5" opacity="0.8" filter="url(#circuitGlow)">
          <path d="M250 150V50" strokeDasharray="20 120" className="animate-[flowingLight_2.5s_linear_infinite_2s]" />
          <path d="M250 350V450" strokeDasharray="20 120" className="animate-[flowingLight_2.5s_linear_infinite_2.2s]" />
          <path d="M150 250H50" strokeDasharray="20 120" className="animate-[flowingLight_2.5s_linear_infinite_2.4s]" />
          <path d="M350 250H450" strokeDasharray="20 120" className="animate-[flowingLight_2.5s_linear_infinite_2.6s]" />
        </g>

        {/* LAYER 3: Core Pulse Streams (Coming from Center) */}
        <g stroke="#00D4B4" strokeWidth="3" strokeLinecap="round" filter="url(#circuitGlow)">
          <path d="M250 250L450 450" strokeDasharray="10 150" className="animate-[flowingLight_3s_linear_infinite_0.1s]" />
          <path d="M250 250L50 450" strokeDasharray="10 150" className="animate-[flowingLight_3s_linear_infinite_0.4s]" />
          <path d="M250 250L450 50" strokeDasharray="10 150" className="animate-[flowingLight_3s_linear_infinite_0.7s]" />
          <path d="M250 250L50 50" strokeDasharray="10 150" className="animate-[flowingLight_3s_linear_infinite_1s]" />
        </g>

        {/* Small Data Bits (Moving dots) */}
        {[
          "M100 100V200H200", "M400 400V300H300", 
          "M100 400H200V300", "M400 100H300V200",
          "M250 100V200M250 300V400", "M100 250H200M300 250H400",
          "M50 50L150 150", "M450 450L350 350"
        ].map((d, i) => (
          <circle key={i} r={i < 4 ? "2" : "1"} fill={i % 2 === 0 ? "#00D4B4" : "#3B82F6"}>
            <animateMotion dur={`${2 + (i % 3)}s`} repeatCount="indefinite" path={d} />
            <animate attributeName="opacity" values="0;1;0" dur={`${2 + (i % 3)}s`} repeatCount="indefinite" />
          </circle>
        ))}

        {/* Static Junction Points (Gold & Teal) */}
        <g>
          {[
            {x:120,y:80,c:"#F59E0B"}, {x:380,y:80,c:"#F59E0B"}, {x:120,y:420,c:"#F59E0B"}, {x:380,y:420,c:"#F59E0B"},
            {x:80,y:120,c:"#00D4B4"}, {x:420,y:120,c:"#00D4B4"}, {x:80,y:380,c:"#00D4B4"}, {x:420,y:380,c:"#00D4B4"},
            {x:250,y:50,c:"#00D4B4"}, {x:250,y:450,c:"#00D4B4"}, {x:50,y:250,c:"#00D4B4"}, {x:450,y:250,c:"#00D4B4"}
          ].map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="1.5" fill={p.c} opacity="0.6" className="animate-pulse" />
          ))}
        </g>
      </svg>

      {/* Extreme Detail AI Processor Core */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div style={{
          width: 200, height: 200,
          background: 'rgba(3, 6, 12, 0.96)',
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(0, 212, 180, 0.55)',
          borderRadius: 36,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 0,
          boxShadow: '0 0 60px rgba(0, 212, 180, 0.3), inset 0 0 30px rgba(0, 212, 180, 0.08)',
          overflow: 'hidden',
          position: 'relative'
        }} className="animate-[chipPulse_5s_ease-in-out_infinite]">
          
          {/* Inner Die Layer */}
          <div className="absolute inset-2 border border-teal/10 rounded-2xl overflow-hidden">
            {/* Scanline Effect */}
            <div className="absolute inset-0 w-full h-1/4 bg-gradient-to-b from-transparent via-teal/20 to-transparent animate-[scanline_3s_linear_infinite]" />
            {/* Micro Traces Grid */}
            <div className="absolute inset-0 opacity-10" 
              style={{ backgroundImage: 'radial-gradient(circle, rgba(0,212,180,0.6) 1px, transparent 1px)', backgroundSize: '10px 10px' }} 
            />
          </div>

          {/* AI Text Content */}
          <div className="relative z-10 flex flex-col items-center justify-center" style={{ gap: 0 }}>
            {/* BIG AI */}
            <div style={{
              fontSize: 76, fontWeight: 900,
              background: 'linear-gradient(135deg, #FFFFFF 0%, #00D4B4 60%, #3B82F6 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 30px rgba(0, 212, 180, 0.95))',
              letterSpacing: '-0.02em',
              lineHeight: 1, marginBottom: 2
            }}>AI</div>
            {/* NEURAL CORE label */}
            <div style={{
              fontFamily: '"DM Mono"', fontSize: 9.5, color: '#00D4B4',
              fontWeight: 700, letterSpacing: '0.3em', opacity: 1,
              textShadow: '0 0 15px rgba(0, 212, 180, 1)',
              marginBottom: 6,
            }}>NEURAL CORE</div>
            {/* Status dots */}
            <div className="flex gap-1.5">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-teal animate-pulse' : 'bg-teal/20'}`} />
              ))}
            </div>
          </div>
          
          {/* Corner Hardware Details */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-teal/60" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-teal/60" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-teal/60" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-teal/60" />
          
          {/* Technical spec line */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap" style={{
            fontSize: 7, fontFamily: '"DM Mono"', color: 'rgba(0,212,180,0.5)',
            letterSpacing: '0.3em', textTransform: 'uppercase',
          }}>
            X-SERIES  REV 4.9
          </div>
        </div>
      </div>
      
      {/* Floating Technical HUD Elements Removed */}
    </div>
  )
}

export default function LandingPage() {
  useScrollAnimation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'anniversary'>('monthly')
  const [paymentModal, setPaymentModal] = useState({ open: false, plan: 'pro' as 'pro' | 'enterprise', cycle: 'monthly' as 'monthly' | 'annual' })

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="bg-[var(--bg-primary)] text-[#E2E8F0] selection:bg-teal/30 selection:text-teal overflow-x-clip">
      {/* Navbar */}
      <nav
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          height: '64px',
          display: 'flex', alignItems: 'center',
          padding: '0 40px',
          background: 'rgba(5, 5, 8, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: scrolled
            ? '1px solid rgba(0, 212, 180, 0.15)'
            : '1px solid var(--border)',
          transition: 'border-color 0.3s ease',
        }}
      >
        {/* Logo */}
        <div style={{ flex: 1 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'rgba(0,212,180,0.15)',
              border: '1px solid rgba(0,212,180,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CircuitBoard size={18} color="#00D4B4" />
            </div>
            <span style={{ fontFamily: '"Be Vietnam Pro", sans-serif', fontWeight: 700, fontSize: 18, color: '#E2E8F0', letterSpacing: '-0.02em' }}>
              ChipCraft
            </span>
          </Link>
        </div>

        {/* Center nav  desktop only */}
        <div style={{
          display: 'flex', gap: '32px', position: 'absolute', left: '50%', transform: 'translateX(-50%)'
        }} className="hidden md:flex">
          {['Khóa học', 'Pricing', 'Cộng đồng', 'Blog'].map(item => (
            <Link key={item} href="#"
              className="hover:text-teal transition-colors"
              style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)', textDecoration: 'none' }}
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Right CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, justifyContent: 'flex-end' }} className="hidden md:flex">
          <Link href="/login"
            style={{
              fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none',
              transition: 'color 0.15s',
            }}
            className="hover:text-white"
          >
            Đăng nhập
          </Link>
          <Link href="/register" style={{
            height: 40, padding: '0 20px', borderRadius: 10,
            background: '#FFFFFF', color: '#000000',
            fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center',
            textDecoration: 'none', transition: 'all 0.2s',
            boxShadow: '0 4px 12px rgba(255,255,255,0.1)'
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(255,255,255,0.15)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,255,255,0.1)' }}
          >
            Bắt đầu free
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#E2E8F0', cursor: 'pointer' }}
          className="flex md:hidden"
        >
          {menuOpen ? <X size={24} /> : <List size={24} />}
        </button>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div style={{
            position: 'absolute', top: 64, left: 0, right: 0,
            background: 'rgba(5,5,8,0.98)', borderBottom: '1px solid var(--border)',
            padding: '24px 40px',
            display: 'flex', flexDirection: 'column', gap: '20px',
          }} className="md:hidden">
            {['Khóa học', 'Pricing', 'Cộng đồng', 'Blog'].map(item => (
              <Link key={item} href="#" style={{ color: '#E2E8F0', textDecoration: 'none', fontSize: 15 }}>
                {item}
              </Link>
            ))}
            <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
            <Link href="/login" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Đăng nhập</Link>
            <Link href="/register" className="btn-primary" style={{ justifyContent: 'center' }}>Bắt đầu free</Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: 64,        // navbar height
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Aurora background */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 70% 60% at 30% 40%, rgba(0,212,180,0.09) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '0 40px',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',   // LEFT content + RIGHT code card
          gap: '64px',
          alignItems: 'center',
        }} className="grid-cols-1 lg:grid-cols-2">

          {/* ?? LEFT: Content ?? */}
          <div style={{ maxWidth: 560 }}>
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 14px', borderRadius: 4, marginBottom: 28,
              border: '2px solid rgba(0,212,180,0.5)',
              background: 'rgba(0,212,180,0.08)',
            }}>
              <span style={{
                fontFamily: '"Be Vietnam Pro"', fontSize: 11, fontWeight: 700,
                color: '#00D4B4', letterSpacing: '0.08em',
              }}>NỀN TẢNG ĐÀO TẠO AI CHIP SỐ 1 VIỆT NAM</span>
            </div>

            {/* H1  BIG */}
            <div className="animate-entrance" style={{ animationDelay: '0.2s' }}>
              <h1 style={{
                fontFamily: '"Be Vietnam Pro"', fontWeight: 900,
                fontSize: 'clamp(52px, 7vw, 84px)',
                lineHeight: 1, letterSpacing: '-0.04em',
                color: '#FFFFFF', marginBottom: 16,
                textShadow: '0 0 30px rgba(255,255,255,0.15)'
              }}>
                Làm chủ<br />
                Hệ sinh thái thiết kế chip
              </h1>
            </div>
            <div className="animate-entrance" style={{ animationDelay: '0.4s' }}>
              <h1 className="animate-text-glow" style={{
                fontFamily: '"Be Vietnam Pro"', fontWeight: 900,
                fontSize: 'clamp(52px, 7vw, 84px)',
                lineHeight: 1, letterSpacing: '-0.04em',
                background: 'linear-gradient(135deg, #00D4B4 10%, #3B82F6 90%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                marginBottom: 24,
                filter: 'drop-shadow(0 0 20px rgba(0, 212, 180, 0.4))'
              }}>
                với AI Tutor
              </h1>
            </div>

            {/* Subtitle */}
            <p style={{
              fontSize: 18, fontWeight: 400, color: 'var(--text-secondary)',
              lineHeight: 1.7, marginBottom: 36, maxWidth: 480,
            }}>
              Học Verilog, RTL Design và ASIC flow với AI giải thích từng dòng code.
              Thực hành ngay trên trình duyệt – không cần cài đặt EDA phức tạp.
            </p>

            {/* CTA Row */}
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 32, flexWrap: 'wrap' }}>
              <Link href="/register" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                height: 56, padding: '0 32px', borderRadius: 14,
                background: '#00D4B4', color: '#000000',
                fontWeight: 800, fontSize: 16, textDecoration: 'none',
                whiteSpace: 'nowrap',
                boxShadow: '0 0 0 0 rgba(0,212,180,0.5)',
                animation: 'glowPulse 2.5s ease-in-out infinite',
                transition: 'transform 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'}
              >
                Bắt đầu học miễn phí →
              </Link>
              <a href="#demo" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                height: 56, padding: '0 28px', borderRadius: 14,
                background: 'transparent', border: '1.5px solid rgba(255,255,255,0.15)',
                color: '#E2E8F0', fontWeight: 600, fontSize: 15, textDecoration: 'none',
                whiteSpace: 'nowrap', transition: 'border-color 0.15s, color 0.15s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.borderColor = 'rgba(0,212,180,0.5)'
                el.style.color = '#00D4B4'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.borderColor = 'rgba(255,255,255,0.15)'
                el.style.color = '#E2E8F0'
              }}
              >
                ▶ Xem demo video
              </a>
            </div>

            {/* Social proof */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Avatar stack */}
              <div style={{ display: 'flex' }}>
                {[
                  { i: 'NT', c: '#00D4B4', bg: 'rgba(0,212,180,0.2)' },
                  { i: 'LH', c: '#3B82F6', bg: 'rgba(59,130,246,0.2)' },
                  { i: 'PA', c: '#8B5CF6', bg: 'rgba(139,92,246,0.2)' },
                ].map((a, idx) => (
                  <div key={idx} style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: a.bg, border: `2px solid ${a.c}`,
                    marginLeft: idx > 0 ? -12 : 0, zIndex: 3 - idx,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: '"DM Mono"', fontSize: 12, fontWeight: 800, color: a.c,
                    boxShadow: `0 0 15px ${a.c}44`,
                    imageRendering: 'crisp-edges'
                  }}>{a.i}</div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#E2E8F0' }}>
                  Tham gia <span style={{ color: '#00D4B4' }}>2,847</span> kỹ sư đang học
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  ★★★★★ 4.9/5  312 đánh giá
                </div>
              </div>
            </div>
          </div>

          {/* ?? RIGHT: Animated AI Chip ?? */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            <AIChip />
            
            {/* Visual background element */}
            <div className="absolute -z-10 w-[140%] h-[140%] translate-x-[-10%] opacity-20"
              style={{
                background: 'radial-gradient(circle at center, rgba(0,212,180,0.15) 0%, transparent 70%)',
                filter: 'blur(60px)'
              }}
            />
          </div>
        </div>
      </section>

      {/* Stats Section  Fix 3: 4 columns with dividers */}
      <section style={{
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(255,255,255,0.015)',
        padding: '0',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '0 40px',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
          }} className="stats-grid">
            {[
              { value: '2,847', label: 'Học viên đang học', suffix: '' },
              { value: '6', label: 'Khóa học chuyên sâu', suffix: '' },
              { value: '50', label: 'Bài lab thực hành', suffix: '+' },
              { value: '4.9', label: 'Đánh giá trung bình', suffix: '★' },
            ].map((stat, i) => (
              <div key={i} style={{
                padding: '40px 28px',
                textAlign: 'center',
                borderRight: i < 3 ? '1px solid var(--border)' : 'none',
                position: 'relative',
              }}>
                <div style={{
                  fontFamily: '"Be Vietnam Pro", sans-serif',
                  fontWeight: 800,
                  fontSize: 40,
                  color: '#FFFFFF',
                  lineHeight: 1,
                  marginBottom: 10,
                  letterSpacing: '-0.02em',
                }}>
                  {stat.value}<span style={{ color: '#00D4B4', fontSize: 32 }}>{stat.suffix}</span>
                </div>
                <div style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'var(--text-muted)',
                  letterSpacing: '0.01em',
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Features Section  Step 3C fix */}
      <section id="features" style={{ padding: '96px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div className="flex flex-col items-center text-center mb-16 animate-target">
            <span className="section-label">Tính năng</span>
            <h2 className="text-4xl md:text-5xl mb-6 font-bold text-white tracking-tight">Mọi thứ bạn cần để <br className="hidden md:block" /> trở thành chip designer</h2>
            <p className="text-[var(--text-muted)] max-w-2xl mx-auto text-lg">Chu trình học tập khép kín: Lý thuyết → Thực hành → AI Feedback.</p>
          </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          marginTop: '64px',
        }} className="features-grid"
        >
          {[
            {
              icon: <Sparkle size={22} color="#00D4B4" weight="duotone" />,
              iconBg: 'rgba(0,212,180,0.10)', iconBorder: 'rgba(0,212,180,0.2)',
              title: 'AI Tutor 24/7',
              description: 'Giải đáp mọi thắc mắc về Verilog và kiến trúc chip ngay lập tức bằng tiếng Việt.',
            },
            {
              icon: <Terminal size={22} color="#00D4B4" weight="duotone" />,
              iconBg: 'rgba(0,212,180,0.10)', iconBorder: 'rgba(0,212,180,0.2)',
              title: 'Cloud Lab Simulator',
              description: 'Thiết kế, biên dịch và chạy mô phỏng Verilog ngay trên trình duyệt web.',
            },
            {
              icon: <CircuitBoard size={22} color="#00D4B4" weight="duotone" />,
              title: 'Lộ trình chuẩn Công nghiệp',
              description: 'Nội dung bám sát quy trình thiết kế ASIC/FPGA thực tế tại các tập đoàn lớn.',
              iconBg: 'rgba(0,212,180,0.10)', iconBorder: 'rgba(0,212,180,0.2)'
            },
            {
              icon: <Trophy size={22} color="#F59E0B" weight="duotone" />,
              title: 'Gamification & XP',
              description: 'Kiếm XP, huy hiệu và leo bảng xếp hạng cùng 2,800+ kỹ sư Việt Nam.',
              iconBg: 'rgba(245,158,11,0.10)', iconBorder: 'rgba(245,158,11,0.2)'
            },
            {
              icon: <Certificate size={22} color="#F59E0B" weight="duotone" />,
              title: 'Chứng chỉ được công nhận',
              description: 'Certificate được Intel Vietnam và FPT Semiconductor xác nhận. Thêm ngay vào LinkedIn.',
              iconBg: 'rgba(245,158,11,0.10)', iconBorder: 'rgba(245,158,11,0.2)'
            },
            {
              icon: <BookOpen size={22} color="#8B5CF6" weight="duotone" />,
              title: '6 Khóa học chuyên sâu',
              description: 'Từ Digital Logic → RTL Design → ASIC Flow → Verification → FPGA → AI Chip.',
              iconBg: 'rgba(139,92,246,0.10)', iconBorder: 'rgba(139,92,246,0.2)'
            }
          ].map((feature, i) => (
            <div
              key={i}
              className={`card animate-target stagger-${(i % 3) + 1}`}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 20,
                padding: 32,
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: feature.iconBg,
                border: `1px solid ${feature.iconBorder}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 20,
                flexShrink: 0,
              }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 600, color: '#E2E8F0', marginBottom: 8, fontFamily: '"Be Vietnam Pro", sans-serif' }}>
                {feature.title}
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* Unified Platform  THE MAGIC SECTION */}
      <UnifiedPlatform />

      {/* ?? Roadmap Section ?? */}
      <section id="curriculum" style={{ padding: '160px 0', background: '#020408', position: 'relative' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px', textAlign: 'center' }}>
          <div style={{ 
            fontSize: 12, fontWeight: 800, color: '#3B82F6', 
            letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 24,
            fontFamily: '"DM Mono"'
          }}>Lộ trình học tập</div>

          <h2 style={{ 
            fontSize: 'clamp(40px, 6vw, 72px)', 
            fontWeight: 900, color: '#FFFFFF',
            lineHeight: 1.1, letterSpacing: '-0.04em',
            marginBottom: 32, maxWidth: 900, margin: '0 auto 80px'
          }}>
             Chip bán dẫn{' '}
            <span style={{
              background: 'linear-gradient(to right, #c4b5fd, #7c3aed)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>thế hệ mới</span>
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            marginTop: '48px',
            alignItems: 'start',
          }} className="curriculum-grid"
          >
            {/* Stage 1 */}
            <div className="animate-target stagger-1 group" style={{
              background: 'rgba(0,212,180,0.02)',
              border: '1px solid rgba(0,212,180,0.15)',
              borderLeft: '4px solid #00D4B4',
              borderRadius: '0 24px 24px 0',
              padding: 32,
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 blur-[40px] -mr-16 -mt-16 group-hover:bg-teal-500/10 transition-all" />
              <div style={{ fontSize: 11, fontFamily: '"DM Mono"', color: '#00D4B4', letterSpacing: '0.08em', marginBottom: 8 }}>
                GIAI ĐOẠN 1  03 THÁNG
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#E2E8F0', marginBottom: 20, fontFamily: '"Be Vietnam Pro"' }}>
                Nền tảng vững chắc
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                {[
                  { name: 'Nền tảng số & Logic', badge: 'BEGINNER  8H  FREE' },
                  { name: 'RTL Design với Verilog', badge: 'INTERMEDIATE  12H' },
                ].map((course, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    padding: '12px 14px', borderRadius: 10,
                    background: 'rgba(0,212,180,0.06)',
                    border: '1px solid rgba(0,212,180,0.12)',
                  }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#00D4B4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <span style={{ fontSize: 10, color: '#000' }}>✓</span>
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: '#E2E8F0' }}>{course.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: '"DM Mono"', marginTop: 3 }}>{course.badge}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Kết quả: </span>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Viết Verilog thành thạo, thiết kế mạch số cơ bản</span>
              </div>
            </div>

            {/* Stage 2 */}
            <div className="animate-target stagger-2 group" style={{
              background: 'rgba(59,130,246,0.02)',
              border: '1px solid rgba(59,130,246,0.15)',
              borderLeft: '4px solid #3B82F6',
              borderRadius: '0 24px 24px 0',
              padding: 32,
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[40px] -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-all" />
              <div style={{ fontSize: 11, fontFamily: '"DM Mono"', color: '#3B82F6', letterSpacing: '0.08em', marginBottom: 8 }}>
                GIAI ĐOẠN 2  3-9 THÁNG
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#E2E8F0', marginBottom: 20, fontFamily: '"Be Vietnam Pro"' }}>
                Kỹ năng chuyên nghiệp
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                {[
                  { name: 'ASIC Design Flow', badge: 'ADVANCED  20H' },
                  { name: 'Verification & Testbench', badge: 'INTERMEDIATE  10H' },
                  { name: 'FPGA Prototyping', badge: 'INTERMEDIATE  14H' },
                ].map((course, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    padding: '12px 14px', borderRadius: 10,
                    background: 'rgba(59,130,246,0.06)',
                    border: '1px solid rgba(59,130,246,0.12)',
                  }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <span style={{ fontSize: 10, color: '#fff' }}>✓</span>
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: '#E2E8F0' }}>{course.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: '"DM Mono"', marginTop: 3 }}>{course.badge}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Kết quả: </span>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Pass technical interview tại Intel, Marvell, Cadence</span>
              </div>
            </div>

            {/* Stage 3 */}
            <div className="animate-target stagger-3 group" style={{
              background: 'rgba(245,158,11,0.02)',
              border: '1px solid rgba(245,158,11,0.15)',
              borderLeft: '4px solid #F59E0B',
              borderRadius: '0 24px 24px 0',
              padding: 32,
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-[40px] -mr-16 -mt-16 group-hover:bg-orange-500/10 transition-all" />
              <div style={{ fontSize: 11, fontFamily: '"DM Mono"', color: '#F59E0B', letterSpacing: '0.08em', marginBottom: 8 }}>
                GIAI ĐOẠN 3  9-18 THÁNG
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#E2E8F0', marginBottom: 20, fontFamily: '"Be Vietnam Pro"' }}>
                Chuyên gia AI Chip
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                {[
                  { name: 'Kiến trúc AI Chip', badge: 'EXPERT  18H' },
                  { name: 'RISC-V Processor Design', badge: 'COMING SOON' },
                  { name: 'Chiplet Design', badge: 'COMING SOON' },
                ].map((course, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    padding: '12px 14px', borderRadius: 10,
                    background: 'rgba(245,158,11,0.06)',
                    border: '1px solid rgba(245,158,11,0.12)',
                    opacity: course.badge.includes('COMING') ? 0.6 : 1,
                  }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <span style={{ fontSize: 10, color: '#000' }}>{course.badge.includes('COMING') ? '' : '✓'}</span>
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: '#E2E8F0' }}>{course.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: '"DM Mono"', marginTop: 3 }}>{course.badge}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Kết quả: </span>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Senior Chip Designer tại các fab hàng đầu</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" style={{ padding: '160px 0', position: 'relative' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 40px', textAlign: 'center' }}>
          <div className="flex flex-col items-center mb-16 animate-target">
            <div style={{ 
              fontSize: 12, fontWeight: 800, color: '#00D4B4', 
              letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 24,
              fontFamily: '"DM Mono"'
            }}>Pricing</div>
            <h2 style={{ 
              fontSize: 'clamp(40px, 6vw, 72px)', 
              fontWeight: 900, color: '#FFFFFF',
              lineHeight: 1.1, letterSpacing: '-0.04em',
              marginBottom: 48, maxWidth: 900, margin: '0 auto'
            }}>Đầu tư vào tương lai của bạn</h2>
          
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12, margin: '0 auto',
              marginBottom: 48,
              width: '100%', maxWidth: 480,
            }}>
            {/* Tháng */}
            <button
              onClick={() => setBillingPeriod('monthly')}
              style={{
                flex: 1, height: 48, padding: '0 28px', borderRadius: 999, border: 'none',
                background: billingPeriod === 'monthly' ? '#FFFFFF' : 'rgba(255,255,255,0.05)',
                color: billingPeriod === 'monthly' ? '#0F172A' : 'var(--text-muted)',
                fontWeight: billingPeriod === 'monthly' ? 800 : 500,
                fontSize: 15, cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: billingPeriod === 'monthly' ? '0 4px 20px rgba(255,255,255,0.15)' : 'none',
              }}
            >
              Hàng tháng
            </button>

            {/* Năm */}
            <button
              onClick={() => setBillingPeriod('anniversary')}
              style={{
                flex: 1, height: 48, padding: '0 28px', borderRadius: 999, border: 'none',
                background: billingPeriod === 'anniversary' ? '#00D4B4' : 'rgba(255,255,255,0.05)',
                color: billingPeriod === 'anniversary' ? '#000000' : 'var(--text-muted)',
                fontWeight: billingPeriod === 'anniversary' ? 800 : 500,
                fontSize: 15, cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: billingPeriod === 'anniversary' ? '0 4px 20px rgba(0,212,180,0.3)' : 'none',
              }}
            >
              Hàng năm
              <span style={{
                background: billingPeriod === 'anniversary' ? 'rgba(0,0,0,0.2)' : 'rgba(0,212,180,0.15)',
                color: billingPeriod === 'anniversary' ? '#000' : '#00D4B4',
                fontSize: 11, fontWeight: 900, fontFamily: '"DM Mono"',
                padding: '2px 8px', borderRadius: 999,
              }}>-20%</span>
            </button>
          </div>
        </div>

          <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '20px',
          maxWidth: 1000,
          margin: '48px auto 0',
          alignItems: 'start',
        }} className="pricing-grid">

          {/* ?? FREE ?? */}
          <div style={{
            background: 'rgba(255,255,255,0.01)',
            border: '1px solid var(--border)',
            borderRadius: 24, padding: '40px',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            boxShadow: 'inset 0 0 20px var(--bg-surface)'
          }} className="animate-target stagger-1 hover:border-white/20 hover:bg-white/[0.02]">
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 12 }}>Free</div>
            <div style={{
              fontFamily: '"Be Vietnam Pro"', fontWeight: 800,
              fontSize: 44, color: '#FFFFFF', lineHeight: 1, marginBottom: 6,
            }}>$0</div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 8 }}>Mới mới miễn phí</div>
            <div style={{ fontSize: 13, color: '#475569', marginBottom: 28,
              padding: '6px 10px', background: 'var(--bg-surface)',
              borderRadius: 6, display: 'inline-block',
            }}>Miễn phí 100%</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 13, marginBottom: 28 }}>
              {[
                { t: 'Khóa học "Nền tảng số" đầy đủ', ok: true },
                { t: 'AI Tutor: 20 tin nhắn / ngày', ok: true },
                { t: 'Lab Simulator: 1h / ngày', ok: true },
                { t: 'Cộng đồng Discord', ok: true },
                { t: 'Chứng chỉ hoàn thành', ok: false },
                { t: 'Toàn bộ 6 khóa học', ok: false },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{
                    flexShrink: 0, width: 18, height: 18, borderRadius: '50%', marginTop: 1,
                    background: item.ok ? 'rgba(0,212,180,0.15)' : 'rgba(255,255,255,0.04)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, color: item.ok ? '#00D4B4' : '#374151', fontWeight: 700,
                  }}>
                    {item.ok ? '✓' : ''}
                  </span>
                  <span style={{
                    fontSize: 14, fontWeight: 500,
                    color: item.ok ? 'var(--text-secondary)' : '#374151',
                    lineHeight: 1.4,
                  }}>{item.t}</span>
                </div>
              ))}
            </div>
            <a href="/register" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '100%', height: 48, borderRadius: 10,
              background: 'transparent', border: '1px solid rgba(255,255,255,0.15)',
              color: '#E2E8F0', fontSize: 15, fontWeight: 600, textDecoration: 'none',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(0,212,180,0.4)'}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.15)'}
            >
              Bắt đầu miễn phí
            </a>
          </div>

          {/* ?? PRO (highlighted) ?? */}
          <div style={{
            background: 'rgba(0,212,180,0.02)',
            border: '2px solid #00D4B4',
            borderRadius: 24, padding: '40px',
            boxShadow: '0 20px 80px -20px rgba(0,212,180,0.15), inset 0 0 30px rgba(0,212,180,0.05)',
            position: 'relative',
            backdropFilter: 'blur(20px)',
            transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          }} className="animate-target stagger-2 hover:-translate-y-2 hover:shadow-[0_40px_100px_-20px_rgba(0,212,180,0.25)]">
            <div style={{
              position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
              background: '#00D4B4', color: '#000', fontSize: 11, fontWeight: 800,
              padding: '5px 16px', borderRadius: 999, whiteSpace: 'nowrap',
              letterSpacing: '0.05em',
            }}>PHỔ BIẾN NHẤT</div>

            <div style={{ fontSize: 15, fontWeight: 600, color: '#00D4B4', marginBottom: 12, marginTop: 8 }}>Pro</div>
            <div style={{
              fontFamily: '"Be Vietnam Pro"', fontWeight: 800,
              fontSize: 44, color: '#FFFFFF', lineHeight: 1, marginBottom: 4,
            }}>{billingPeriod === 'monthly' ? '$29' : '$23'}</div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 4 }}>/ tháng</div>
            <div style={{
              fontSize: 13, color: 'var(--text-muted)', marginBottom: 28,
              padding: '6px 10px', background: 'rgba(0,212,180,0.08)',
              border: '1px solid rgba(0,212,180,0.15)', borderRadius: 6, display: 'inline-block',
            }}>{billingPeriod === 'monthly' ? '≈ 736,000' : '≈ 580,000'} / tháng</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 13, marginBottom: 28 }}>
              {[
                'Toàn bộ 6 khóa học',
                'AI Tutor không giới hạn',
                'Lab Simulator: 50h / tháng',
                'Chứng chỉ hoàn thành',
                'Ưu tiên hỗ trợ 24/7',
                'Truy cập vĩnh viễn',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{
                    flexShrink: 0, width: 18, height: 18, borderRadius: '50%', marginTop: 1,
                    background: 'rgba(0,212,180,0.2)', border: '1px solid rgba(0,212,180,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, color: '#00D4B4', fontWeight: 700,
                  }}>✓</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#C8D0DC', lineHeight: 1.4 }}>{item}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setPaymentModal({ open: true, plan: 'pro', cycle: billingPeriod === 'monthly' ? 'monthly' : 'annual' })}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '100%', height: 52, borderRadius: 10,
                background: '#00D4B4', color: '#000000', fontSize: 15, fontWeight: 700,
                textDecoration: 'none', transition: 'background 0.15s',
                animation: 'glowPulse 2.5s ease-in-out infinite',
                border: 'none', cursor: 'pointer',
              }}>
              Bắt đầu Pro →
            </button>
          </div>

          {/* ?? ENTERPRISE ?? */}
          <div style={{
            background: 'rgba(255,255,255,0.01)',
            border: '1px solid var(--border)',
            borderRadius: 24, padding: '40px',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            boxShadow: 'inset 0 0 20px var(--bg-surface)'
          }} className="animate-target stagger-3 hover:border-white/20 hover:bg-white/[0.02]">
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 12 }}>Enterprise</div>
            <div style={{
              fontFamily: '"Be Vietnam Pro"', fontWeight: 800,
              fontSize: 36, color: '#FFFFFF', lineHeight: 1.1, marginBottom: 4,
            }}>Liên hệ</div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.5 }}>
              Cho doanh nghiệp<br />& trường đại học
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 13, marginBottom: 28 }}>
              {[
                'Tất cả tính năng Pro',
                'Team management',
                'SSO / SAML',
                'Nội dung custom',
                'SLA 99.9% uptime',
                'Báo cáo tiến độ nhân sự',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{
                    flexShrink: 0, width: 18, height: 18, borderRadius: '50%', marginTop: 1,
                    background: 'rgba(0,212,180,0.1)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, color: '#00D4B4', fontWeight: 700,
                  }}>✓</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{item}</span>
                </div>
              ))}
            </div>
            <a href="/contact" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '100%', height: 48, borderRadius: 10,
              background: 'transparent', border: '1px solid rgba(255,255,255,0.15)',
              color: '#E2E8F0', fontSize: 15, fontWeight: 600, textDecoration: 'none',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(0,212,180,0.4)'}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.15)'}
            >
              Liên hệ ngay
            </a>
          </div>
        </div>
      </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" style={{ padding: '160px 0', position: 'relative', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 40px', textAlign: 'center' }}>
          <div className="flex flex-col items-center mb-16 animate-target">
            <div style={{ 
              fontSize: 12, fontWeight: 800, color: '#8B5CF6', 
              letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 24,
              fontFamily: '"DM Mono"'
            }}>Cảm nhận học viên</div>
            <h2 style={{ 
              fontSize: 'clamp(40px, 6vw, 72px)', 
              fontWeight: 900, color: '#FFFFFF',
              lineHeight: 1.1, letterSpacing: '-0.04em',
              marginBottom: 24, maxWidth: 900, margin: '0 auto'
            }}>Câu chuyện thành công</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '20px',
            marginTop: '56px',
          }} className="testimonials-grid">
            {[
              {
                initials: 'NT', color: '#00D4B4', bgColor: 'rgba(0,212,180,0.12)',
                name: 'Nguyễn Minh Tuấn',
                role: 'Kỹ sư RTL @ Intel Vietnam',
                quote: 'Sau 3 tháng học ChipCraft, tôi pass vòng technical interview tại Intel. AI Tutor giúp tôi hiểu timing constraint nhanh gấp 10 lần đọc sách.',
              },
              {
                initials: 'LH', color: '#3B82F6', bgColor: 'rgba(59,130,246,0.12)',
                name: 'Lê Thị Hằng',
                role: 'SV năm 4  ĐH Bách Khoa HCM',
                quote: 'Virtual Lab cho tôi synthesis ngay trên browser không cần xin license EDA từ trường. Cực kỳ tiện lợi và tiết kiệm thời gian.',
              },
              {
                initials: 'PA', color: '#8B5CF6', bgColor: 'rgba(139,92,246,0.12)',
                name: 'Phạm Đức Anh',
                role: 'Verification Engineer @ Marvell',
                quote: 'Khóa SystemVerilog Verification rất practical. Tất cả code examples đều là real-world patterns từ dự án thực tế.',
              },
            ].map((t, i) => (
              <div key={i} className={`animate-target stagger-${i + 1} group`} style={{
                background: 'rgba(255,255,255,0.01)',
                border: '1px solid var(--border)',
                borderRadius: 24, padding: '32px',
                position: 'relative', overflow: 'hidden',
                transition: 'all 0.4s ease',
                backdropFilter: 'blur(10px)',
                boxShadow: 'inset 0 0 20px var(--bg-surface)'
              }}>
                <div className="absolute top-0 left-0 w-2 h-full transition-all group-hover:w-full opacity-0 group-hover:opacity-[0.02]" 
                     style={{ background: t.color }} />
                <div style={{
                  position: 'absolute', top: 12, right: 20,
                  fontFamily: '"Be Vietnam Pro"', fontWeight: 800,
                  fontSize: 72, color: 'rgba(0,212,180,0.07)',
                  lineHeight: 1, userSelect: 'none', zIndex: 0
                }}>&quot;</div>

                <div style={{ color: '#F59E0B', fontSize: 16, marginBottom: 16, letterSpacing: 2 }}>★★★★★</div>

                <p style={{
                  fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7,
                  marginBottom: 24, fontStyle: 'italic',
                  position: 'relative', zIndex: 1,
                }}>
                  &quot;{t.quote}&quot;
                </p>

                <div style={{ height: 1, background: 'var(--border)', marginBottom: 20 }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 44, height: 44,
                    borderRadius: '50%',
                    background: t.bgColor,
                    border: `2px solid ${t.color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <span style={{
                      fontFamily: '"DM Mono"', fontWeight: 600,
                      fontSize: 14, color: t.color,
                    }}>
                      {t.initials}
                    </span>
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#E2E8F0', marginBottom: 3 }}>{t.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer  Fix 6: 4 columns 1 row */}
      <footer style={{
        background: 'rgba(0,0,0,0.4)',
        borderTop: '1px solid var(--border)',
        padding: '72px 0 32px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: '48px',
            paddingBottom: '48px',
            borderBottom: '1px solid var(--border)',
            marginBottom: '32px',
          }} className="footer-grid">
            
            {/* Col 1: Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 8,
                  background: 'rgba(0,212,180,0.15)', border: '1px solid rgba(0,212,180,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <CircuitBoard size={18} color="#00D4B4" />
                </div>
                <span style={{ fontFamily: '"DM Mono"', fontWeight: 600, fontSize: 17, color: '#E2E8F0' }}>ChipCraft</span>
              </div>
              <p style={{ marginTop: 20, color: 'rgba(148,163,184,0.6)', fontSize: 15, lineHeight: 1.7, maxWidth: 560, margin: '20px auto 0' }}>
            Nền tảng đào tạo AI-Native tiên phong, kết nối lộ trình học thuật với môi trường mô phỏng công nghiệp.
          </p>
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  { label: 'GH', href: 'https://github.com' },
                  { label: 'LI', href: 'https://linkedin.com' },
                  { label: 'TW', href: 'https://twitter.com' },
                ].map((s, i) => (
                  <a key={i} href={s.href}
                    style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--text-muted)', textDecoration: 'none', fontSize: 11,
                      fontFamily: '"DM Mono"', fontWeight: 600, transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLAnchorElement
                      el.style.borderColor = 'rgba(0,212,180,0.4)'
                      el.style.color = '#00D4B4'
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLAnchorElement
                      el.style.borderColor = 'var(--border)'
                      el.style.color = 'var(--text-muted)'
                    }}
                  >{s.label}</a>
                ))}
              </div>
            </div>

            {/* Col 2: Kha h?c */}
            <div>
              <div style={{ fontFamily: '"DM Mono"', fontSize: 12, fontWeight: 700, color: '#E2E8F0', letterSpacing: '0.08em', marginBottom: 20 }}>
                KHÓA HỌC
              </div>
              {['Nền tảng số', 'RTL Verilog', 'ASIC Flow', 'Verification', 'AI Chip', 'FPGA'].map(link => (
                <a key={link} href="#" style={{ display: 'block', fontSize: 14, color: '#475569', textDecoration: 'none', marginBottom: 12, transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#475569')}
                >{link}</a>
              ))}
            </div>

            {/* Col 3: Cng ty */}
            <div>
              <div style={{ fontFamily: '"DM Mono"', fontSize: 12, fontWeight: 700, color: '#E2E8F0', letterSpacing: '0.08em', marginBottom: 20 }}>
                CÔNG TY
              </div>
              {['Về chúng tôi', 'Blog', 'Careers', 'Sự kiện'].map(link => (
                <a key={link} href="#" style={{ display: 'block', fontSize: 14, color: '#475569', textDecoration: 'none', marginBottom: 12, transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#475569')}
                >{link}</a>
              ))}
            </div>

            {/* Col 4: H? tr? */}
            <div>
              <div style={{ fontFamily: '"DM Mono"', fontSize: 12, fontWeight: 700, color: '#E2E8F0', letterSpacing: '0.08em', marginBottom: 20 }}>
                HỖ TRỢ
              </div>
              {['Tài liệu', 'Discord', 'Liên hệ', 'Status'].map(link => (
                <a key={link} href="#" style={{ display: 'block', fontSize: 14, color: '#475569', textDecoration: 'none', marginBottom: 12, transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#475569')}
                >{link}</a>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, paddingTop: 32 }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
               2025 ChipCraft  <Link href="/privacy" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color = '#00D4B4'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>Chính sách bảo mật</Link>  <Link href="/terms" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color = '#00D4B4'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>Điều khoản dịch vụ</Link>  Made in Vietnam 🇻🇳
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00D4B4', boxShadow: '0 0 8px rgba(0,212,180,0.4)', animation: 'pulse 2s infinite' }} />
              <span style={{ fontFamily: '"DM Mono"', fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.06em', fontWeight: 600 }}>
                ALL SYSTEMS OPERATIONAL
              </span>
            </div>
          </div>
        </div>
      </footer>

      <PaymentModal
        isOpen={paymentModal.open}
        onClose={() => setPaymentModal(p => ({ ...p, open: false }))}
        plan={paymentModal.plan}
        billingCycle={paymentModal.cycle}
      />
    </div>
  )
}


