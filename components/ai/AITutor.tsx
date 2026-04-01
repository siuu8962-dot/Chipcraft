'use client'
import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { MarkdownRenderer, normalizeAgentResponse } from '@/components/shared/MarkdownRenderer'
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Zap,
  MoreHorizontal,
  Settings,
  Paperclip,
  Loader2,
  CheckCircle,
  History
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export function AITutor({ 
  lessonId, 
  courseId, 
  context,
  externalMessages,
  conversationId,
  onMessagesChange,
  onConversationIdChange
}: { 
  lessonId?: string, 
  courseId?: string, 
  context?: string,
  externalMessages?: Message[],
  conversationId?: string,
  onMessagesChange?: (messages: Message[]) => void,
  onConversationIdChange?: (id: string) => void
}) {
  const [messages, setMessages] = useState<Message[]>(externalMessages || [])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Sync with external messages when loading a conversation
  useEffect(() => {
    if (externalMessages) {
      setMessages(externalMessages)
    }
  }, [externalMessages])

  const messagesLengthRef = useRef(0)
  const lastMessageRef = useRef('')

  // Notify parent of message changes
  useEffect(() => {
    if (!onMessagesChange || messages.length === 0) return

    const lastMsg = messages[messages.length - 1]
    const lastContent = lastMsg?.content ?? ''

    if (
      messages.length === messagesLengthRef.current &&
      lastContent === lastMessageRef.current
    ) return

    messagesLengthRef.current = messages.length
    lastMessageRef.current = lastContent
    
    onMessagesChange(messages)
  }, [messages, onMessagesChange])

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const addMessage = (msg: Message) => {
    setMessages(prev => {
      if (prev.find(m => m.id === msg.id)) return prev // skip duplicate
      return [...prev, msg]
    })
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      created_at: new Date().toISOString()
    }

    addMessage(userMessage)
    setInput('')
    setIsLoading(true)

    try {
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }))

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          history,
          lessonId,
          courseId,
          context,
          conversationId
        })
      })

      if (!response.ok) throw new Error('Không thể kết nối với AI Tutor.')
      const data = await response.json()
      
      if (data.conversationId && onConversationIdChange) {
        onConversationIdChange(data.conversationId)
      }
      
      addMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.reply,
        created_at: new Date().toISOString()
      })
    } catch (err: any) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div data-theme-area="main" style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--bg-primary)' }}>
      {/* ── CHAT HEADER ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
        backgroundColor: 'var(--bg-secondary)'
      }} className="md:px-5 md:py-3">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="md:gap-3">
          {/* Avatar with status dot */}
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF'
            }} className="md:w-10 md:h-10">
              <Zap size={16} fill="white" className="md:w-5 md:h-5" />
            </div>
            <div style={{
              position: 'absolute',
              bottom: '-1px',
              right: '-1px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              border: '2px solid var(--bg-secondary)'
            }} />
          </div>

          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }} className="md:text-base">AI Chip Tutor</span>
              <span className="desktop-only" style={{
                fontSize: '10px',
                fontWeight: 600,
                color: 'var(--success)',
                backgroundColor: 'rgba(16,185,129,0.12)',
                border: '1px solid rgba(16,185,129,0.25)',
                padding: '1px 8px',
                borderRadius: '20px',
                letterSpacing: '0.04em'
              }}>TRỰC TUYẾN</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="md:text-xs">
              Gemini 2.5 Flash · Chuyên gia RTL
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '4px' }}>
          {[Settings, MoreHorizontal].map((Icon, i) => (
            <button key={i} style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'transparent',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s'
            }}
            >
              <Icon size={16} strokeWidth={2} />
            </button>
          ))}
        </div>
      </div>

      {/* ── MESSAGES AREA ── */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        scrollbarWidth: 'thin',
        scrollbarColor: 'var(--accent) transparent'
      }} className="md:p-5">
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 16px', opacity: 0.5 }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Bot size={24} />
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Chào mừng bạn đến với AI Tutor!</p>
          </div>
        )}

        {messages.map((m) => (
          m.role === 'user' ? (
            /* User message bubble */
            <div key={m.id} style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: '16px',
            }} className="pl-8 md:pl-[20%]">
              <div style={{
                backgroundColor: 'var(--accent)',
                background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
                color: '#FFF',
                padding: '10px 14px',
                borderRadius: '16px 16px 4px 16px',
                fontSize: '14px',
                lineHeight: '1.6',
                maxWidth: '100%',
                wordBreak: 'break-word',
                boxShadow: 'var(--accent-glow)'
              }} className="md:px-4 md:py-3">
                {m.content}
              </div>
            </div>
          ) : (
            /* Assistant message bubble */
            <div key={m.id} style={{
              display: 'flex',
              gap: '10px',
              marginBottom: '16px',
            }} className="pr-4 md:pr-[10%] md:gap-3">
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: '#FFF'
              }} className="md:w-9 md:h-9">
                <Zap size={16} fill="white" className="md:w-5 md:h-5" />
              </div>

              <div style={{
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                padding: '12px 14px',
                borderRadius: '4px 16px 16px 16px',
                fontSize: '14px',
                lineHeight: '1.7',
                flex: 1,
                wordBreak: 'break-word'
              }} className="md:px-5 md:py-4">
                <MarkdownRenderer content={normalizeAgentResponse(m.content)} />
              </div>
            </div>
          )
        ))}

        {isLoading && (
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Loader2 size={16} className="text-[#7C3AED] animate-spin" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── INPUT AREA ── */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid var(--border)',
        backgroundColor: 'var(--bg-secondary)',
        flexShrink: 0
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '10px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: '14px',
          padding: '10px 14px',
          transition: 'border-color 0.2s'
        }}
        onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
        onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            onInput={(e: any) => {
              e.target.style.height = 'auto'
              e.target.style.height = e.target.scrollHeight + 'px'
            }}
            placeholder="Gửi tin nhắn cho AI Tutor..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '14px',
              lineHeight: '1.5',
              resize: 'none',
              minHeight: '22px',
              maxHeight: '120px',
              fontFamily: 'inherit'
            }}
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '9px',
              border: 'none',
              background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
              color: 'white',
              cursor: (!input.trim() || isLoading) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'all 0.15s',
              opacity: (!input.trim() || isLoading) ? 0.4 : 1
            }}
            onMouseEnter={(e) => { if (!(!input.trim() || isLoading)) { e.currentTarget.style.filter = 'brightness(1.15)'; e.currentTarget.style.transform = 'scale(1.05)' } }}
            onMouseLeave={(e) => { if (!(!input.trim() || isLoading)) { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'none' } }}
          >
            <Send size={15} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  )
}
