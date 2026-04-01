'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { mockCourses } from '@/lib/mock-data'
import { useNavigation } from '@/lib/contexts'

export default function Courses() {
  const { setCurrentView, setSelectedCourseId } = useNavigation()
  const [filter, setFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all')

  const filteredCourses = mockCourses.filter(
    (course) => filter === 'all' || course.level === filter
  )

  const handleStartCourse = (courseId: string) => {
    setSelectedCourseId(courseId)
    setCurrentView('player')
  }

  const getLevelBadge = (level: string) => {
    const badges: Record<string, { label: string; color: string }> = {
      beginner: { label: 'Cơ bản', color: 'bg-accent/10 text-accent' },
      intermediate: { label: 'Trung cấp', color: 'bg-secondary/10 text-secondary' },
      advanced: { label: 'Nâng cao', color: 'bg-primary/10 text-primary' },
    }
    const badge = badges[level]
    return <span className={`text-xs font-semibold px-2 py-1 rounded ${badge.color}`}>{badge.label}</span>
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-display font-bold mb-2">Khóa học</h1>
        <p className="text-muted-foreground">Khám phá các khóa học hệ thống nhúng từ cơ bản đến nâng cao</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((level) => (
          <Button
            key={level}
            variant={filter === level ? 'default' : 'outline'}
            onClick={() => setFilter(level)}
            className="capitalize"
          >
            {level === 'all' ? 'Tất cả' : level === 'beginner' ? 'Cơ bản' : level === 'intermediate' ? 'Trung cấp' : 'Nâng cao'}
          </Button>
        ))}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card
            key={course.id}
            className="bg-card overflow-hidden hover:border-primary transition-all cursor-pointer group"
            onClick={() => handleStartCourse(course.id)}
          >
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute top-3 right-3">
                {getLevelBadge(course.level)}
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-display font-bold text-base mb-1 line-clamp-2">{course.title}</h3>
                <p className="text-xs text-muted-foreground">Giảng viên: {course.instructor}</p>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>

              <div className="space-y-1">
                {course.progress > 0 && (
                  <>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Tiến độ</span>
                      <span className="text-primary font-semibold">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </>
                )}
              </div>

              <div className="flex gap-2 text-xs text-muted-foreground">
                <span>⏱️ {course.duration}</span>
                <span>•</span>
                <span>👥 {course.studentsEnrolled.toLocaleString()}</span>
              </div>

              <Button
                variant="default"
                size="sm"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation()
                  handleStartCourse(course.id)
                }}
              >
                {course.progress > 0 ? 'Tiếp tục' : 'Tìm hiểu thêm'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
