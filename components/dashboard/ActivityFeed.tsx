import { 
  CheckCircle, 
  Sparkle, 
  Flask, 
  Trophy,
  Clock
} from '@/lib/icons'
import { cn, formatDate } from '@/lib/utils'

const activityIcons = {
  lesson_complete: { icon: CheckCircle, color: 'text-teal bg-teal/10' },
  ai_chat: { icon: Sparkle, color: 'text-purple bg-purple/10' },
  lab_pass: { icon: Flask, color: 'text-blue-500 bg-blue-500/10' },
  achievement: { icon: Trophy, color: 'text-amber bg-amber/10' },
}

export function ActivityFeed({ activities }: { activities: any[] }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="py-12 text-center">
        <Clock size={48} weight="duotone" className="mx-auto text-text-muted mb-4 opacity-20" />
        <p className="text-sm text-text-secondary">Chưa có hoạt động nào hôm nay.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {activities.map((activity, i) => {
        const type = activity.type as keyof typeof activityIcons
        const cfg = activityIcons[type] || activityIcons.lesson_complete
        return (
          <div key={activity.id} className="flex gap-4 group">
            <div className="flex flex-col items-center">
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10", cfg.color)}>
                <cfg.icon size={20} weight="fill" />
              </div>
              {i < activities.length - 1 && (
                <div className="w-0.5 flex-1 bg-border my-2" />
              )}
            </div>
            <div className="pb-6">
              <p className="text-sm font-bold text-text-primary mb-1">
                {activity.description_vi}
              </p>
              <div className="flex items-center gap-3">
                <span className="text-xs text-text-muted">{formatDate(activity.created_at)}</span>
                {activity.xp_earned > 0 && (
                  <span className="text-[10px] font-bold text-teal bg-teal/10 px-2 py-0.5 rounded-full">
                    +{activity.xp_earned} XP
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
