'use client'
import { useState } from 'react'
import { X, QrCode, CreditCard, CheckCircle, ShieldCheck } from '@phosphor-icons/react'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  plan: 'pro' | 'enterprise'
  billingCycle: 'monthly' | 'annual'
}

export function PaymentModal({ isOpen, onClose, plan, billingCycle }: PaymentModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [payMethod, setPayMethod] = useState<'qr' | 'card'>('qr')
  const [selectedCycle, setSelectedCycle] = useState<'monthly' | 'annual' | 'lifetime'>(billingCycle as any)
  const [contact, setContact] = useState('')
  const [contactType, setContactType] = useState<'phone' | 'email'>('phone')

  const cycleOptions = [
    { key: 'monthly', label: 'Pro Tháng', price: '736k', tag: null },
    { key: 'annual', label: 'Pro Năm', price: '5.5tr', tag: '★ -20%' },
    { key: 'lifetime', label: 'Trọn đời', price: '9.9tr', tag: '🔥 Best' },
  ]

  const currentPrice = selectedCycle === 'monthly' ? '736,000đ' : selectedCycle === 'annual' ? '5,520,000đ' : '9,900,000đ'
  const currentLabel = selectedCycle === 'monthly' ? 'Pro Hàng tháng' : selectedCycle === 'annual' ? 'Pro Hàng năm' : 'Pro Trọn đời'

  if (!isOpen) return null

  return (
    <>
      <style>{`
        @keyframes modal-slide-in {
          from { opacity: 0; transform: translate(-50%, -54%) scale(0.96); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        .payment-modal-inner { animation: modal-slide-in 0.3s cubic-bezier(0.22,1,0.36,1) forwards; }
        .pay-input:focus { border-color: rgba(0,212,180,0.6) !important; box-shadow: 0 0 0 3px rgba(0,212,180,0.12) !important; }
      `}</style>

      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(16px)',
        }}
      />

      {/* Modal */}
      <div className="payment-modal-inner" style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1001, width: '100%', maxWidth: 500,
        background: 'rgba(8, 10, 20, 0.95)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 28,
        boxShadow: '0 40px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(0,212,180,0.06)',
        overflow: 'hidden',
        maxHeight: '92vh', overflowY: 'auto',
      }}>

        {/* Top gradient accent line */}
        <div style={{
          height: 2,
          background: 'linear-gradient(to right, transparent, #00D4B4, #3B82F6, transparent)',
        }} />

        {/* Header */}
        <div style={{ padding: '24px 28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: 'rgba(0,212,180,0.08)', border: '1px solid rgba(0,212,180,0.25)',
              borderRadius: 999, padding: '4px 14px', marginBottom: 14,
            }}>
              <span style={{ fontSize: 13 }}>⚡</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#00D4B4', fontFamily: '"DM Mono"', letterSpacing: '0.05em' }}>
                {currentLabel} — {currentPrice}
              </span>
            </div>
            <h2 style={{ fontSize: 26, fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.03em' }}>
              Nâng cấp ChipCraft{' '}
              <span style={{
                background: 'linear-gradient(to right, #00D4B4, #3B82F6)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>Pro</span>
            </h2>
          </div>
          <button onClick={onClose} style={{
            width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.05)', cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center', color: '#64748B', flexShrink: 0,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = '#E2E8F0' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#64748B' }}
          >
            <X size={18} weight="bold" />
          </button>
        </div>

        <div style={{ padding: '20px 28px 40px' }}>

          {/* Plan selector */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20,
            background: 'rgba(255,255,255,0.03)', borderRadius: 18, padding: 6,
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            {cycleOptions.map(opt => (
              <button key={opt.key}
                onClick={() => setSelectedCycle(opt.key as any)}
                style={{
                  padding: '12px 4px', borderRadius: 13, border: '1px solid',
                  borderColor: selectedCycle === opt.key ? 'rgba(0,212,180,0.4)' : 'transparent',
                  background: selectedCycle === opt.key ? 'rgba(0,212,180,0.1)' : 'transparent',
                  color: selectedCycle === opt.key ? '#00D4B4' : '#64748B',
                  cursor: 'pointer', transition: 'all 0.25s ease',
                  fontWeight: selectedCycle === opt.key ? 800 : 600, fontSize: 13,
                }}
              >
                <div>{opt.label}</div>
                <div style={{ fontSize: 15, fontWeight: 900, color: selectedCycle === opt.key ? '#FFFFFF' : '#94A3B8', marginTop: 3, fontFamily: '"DM Mono"' }}>
                  {opt.price}
                </div>
                {opt.tag && (
                  <div style={{ fontSize: 10, marginTop: 4, color: selectedCycle === opt.key ? '#00D4B4' : '#475569', fontWeight: 700 }}>
                    {opt.tag}
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Payment method tabs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
            {[
              { key: 'qr', icon: <QrCode size={17} />, label: 'QR Ngân hàng' },
              { key: 'card', icon: <CreditCard size={17} />, label: 'Thẻ quốc tế' },
            ].map(m => (
              <button key={m.key}
                onClick={() => setPayMethod(m.key as any)}
                style={{
                  padding: '14px 16px', borderRadius: 14, border: '1px solid',
                  borderColor: payMethod === m.key ? 'rgba(0,212,180,0.4)' : 'rgba(255,255,255,0.07)',
                  background: payMethod === m.key ? 'rgba(0,212,180,0.08)' : 'rgba(255,255,255,0.02)',
                  color: payMethod === m.key ? '#00D4B4' : '#64748B',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                  fontWeight: 700, fontSize: 14, transition: 'all 0.2s',
                }}
              >
                {m.icon} {m.label}
              </button>
            ))}
          </div>

          {/* Step progress */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 28 }}>
            {[{ n: 1, label: 'Thông tin' }, { n: 2, label: payMethod === 'qr' ? 'Quét QR' : 'Thanh toán' }, { n: 3, label: 'Hoàn tất' }].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%',
                    background: step >= s.n ? 'linear-gradient(135deg, #00D4B4, #3B82F6)' : 'rgba(255,255,255,0.05)',
                    color: step >= s.n ? '#FFFFFF' : '#475569',
                    border: step >= s.n ? 'none' : '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 800, transition: 'all 0.3s',
                    boxShadow: step >= s.n ? '0 0 16px rgba(0,212,180,0.3)' : 'none',
                  }}>
                    {step > s.n ? <CheckCircle size={16} weight="fill" /> : s.n}
                  </div>
                  <span style={{ fontSize: 10.5, color: step >= s.n ? '#00D4B4' : '#475569', fontWeight: 700, letterSpacing: '0.03em' }}>
                    {s.label}
                  </span>
                </div>
                {i < 2 && <div style={{ width: 44, height: 1.5, background: step > s.n ? 'linear-gradient(to right, #00D4B4, #3B82F6)' : 'rgba(255,255,255,0.07)', marginBottom: 16, borderRadius: 9 }} />}
              </div>
            ))}
          </div>

          {/* ── Step 1 ── */}
          {step === 1 && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <label style={{ fontSize: 14, fontWeight: 700, color: '#E2E8F0' }}>
                    Nhập SĐT hoặc email:
                  </label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[{ k: 'phone', l: '📱 SĐT' }, { k: 'email', l: '✉ Email' }].map(t => (
                      <button key={t.k}
                        onClick={() => setContactType(t.k as any)}
                        style={{
                          padding: '5px 12px', borderRadius: 9, border: '1px solid',
                          borderColor: contactType === t.k ? 'rgba(0,212,180,0.4)' : 'rgba(255,255,255,0.08)',
                          background: contactType === t.k ? 'rgba(0,212,180,0.1)' : 'transparent',
                          color: contactType === t.k ? '#00D4B4' : '#64748B',
                          fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                        }}
                      >{t.l}</button>
                    ))}
                  </div>
                </div>
                <input
                  className="pay-input"
                  type={contactType === 'phone' ? 'tel' : 'email'}
                  placeholder={contactType === 'phone' ? 'Ví dụ: 0987-XXX-XXX' : 'your@email.com'}
                  value={contact}
                  onChange={e => setContact(e.target.value)}
                  style={{
                    width: '100%', height: 52, borderRadius: 13,
                    border: '1px solid rgba(255,255,255,0.1)', padding: '0 18px',
                    fontSize: 15, color: '#E2E8F0', outline: 'none',
                    boxSizing: 'border-box', transition: 'all 0.2s',
                    background: 'rgba(255,255,255,0.04)',
                  }}
                />
                <p style={{ fontSize: 12.5, color: '#475569', marginTop: 10, lineHeight: 1.5, display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                  <span style={{ color: '#00D4B4', fontWeight: 700, flexShrink: 0 }}>●</span>
                  Đây là thông tin để kích hoạt tài khoản sau khi thanh toán.
                </p>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!contact}
                style={{
                  width: '100%', height: 52, borderRadius: 14,
                  background: contact
                    ? 'linear-gradient(135deg, #00D4B4, #3B82F6)'
                    : 'rgba(255,255,255,0.05)',
                  color: contact ? '#000000' : '#475569',
                  fontWeight: 900, fontSize: 15, border: 'none',
                  cursor: contact ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  transition: 'all 0.3s',
                  boxShadow: contact ? '0 8px 28px rgba(0,212,180,0.25)' : 'none',
                }}
              >
                {payMethod === 'qr' ? <QrCode size={19} /> : <CreditCard size={19} />}
                {payMethod === 'qr' ? 'Xem mã QR thanh toán' : 'Tiếp tục thanh toán'}
              </button>
            </div>
          )}

          {/* ── Step 2 QR ── */}
          {step === 2 && payMethod === 'qr' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 210, height: 210, margin: '0 auto 20px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(0,212,180,0.2)',
                borderRadius: 22,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', gap: 12,
                boxShadow: '0 0 40px rgba(0,212,180,0.08)',
              }}>
                <QrCode size={110} color="#00D4B4" />
                <div style={{ fontSize: 12, color: '#475569', fontFamily: '"DM Mono"', letterSpacing: '0.05em' }}>SCAN TO PAY</div>
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#E2E8F0', marginBottom: 4 }}>
                Chấp nhận mọi Ngân hàng 🇻🇳
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, marginBottom: 16, fontFamily: '"DM Mono"',
                background: 'linear-gradient(to right, #00D4B4, #3B82F6)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>{currentPrice}</div>
              <div style={{ fontSize: 13, color: '#475569', marginBottom: 24, lineHeight: 1.6 }}>
                Vui lòng không thay đổi nội dung chuyển khoản.<br/>
                Hệ thống tự động kích hoạt sau 1-3 phút.
              </div>
              <button
                onClick={() => setStep(3)}
                style={{
                  width: '100%', height: 52, borderRadius: 14, border: 'none',
                  background: 'linear-gradient(135deg, #00D4B4, #3B82F6)',
                  color: '#000000', fontWeight: 900, fontSize: 15,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  boxShadow: '0 8px 28px rgba(0,212,180,0.25)',
                }}
              >
                <CheckCircle size={20} weight="fill" /> Tôi đã thanh toán xong
              </button>
            </div>
          )}

          {/* ── Step 2 Card ── */}
          {step === 2 && payMethod === 'card' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                padding: '28px 24px', background: 'rgba(255,255,255,0.03)',
                borderRadius: 18, marginBottom: 20,
                border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🌍</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#E2E8F0', marginBottom: 6 }}>
                  Thanh toán Thẻ quốc tế
                </div>
                <div style={{ fontSize: 13, color: '#64748B', marginBottom: 6 }}>
                  Visa / Mastercard / JCB / Apple Pay
                </div>
                <div style={{ fontSize: 12, color: '#475569' }}>
                  Xử lý bởi <strong style={{ color: '#6366F1' }}>Stripe</strong> — SSL 256-bit
                </div>
              </div>
              <div style={{
                padding: '14px 16px', borderRadius: 12,
                background: 'rgba(0,212,180,0.07)', border: '1px solid rgba(0,212,180,0.2)',
                marginBottom: 20, textAlign: 'left',
              }}>
                <div style={{ fontSize: 13, color: '#00D4B4', display: 'flex', gap: 8, lineHeight: 1.5, fontWeight: 600 }}>
                  <CheckCircle size={16} weight="fill" style={{ flexShrink: 0, marginTop: 1 }} />
                  Kích hoạt tức thì sau khi thanh toán thành công.
                </div>
              </div>
              <button
                onClick={() => { window.open('https://buy.stripe.com/test_eVaeXD1X37Z5g4U288', '_blank'); setStep(3) }}
                style={{
                  width: '100%', height: 52, borderRadius: 14, border: 'none',
                  background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                  color: '#FFFFFF', fontWeight: 900, fontSize: 15,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  boxShadow: '0 8px 28px rgba(99,102,241,0.3)',
                }}
              >
                <CreditCard size={19} /> Thanh toán qua Stripe →
              </button>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 14 }}>
                <ShieldCheck size={15} color="#475569" />
                <span style={{ fontSize: 12, color: '#475569' }}>Bảo mật tuyệt đối · Hoàn tiền 7 ngày</span>
              </div>
            </div>
          )}

          {/* ── Step 3 Success ── */}
          {step === 3 && (
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <div style={{
                width: 80, height: 80,
                background: 'linear-gradient(135deg, rgba(0,212,180,0.15), rgba(59,130,246,0.15))',
                border: '1px solid rgba(0,212,180,0.3)',
                borderRadius: '50%', display: 'flex', alignItems: 'center',
                justifyContent: 'center', margin: '0 auto 24px', fontSize: 38,
                boxShadow: '0 0 30px rgba(0,212,180,0.15)',
              }}>🎉</div>
              <h3 style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', marginBottom: 12, letterSpacing: '-0.02em' }}>
                Đã gửi yêu cầu!
              </h3>
              <p style={{ fontSize: 15, color: '#64748B', lineHeight: 1.7, marginBottom: 24 }}>
                Tài khoản gắn với{' '}
                <strong style={{ color: '#00D4B4' }}>{contact}</strong>{' '}
                sẽ được nâng cấp Pro trong vòng 1–5 phút.
              </p>
              <div style={{
                padding: '18px 20px', borderRadius: 16,
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                marginBottom: 24, textAlign: 'left',
              }}>
                <div style={{ fontSize: 14, color: '#E2E8F0', fontWeight: 700, marginBottom: 10 }}>Tiếp theo:</div>
                {[
                  '1. Kiểm tra email/SĐT nhận thông báo kích hoạt',
                  '2. Đăng nhập vào ChipCraft',
                  '3. Bắt đầu khóa học đầu tiên! 🚀',
                ].map((s, i) => (
                  <div key={i} style={{ fontSize: 13.5, color: '#64748B', marginBottom: 7, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ color: '#00D4B4', fontWeight: 700, flexShrink: 0 }}>→</span> {s.slice(3)}
                  </div>
                ))}
              </div>
              <button onClick={onClose} style={{
                width: '100%', height: 52, borderRadius: 14, border: 'none',
                background: 'linear-gradient(135deg, #00D4B4, #3B82F6)',
                color: '#000000', fontWeight: 900, fontSize: 15,
                cursor: 'pointer', transition: 'transform 0.2s',
                boxShadow: '0 8px 28px rgba(0,212,180,0.25)',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                Vào Dashboard ngay thôi! →
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
