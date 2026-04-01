'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { LessonSidebar } from '@/components/lesson/LessonSidebar'
import { VideoPlayer } from '@/components/lesson/VideoPlayer'
import { LessonContent } from '@/components/lesson/LessonContent'
import { LabPanel } from '@/components/lab/LabPanel'
import { QuizCard } from '@/components/quiz/QuizCard'
import { AITutor } from '@/components/ai/AITutor'
import { Loader2 as Spinner } from 'lucide-react'
import toast from 'react-hot-toast'

const BookOpenIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
)

const SparkleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 3v18M3 12h18m-4-7l-8 14M7 5l10 14" />
  </svg>
)

const FlaskIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M9 3H15M10 3V8L4 21H20L14 8V3" />
  </svg>
)

const HelpCircleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="9" />
    <path d="M10.5 9A1.5 1.5 0 0 1 13.5 9C13.5 10.5 12 11 12 12" strokeLinecap="round" />
    <circle cx="12" cy="15.5" r="1" fill="currentColor" />
  </svg>
)

const ClockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
)

function StudyTimeTracker({ userId, lessonId }: { userId: string, lessonId: string }) {
  const startTimeRef = useRef(Date.now())
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    startTimeRef.current = Date.now()
    
    // Save every 60 seconds
    intervalRef.current = setInterval(async () => {
      const activeMinutes = Math.floor((Date.now() - startTimeRef.current) / 60000)
      if (activeMinutes > 0) {
        try {
          await fetch('/api/learning/track-time', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, lessonId, minutes: activeMinutes })
          })
          startTimeRef.current = Date.now() // reset
        } catch (err) {
          console.error('Failed to track study time:', err)
        }
      }
    }, 60000)

    // Save on unmount (user leaves lesson)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      const minutes = Math.floor((Date.now() - startTimeRef.current) / 60000)
      if (minutes > 0) {
        // use fetch with keepalive or beacon
        fetch('/api/learning/track-time', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, lessonId, minutes }),
          keepalive: true
        }).catch(() => {})
      }
    }
  }, [userId, lessonId])

  return null
}

export default function LessonPlayerPage() {
  const params = useParams()
  const courseSlug = params.courseSlug as string
  const lessonSlug = params.lessonSlug as string
  
  const [course, setCourse] = useState<any>(null)
  const [lesson, setLesson] = useState<any>(null)
  const [quizQuestions, setQuizQuestions] = useState<any[]>([])
  const [lab, setLab] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('lesson')
  const [user, setUser] = useState<any>(null)
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([])
  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      if (!courseSlug || !lessonSlug) return

      const { data: { user: authUser } } = await supabase.auth.getUser()
      setUser(authUser)

      const { data: courseData } = await supabase
        .from('courses')
        .select('*, course_sections(*, lessons(*))')
        .eq('slug', courseSlug)
        .single()

      if (!courseData) {
        setLoading(false)
        return
      }

      setCourse(courseData)

      const foundLesson = courseData.course_sections
        ?.flatMap((s: any) => s.lessons)
        .find((l: any) => l.slug === lessonSlug)

      if (!foundLesson) {
        setLoading(false)
        return
      }

      setLesson(foundLesson)
      
      // Fetch user progress
      if (authUser) {
        const { data: progressData } = await supabase
          .from('lesson_progress')
          .select('lesson_id')
          .eq('user_id', authUser.id)
          .eq('is_completed', true)
        
        if (progressData) {
          setCompletedLessonIds(progressData.map((p: any) => p.lesson_id))
        }
      }

      if (foundLesson.type === 'quiz') {
        const { data: qs } = await supabase
          .from('quiz_questions')
          .select('*')
          .eq('lesson_id', foundLesson.id)
          .order('order_index', { ascending: true })
        setQuizQuestions(qs || [])
      }

      if (foundLesson.type === 'lab') {
        const { data: labData } = await supabase
          .from('lab_exercises')
          .select('*')
          .eq('lesson_id', foundLesson.id)
          .single()
        setLab(labData)
      }

      setLoading(false)
    }

    loadData()
  }, [courseSlug, lessonSlug])

  if (loading) {
    return (
      <div data-theme-area="main" className="h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <Spinner size={32} style={{ color: '#7C3AED' }} className="animate-spin" />
      </div>
    )
  }

  if (!course || !lesson) return notFound()

  const rawDur = lesson.duration_minutes?.toString() || '';
  const cleanDurMatch = rawDur.match(/\d+/);
  const finalDur = cleanDurMatch ? cleanDurMatch[0] : '10';

  const typeMap: Record<string, string> = {
    'video': 'BÀI HỌC VIDEO',
    'article': 'BÀI HỌC LÝ THUYẾT',
    'lab': 'BÀI THỰC HÀNH',
    'quiz': 'BÀI KIỂM TRA',
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .lesson-page { display: flex; height: calc(100vh - 64px); overflow: hidden; background: var(--bg-primary); }
        .lesson-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }
        .lesson-header { padding: 20px 32px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; background: var(--bg-primary); flex-shrink: 0; gap: 16px; }
        .lesson-tabs { display: flex; gap: 0; border-bottom: 1px solid var(--border); background: var(--bg-secondary); flex-shrink: 0; padding: 0 32px; overflow-x: auto; }
        .lesson-content-area { flex: 1; overflow-y: auto; padding: 32px; }

        .complete-btn { background: transparent; border: 1px solid #7C3AED; color: #7C3AED; padding: 10px 20px; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; white-space: nowrap; transition: all 0.2s; }
        .complete-btn:hover { background: rgba(124, 58, 237, 0.12); border-color: #7C3AED; }

        .meta-pill { background: rgba(255,255,255,0.04); border: 1px solid var(--border); color: var(--text-secondary); font-size: 11px; padding: 4px 10px; border-radius: 20px; display: inline-flex; align-items: center; gap: 5px; font-weight: 700; letter-spacing: 0.5px; }

        .tab-item { padding: 14px 20px; font-size: 13px; color: var(--text-muted); cursor: pointer; border-bottom: 2px solid transparent; display: flex; align-items: center; gap: 8px; transition: all 0.15s; white-space: nowrap; font-weight: 700; }
        .tab-item:hover { color: var(--text-secondary); }
        .tab-item.active { color: #A855F7; border-bottom-color: #7C3AED; background: rgba(124, 58, 237, 0.05); }
      `}} />
      <div className="lesson-page">
        {user && lesson && (
          <StudyTimeTracker userId={user.id} lessonId={lesson.id} />
        )}
        <LessonSidebar 
          course={course} 
          currentLessonId={lesson.id} 
          completedLessonIds={completedLessonIds}
        />

        <div className="lesson-main">
          {/* Header Zone */}
          <div data-theme-area="main" className="lesson-header">
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 11, color: '#475569', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700 }}>
                ĐANG HỌC
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 12px 0', lineHeight: 1.2 }} className="truncate">
                {lesson.title_vi}
              </h1>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span className="meta-pill"><ClockIcon /> {finalDur} PHÚT</span>
                <span className="meta-pill">{typeMap[lesson.type] || 'BÀI HỌC'}</span>
              </div>
            </div>
            <div>
              <button 
                className="complete-btn"
                onClick={async (e) => {
                  const btn = e.currentTarget
                  btn.disabled = true
                  btn.innerHTML = '<span class="animate-spin inline-block mr-2">⏳</span> ĐANG LƯU...'
                  
                  try {
                    const res = await fetch('/api/lessons/complete', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ lessonId: lesson.id, courseId: course.id })
                    })
                    const data = await res.json()
                    
                    if (data.success) {
                      btn.innerHTML = '✅ ĐÃ HOÀN THÀNH'
                      btn.style.borderColor = '#10B981'
                      btn.style.color = '#10B981'
                      
                      // Update local state for sidebar
                      setCompletedLessonIds(prev => [...prev, lesson.id])
                      
                      // Show success feedback
                      const msg = `🎉 +${data.xpGained} XP! ${data.newLevel ? `Bạn đã lên Level ${data.newLevel}!` : ''}`
                      toast.success(msg) 
                    } else {
                      btn.disabled = false
                      btn.innerHTML = 'ĐÁNH DẤU HOÀN THÀNH'
                    }
                  } catch (err) {
                    btn.disabled = false
                    btn.innerHTML = 'ĐÁNH DẤU HOÀN THÀNH'
                  }
                }}
              >
                ĐÁNH DẤU HOÀN THÀNH
              </button>
            </div>
          </div>

          {/* Tab Zone */}
          <div className="lesson-tabs custom-scrollbar">
            <div className={`tab-item ${activeTab === 'lesson' ? 'active' : ''}`} onClick={() => setActiveTab('lesson')}>
              <BookOpenIcon /> BÀI HỌC
            </div>
            <div className={`tab-item ${activeTab === 'ai' ? 'active' : ''}`} onClick={() => setActiveTab('ai')}>
              <SparkleIcon /> AI TUTOR
            </div>
            <div className={`tab-item ${activeTab === 'lab' ? 'active' : ''}`} onClick={() => setActiveTab('lab')}>
              <FlaskIcon /> LAB
            </div>
            <div className={`tab-item ${activeTab === 'quiz' ? 'active' : ''}`} onClick={() => setActiveTab('quiz')}>
              <HelpCircleIcon /> QUIZ
            </div>
          </div>

          {/* Content Zone */}
          <div data-theme-area="main" className="lesson-content-area custom-scrollbar" style={activeTab === 'lab' ? { padding: 0, overflow: 'hidden', backgroundColor: 'var(--bg-primary)' } : { backgroundColor: 'var(--bg-primary)' }}>
            <div style={{ maxWidth: activeTab === 'lab' ? '100%' : 760, margin: '0 auto', height: '100%' }}>
              
              {activeTab === 'lesson' && (
                <>
                  {lesson.type === 'video' && lesson.video_url && (
                    <div style={{ marginBottom: 32 }}>
                      <VideoPlayer url={lesson.video_url} title={lesson.title_vi} />
                    </div>
                  )}
                  <LessonContent lesson={lesson} />
                </>
              )}

              {activeTab === 'ai' && (
                <AITutor 
                  lessonId={lesson.id} 
                  courseId={course.id} 
                  context={lesson.content_vi || lesson.description_vi} 
                />
              )}

              {activeTab === 'lab' && (
                (lesson.type === 'lab' || lab) ? (
                  <LabPanel lab={lab} />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 300 }}>
                    <div style={{ opacity: 0.2, color: '#475569', marginBottom: 16 }}><FlaskIcon /></div>
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Không có bài thực hành</h3>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Bài học này không bao gồm phần thực hành Verilog.</p>
                  </div>
                )
              )}

              {activeTab === 'quiz' && (
                quizQuestions.length > 0 ? (
                  <QuizCard questions={quizQuestions} courseId={course.id} />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '40px' }}>
                    <div style={{ opacity: 0.2, color: '#475569', marginBottom: 16 }}><HelpCircleIcon /></div>
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Không có bài trắc nghiệm</h3>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Bài học này không bao gồm phần kiểm tra nhanh.</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

