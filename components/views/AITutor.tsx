'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Robot, PaperPlaneTilt, Cpu } from '@phosphor-icons/react'


export default function AITutor() {
  const [messages, setMessages] = useState([
    { role: 'tutor', text: 'Xin chào! 👋 Tôi là ChipCraft AI Tutor. Tôi sẵn sàng giúp bạn học về hệ thống nhúng. Bạn muốn hỏi gì?' },
  ])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return
    setMessages([...messages, { role: 'user', text: input }])
    setInput('')
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-4xl font-display font-bold mb-2 flex items-center gap-3">
          <Robot size={36} weight="regular" color="#00D4B4" />
          AI Tutor
        </h1>
        <p className="text-muted-foreground">Hỏi bất kỳ câu hỏi nào về embedded systems</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat */}
        <Card className="lg:col-span-3 bg-card flex flex-col h-[600px]">
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'tutor' && (
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                      <Cpu size={14} weight="regular" color="#00D4B4" />

                    </div>
                  )}
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Đặt câu hỏi..."
              className="flex-1 px-4 py-2 bg-input border border-border rounded"
            />
            <Button onClick={handleSend} className="gap-2">
              <PaperPlaneTilt size={16} weight="fill" />
              <span className="hidden sm:inline">Gửi</span>
            </Button>
          </div>
        </Card>

        {/* Sidebar - Suggested Topics */}
        <div className="space-y-4">
          <Card className="bg-card p-4">
            <h3 className="font-display font-bold text-sm mb-3">Chủ đề được đề xuất</h3>
            <div className="space-y-2">
              {['GPIO Configuration', 'UART Protocol', 'Interrupts'].map((topic) => (
                <button
                  key={topic}
                  className="w-full text-left px-3 py-2 text-sm bg-muted/50 hover:bg-muted rounded transition"
                  onClick={() => setInput(`Giải thích về ${topic}`)}
                >
                  {topic}
                </button>
              ))}
            </div>
          </Card>

          <Card className="bg-accent/10 p-4">
            <p className="text-xs text-muted-foreground">Tutor có sẵn 24/7 để giúp bạn!</p>
          </Card>
        </div>
      </div>
    </div>
  )
}
