'use client'

import { useState, useEffect } from 'react'
import { useParams, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { CourseDetailHero } from '@/components/courses/CourseDetailHero'
import { 
  Loader2 as Spinner,
  Sparkles,
  Trophy,
  Video,
  Monitor,
  Lightbulb,
  ChevronRight,
  BookOpen,
  FlaskConical as FlaskIconLucide,
  HelpCircle
} from 'lucide-react'
import Link from 'next/link'

// Custom SVGs (14px)
const VideoIcon = ({ locked }: { locked?: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="5" width="20" height="14" rx="3" stroke={locked ? '#475569' : '#7C3AED'} strokeWidth="1.5"/>
    <polygon points="10,9 15,12 10,15" fill={locked ? '#475569' : '#7C3AED'} />
  </svg>
)

const LabIcon = ({ locked }: { locked?: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="4" width="6" height="6" rx="1.5" stroke={locked ? '#475569' : '#7C3AED'} strokeWidth="1.5"/>
    <rect x="14" y="4" width="6" height="6" rx="1.5" stroke={locked ? '#475569' : '#7C3AED'} strokeWidth="1.5"/>
    <rect x="4" y="14" width="6" height="6" rx="1.5" stroke={locked ? '#475569' : '#7C3AED'} strokeWidth="1.5"/>
    <rect x="14" y="14" width="6" height="6" rx="1.5" stroke={locked ? '#475569' : '#7C3AED'} strokeWidth="1.5"/>
    <line x1="10" y1="7" x2="14" y2="7" stroke={locked ? '#475569' : '#7C3AED'} strokeWidth="1.5"/>
    <line x1="10" y1="17" x2="14" y2="17" stroke={locked ? '#475569' : '#7C3AED'} strokeWidth="1.5"/>
    <line x1="7" y1="10" x2="7" y2="14" stroke={locked ? '#475569' : '#7C3AED'} strokeWidth="1.5"/>
    <line x1="17" y1="10" x2="17" y2="14" stroke={locked ? '#475569' : '#7C3AED'} strokeWidth="1.5"/>
  </svg>
)

const QuizIcon = ({ locked }: { locked?: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke={locked ? '#475569' : '#7C3AED'} strokeWidth="1.5"/>
    <path d="M10.5 9A1.5 1.5 0 0 1 13.5 9C13.5 10.5 12 11 12 12" stroke={locked ? '#475569' : '#7C3AED'} strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="15.5" r="1" fill={locked ? '#475569' : '#7C3AED'} />
  </svg>
)

const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <rect x="6" y="11" width="12" height="10" rx="2" stroke="#475569" strokeWidth="2"/>
    <path d="M8 11V7C8 4.79086 9.79086 3 12 3V3C14.2091 3 16 4.79086 16 7V11" stroke="#475569" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const LessonIcon = ({ type, locked }: { type: string, locked: boolean }) => {
  if (type === 'lab') return <LabIcon locked={locked} />
  if (type === 'quiz') return <QuizIcon locked={locked} />
  return <VideoIcon locked={locked} />
}

export default function CourseDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [course, setCourse] = useState<any>(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<any>(null)
  
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([])
  
  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      if (!slug) return

      const { data: courseData } = await supabase
        .from('courses')
        .select(`
          *, 
          course_sections (
            *, 
            lessons (*)
          ),
          lessons (duration_minutes)
        `)
        .eq('slug', slug)
        .single()

      if (!courseData) {
        setLoading(false)
        return
      }

      const totalMinutes = courseData.lessons?.reduce((sum: number, l: any) => {
        const val = parseInt(l.duration_minutes);
        return sum + (isNaN(val) ? 0 : val);
      }, 0) ?? 0;
      const totalHours = Math.round((totalMinutes / 60) * 10) / 10;
      
      setCourse({
        ...courseData,
        total_duration_hours: totalHours,
        total_duration_minutes: totalMinutes,
        actual_lesson_count: courseData.lessons?.length || courseData.lesson_count
      })

      if (courseData.course_sections?.length > 0) {
        const sorted = [...courseData.course_sections].sort((a: any, b: any) => a.order_index - b.order_index);
        setExpandedSections([sorted[0].id])
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: enrollment } = await supabase
          .from('enrollments')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', courseData.id)
          .maybeSingle()
        setIsEnrolled(!!enrollment)

        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        setUserProfile(profile)

        // Fetch progress
        const { data: progress } = await supabase
          .from('lesson_progress')
          .select('lesson_id')
          .eq('user_id', user.id)
          .eq('is_completed', true)
        
        if (progress) {
          setCompletedLessonIds(progress.map((p: any) => p.lesson_id))
        }
      }

      setLoading(false)
    }

    loadData()
  }, [slug])

  if (loading) {
    return (
      <div data-theme-area="main" className="h-[calc(100vh-64px)] flex items-center justify-center bg-[var(--bg-primary)]">
        <Spinner size={32} style={{ color: '#7C3AED' }} className="animate-spin" />
      </div>
    )
  }

  if (!course) return notFound()

  const toggleSection = (id: string) => {
    setExpandedSections(prev => 
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    )
  }

  let firstUnlockedFound = false;

  return (
    <div data-theme-area="main" className="page-wrapper" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      
      {/* Center scrollable column */}
      <div className="main-content" style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        
        <CourseDetailHero course={course} isEnrolled={isEnrolled} />
        
        <div className="body-content" style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          <div data-theme-area="card" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 10, padding: '18px 20px' }}>
             <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>Bạn sẽ học được gì?</h3>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  'Nắm vững kiến thức nền tảng về hệ thống số',
                  'Thực hành thiết kế RTL với ngôn ngữ Verilog',
                  'Hiểu rõ quy trình thiết kế ASIC chuẩn công nghiệp',
                  'Xây dựng các testbench để kiểm tra thiết kế'
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{item}</span>
                  </div>
                ))}
             </div>
          </div>

          {/* Curriculum Section */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>Chương trình học</h2>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {course.course_sections?.length || 0} chương • {course.actual_lesson_count || course.lesson_count || 0} bài học
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {course.course_sections?.sort((a: any, b: any) => a.order_index - b.order_index).map((section: any, idx: number) => {
                const isExpanded = expandedSections.includes(section.id)
                return (
                  <div key={section.id} data-theme-area="card" style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', marginBottom: 10 }}>
                    <div 
                      onClick={() => toggleSection(section.id)}
                      style={{ background: 'var(--bg-secondary)', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span style={{ fontSize: 11, color: '#7C3AED', fontWeight: 700 }}>
                          Phần {String(idx + 1).padStart(2, '0')}
                        </span>
                        <h3 style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600, margin: 0 }}>{section.title_vi}</h3>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: 20 }}>
                          {section.lessons?.length || 0} bài
                        </span>
                        <ChevronRight 
                          size={14} 
                          color="var(--text-muted)"
                          style={{ 
                            transform: isExpanded ? 'rotate(90deg)' : 'none',
                            transition: 'transform 0.2s'
                          }} 
                        />
                      </div>
                    </div>

                    {isExpanded && (
                      <div style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-primary)' }}>
                        {section.lessons?.sort((a: any, b: any) => a.order_index - b.order_index).map((lesson: any) => {
                          const canPreview = lesson.is_free_preview || isEnrolled
                          
                          let isActive = false
                          if (canPreview && !firstUnlockedFound) {
                            isActive = true
                            firstUnlockedFound = true 
                          }
                          
                          const rawDur = lesson.duration_minutes?.toString() || '';
                          const cleanDurMatch = rawDur.match(/\d+/);
                          const finalDur = cleanDurMatch ? cleanDurMatch[0] : '10';

                          return (
                            <Link 
                              key={lesson.id} 
                              href={canPreview ? `/learn/${course.slug}/${lesson.slug}` : '#'}
                              style={{ 
                                padding: '12px 16px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, 
                                borderBottom: '1px solid var(--border)', background: isActive ? 'rgba(124, 58, 237, 0.05)' : 'transparent',
                                cursor: canPreview ? 'pointer' : 'default',
                                opacity: canPreview ? 1 : 0.6,
                                transition: 'all 0.15s'
                              }}
                              onMouseEnter={e => { if (canPreview && !isActive) e.currentTarget.style.background = 'var(--bg-surface)' }}
                              onMouseLeave={e => { if (canPreview && !isActive) e.currentTarget.style.background = 'transparent' }}
                            >
                              <LessonIcon type={lesson.type} locked={!canPreview} />
                              <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: canPreview ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                                {lesson.title_vi}
                              </span>
                              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                                {finalDur} phút
                              </span>
                              <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                                {completedLessonIds.includes(lesson.id) ? (
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 6L9 17l-5-5" />
                                  </svg>
                                ) : canPreview ? (
                                  isActive ? (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M5 12H19M19 12L12 5M19 12L12 19" />
                                    </svg>
                                  ) : (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <circle cx="12" cy="12" r="10" />
                                      <path d="M10 8L16 12L10 16V8Z" fill="currentColor" stroke="none"/>
                                    </svg>
                                  )
                                ) : (
                                  <LockIcon />
                                )}
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        </div>
      </div>

      {/* Right Panel */}
      <aside className="right-panel hidden lg:flex flex-col" style={{ width: 260, minWidth: 260, background: 'var(--bg-secondary)', borderLeft: '1px solid var(--border)', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', padding: '24px 20px', flexShrink: 0 }}>
         <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px 0' }}>Khóa học này bao gồm:</h3>
         <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: Video, text: `${course.total_duration_hours || 0} giờ video bài giảng` },
              { icon: Monitor, text: 'Bài viết chuyên sâu & Slides' },
              { icon: Lightbulb, text: 'Hệ thống bài trắc nghiệm' },
              { icon: Monitor, text: '20+ bài thực hành Verilog' },
              { icon: Sparkles, text: 'AI Tutor hỗ trợ giải đáp 24/7' },
              { icon: Trophy, text: 'Chứng chỉ hoàn thành' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <item.icon size={16} style={{ color: '#7C3AED', flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{item.text}</span>
              </div>
            ))}
         </div>

         {/* Bottom User Card */}
         <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
            {userProfile ? (
              <>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#FFF' }}>
                  {(userProfile.full_name || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{userProfile.full_name || 'Học viên'}</div>
                  <div style={{ fontSize: 10, color: '#7C3AED', fontWeight: 700, textTransform: 'uppercase' }}>Thành viên</div>
                </div>
              </>
            ) : (
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Đăng nhập để xem tiến độ</span>
            )}
         </div>
      </aside>
    </div>
  )
}

