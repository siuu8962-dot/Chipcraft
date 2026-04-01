// app/register/page.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { GoogleSignInButton } from '@/components/auth/GoogleButton'
import { Eye, EyeSlash, CircuitBoard, CheckCircle, ArrowRight } from '@/lib/icons'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const passwordStrength = (p: string) => {
    if (!p) return { level: 0, label: '', color: '' }
    if (p.length < 6) return { level: 1, label: 'Yếu', color: '#FF6B6B' }
    if (p.length < 10 || !/[A-Z]/.test(p)) return { level: 2, label: 'Trung bình', color: '#F59E0B' }
    if (/[A-Z]/.test(p) && /[0-9]/.test(p) && p.length >= 10) return { level: 4, label: 'Rất mạnh', color: '#00D4B4' }
    return { level: 3, label: 'Mạnh', color: '#3B82F6' }
  }
  const strength = passwordStrength(form.password)
  const passwordsMatch = form.confirm && form.confirm === form.password

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) { setError('Mật khẩu không khớp'); return }
    setLoading(true); setError('')
    const { data, error } = await supabase.auth.signUp({
      email: form.email, password: form.password,
      options: { data: { full_name: form.name } }
    })
    
    if (error) { 
      setError(error.message)
      setLoading(false) 
    } else {
      // Nếu có session (nghĩa là auto-confirm đã bật) hoặc đăng ký thành công, 
      // chúng ta sẽ điều hướng thẳng vào dashboard. Sử dụng window.location.href
      // thay vì router.push để đảm bảo cookie phiên được gửi đầy đủ lên server.
      window.location.href = '/dashboard'
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'var(--bg-primary)',
    }}>
      {/* LEFT - Visual panel */}
      <div style={{
        width: '45%', minHeight: '100vh',
        background: 'linear-gradient(135deg, var(--bg-primary) 0%, #0a0a14 100%)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '60px 48px',
        position: 'relative', overflow: 'hidden',
      }} className="hidden lg:flex">
        {/* Circuit bg */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cpath d='M10 10h60M10 10v60M40 10v20M40 50v20M10 40h20M50 40h20' fill='none' stroke='%2300D4B4' stroke-width='0.4' opacity='0.07'/%3E%3Ccircle cx='10' cy='10' r='2' fill='%2300D4B4' opacity='0.1'/%3E%3Ccircle cx='40' cy='40' r='2' fill='%2300D4B4' opacity='0.1'/%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px',
        }} />
        {/* Aurora */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '40%',
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,212,180,0.12) 0%, transparent 70%)',
        }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 360 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 48 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'rgba(0,212,180,0.15)', border: '1px solid rgba(0,212,180,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CircuitBoard size={22} color="#00D4B4" />
            </div>
            <span style={{ fontFamily: '"DM Mono"', fontWeight: 600, fontSize: 20, color: '#E2E8F0' }}>ChipCraft</span>
          </div>

          {/* Learning path visual */}
          <h2 style={{ fontFamily: '"Be Vietnam Pro"', fontWeight: 700, fontSize: 28, color: '#E2E8F0', marginBottom: 12, letterSpacing: '-0.02em' }}>
            Lộ trình Silicon của bạn
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 40, lineHeight: 1.6 }}>
            Từ zero đến chip designer trong 18 tháng
          </p>

          {/* Path steps */}
          {[
            { step: '01', title: 'Nền tảng số & Logic', sub: 'Verilog, Boolean, FSM', color: '#00D4B4', done: true },
            { step: '02', title: 'RTL Design', sub: 'Flip-flop, Counter, Pipeline', color: '#3B82F6', done: false },
            { step: '03', title: 'ASIC Design Flow', sub: 'Synthesis, P&R, Timing', color: '#8B5CF6', done: false },
            { step: '04', title: 'AI Chip Architecture', sub: 'NPU, Systolic Array', color: '#F59E0B', done: false },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 16px', borderRadius: 12, marginBottom: 8,
              background: item.done ? 'rgba(0,212,180,0.06)' : 'var(--bg-surface)',
              border: `1px solid ${item.done ? 'rgba(0,212,180,0.2)' : 'rgba(255,255,255,0.05)'}`,
              textAlign: 'left',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: `${item.color}20`,
                border: `1.5px solid ${item.color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {item.done
                  ? <CheckCircle size={16} color={item.color} weight="fill" />
                  : <span style={{ fontFamily: '"DM Mono"', fontSize: 10, color: item.color, fontWeight: 600 }}>{item.step}</span>
                }
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: item.done ? '#E2E8F0' : 'var(--text-secondary)' }}>{item.title}</div>
                <div style={{ fontSize: 11, color: '#475569', marginTop: 1 }}>{item.sub}</div>
              </div>
              {item.done && (
                <div style={{ marginLeft: 'auto', fontSize: 10, color: '#00D4B4', fontFamily: '"DM Mono"', border: '1px solid rgba(0,212,180,0.3)', padding: '2px 8px', borderRadius: 20 }}>FREE</div>
              )}
            </div>
          ))}

          {/* Social proof */}
          <div style={{ marginTop: 32, padding: '16px', borderRadius: 12, background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: -6, marginBottom: 8 }}>
              {['NT', 'LH', 'PA', 'TK', 'BM'].map((init, i) => (
                <div key={i} style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: ['#00D4B4', '#3B82F6', '#8B5CF6', '#F59E0B', '#FF6B6B'][i],
                  border: '2px solid var(--bg-primary)',
                  marginLeft: i > 0 ? -8 : 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700, color: i < 2 ? '#000' : '#fff',
                  fontFamily: '"DM Mono"',
                }}>{init}</div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
              <span style={{ color: '#E2E8F0', fontWeight: 600 }}>2,847 kỹ sư</span> đã tham gia hôm nay
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT - Form panel */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 40px',
        overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {success ? (
            // Success state
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'rgba(0,212,180,0.15)', border: '2px solid #00D4B4',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
              }}>
                <CheckCircle size={32} color="#00D4B4" weight="fill" />
              </div>
              <h2 style={{ fontFamily: '"Be Vietnam Pro"', fontWeight: 700, fontSize: 24, color: '#E2E8F0', marginBottom: 12 }}>
                Kiểm tra email của bạn!
              </h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Chúng tôi đã gửi link xác nhận đến <strong style={{ color: 'var(--text-secondary)' }}>{form.email}</strong>. Nhấn link để kích hoạt tài khoản.
              </p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontFamily: '"Be Vietnam Pro"', fontWeight: 800, fontSize: 30, color: '#E2E8F0', letterSpacing: '-0.02em', marginBottom: 8 }}>
                  Bắt đầu học ngay!
                </h1>
                <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                  Tạo tài khoản miễn phí – không cần thẻ tín dụng.
                </p>
              </div>

              {/* Google button */}
              <GoogleSignInButton label="Đăng ký với Google" />

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                <span style={{ fontSize: 12, color: '#475569', fontFamily: '"DM Mono"' }}>HOẶC</span>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Full name */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Họ và tên</label>
                  <input
                    type="text" placeholder="Nguyễn Văn A"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                    style={{
                      width: '100%', height: 48, borderRadius: 10,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#E2E8F0', fontSize: 14, padding: '0 14px',
                      outline: 'none', boxSizing: 'border-box',
                      transition: 'border-color 0.15s',
                    }}
                    onFocus={e => (e.target.style.borderColor = '#00D4B4')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                  />
                </div>

                {/* Email */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Email</label>
                  <input
                    type="email" placeholder="name@company.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                    style={{
                      width: '100%', height: 48, borderRadius: 10,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#E2E8F0', fontSize: 14, padding: '0 14px',
                      outline: 'none', boxSizing: 'border-box',
                      transition: 'border-color 0.15s',
                    }}
                    onFocus={e => (e.target.style.borderColor = '#00D4B4')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                  />
                </div>

                {/* Password with strength */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Mật khẩu</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPass ? 'text' : 'password'}
                      placeholder="Tối thiểu 8 ký tự"
                      value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })}
                      required minLength={8}
                      style={{
                        width: '100%', height: 48, borderRadius: 10,
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#E2E8F0', fontSize: 14, padding: '0 44px 0 14px',
                        outline: 'none', boxSizing: 'border-box',
                        transition: 'border-color 0.15s',
                      }}
                      onFocus={e => (e.target.style.borderColor = '#00D4B4')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0, display: 'flex' }}>
                      {showPass ? <EyeSlash size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {/* Strength bar */}
                  {form.password && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} style={{
                            flex: 1, height: 3, borderRadius: 2,
                            background: i <= strength.level ? strength.color : 'var(--border)',
                            transition: 'background 0.2s',
                          }} />
                        ))}
                      </div>
                      <span style={{ fontSize: 11, color: strength.color, fontFamily: '"DM Mono"' }}>{strength.label}</span>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Xác nhận mật khẩu</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="password"
                      placeholder="Nhập lại mật khẩu"
                      value={form.confirm}
                      onChange={e => setForm({ ...form, confirm: e.target.value })}
                      required
                      style={{
                        width: '100%', height: 48, borderRadius: 10,
                        background: 'rgba(255,255,255,0.04)',
                        border: `1px solid ${form.confirm ? (passwordsMatch ? 'rgba(0,212,180,0.5)' : 'rgba(255,107,107,0.5)') : 'rgba(255,255,255,0.1)'}`,
                        color: '#E2E8F0', fontSize: 14, padding: '0 44px 0 14px',
                        outline: 'none', boxSizing: 'border-box',
                      }}
                    />
                    {form.confirm && (
                      <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)' }}>
                        {passwordsMatch
                          ? <CheckCircle size={18} color="#00D4B4" weight="fill" />
                          : <span style={{ color: '#FF6B6B', fontSize: 16 }}>★</span>
                        }
                      </div>
                    )}
                  </div>
                </div>

                {error && (
                  <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)', fontSize: 13, color: '#FF6B6B' }}>
                    {error}
                  </div>
                )}

                <button type="submit" disabled={loading}
                  style={{
                    width: '100%', height: 52, borderRadius: 12,
                    background: loading ? 'rgba(0,212,180,0.5)' : '#00D4B4',
                    color: '#000', fontWeight: 700, fontSize: 15, border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    marginTop: 4,
                    transition: 'background 0.15s',
                  }}
                >
                  {loading ? 'Đang tạo tài khoản...' : <>Tạo tài khoản <ArrowRight size={18} weight="bold" /></>}
                </button>
              </form>

              <p style={{ textAlign: 'center', fontSize: 13, color: '#475569', marginTop: 20 }}>
                Đã có tài khoản?{' '}
                <Link href="/login" style={{ color: '#00D4B4', textDecoration: 'none', fontWeight: 500 }}>Đăng nhập</Link>
              </p>

              <p style={{ textAlign: 'center', fontSize: 11, color: '#374151', marginTop: 16, lineHeight: 1.5 }}>
                Bằng cách đăng ký, bạn đồng ý với{' '}
                <Link href="/terms" style={{ color: '#4B5563', textDecoration: 'underline' }}>Điều khoản dịch vụ</Link>{' '}
                và{' '}
                <Link href="/privacy" style={{ color: '#4B5563', textDecoration: 'underline' }}>Chính sách bảo mật</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
