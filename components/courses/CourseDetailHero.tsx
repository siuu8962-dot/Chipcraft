import { 
  Users, 
  Star, 
  Timer, 
  ArrowRight
} from 'lucide-react'

interface CourseDetailHeroProps {
  course: any
  isEnrolled: boolean
}

export function CourseDetailHero({ course, isEnrolled }: CourseDetailHeroProps) {
  const price = course.price ?? course.price_vnd ?? course.price_usd;
  const isFree = course.is_free || price === 0 || price == null;
  const priceText = isFree ? 'Miễn phí' : (typeof price === 'number' && price > 1000 ? `${price.toLocaleString('vi-VN')}₫` : `$${price}`);

  return (
    <div className="hero" style={{
      background: 'linear-gradient(135deg, #1A1B3A, #1E1040)',
      padding: '40px 40px 32px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative',
      borderBottom: '1px solid #2D3060'
    }}>
      {/* Absolute Thumbnail */}
      <div style={{
        position: 'absolute',
        top: 40,
        right: 40,
        width: 100, 
        height: 100,
        borderRadius: 16,
        background: 'linear-gradient(to bottom right, #7C3AED, #4C1D95)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
        border: '1px solid rgba(255,255,255,0.1)',
        zIndex: 10
      }}>
        <svg width="48" height="48" viewBox="0 0 40 40" fill="none">
          <rect x="10" y="10" width="20" height="20" rx="4" stroke="#A78BFA" strokeWidth="2"/>
          <rect x="15" y="15" width="10" height="10" rx="2" fill="#A78BFA" fillOpacity="0.3" stroke="#A78BFA" strokeWidth="1.5"/>
          <line x1="15" y1="10" x2="15" y2="5" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round"/>
          <line x1="20" y1="10" x2="20" y2="5" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round"/>
          <line x1="25" y1="10" x2="25" y2="5" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round"/>
          <line x1="15" y1="30" x2="15" y2="35" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round"/>
          <line x1="20" y1="30" x2="20" y2="35" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round"/>
          <line x1="25" y1="30" x2="25" y2="35" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round"/>
          <line x1="10" y1="15" x2="5" y2="15" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round"/>
          <line x1="10" y1="20" x2="5" y2="20" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round"/>
          <line x1="10" y1="25" x2="5" y2="25" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round"/>
          <line x1="30" y1="15" x2="35" y2="15" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round"/>
          <line x1="30" y1="20" x2="35" y2="20" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round"/>
          <line x1="30" y1="25" x2="35" y2="25" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>

      <div style={{ maxWidth: 'calc(100% - 130px)', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <span style={{ padding: '2px 12px', background: '#7C3AED22', color: '#A78BFA', borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {course.difficulty_level || 'BEGINNER'}
          </span>
          <span style={{ padding: '2px 12px', background: '#12132A', color: '#94A3B8', border: '1px solid #2D3060', borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {course.actual_lesson_count || course.lesson_count || 0} bài học
          </span>
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 600, color: '#F1F5F9', marginBottom: 12, lineHeight: 1.2 }}>
          {course.title_vi}
        </h1>
        <p style={{ fontSize: 14, color: '#94A3B8', marginBottom: 24, lineHeight: 1.5 }}>
          {course.description_vi}
        </p>

        {/* Stats Row */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Star size={14} color="#F59E0B" fill="#F59E0B" />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#F1F5F9' }}>{course.rating ?? 4.8}</span>
            <span style={{ fontSize: 13, color: '#64748B' }}>({course.rating_count ?? 128})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Users size={14} color="#94A3B8" />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#F1F5F9' }}>{(course.student_count ?? 1205).toLocaleString()}</span>
            <span style={{ fontSize: 13, color: '#64748B' }}>học viên</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Timer size={14} color="#94A3B8" />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#F1F5F9' }}>
              {course.total_duration_hours > 0 ? `${course.total_duration_hours} giờ` : `${course.total_duration_minutes || 0} phút`}
            </span>
          </div>
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {isEnrolled ? (
            <button style={{ height: 44, padding: '0 24px', background: '#F1F5F9', color: '#0E0F1A', fontSize: 14, fontWeight: 600, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8, border: 'none', cursor: 'pointer' }}>
              Tiếp tục học
              <ArrowRight size={16} />
            </button>
          ) : (
            <>
              <button style={{ height: 44, padding: '0 24px', background: 'linear-gradient(to right, #7C3AED, #6D28D9)', color: '#F1F5F9', fontSize: 14, fontWeight: 600, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8, border: '1px solid rgba(167, 139, 250, 0.3)', cursor: 'pointer' }}>
                Ghi danh ngay
                <ArrowRight size={16} />
              </button>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#10B981' }}>
                {priceText}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
