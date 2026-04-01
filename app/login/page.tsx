// app/login/page.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { GoogleSignInButton } from '@/components/auth/GoogleButton'
import { Eye, EyeSlash, CircuitBoard, Lightning, Trophy, Certificate, Users } from '@/lib/icons'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
    if (error) { setError('Email hoặc mật khẩu không đúng'); setLoading(false) }
    else router.push('/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-primary)' }}>

      {/* LEFT - Stats & Social Proof panel */}
      <div style={{
        width: '45%', minHeight: '100vh',
        background: 'linear-gradient(135deg, var(--bg-primary) 0%, #080810 100%)',
        borderRight: '1px solid var(--border)',
        padding: '60px 48px', position: 'relative', overflow: 'hidden',
      }} className="hidden lg:flex flex-col items-center justify-center">

        {/* Circuit background */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M0 30h20M40 30h20M30 0v20M30 40v20' fill='none' stroke='%2300D4B4' stroke-width='0.4' opacity='0.06'/%3E%3Ccircle cx='30' cy='30' r='2' fill='%2300D4B4' opacity='0.08'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }} />
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,212,180,0.10) 0%, transparent 70%)',
        }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 380, width: '100%' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 56 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'rgba(0,212,180,0.15)', border: '1px solid rgba(0,212,180,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CircuitBoard size={22} color="#00D4B4" />
            </div>
            <span style={{ fontFamily: '"DM Mono"', fontWeight: 600, fontSize: 20, color: '#E2E8F0' }}>ChipCraft</span>
          </div>

          {/* Quote */}
          <div style={{
            padding: '28px', borderRadius: 16,
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            marginBottom: 32, textAlign: 'left',
          }}>
            <div style={{ fontSize: 40, color: 'rgba(0,212,180,0.3)', fontFamily: '"Be Vietnam Pro"', fontWeight: 800, lineHeight: 1, marginBottom: 12 }}>"</div>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 20 }}>
              ChipCraft đã giúp tôi pass technical interview tại Intel chỉ sau 3 tháng. AI Tutor giải thích timing constraint tốt hơn cả giảng viên đại học.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'rgba(0,212,180,0.15)', border: '1.5px solid #00D4B4',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: '"DM Mono"', fontSize: 13, fontWeight: 600, color: '#00D4B4',
              }}>NT</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#E2E8F0' }}>Nguyễn Minh Tuấn</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Kỹ sư RTL @ Intel Vietnam</div>
              </div>
              <div style={{ marginLeft: 'auto', color: '#F59E0B', fontSize: 14 }}>★★★★★</div>
            </div>
          </div>

          {/* 4 stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { icon: <Users size={18} color="#00D4B4" />, value: '2,847', label: 'Học viên' },
              { icon: <Trophy size={18} color="#F59E0B" />, value: '4.9/5', label: 'Đánh giá' },
              { icon: <Lightning size={18} color="#F59E0B" />, value: '50+', label: 'Bài Lab' },
              { icon: <Certificate size={18} color="#8B5CF6" />, value: '6', label: 'Khóa học' },
            ].map((s, i) => (
              <div key={i} style={{
                padding: '16px', borderRadius: 12,
                background: 'var(--bg-surface)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                  background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{s.icon}</div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontFamily: '"Be Vietnam Pro"', fontWeight: 700, fontSize: 18, color: '#E2E8F0', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT - Form */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 40px', overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ marginBottom: 36 }}>
            <h1 style={{
              fontFamily: '"Be Vietnam Pro"', fontWeight: 800, fontSize: 32,
              color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: 10,
            }}>
              Chào mừng trở lại!
            </h1>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Đăng nhập để tiếp tục hành trình học tập của bạn.
            </p>
          </div>

          <GoogleSignInButton label="Đăng nhập với Google" />

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: 12, color: '#475569', fontFamily: '"DM Mono"', letterSpacing: '0.05em' }}>HOẶC</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Email</label>
              <input type="email" placeholder="name@company.com" value={form.email}
                onChange={e => setForm({...form, email: e.target.value})} required
                style={{
                  width: '100%', height: 52, borderRadius: 10,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
                  color: '#E2E8F0', fontSize: 15, padding: '0 16px',
                  outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s',
                }}
                onFocus={e => e.target.style.borderColor = '#00D4B4'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>Mật khẩu</label>
                <a href="/forgot-password" style={{ fontSize: 13, color: '#00D4B4', textDecoration: 'none' }}>Quên mật khẩu?</a>
              </div>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} placeholder="" value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})} required
                  style={{
                    width: '100%', height: 52, borderRadius: 10,
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
                    color: '#E2E8F0', fontSize: 15, padding: '0 48px 0 16px',
                    outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#00D4B4'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0, display: 'flex',
                }}>
                  {showPass ? <EyeSlash size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                padding: '12px 16px', borderRadius: 10,
                background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.25)',
                fontSize: 14, color: '#FF6B6B',
              }}>{error}</div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', height: 54, borderRadius: 12,
              background: loading ? 'rgba(0,212,180,0.5)' : '#00D4B4',
              color: '#000000', fontWeight: 700, fontSize: 16, border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s, transform 0.1s',
              boxShadow: loading ? 'none' : '0 0 0 0 rgba(0,212,180,0.4)',
              animation: loading ? 'none' : 'glowPulse 2.5s ease-in-out infinite',
            }}>
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>
 
          <p style={{ textAlign: 'center', fontSize: 14, color: '#475569', marginTop: 24 }}>
            Chưa có tài khoản?{' '}
            <Link href="/register" style={{ color: '#00D4B4', textDecoration: 'none', fontWeight: 600 }}>Đăng ký ngay</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
