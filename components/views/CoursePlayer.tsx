'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { mockCourses } from '@/lib/mock-data'
import { useNavigation } from '@/lib/contexts'
import { CodeEditor } from '@/components/CodeEditor'
import { VideoCamera, Sparkle, Terminal, Question, CaretLeft } from '@phosphor-icons/react'

export default function CoursePlayer() {
  const { selectedCourseId, setCurrentView } = useNavigation()
  const [activeTab, setActiveTab] = useState('lesson')
  const [activeLesson, setActiveLesson] = useState(0)

  const course = mockCourses.find((c) => c.id === selectedCourseId)

  if (!course || course.lessons.length === 0) {
    return (
      <div className="p-8">
        <Button onClick={() => setCurrentView('courses')} variant="ghost" className="mb-4 gap-2">
          <CaretLeft size={16} weight="bold" />
          Quay lại khóa học
        </Button>
        <Card className="p-8 bg-card text-center">
          <p className="text-muted-foreground">Khóa học này sắp ra mắt</p>
        </Card>
      </div>
    )
  }

  const lesson = course.lessons[activeLesson]

  return (
    <div className="p-8 space-y-6">
      <Button onClick={() => setCurrentView('courses')} variant="ghost" className="mb-4 gap-2">
        <CaretLeft size={16} weight="bold" />
        {course.title}
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Panel - Lessons Tree */}
        <div className="lg:col-span-1">
          <Card className="bg-card p-4">
            <h3 className="font-display font-bold text-sm mb-4">Danh sách bài học</h3>
            <ScrollArea className="h-96">
              <div className="space-y-2 pr-4">
                {course.lessons.map((l, idx) => (
                  <button
                    key={l.id}
                    onClick={() => setActiveLesson(idx)}
                    className={`w-full text-left px-3 py-2 rounded transition-colors text-sm ${
                      activeLesson === idx
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted text-foreground'
                    }`}
                  >
                    <div className="font-semibold">{idx + 1}. {l.title}</div>
                    <div className="text-xs opacity-70">{l.duration} phút</div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </div>

        {/* Center Panel - Main Content */}
        <div className="lg:col-span-2">
          <Card className="bg-card overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start border-b border-border rounded-none bg-card px-4">
                <TabsTrigger value="lesson" className="gap-2">
                  <VideoCamera size={14} weight="regular" />
                  <span className="hidden sm:inline">Bài học</span>
                </TabsTrigger>
                <TabsTrigger value="tutor" className="gap-2">
                  <Sparkle size={14} weight="regular" />
                  <span className="hidden sm:inline">AI Tutor</span>
                </TabsTrigger>
                <TabsTrigger value="lab" className="gap-2">
                  <Terminal size={14} weight="regular" />
                  <span className="hidden sm:inline">Lab</span>
                </TabsTrigger>
                <TabsTrigger value="quiz" className="gap-2">
                  <Question size={14} weight="regular" />
                  <span className="hidden sm:inline">Quiz</span>
                </TabsTrigger>
              </TabsList>

              {/* Lesson Tab */}
              <TabsContent value="lesson" className="tab-content-enter p-6 space-y-4">
                <div>
                  <h2 className="text-2xl font-display font-bold mb-2">{lesson.title}</h2>
                  <p className="text-muted-foreground">{lesson.content}</p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🎥</div>
                    <p className="text-sm text-muted-foreground">Video player placeholder</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-display font-semibold mb-3">Code Example:</h3>
                  <CodeEditor
                    code={lesson.code}
                    language={lesson.codeLanguage}
                  />
                </div>
              </TabsContent>

              {/* AI Tutor Tab */}
              <TabsContent value="tutor" className="tab-content-enter p-6 space-y-4">
                <div className="h-96 flex flex-col gap-4">
                  <div className="flex-1 bg-muted/30 rounded-lg p-4 overflow-y-auto">
                    <div className="text-sm text-muted-foreground">Tutor sẽ giúp bạn tại đây</div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Đặt câu hỏi..."
                      className="flex-1 px-3 py-2 bg-input border border-border rounded"
                    />
                    <Button>Gửi</Button>
                  </div>
                </div>
              </TabsContent>

              {/* Lab Tab */}
              <TabsContent value="lab" className="tab-content-enter p-6 space-y-4">
                <div>
                  <h3 className="font-display font-semibold mb-2">Lab Challenge:</h3>
                  <p className="text-sm text-muted-foreground mb-4">{lesson.labCode}</p>
                </div>
                <CodeEditor
                  code={lesson.labCode}
                  language={lesson.codeLanguage}
                  isLabMode
                />
              </TabsContent>

              {/* Quiz Tab */}
              <TabsContent value="quiz" className="tab-content-enter p-6 space-y-4">
                {lesson.quiz.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-display font-semibold">{lesson.quiz[0].question}</h3>
                    <div className="space-y-2">
                      {lesson.quiz[0].options.map((option, idx) => (
                        <button
                          key={idx}
                          className="w-full text-left px-4 py-3 border border-border rounded hover:bg-primary/10 transition"
                        >
                          {String.fromCharCode(65 + idx)}) {option}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* Right Panel - Notes */}
        <div className="lg:col-span-1">
          <Card className="bg-card p-4">
            <h3 className="font-display font-bold text-sm mb-4">Ghi chú</h3>
            <textarea
              placeholder="Viết ghi chú của bạn tại đây..."
              className="w-full h-96 px-3 py-2 bg-input border border-border rounded text-sm resize-none"
            />
          </Card>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-2 justify-between">
        <Button
          variant="outline"
          onClick={() => setActiveLesson(Math.max(0, activeLesson - 1))}
          disabled={activeLesson === 0}
        >
          ← Bài trước
        </Button>
        <Button
          onClick={() => setActiveLesson(Math.min(course.lessons.length - 1, activeLesson + 1))}
          disabled={activeLesson === course.lessons.length - 1}
        >
          Bài tiếp theo →
        </Button>
      </div>
    </div>
  )
}
