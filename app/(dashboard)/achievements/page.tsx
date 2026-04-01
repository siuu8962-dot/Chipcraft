// app/(dashboard)/achievements/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { 
  Trophy, 
  Target, 
  Flame, 
  Star, 
  Medal, 
  Award,
  Zap,
  TrendingUp,
  ChevronRight,
  Search,
  BookOpen,
  Cpu,
  Code2,
  Clock,
  Lock,
  Loader2
} from 'lucide-react'

// Define ICON_MAP to dynamically render icons from DB strings
const ICON_MAP: Record<string, any> = {
  Trophy,
  Target,
  Flame,
  Star,
  Medal,
  Award,
  Zap,
  TrendingUp,
  BookOpen,
  Cpu,
  Code2,
  Clock
}

const BADGE_COLORS: Record<string, { color: string; bg: string }> = {
  common: { color: '#94A3B8', bg: 'rgba(148, 163, 184, 0.1)' },
  rare: { color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)' },
  epic: { color: '#A855F7', bg: 'rgba(168, 85, 247, 0.1)' },
  legendary: { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' }
}

export default function AchievementsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function fetchAchievements() {
      try {
        const res = await fetch('/api/achievements')
        const json = await res.json()
        setData(json)
      } catch (err) {
        console.error('Failed to fetch achievements:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAchievements()
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', color: 'var(--text-muted)' }}>
        <Loader2 className="animate-spin" size={32} />
      </div>
    )
  }

  const stats = [
    { label: 'Tổng XP', value: data?.totalXP?.toLocaleString() || '0', icon: Star, color: '#F59E0B' },
    { label: 'Thứ hạng', value: '#1', icon: Trophy, color: '#8B5CF6' }, // Rank logic can be expanded
    { label: 'Chuỗi học', value: `${data?.streak || 0} ngày`, icon: Flame, color: '#EF4444' },
    { label: 'Cấp độ', value: data?.level || '1', icon: TrendingUp, color: '#06B6D4' }
  ]

  const categories = [
    { id: 'all', label: 'Tất cả' },
    { id: 'streak', label: 'Thử thách' },
    { id: 'level', label: 'Cấp độ' },
    { id: 'xp', label: 'Tích lũy' }
  ]

  const filteredBadges = data?.badges?.filter((b: any) => {
    const matchesSearch = b.name_vi.toLowerCase().includes(searchQuery.toLowerCase())
    if (activeTab === 'all') return matchesSearch
    return matchesSearch && b.slug.includes(activeTab)
  }) || []

  return (
    <div style={{ 
      padding: '32px', 
      maxWidth: 1200, 
      margin: '0 auto', 
      minHeight: '100vh', 
      backgroundColor: 'var(--bg-primary)',
      fontFamily: 'var(--font-be-vietnam), sans-serif'
    }}>
      
      {/* Header Section */}
      <div style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#8B5CF6', marginBottom: 8 }}>
            <Award size={18} />
            <span style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Thành tích cá nhân</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>Thành tích & Huy hiệu</h1>
        </div>
        
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Tìm tên huy hiệu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                height: 44, padding: '0 16px 0 40px', borderRadius: 12,
                background: 'var(--bg-surface)', border: '1px solid var(--border)',
                color: 'var(--text-primary)', fontSize: 14, width: 240,
                outline: 'none', transition: 'all 0.2s'
              }}
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 40 }}>
        {stats.map((stat, i) => (
          <div key={i} className="card-redesign" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ 
              width: 52, height: 52, borderRadius: 14, 
              background: `${stat.color}15`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: stat.color, flexShrink: 0
            }}>
              <stat.icon size={28} />
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>{stat.label}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Badges Section */}
      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
        
        {/* Left Sidebar Filters */}
        <div style={{ width: 200, flexShrink: 0, position: 'sticky', top: 32, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12, paddingLeft: 16 }}>Thể loại</div>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', borderRadius: 10, border: 'none',
                background: activeTab === cat.id ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                color: activeTab === cat.id ? '#8B5CF6' : 'var(--text-secondary)',
                fontSize: 14, fontWeight: 600, cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              {cat.label}
              {activeTab === cat.id && <ChevronRight size={16} />}
            </button>
          ))}
        </div>

        {/* Badges Grid */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {filteredBadges.map((badge: any, i: number) => {
              const theme = BADGE_COLORS[badge.rarity] || BADGE_COLORS.common
              const IconComp = ICON_MAP[badge.icon] || star
              const isLocked = !badge.earned

              return (
                <div 
                  key={badge.id} 
                  className="card-redesign"
                  style={{ 
                    padding: 24, 
                    position: 'relative',
                    overflow: 'hidden',
                    opacity: isLocked ? 0.6 : 1,
                    transition: 'all 0.3s'
                  }}
                >
                  {/* Lock Overlay for unearned badges */}
                  {isLocked && (
                    <div style={{
                      position: 'absolute', top: 12, right: 12,
                      width: 24, height: 24, borderRadius: '50%',
                      background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <Lock size={12} color="rgba(255,255,255,0.5)" />
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                    <div style={{ 
                      width: 52, height: 52, borderRadius: 12, 
                      background: isLocked ? 'rgba(255,255,255,0.05)' : theme.bg, 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      color: isLocked ? '#475569' : theme.color
                    }}>
                      <IconComp size={28} />
                    </div>
                    <div style={{ 
                      padding: '4px 10px', borderRadius: 20, 
                      background: 'rgba(124, 58, 237, 0.08)', color: '#8B5CF6',
                      fontSize: 11, fontWeight: 700, fontFamily: '"DM Mono"'
                    }}>
                      +{badge.xp_reward} XP
                    </div>
                  </div>
                  
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{badge.name_vi}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 24, minHeight: 40 }}>
                    {badge.description_vi}
                  </p>
                  
                  <div style={{ 
                    paddingTop: 16, borderTop: '1px solid var(--border)', 
                    display: 'flex', alignItems: 'center', gap: 8,
                    fontSize: 11, color: isLocked ? 'var(--text-muted)' : '#8B5CF6', fontWeight: 600
                  }}>
                    {isLocked ? (
                      <>
                        <Clock size={12} />
                        Tiêu chí: {badge.condition_json?.type === 'level' ? `Đạt Level ${badge.condition_json.value}` : 'Xem mục tiêu'}
                      </>
                    ) : (
                      <>
                        <CheckCircle size={12} />
                        Đã mở khóa vào {new Date(badge.earned_at).toLocaleDateString('vi-VN')}
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {filteredBadges.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
              <Trophy size={48} strokeWidth={1} style={{ marginBottom: 16, opacity: 0.3 }} />
              <p>Không tìm thấy huy hiệu nào khớp với lựa chọn của bạn.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

function CheckCircle({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  )
}

const star = Star
