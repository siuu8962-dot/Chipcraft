'use client'
import { Lightning, Fire, Trophy, BookOpen } from '@/lib/icons'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  icon: any
  color: string
  trend?: string
}

function StatCard({ label, value, icon: Icon, color, trend }: StatCardProps) {
  return (
    <div className="p-6 rounded-2xl bg-bg-secondary border border-border hover:border-teal/30 transition-all shadow-card hover:shadow-hover group">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-2 rounded-lg", color)}>
          <Icon size={20} weight="duotone" />
        </div>
        {trend && (
          <span className="text-[10px] font-bold text-teal bg-teal/10 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-text-muted text-xs font-semibold uppercase tracking-wider mb-1">{label}</h3>
      <p className="text-2xl font-extrabold text-text-primary">{value}</p>
    </div>
  )
}

export function StatsCards({ stats }: { stats: any }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <StatCard 
        label="Tổng XP" 
        value={stats.xp || 0} 
        icon={Lightning} 
        color="text-amber bg-amber/10" 
        trend="+120 hôm nay"
      />
      <StatCard 
        label="Chuỗi học" 
        value={`${stats.streak || 0} ngày`} 
        icon={Fire} 
        color="text-coral bg-coral/10" 
      />
      <StatCard 
        label="Khóa học" 
        value={stats.courses_count || 0} 
        icon={BookOpen} 
        color="text-teal bg-teal/10" 
      />
      <StatCard 
        label="Xếp hạng" 
        value={`#${stats.rank || '--'}`} 
        icon={Trophy} 
        color="text-purple bg-purple/10" 
      />
    </div>
  )
}
