'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { 
  User, 
  Bell, 
  ShieldCheck, 
  CreditCard, 
  LogOut, 
  Camera, 
  Key,
  ChevronRight,
  Sparkles,
  Settings as SettingsIcon
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const supabase = createClient()

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
      setLoading(false)
    }
    loadProfile()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          bio: profile.bio,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id)
      
      if (error) throw error
      toast.success('? c?p nh?t h? s thnh cng!')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return null

  const inputStyle = {
    width: '100%', height: 44, borderRadius: 10,
    background: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)', fontSize: 14, padding: '0 14px',
    outline: 'none', transition: 'all 0.2s',
  }

  return (
    <div data-theme-area="main" style={{ padding: '32px', maxWidth: 1200, margin: '0 auto', backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
      
      {/* ?? HEADER ?? */}
      <div className="page-header" style={{ marginBottom: 32 }}>
        <p className="label-caps" style={{ color: '#7C3AED', marginBottom: 8 }}>
          C?u h?nh h? th?ng
        </p>
        <h1 style={{ fontSize: 32, margin: '0 0 12px', color: 'var(--text-primary)' }}>Ci ?t ti kho?n</h1>
        <p className="subtitle" style={{ margin: 0, color: 'var(--text-secondary)' }}>
          Qu?n l? thng tin c nhn v thi?t l?p ty ch?n h?c t?p c?a b?n.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 32, alignItems: 'start' }}>
        
        {/* ?? SETTINGS SIDEBAR ?? */}
        <aside className="animate-fade-up" style={{ animationDelay: '100ms', position: 'sticky', top: 80 }}>
          <div data-theme-area="card" className="card-redesign" style={{ padding: '8px', overflow: 'hidden', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
            {[
              { id: 'profile', label: 'H? s c nhn', icon: User },
              { id: 'notifications', label: 'Thng bo', icon: Bell },
              { id: 'security', label: 'B?o m?t', icon: ShieldCheck },
              { id: 'billing', label: 'Gi h?c t?p', icon: CreditCard },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px', borderRadius: 8, border: 'none',
                  background: activeTab === item.id ? 'rgba(124, 58, 237, 0.12)' : 'transparent',
                  color: activeTab === item.id ? '#A855F7' : 'var(--text-secondary)',
                  fontWeight: activeTab === item.id ? 600 : 500,
                  fontSize: 13.5, cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
            <div style={{ height: 1, background: 'var(--border)', margin: '8px 8px' }} />
            <button style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 16px', borderRadius: 8, border: 'none',
              background: 'transparent', color: '#EF4444',
              fontWeight: 500, fontSize: 13.5, cursor: 'pointer', textAlign: 'left',
            }} onClick={async () => {
              await supabase.auth.signOut()
              window.location.href = '/'
            }}>
              <LogOut size={16} /> ng xu?t
            </button>
          </div>
        </aside>

        {/* ?? CONTENT AREA ?? */}
        <main className="animate-fade-up" style={{ animationDelay: '200ms' }}>
          {activeTab === 'profile' && (
            <div data-theme-area="card" className="card-redesign" style={{ padding: '32px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
              <form onSubmit={handleSave}>
                {/* Avatar Section */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 40 }}>
                   <div style={{ position: 'relative' }}>
                      <div style={{
                        width: 80, height: 80, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 32, fontWeight: 800, color: '#000'
                      }}>
                        {(profile?.full_name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <button type="button" style={{
                         position: 'absolute', bottom: 0, right: 0,
                         width: 28, height: 28, borderRadius: '50%',
                         background: '#7C3AED', border: '3px solid var(--bg-tertiary)',
                         display: 'flex', alignItems: 'center', justifyContent: 'center',
                         color: 'var(--text-primary)', cursor: 'pointer', transition: 'transform 0.15s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        <Camera size={14} />
                      </button>
                   </div>
                    <div>
                      <h2 style={{ fontSize: 18, margin: '0 0 4px', color: 'var(--text-primary)' }}>?nh ?i di?n</h2>
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>H? tr? JPG, PNG. T?i a 2MB.</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                   <div>
                     <div className="label-caps" style={{ marginBottom: 8, color: 'var(--text-secondary)' }}>H? v tn</div>
                     <input
                       style={inputStyle}
                       value={profile?.full_name || ''}
                       onChange={e => setProfile({...profile, full_name: e.target.value})}
                       onFocus={(e) => { e.currentTarget.style.borderColor = '#7C3AED'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.12)' }}
                       onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}
                     />
                   </div>
                   <div>
                     <div className="label-caps" style={{ marginBottom: 8, color: 'var(--text-secondary)' }}>?a ch? Email</div>
                     <input
                       style={{...inputStyle, opacity: 0.5, cursor: 'not-allowed'}}
                       value={profile?.email || ''}
                       readOnly
                     />
                   </div>
                </div>

                <div style={{ marginBottom: 32 }}>
                  <div className="label-caps" style={{ marginBottom: 8 }}>Gi?i thi?u ng?n (Bio)</div>
                  <textarea
                    style={{...inputStyle, height: 100, padding: '12px 14px', resize: 'none'}}
                    value={profile?.bio || ''}
                    onChange={e => setProfile({...profile, bio: e.target.value})}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.12)' }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.boxShadow = 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                   <button 
                     type="submit" 
                     disabled={saving}
                     style={{
                        padding: '12px 32px', borderRadius: 10, border: 'none',
                        background: '#7C3AED', color: 'var(--text-primary)', fontWeight: 700, fontSize: 14,
                        cursor: 'pointer', transition: 'all 0.2s',
                        letterSpacing: '0.01em'
                     }}
                     onMouseEnter={(e) => { e.currentTarget.style.background = '#6D28D9'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                     onMouseLeave={(e) => { e.currentTarget.style.background = '#7C3AED'; e.currentTarget.style.transform = 'translateY(0)' }}
                   >
                     {saving ? 'ang lu...' : 'Lu thay ?i'}
                   </button>
                </div>
              </form>

              <div style={{ height: 1, background: 'var(--border)', margin: '40px 0' }} />

              {/* Danger Zone */}
              <div style={{
                background: 'rgba(239, 68, 68, 0.04)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: 14, padding: '24px'
              }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#EF4444', margin: '0 0 8px' }}>Vng nguy hi?m</h3>
                <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', margin: '0 0 20px', lineHeight: 1.6 }}>
                  Hnh ?ng ny s? xa v?nh vi?n ton b? d? li?u h?c t?p v XP c?a b?n. H?y cn nh?c k?.
                </p>
                <button style={{
                   padding: '10px 18px', borderRadius: 10,
                   background: 'transparent',
                   border: '1px solid #EF4444',
                   color: '#EF4444', fontWeight: 700, fontSize: 13,
                   cursor: 'pointer', transition: 'all 0.15s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  Xa ti kho?n v?nh vi?n
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}


