'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { mockUserStats, mockCourses } from '@/lib/mock-data'
import { useNavigation } from '@/lib/contexts'
import { Lightning, Fire, BookOpen, Trophy, TrendUp, Medal, Sparkle, CheckCircle } from '@phosphor-icons/react'

export default function Dashboard() {
  const { setCurrentView, setSelectedCourseId } = useNavigation()

  const handleStartCourse = (courseId: string) => {
    setSelectedCourseId(courseId)
    setCurrentView('player')
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header Stats */}
      <div>
        <h1 className="text-4xl font-display font-bold mb-2">
          Xin chào, {mockUserStats.name.split(' ')[mockUserStats.name.split(' ').length - 1]}! 👋
        </h1>
        <p className="text-muted-foreground">Tiếp tục hành trình học tập nhúng hệ thống của bạn</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-card/50 to-primary/10 border-primary/30 hover:border-primary/60 transition-all hover:shadow-lg hover:shadow-primary/20 group">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Điểm tích lũy</div>
              <div className="text-4xl font-display font-bold text-primary">{mockUserStats.totalPoints}</div>
            </div>
            <Lightning size={16} weight="fill" className="text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xs text-muted-foreground">+250 tuần này</div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-card/50 to-accent/10 border-accent/30 hover:border-accent/60 transition-all hover:shadow-lg hover:shadow-accent/20 group">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Chuỗi học tập</div>
              <div className="text-4xl font-display font-bold text-accent">{mockUserStats.streak}</div>
            </div>
            <Fire size={16} weight="fill" className="text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xs text-muted-foreground">Ngày liên tiếp</div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-card/50 to-secondary/10 border-secondary/30 hover:border-secondary/60 transition-all hover:shadow-lg hover:shadow-secondary/20 group">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Khóa học</div>
              <div className="text-4xl font-display font-bold text-secondary">{mockUserStats.coursesCompleted}</div>
            </div>
            <BookOpen size={16} weight="regular" className="text-secondary/60 group-hover:text-secondary transition-colors" />
          </div>
          <div className="text-xs text-muted-foreground">{mockUserStats.coursesInProgress} đang học</div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-card/50 to-primary/10 border-primary/30 hover:border-primary/60 transition-all hover:shadow-lg hover:shadow-primary/20 group">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Xếp hạng</div>
              <div className="text-4xl font-display font-bold">#{mockUserStats.leaderboardRank}</div>
            </div>
            <Trophy size={16} weight="fill" className="text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xs text-muted-foreground">Hạng {Math.round(mockUserStats.leaderboardRank / 500 * 100)}%</div>
        </Card>
      </div>

      {/* Continue Learning */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-display font-bold">Tiếp tục học</h2>
          <Button
            variant="ghost"
            onClick={() => setCurrentView('courses')}
          >
            Xem tất cả →
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCourses.slice(0, 3).map((course) => (
            <Card key={course.id} className="bg-card overflow-hidden hover:border-primary transition-colors cursor-pointer group">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-display font-bold text-base mb-1">{course.title}</h3>
                  <p className="text-xs text-muted-foreground">Giảng viên: {course.instructor}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Tiến độ</span>
                    <span className="text-primary font-semibold">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>

                <Button
                  variant="default"
                  size="sm"
                  className="w-full"
                  onClick={() => handleStartCourse(course.id)}
                >
                  {course.progress > 0 ? 'Tiếp tục' : 'Bắt đầu'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-display font-bold mb-4 flex items-center gap-2">
          <TrendUp size={24} weight="regular" className="text-primary" />
          Hoạt động gần đây
        </h2>
        <Card className="bg-card/50 backdrop-blur border-primary/20 p-6">
          <div className="space-y-3">
            {[
              { Icon: CheckCircle, color: '#00D4B4', time: '2 giờ trước', action: 'Hoàn thành bài Lab: LED Blink Pattern', weight: 'fill' },
              { Icon: TrendUp, color: '#FF6B6B', time: '1 ngày trước', action: 'Đạt 100% trong Quiz: GPIO Configuration', weight: 'regular' },
              { Icon: BookOpen, color: '#F59E0B', time: '2 ngày trước', action: 'Hoàn thành bài học: Cơ bản UART Protocol', weight: 'regular' },
              { Icon: Sparkle, color: '#00D4B4', time: '3 ngày trước', action: 'Mở khóa thành tích: Chiến binh mã', weight: 'regular' },
            ].map((activity, idx) => {
              const Icon = activity.Icon
              return (
                <div key={idx} className="flex gap-3 pb-3 border-b border-border/50 last:border-0 last:pb-0 hover:translate-x-1 transition-transform">
                  <Icon size={16} weight={activity.weight as any} color={activity.color} className="flex-shrink-0 mt-0.5" />

                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}
