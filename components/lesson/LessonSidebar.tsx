'use client'
import Link from 'next/link'

interface LessonSidebarProps {
  course: any
  currentLessonId: string
  completedLessonIds?: string[]
}

const VideoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="5" width="20" height="14" rx="3" />
    <polygon points="10,9 15,12 10,15" />
  </svg>
)

const ArticleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="M8 8h8M8 12h8M8 16h4" />
  </svg>
)

const LabIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M9 3H15M10 3V8L4 21H20L14 8V3" />
  </svg>
)

const QuizIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="9" />
    <path d="M10.5 9A1.5 1.5 0 0 1 13.5 9C13.5 10.5 12 11 12 12" strokeLinecap="round" />
    <circle cx="12" cy="15.5" r="1" fill="currentColor" />
  </svg>
)

const LockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
)

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12l5 5L20 7" />
  </svg>
)

export function LessonSidebar({ course, currentLessonId, completedLessonIds }: LessonSidebarProps) {
  const lessonIcons: Record<string, React.FC> = {
    video: VideoIcon,
    article: ArticleIcon,
    quiz: QuizIcon,
    lab: LabIcon,
  }

  return (
    <div data-sidebar-alt className="lesson-sidebar custom-scrollbar" style={{ width: '100%', height: '100%', background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8, fontWeight: 700 }}>Khóa học</div>
        <Link href={`/courses/${course.slug}`} className="hover:underline">
          <h2 style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 700, margin: 0 }}>{course.title_vi}</h2>
        </Link>
      </div>

      <div style={{ flex: 1 }}>
        {course.course_sections?.sort((a: any, b: any) => a.order_index - b.order_index).map((section: any) => (
          <div key={section.id}>
            <div className="chapter-header" style={{ padding: '10px 16px', fontSize: 10, color: '#475569', fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', background: 'var(--bg-primary)', display: 'flex', justifyContent: 'space-between' }}>
              <span>{section.title_vi}</span>
              <span>{section.lessons?.length || 0} bài</span>
            </div>
            <div>
              {section.lessons?.sort((a: any, b: any) => a.order_index - b.order_index).map((lesson: any) => {
                const Icon = lessonIcons[lesson.type] || VideoIcon
                const isActive = lesson.id === currentLessonId
                const isCompleted = completedLessonIds?.includes(lesson.id)
                const rawDur = lesson.duration_minutes?.toString() || '';
                const cleanDurMatch = rawDur.match(/\d+/);
                const finalDur = cleanDurMatch ? cleanDurMatch[0] : '10';

                return (
                  <Link 
                    key={lesson.id}
                    href={`/learn/${course.slug}/${lesson.slug}`}
                    className="lesson-row"
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', cursor: 'pointer',
                      borderLeft: `2px solid ${isActive ? '#7C3AED' : 'transparent'}`,
                      background: isActive ? 'rgba(124, 58, 237, 0.08)' : 'transparent',
                      textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.background = 'var(--bg-surface)'
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    <div style={{ flexShrink: 0, color: isActive ? '#A855F7' : 'var(--text-muted)', display: 'flex' }}>
                      <Icon />
                    </div>
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                      <span className="lesson-title" style={{ fontSize: 12, color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)', lineHeight: 1.4, margin: 0, display: 'block', fontWeight: isActive ? 600 : 400 }}>
                        {lesson.title_vi}
                      </span>
                      <span className="lesson-meta" style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>
                        {finalDur} phút • {lesson.type === 'video' ? 'Video' : lesson.type === 'article' ? 'Lý thuyết' : lesson.type === 'quiz' ? 'Trắc nghiệm' : 'Thực hành'}
                      </span>
                    </div>
                    {/* Completion/lock icon based on real progress */}
                    <div style={{ flexShrink: 0, display: 'flex', color: isCompleted ? '#10B981' : '#475569' }}>
                      {isCompleted || lesson.is_free_preview ? <CheckIcon /> : <LockIcon />}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


