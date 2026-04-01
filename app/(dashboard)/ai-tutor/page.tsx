'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { 
  MessageSquare, 
  Plus, 
  Cpu, 
  Zap, 
  Sparkles,
  ChevronRight,
  Star,
  Clock,
  Bot
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { AITutor } from '@/components/ai/AITutor'
import { AgentPanel } from '@/components/agent/AgentPanel'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  updatedAt: number
}

export default function StandaloneAITutorPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'chat' | 'agent'>('chat')
  const [userId, setUserId] = useState<string | null>(null)
  const [aiUsage, setAiUsage] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    async function init() {
      // Load Profile & Auth
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        setProfile(data)
        
        // Load AI Usage
        const now = new Date()
        const monthYear = `${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`
        const { data: usage } = await supabase
          .from('ai_usage')
          .select('*')
          .eq('user_id', user.id)
          .eq('month_year', monthYear)
          .single()
        setAiUsage(usage)
        
        // 1. Load History from DB
        const { data: dbConvs } = await supabase
          .from('ai_conversations')
          .select(`
            id, 
            title, 
            updated_at,
            ai_messages (
              id,
              role,
              content,
              created_at
            )
          `)
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })

        if (dbConvs && dbConvs.length > 0) {
          const mapped: Conversation[] = (dbConvs as any[]).map(c => ({
            id: c.id,
            title: c.title || 'Hội thoại mới',
            messages: (c.ai_messages || []) as any[],
            updatedAt: new Date(c.updated_at).getTime()
          }))
          setConversations(mapped)
          setActiveId(mapped[0].id)
        } else {
          // 2. Fallback to user-specific localStorage if no DB data
          const storageKey = `chatHistory_${user.id}`
          const saved = JSON.parse(localStorage.getItem(storageKey) || '[]')
          if (saved.length > 0) {
             setConversations(saved)
             setActiveId(saved[0].id)
          }
        }
      }

      setLoading(false)
    }
    init()
  }, [])

  const saveConversation = useCallback((messages: Message[]) => {
    if (!messages || messages.length === 0 || !userId) return
    
    setConversations(prev => {
      const history = [...prev]
      const id = activeId || Date.now().toString()
      const title = messages[0].content.slice(0, 40) + (messages[0].content.length > 40 ? '...' : '')
      const existing = history.findIndex(h => h.id === id)
      const entry: Conversation = { id, title, messages, updatedAt: Date.now() }
      
      if (existing >= 0) {
        if (JSON.stringify(history[existing].messages) === JSON.stringify(messages)) {
          return prev
        }
        history[existing] = entry
      } else {
        history.unshift(entry)
        if (!activeId) setActiveId(id)
      }
      
      const storageKey = `chatHistory_${userId}`
      localStorage.setItem(storageKey, JSON.stringify(history))
      return history
    })
  }, [activeId, userId])

  const handleConversationIdChange = (newId: string) => {
    if (activeId !== newId) {
      setActiveId(newId)
    }
  }

  const startNewChat = () => {
    setActiveId(null)
  }

  const activeConversation = conversations.find(c => c.id === activeId)

  // Grouping logic...

  // Grouping logic
  const groupConversations = () => {
    const today = new Date().setHours(0,0,0,0)
    const yesterday = today - 86400000
    
    const groups: { [key: string]: Conversation[] } = {
      'Hôm nay': [],
      'Hôm qua': [],
      'Trước đó': []
    }

    conversations.forEach(c => {
      if (c.updatedAt >= today) groups['Hôm nay'].push(c)
      else if (c.updatedAt >= yesterday) groups['Hôm qua'].push(c)
      else groups['Trước đó'].push(c)
    })

    return groups
  }

  const groups = groupConversations()

  if (loading) return null

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      overflow: 'hidden',
      minHeight: 0,
      backgroundColor: 'var(--bg-primary)'
    }}>
      {/* CONVERSATION HISTORY PANEL */}
      <div 
        data-sidebar-alt
        style={{
          width: '240px',
          minWidth: '240px',
          flexShrink: 0,
          height: '100%',
          overflowY: 'auto',
          borderRight: '1px solid var(--border)',
          backgroundColor: 'var(--bg-secondary)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          padding: '16px 12px'
        }}>
        <button 
          onClick={startNewChat}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
            border: 'none',
            background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
            color: 'white',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '16px',
            flexShrink: 0
          }}
        >
          <Plus size={16} strokeWidth={3} />
          {activeTab === 'chat' ? 'Hội thoại mới' : 'Nhiệm vụ mới'}
        </button>

        {/* History List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {Object.entries(groups).map(([label, items]) => items.length > 0 && (
            <div key={label} style={{ marginBottom: '16px' }}>
              <div style={{ padding: '0 8px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
              </div>
              {items.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => { setActiveTab('chat'); setActiveId(item.id); }} 
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    marginBottom: '2px',
                    backgroundColor: activeId === item.id && activeTab === 'chat' ? 'rgba(255,255,255,0.04)' : 'transparent',
                    borderLeft: activeId === item.id && activeTab === 'chat' ? '3px solid #7C3AED' : '3px solid transparent',
                    color: activeId === item.id && activeTab === 'chat' ? 'var(--text-primary)' : 'var(--text-secondary)'
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '11px', color: '#475569', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={10} />
                    {new Date(item.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* AI Limit Indicator */}
        <div style={{ padding: '12px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
             <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>TRẠNG THÁI AI</span>
             <span style={{ fontSize: '11px', color: '#7C3AED', fontWeight: 700 }}>{20 - (aiUsage?.messages_used || 0)}/20</span>
           </div>
           <div style={{ height: '4px', backgroundColor: 'var(--border)', borderRadius: '2px' }}>
              <div style={{ height: '100%', background: 'linear-gradient(90deg, #7C3AED, #06B6D4)', width: `${((20 - (aiUsage?.messages_used || 0)) / 20) * 100}%` }} />
           </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main style={{
        flex: 1,
        minWidth: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Tab switcher - fixed height */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 20px',
          gap: '8px',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
          backgroundColor: 'var(--bg-primary)'
        }}>
          <div style={{
            display: 'inline-flex',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '4px',
            gap: '4px'
          }}>
            <button 
              onClick={() => setActiveTab('chat')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 20px',
                borderRadius: '9px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                transition: 'all 0.2s ease',
                background: activeTab === 'chat' ? 'rgba(124, 58, 237, 0.12)' : 'transparent',
                color: activeTab === 'chat' ? '#A855F7' : 'var(--text-secondary)',
                boxShadow: activeTab === 'chat' ? '0 2px 12px rgba(0,0,0,0.2)' : 'none'
              }}
            >
              <MessageSquare size={15} strokeWidth={2} />
              Chat
            </button>
            <button 
              onClick={() => setActiveTab('agent')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 20px',
                borderRadius: '9px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                transition: 'all 0.2s ease',
                position: 'relative',
                background: activeTab === 'agent' ? 'rgba(6, 182, 212, 0.12)' : 'transparent',
                color: activeTab === 'agent' ? '#06B6D4' : 'var(--text-secondary)',
                boxShadow: activeTab === 'agent' ? '0 2px 12px rgba(0,0,0,0.2)' : 'none'
              }}
            >
              <Zap size={15} strokeWidth={2} />
              Agent
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-4px',
                background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
                color: 'white',
                fontSize: '9px',
                fontWeight: 800,
                letterSpacing: '0.05em',
                padding: '2px 6px',
                borderRadius: '6px',
                lineHeight: 1.4
              }}>NEW</span>
            </button>
          </div>
        </div>

        {/* Scrollable content area */}
        <div data-theme-area="main" style={{ flex: 1, overflowY: 'auto', backgroundColor: 'var(--bg-primary)' }}>
          {activeTab === 'chat' ? (
            <AITutor 
              key={activeId || 'new'} 
              conversationId={activeId || undefined}
              externalMessages={activeConversation?.messages}
              onMessagesChange={saveConversation}
              onConversationIdChange={handleConversationIdChange}
            />
          ) : (
            <AgentPanel />
          )}
        </div>
      </main>

      {/* RIGHT PANEL */}
      <div style={{
        width: '280px',
        minWidth: '280px',
        flexShrink: 0,
        height: '100%',
        overflowY: 'auto',
        borderLeft: '1px solid var(--border)',
        backgroundColor: 'var(--bg-secondary)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(124, 58, 237, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={18} style={{ color: '#7C3AED' }} />
          </div>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>Ngữ cảnh học tập</h2>
        </div>

        {/* Current Lesson */}
        <div data-theme-area="card" className="card-redesign" style={{
          padding: '16px',
          backgroundColor: 'var(--bg-tertiary)',
          border: '1px solid var(--border)'
        }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>BÀI HỌC HIỆN TẠI</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
              <Cpu size={20} style={{ color: '#7C3AED' }} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Nền tảng số & Logic</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Chương 1: Cổng Logic</div>
            </div>
          </div>
        </div>

        {/* Expert Suggestion */}
        <div data-theme-area="card" className="card-redesign" style={{
          padding: '16px',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-tertiary)',
          border: '1px solid var(--border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Star size={12} fill="#06B6D4" style={{ color: '#06B6D4' }} />
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#06B6D4', textTransform: 'uppercase' }}>CHUYÊN GIA GỢI Ý</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: '1.6', margin: 0 }}>
             "Hãy thử yêu cầu AI vẽ sơ đồ timing cho chu kỳ ghi đơn giản của cổng AND để hiểu sâu hơn."
          </p>
        </div>

        {/* AI Status */}
        <div data-theme-area="card" className="card-redesign" style={{ marginTop: 'auto', padding: '16px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
             <Zap size={12} className="text-amber-400" fill="currentColor" />
             <span style={{ fontSize: '10px', fontWeight: 700, color: '#475569' }}>MODEL: GEMINI 1.5 FLASH</span>
           </div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 8px #10B981' }} />
              <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 600 }}>Hệ thống sẵn sàng</span>
           </div>
        </div>
      </div>
    </div>
  )
}