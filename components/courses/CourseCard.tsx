import Link from 'next/link'
import { Users, Star, Timer, CaretRight } from '@/lib/icons'
import { cn } from '@/lib/utils'

interface CourseCardProps {
  course: any
}

const difficultyColors: Record<string, string> = {
  beginner: 'text-teal bg-teal/10',
  intermediate: 'text-amber bg-amber/10',
  advanced: 'text-purple bg-purple/10',
  expert: 'text-coral bg-coral/10',
}

const difficultyLabels: Record<string, string> = {
  beginner: 'Cơ bản',
  intermediate: 'Trung cấp',
  advanced: 'Nâng cao',
  expert: 'Chuyên gia',
}

export function CourseCard({ course }: CourseCardProps) {
  // Map schema 'difficulty_level' to component 'difficulty' keys
  const difficulty = (course.difficulty_level || 'Beginner').toLowerCase()
  const diffColor = difficultyColors[difficulty] || difficultyColors.beginner
  const diffLabel = difficultyLabels[difficulty] || difficultyLabels.beginner


  return (
    <div className="group bg-bg-secondary border border-border rounded-2xl overflow-hidden hover:border-teal/50 transition-all shadow-card hover:shadow-hover flex flex-col">
      <div className="aspect-video bg-bg-tertiary relative overflow-hidden">
        {course.thumbnail_url ? (
          <img 
            src={course.thumbnail_url} 
            alt={course.title_vi} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl font-black text-text-muted opacity-20 uppercase tracking-widest">
              {course.slug.split('-')[0]}
            </span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={cn("px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider", diffColor)}>
            {diffLabel}
          </span>
        </div>
        {course.is_free_preview && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 bg-amber text-bg-primary rounded-md text-[10px] font-bold uppercase tracking-wider">
              Preview
            </span>
          </div>
        )}

      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-text-primary mb-2 line-clamp-1 group-hover:text-teal transition-colors">
          {course.title_vi}
        </h3>
        <p className="text-sm text-text-secondary line-clamp-2 mb-4 flex-1">
          {course.description_vi}
        </p>

        <div className="flex items-center justify-between text-[11px] font-bold text-text-muted uppercase tracking-wider mb-5">
          <div className="flex items-center gap-1.5">
            <Users size={14} className="text-teal" />
            <span>{(course.enrollments_count || 0).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Timer size={14} className="text-amber" />
            <span>{course.duration_hours || 0} giờ</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star size={14} weight="fill" className="text-amber" />
            <span>{(course.average_rating || 5.0).toFixed(1)}</span>
          </div>
        </div>


        <Link 
          href={`/courses/${course.slug}`}
          className="w-full h-10 bg-bg-surface border border-border hover:bg-teal hover:text-bg-primary hover:border-teal rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all"
        >
          Xem chi tiết
          <CaretRight size={14} />
        </Link>
      </div>
    </div>
  )
}
