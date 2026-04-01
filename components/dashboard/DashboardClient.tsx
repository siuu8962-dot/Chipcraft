'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Zap, Flame, BookOpen, Trophy, Target, Clock, 
  TrendingUp, Star, ChevronRight, Search, 
  Bot, Cpu, Award, BarChart3, CheckCircle2, 
  PlayCircle, Lightbulb, ArrowRight
} from 'lucide-react'

interface DashboardClientProps {
  user: any
  profile: any
  courses: any[]
  enrollments: any[]
  stats: {
    totalXP: number
    streak: number
    completedCourses: number
    rank: number
    todayMinutes: number
    levelXP: number
    nextLevelXP: number
    level: number
  }
}

export default function DashboardClient({ user, profile, courses = [], enrollments = [], stats }: DashboardClientProps) {
  const [greeting, setGreeting] = useState('')

  const [today, setToday] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('chào buổi sáng')
    else if (hour < 18) setGreeting('chào buổi chiều')
    else setGreeting('chào buổi tối')

    setToday(new Date().toLocaleDateString('vi-VN', { 
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
    }).toUpperCase())
  }, [])

  const DAILY_GOAL_MINUTES = 30
  const progressPercent = Math.min(Math.round((stats.todayMinutes / DAILY_GOAL_MINUTES) * 100), 100)
  
  const RADIUS = 36
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS
  const strokeDashoffset = CIRCUMFERENCE - (progressPercent / 100) * CIRCUMFERENCE

  return (
    <div data-theme-area="main" style={{ padding: '24px 32px', maxWidth: 1200, margin: '0 auto', backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
      
      {/* ── GREETING SECTION ── */}
      <div className="page-header" style={{ marginBottom: 24 }}>
        <p style={{ 
          fontSize: 10.5, fontWeight: 700, letterSpacing: '0.12em', 
          color: '#7C3AED', textTransform: 'uppercase', marginBottom: 6 
        }}>
          {today}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <div style={{
            width: 36, height: 36,
            background: 'rgba(124, 58, 237, 0.15)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Lightbulb size={20} color="#7C3AED" />
          </div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>
            Chúc {greeting}, {profile?.full_name?.split(' ').pop() || 'bạn'}!
          </h1>
        </div>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 14 }}>
          Bắt đầu hành trình thiết kế chip của bạn hôm nay.
        </p>
      </div>

      {/* ── STATS GRID ── */}
      <div style={{ 
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: 16, marginBottom: 20 
      }}>
        <StatCard 
          label="Tổng XP" 
          value={stats.totalXP} 
          subtext={`Level ${stats.level}`}
          icon={Zap} 
          color="#EAB308" 
          iconBg="rgba(234,179,8,0.15)"
          iconBorder="rgba(234,179,8,0.2)"
        />
        <StatCard 
          label="Chuỗi học" 
          value={stats.streak} 
          subtext={stats.streak > 0 ? 'Tuyệt vời!' : 'Bắt đầu ngay'}
          icon={Flame} 
          color="#F97316" 
          iconBg="rgba(249,115,22,0.15)"
          iconBorder="rgba(249,115,22,0.2)"
        />
        <StatCard 
          label="Khóa học" 
          value={courses?.length || 0} 
          subtext={`${stats.completedCourses} đã xong`}
          icon={BookOpen} 
          color="#6366F1" 
          iconBg="rgba(99,102,241,0.15)"
          iconBorder="rgba(99,102,241,0.2)"
        />
        <StatCard 
          label="Xếp hạng" 
          value={`#${stats.rank}`} 
          subtext="Bảng xếp hạng tuần"
          icon={Trophy} 
          color="#A855F7" 
          iconBg="rgba(168,85,247,0.15)"
          iconBorder="rgba(168,85,247,0.2)"
        />
      </div>

      {/* ── LEVEL PROGRESS BAR ── */}
      <div data-theme-area="card" style={{
        backgroundColor: 'var(--bg-tertiary)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: 20
      }}>
        <div style={{
          width: '36px', height: '36px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '15px', fontWeight: 800, color: 'white',
          flexShrink: 0,
          boxShadow: '0 0 12px rgba(124, 58, 237, 0.2)'
        }}>
          {stats.level}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize:'13px', fontWeight:600, color:'var(--text-primary)' }}>
              Tiến trình Cấp độ {stats.level}
            </span>
            <span style={{ fontSize:'13px', color:'#7C3AED', fontWeight:700 }}>
              {stats.levelXP} / {stats.nextLevelXP} XP
            </span>
          </div>
          <div style={{
            height: '8px',
            backgroundColor: 'var(--border)',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${Math.round((stats.levelXP / stats.nextLevelXP) * 100)}%`,
              background: 'linear-gradient(90deg, #7C3AED, #A855F7)',
              borderRadius: '4px',
              transition: 'width 1s ease',
            }} />
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT AREA ── */}
      <div style={{ 
        display: 'grid', gridTemplateColumns: '1fr 320px', 
        gap: 16, marginBottom: 16 
      }}>
        
        {/* LEFT: Currently Learning & Suggested Courses */}
        <div data-theme-area="card" className="card-redesign" style={{ padding: 24, backgroundColor: 'var(--bg-tertiary)' }}>
          {(() => {
            // Determine what to display
            const enrolledCourseIds = enrollments.map(e => e.course_id || e.courseId || e.id)
            
            const enrolledCourses = enrollments.map(enrollment => {
              // Find matching course data
              const courseData = courses.find(c => 
                c.id === enrollment.course_id || 
                c.id === enrollment.courseId
              )
              return {
                ...enrollment,
                courseData: courseData || null,
                progress: enrollment.progress_percentage || 
                          enrollment.progress || 
                          enrollment.completion || 0
              }
            })

            const unenrolledCourses = courses.filter(c => !enrolledCourseIds.includes(c.id))
            const hasEnrollments = enrolledCourses.length > 0
            const displayCourses = hasEnrollments ? enrolledCourses : courses

            return (
              <div>
                <div style={{ display:'flex', justifyContent:'space-between',
                              alignItems:'center', marginBottom:'20px' }}>
                  <h2 style={{ fontSize:'18px', fontWeight:700, color:'var(--text-primary)', margin:0 }}>
                    {hasEnrollments ? 'Khóa học của bạn' : 'Khóa học nổi bật'}
                  </h2>
                  <Link href="/courses" style={{ fontSize:'13px', color:'#7C3AED',
                    fontWeight:600, display:'flex', alignItems:'center', gap:'4px',
                    textDecoration:'none' }}>
                    Tất cả khóa học <ChevronRight size={14} />
                  </Link>
                </div>

                {displayCourses.length > 0 ? (
                  <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                    {displayCourses.slice(0, 4).map((item: any) => {
                      // Handle both enrolled and non-enrolled course shapes
                      const course = item.courseData || item
                      const progress = item.progress || 0
                      const courseId = course.id || course.slug

                      // Get title - try common field names
                      const title = course.title_vi || course.title || course.name || course.course_name || 'Khóa học'
                      const lessons = course.lesson_count || course.total_lessons || course.lessons_count || 
                                      course.num_lessons || '?'
                      const level = course.difficulty_level || course.level || course.difficulty || course.tier || ''
                      const slug = course.slug || course.id

                      return (
                        <Link key={courseId} href={`/courses/${slug}`}
                          style={{ textDecoration: 'none' }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '14px',
                            padding: '14px 16px',
                            backgroundColor: 'var(--bg-surface)',
                            border: '1px solid var(--border)',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                          }}>
                            {/* Thumbnail or gradient */}
                            {course.thumbnail_url || course.image_url || course.cover ? (
                              <img
                                src={course.thumbnail_url || course.image_url || course.cover}
                                alt={title}
                                style={{ width:'48px', height:'48px', borderRadius:'10px',
                                         objectFit:'cover', flexShrink:0 }}
                              />
                            ) : (
                              <div style={{
                                width:'48px', height:'48px', borderRadius:'10px',
                                background:'linear-gradient(135deg, #7C3AED, #06B6D4)',
                                display:'flex', alignItems:'center', justifyContent:'center',
                                flexShrink:0
                              }}>
                                <BookOpen size={22} color="white" strokeWidth={1.5} />
                              </div>
                            )}

                            {/* Course info */}
                            <div style={{ flex:1, minWidth:0 }}>
                              <div style={{ fontSize:'15px', fontWeight:700, color:'var(--text-primary)',
                                marginBottom:'4px', overflow:'hidden',
                                textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                                {title}
                              </div>
                              <div style={{ fontSize:'12px', color:'var(--text-secondary)',
                                            marginBottom: hasEnrollments ? '8px' : '0' }}>
                                {lessons} bài học
                                {level && ` · ${level}`}
                                {hasEnrollments && item.last_lesson_title && ` · Đang học: ${item.last_lesson_title}`}
                              </div>

                              {/* Progress bar — only for enrolled */}
                              {hasEnrollments && (
                                <div style={{ height:'4px',
                                  backgroundColor:'var(--border)',
                                  borderRadius:'2px', overflow:'hidden' }}>
                                  <div style={{
                                    height:'100%',
                                    width:`${progress}%`,
                                    background: progress === 100
                                      ? 'linear-gradient(90deg, #10B981, #06B6D4)'
                                      : 'linear-gradient(90deg, #7C3AED, #A855F7)',
                                    borderRadius:'2px'
                                  }} />
                                </div>
                              )}
                            </div>

                            {/* Right side */}
                            <div style={{ flexShrink:0, display:'flex',
                                          alignItems:'center', gap:'8px', paddingLeft: 8 }}>
                              {hasEnrollments ? (
                                <span style={{ fontSize:'14px', fontWeight:800,
                                  color: progress === 100 ? '#10B981' : '#7C3AED' }}>
                                  {progress}%
                                </span>
                              ) : (
                                <span style={{
                                  fontSize:'13px', fontWeight:600, color:'#A855F7',
                                  backgroundColor:'rgba(124,58,237,0.15)',
                                  border:'1px solid rgba(124,58,237,0.3)',
                                  borderRadius:'8px', padding:'6px 14px'
                                }}>
                                  Bắt đầu
                                </span>
                              )}
                              <ChevronRight size={16} color="#475569" />
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                ) : (
                  // Only show empty state if TRULY nothing in DB
                  <div style={{ textAlign:'center', padding:'40px 20px' }}>
                    <div style={{
                      width: '72px', height: '72px',
                      borderRadius: '20px',
                      background: 'rgba(124, 58, 237, 0.15)',
                      border: '1px solid rgba(124, 58, 237, 0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 16px'
                    }}>
                      <Cpu size={36} color="#7C3AED" strokeWidth={1.5} />
                    </div>
                    <h3 style={{ fontSize: 18, color: 'var(--text-primary)', marginBottom: 8 }}>Chưa có khóa học nào</h3>
                    <p style={{ fontSize: 14, color: '#475569', maxWidth: 360, margin: '0 auto 24px', lineHeight: 1.6 }}>
                      Khám phá lộ trình thiết kế chip chuyên sâu từ digital logic đến kiến trúc AI.
                    </p>
                    <Link href="/courses" style={{ textDecoration: 'none' }}>
                      <button style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        background: 'linear-gradient(135deg, #7C3AED, #A855F7)', color: 'white',
                        fontSize: 14, fontWeight: 700,
                        padding: '12px 24px', borderRadius: 10, border: 'none',
                        cursor: 'pointer', margin: '0 auto'
                      }}>
                        <Search size={16} /> Khám phá ngay
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            )
          })()}
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          
          {/* Today's Goal Ring */}
          <div data-theme-area="card" className="card-redesign" style={{ padding: 20, backgroundColor: 'var(--bg-tertiary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Target size={16} color="#06B6D4" strokeWidth={2} />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Mục tiêu hôm nay
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <div style={{ position: 'relative', width: 90, height: 90 }}>
                <svg width="90" height="90" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="45" cy="45" r={RADIUS}
                    fill="none" stroke="var(--border)" strokeWidth="6" />
                  <circle cx="45" cy="45" r={RADIUS}
                    fill="none"
                    stroke="url(#progressGradient)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={strokeDashoffset}
                    style={{ transition: 'stroke-dashoffset 1s ease' }}
                  />
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#7C3AED" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ fontSize:'16px', fontWeight:800, color:'var(--text-primary)' }}>
                    {progressPercent}%
                  </span>
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize:'13px', color:'var(--text-secondary)', marginBottom: 2 }}>
                  Đã học <strong style={{color:'var(--text-primary)'}}>{stats.todayMinutes} phút</strong>
                </div>
                <div style={{ fontSize:'11px', color:'#475569' }}>
                  Còn {Math.max(0, DAILY_GOAL_MINUTES - stats.todayMinutes)} phút để xong mục tiêu!
                </div>
              </div>
            </div>
          </div>

          {/* AI Tutor Tip */}
          <div data-theme-area="card" className="card-redesign" style={{ 
            padding: 20,
            backgroundColor: 'var(--bg-tertiary)',
            borderLeft: '4px solid #7C3AED'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{
                width: '32px', height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                <Bot size={16} color="white" strokeWidth={2} />
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                MẸO TỪ AI TUTOR
              </div>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, fontStyle: 'italic', margin: 0 }}>
              "Khi thiết kế flip-flop, luôn dùng non-blocking assignment (&lt;=) trong always block để tránh race condition."
            </p>
            <Link href="/ai-tutor" style={{ textDecoration: 'none' }}>
              <div style={{ marginTop: 12, fontSize: 12, fontWeight: 600, color: '#7C3AED', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                Hỏi AI Tutor thêm <ArrowRight size={14} />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, subtext, icon: Icon, color, iconBg, iconBorder }: any) {
  return (
    <div data-theme-area="card" className="card-redesign" style={{ 
      padding: '20px',
      backgroundColor: 'var(--bg-tertiary)',
      border: '1px solid var(--border)',
      borderRadius: '14px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {label}
        </div>
        <div style={{
          width: '36px', height: '36px',
          borderRadius: '9px',
          background: iconBg,
          border: `1px solid ${iconBorder}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Icon size={18} color={color} strokeWidth={2} />
        </div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
        {subtext}
      </div>
    </div>
  )
}

function CourseProgressCard({ course, progress, lastLesson, href }: any) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '14px 16px',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid rgba(255,255,255,0.04)',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}>
        <div style={{
          width: '48px', height: '48px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 4px 12px rgba(124,58,237,0.2)'
        }}>
          <BookOpen size={22} color="white" strokeWidth={1.5} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '15px', fontWeight: 700,
            color: 'var(--text-primary)', marginBottom: '4px',
            overflow: 'hidden', textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {course?.title_vi || course?.title}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {lastLesson || 'Bắt đầu học'}
          </div>
          <div style={{
            height: '4px',
            backgroundColor: 'var(--border)',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: progress === 100
                ? 'linear-gradient(90deg, #10B981, #06B6D4)'
                : 'linear-gradient(90deg, #7C3AED, #A855F7)',
              borderRadius: '2px',
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>

        <div style={{ textAlign: 'right', flexShrink: 0, paddingLeft: 8 }}>
          <div style={{
            fontSize: '14px', fontWeight: 800,
            color: progress === 100 ? '#10B981' : '#A855F7'
          }}>
            {progress}%
          </div>
          <ChevronRight size={14} color="#334155" />
        </div>
      </div>
    </Link>
  )
}
