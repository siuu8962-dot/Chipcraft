'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { mockAchievements, mockLeaderboard } from '@/lib/mock-data'

export default function Achievements() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-display font-bold mb-2">Thành tích & Bảng xếp hạng</h1>
        <p className="text-muted-foreground">Theo dõi tiến trình và cạnh tranh với người dùng khác</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Badges */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-display font-bold mb-4">Huy hiệu & Thành tích</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {mockAchievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={`p-4 text-center space-y-2 ${
                  achievement.progress === 100
                    ? 'bg-card border-secondary'
                    : 'bg-card/50 border-muted'
                }`}
              >
                <div className="text-3xl">{achievement.icon}</div>
                <h3 className="font-display font-bold text-sm">{achievement.title}</h3>
                <p className="text-xs text-muted-foreground">{achievement.description}</p>
                {achievement.progress < 100 && (
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-primary">{achievement.progress}%</div>
                    <Progress value={achievement.progress} className="h-1" />
                  </div>
                )}
                {achievement.progress === 100 && (
                  <div className="text-xs font-semibold text-secondary">✓ Đã mở khóa</div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <Card className="bg-card p-6 space-y-4">
            <h3 className="font-display font-bold">Thống kê của bạn</h3>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Tổng điểm</div>
                <div className="text-2xl font-display font-bold text-primary">3,450</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Xếp hạng</div>
                <div className="text-2xl font-display font-bold text-accent">Top 47</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Chuỗi đang học</div>
                <div className="text-2xl font-display font-bold text-secondary">7 ngày 🔥</div>
              </div>
            </div>
          </Card>

          <Card className="bg-primary/10 p-4 border-primary">
            <p className="text-sm text-primary font-semibold">💡 Tiếp tục học để mở khóa thêm huy hiệu!</p>
          </Card>
        </div>
      </div>

      {/* Leaderboard */}
      <div>
        <h2 className="text-2xl font-display font-bold mb-4">Bảng xếp hạng toàn cầu</h2>
        <Card className="bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-display font-bold text-sm">Xếp hạng</th>
                  <th className="text-left px-4 py-3 font-display font-bold text-sm">Người dùng</th>
                  <th className="text-right px-4 py-3 font-display font-bold text-sm">Điểm</th>
                </tr>
              </thead>
              <tbody>
                {mockLeaderboard.map((user) => (
                  <tr
                    key={user.rank}
                    className={`border-b border-border hover:bg-muted/50 transition ${
                      user.isCurrentUser ? 'bg-primary/10' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {user.rank <= 3 && <span className="text-lg">{['🥇', '🥈', '🥉'][user.rank - 1]}</span>}
                        <span className="font-display font-bold">#{user.rank}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{user.avatar}</span>
                        <span className="font-semibold">{user.name}</span>
                        {user.isCurrentUser && <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Bạn</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-primary">{user.points.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
