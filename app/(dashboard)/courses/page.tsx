'use client'
import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { 
  BookOpen, 
  Star, 
  Clock, 
  GraduationCap, 
  Search, 
  Filter,
  ArrowRight
} from 'lucide-react'

// --- Types -------------------------------------------------------------------
interface Category {
  id: string
  name_vi: string
  slug: string
  icon_name: string | null
}

interface Course {
  id: string
  slug: string
  title_vi: string
  title_en: string | null
  description_vi: string | null
  description_en: string | null
  thumbnail_url: string | null
  duration_hours: number
  lesson_count: number
  // Computed from join
  actual_lesson_count?: number
  difficulty_level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional'
  is_published: boolean
  order_index: number
  category_id: string | null
  created_at: string
  // Joined
  categories?: Category | null
}

// --- Constants -----------------------------------------------------------------------
const DIFFICULTY_MAP: Record<string, { gradient: string; emoji: string; label: string; color: string }> = {
  Beginner: {
    gradient: 'linear-gradient(135deg, #0D3B2E, #1A5C45)',
    emoji: '🟢', label: 'Cơ bản', color: '#10B981',
  },
  Intermediate: {
    gradient: 'linear-gradient(135deg, #2D1B00, #4A3200)',
    emoji: '🟡', label: 'Trung cấp', color: '#F59E0B',
  },
  Advanced: {
    gradient: 'linear-gradient(135deg, #1A0533, #2D0B52)',
    emoji: '🟣', label: 'Nâng cao', color: '#7C3AED',
  },
  Professional: {
    gradient: 'linear-gradient(135deg, #330505, #520B0B)',
    emoji: '🔴', label: 'Chuyên gia', color: '#EF4444',
  },
}

const LEVEL_FILTER_OPTIONS = [
  { key: 'Beginner',      label: 'Cơ bản',    color: '#10B981' },
  { key: 'Intermediate',  label: 'Trung cấp',  color: '#F59E0B' },
  { key: 'Advanced',      label: 'Nâng cao',   color: '#7C3AED' },
  { key: 'Professional',  label: 'Chuyên gia', color: '#EF4444' },
]

// --- Skeleton ------------------------------------------------------------------------
function SkeletonCards() {
  return (
    <div style={{ padding: '32px', maxWidth: 1200, margin: '0 auto' }}>
      <div className="skeleton" style={{ height: 90, marginBottom: 40, borderRadius: 12 }} />
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 32 }}>
        <div className="skeleton" style={{ height: 420, borderRadius: 12 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 300, borderRadius: 12 }} />
          ))}
        </div>
      </div>
    </div>
  )
}

// --- Main Page ------------------------------------------------------------------------
export default function CoursesPage() {
  const supabase = createClient()

  const [courses, setCourses]       = useState<Course[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState<string | null>(null)

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('all')       // 'all' | category.slug
  const [selectedLevels, setSelectedLevels]     = useState<string[]>([])        // empty = all

  // -- Fetch --------------------------------------------------------------------------
  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        // Fetch categories
        const { data: catData, error: catErr } = await supabase
          .from('categories')
          .select('*')
          .order('order_index')
        if (catErr) throw catErr

        // Fetch published courses (joined with categories)
        const { data: courseData, error: courseErr } = await supabase
          .from('courses')
          .select(`
            *,
            categories (
              id, name_vi, slug, icon_name
            )
          `)
          .eq('is_published', true)
          .order('order_index', { ascending: true })
        if (courseErr) throw courseErr

        // Use lesson_count directly from the table (simpler and safer)
        const coursesWithCount = (courseData ?? []).map((c: any) => ({
          ...c,
          actual_lesson_count: c.lesson_count ?? 0,
        }))

        setCategories(catData ?? [])
        setCourses(coursesWithCount)
      } catch (e: any) {
        setError('Không thể tải khóa học. Thử lại sau.')
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // -- Client-side filter -----------------------------------------------------
  const filtered = useMemo(() => {
    return courses.filter(c => {
      const catMatch = selectedCategory === 'all' || c.categories?.slug === selectedCategory
      const levelMatch = selectedLevels.length === 0 || selectedLevels.includes(c.difficulty_level)
      return catMatch && levelMatch
    })
  }, [courses, selectedCategory, selectedLevels])

  const toggleLevel = (key: string) => {
    setSelectedLevels(prev =>
      prev.includes(key) ? prev.filter(l => l !== key) : [...prev, key]
    )
  }

  // -- States -------------------------------------------------------------------------
  if (loading) return <SkeletonCards />

  if (error) return (
    <div data-theme-area="main" style={{ padding: '32px', maxWidth: 1200, margin: '0 auto', backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
      <div style={{
        background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)',
        borderRadius: 12, padding: '24px 28px',
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <span style={{ fontSize: 24 }}>⚠️</span>
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Lỗi tải dữ liệu</div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{error}</div>
        </div>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginLeft: 'auto', height: 38, padding: '0 18px', borderRadius: 8,
            background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#EF4444', fontWeight: 700, fontSize: 14, cursor: 'pointer',
          }}
        >
          Thử lại
        </button>
      </div>
    </div>
  )

  // -- Render -------------------------------------------------------------------------
  return (
    <div data-theme-area="main" style={{ padding: '32px', maxWidth: 1200, margin: '0 auto', backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>

      {/* Header */}
      <div className="page-header" style={{ marginBottom: 40 }}>
        <p className="label-caps" style={{ color: '#7C3AED', marginBottom: 8 }}>
          Thư viện tri thức
        </p>
        <h1 style={{ fontSize: 32, margin: '0 0 12px', color: 'var(--text-primary)' }}>Khóa học thiết kế chip</h1>
        <p className="subtitle" style={{ margin: 0, color: 'var(--text-secondary)' }}>
          Lộ trình từ Digital Logic cơ bản đến AI Chip Architecture chuyên sâu.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 32, alignItems: 'start' }}>

        {/* -- Filter Sidebar -- */}
        <aside className="animate-fade-up" style={{ animationDelay: '100ms', position: 'sticky', top: 80 }}>
          <div className="card-redesign" style={{ padding: '24px' }}>

            {/* Category */}
            <div className="label-caps" style={{ marginBottom: 20 }}>Chủ đề</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {/* "Tất cả" */}
              <div
                onClick={() => setSelectedCategory('all')}
                style={{
                  padding: '10px 14px', borderRadius: 8, fontSize: 13.5, cursor: 'pointer',
                  background: selectedCategory === 'all' ? 'rgba(124, 58, 237, 0.12)' : 'transparent',
                  color: selectedCategory === 'all' ? '#A855F7' : 'var(--text-secondary)',
                  fontWeight: selectedCategory === 'all' ? 600 : 500,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (selectedCategory !== 'all') e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                onMouseLeave={e => { if (selectedCategory !== 'all') e.currentTarget.style.background = 'transparent' }}
              >
                Tất cả
                <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.5 }}>({courses.length})</span>
              </div>

              {/* Dynamic categories */}
              {categories.map(cat => {
                const count = courses.filter(c => c.categories?.slug === cat.slug).length
                const active = selectedCategory === cat.slug
                return (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    style={{
                      padding: '10px 14px', borderRadius: 8, fontSize: 13.5, cursor: 'pointer',
                      background: active ? 'rgba(124, 58, 237, 0.12)' : 'transparent',
                      color: active ? '#A855F7' : 'var(--text-secondary)',
                      fontWeight: active ? 600 : 500,
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
                  >
                    {cat.name_vi}
                    <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.5 }}>({count})</span>
                  </div>
                )
              })}
            </div>

            <div style={{ height: 1, background: 'var(--border)', margin: '24px 0' }} />

            {/* Level */}
            <div className="label-caps" style={{ marginBottom: 20 }}>Trình độ</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {LEVEL_FILTER_OPTIONS.map(level => {
                const active = selectedLevels.includes(level.key)
                return (
                  <div
                    key={level.key}
                    onClick={() => toggleLevel(level.key)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      fontSize: 13.5, cursor: 'pointer',
                      color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                      fontWeight: active ? 600 : 400,
                      transition: 'all 0.15s',
                      padding: '4px 0',
                    }}
                  >
                    <div style={{
                      width: 14, height: 14, borderRadius: 4, flexShrink: 0,
                      border: `1.5px solid ${level.color}`,
                      background: active ? level.color : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.15s',
                    }}>
                      {active && <span style={{ fontSize: 9, color: '#000', fontWeight: 900 }}>✓</span>}
                    </div>
                    {level.label}
                  </div>
                )
              })}
            </div>

            {/* Clear filters */}
            {(selectedCategory !== 'all' || selectedLevels.length > 0) && (
              <button
                onClick={() => { setSelectedCategory('all'); setSelectedLevels([]) }}
                style={{
                  marginTop: 20, width: '100%', height: 36, borderRadius: 8,
                  background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
                  color: 'var(--text-muted)', fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                ✕ Xóa bộ lọc
              </button>
            )}
          </div>
        </aside>

        {/* -- Course Grid -- */}
        <div>
          {filtered.length === 0 ? (
            /* Empty State */
            <div data-theme-area="card" style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', padding: '80px 40px',
              background: 'var(--bg-surface)', borderRadius: 16,
              border: '1px dashed var(--border)',
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                Chưa có khóa học nào
              </div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
                Thử thay đổi bộ lọc để xem thêm khóa học.
              </div>
              <button
                onClick={() => { setSelectedCategory('all'); setSelectedLevels([]) }}
                style={{
                  height: 40, padding: '0 20px', borderRadius: 8,
                  background: 'rgba(124, 58, 237, 0.12)', border: '1px solid #7C3AED',
                  color: '#A855F7', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                }}
              >
                Xem tất cả khóa học
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
              {filtered.map((course, i) => {
                const theme = DIFFICULTY_MAP[course.difficulty_level] ?? DIFFICULTY_MAP.Beginner
                return (
                  <Link key={course.id} href={`/courses/${course.slug}`} style={{ textDecoration: 'none' }}>
                    <div
                      data-theme-area="card"
                      className="card-redesign animate-fade-up"
                      style={{
                        animationDelay: `${200 + i * 80}ms`,
                        padding: 0, overflow: 'hidden', height: '100%',
                        display: 'flex', flexDirection: 'column',
                        backgroundColor: 'var(--bg-tertiary)',
                        border: '1px solid var(--border)'
                      }}
                    >
                      {/* Card Header Gradient */}
                      <div style={{
                        height: 120, background: theme.gradient,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        position: 'relative', flexShrink: 0,
                      }}>
                        {course.thumbnail_url ? (
                          <img
                            src={course.thumbnail_url}
                            alt={course.title_vi}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
                          />
                        ) : (
                          <span style={{ fontSize: 48 }}>{theme.emoji}</span>
                        )}

                        {/* Category pill */}
                        {course.categories && (
                          <div style={{
                            position: 'absolute', top: 12, left: 12,
                            padding: '3px 9px', borderRadius: 20,
                            background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)',
                            color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: 600,
                            border: '1px solid rgba(255,255,255,0.1)',
                          }}>
                            {course.categories.name_vi}
                          </div>
                        )}

                        {/* Difficulty badge */}
                        <div style={{
                          position: 'absolute', top: 12, right: 12,
                          padding: '4px 10px', borderRadius: 20,
                          background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)',
                          color: theme.color, fontSize: 10, fontWeight: 700,
                          border: '1px solid rgba(255,255,255,0.1)',
                          textTransform: 'uppercase', letterSpacing: '0.05em',
                        }}>
                          {theme.label}
                        </div>
                      </div>

                      {/* Card Body */}
                      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ fontSize: 18, color: 'var(--text-primary)', margin: '0 0 8px' }}>
                          {course.title_vi || course.title_en}
                        </h3>
                        <p style={{
                          fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6,
                          margin: '0 0 20px', flex: 1,
                          display: '-webkit-box', WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        }}>
                          {course.description_vi || course.description_en || 'Sắp ra mắt.'}
                        </p>

                        {/* Stats */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                            <GraduationCap size={16} />
                            {course.actual_lesson_count ?? course.lesson_count ?? 0} bài
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                            <Clock size={16} />
                            {course.duration_hours || 0}h
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                            <Star size={16} fill="#F59E0B" color="#F59E0B" />
                            5.0
                          </div>
                        </div>

                        <button
                          style={{
                            width: '100%', height: 42, borderRadius: 10,
                            background: 'transparent',
                            border: '1px solid rgba(124, 58, 237, 0.2)',
                            color: '#A855F7', fontSize: 14, fontWeight: 700,
                            cursor: 'pointer', transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(124, 58, 237, 0.12)'
                            e.currentTarget.style.borderColor = '#7C3AED'
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = 'transparent'
                            e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.2)'
                          }}
                        >
                          Bắt đầu học ngay
                        </button>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
