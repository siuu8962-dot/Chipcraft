// ─────────────────────────────────────────────────────────
// components/agent/AgentPanel.tsx — REWRITTEN FOR MULTI-AGENT
// ─────────────────────────────────────────────────────────

'use client'
import { useState, useRef, useEffect } from 'react'
import { 
  Sparkles, 
  Brain, 
  Wrench, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  ChevronRight,
  Database,
  Search,
  Code2,
  Table as TableIcon,
  Loader2,
  Terminal,
  History,
  StopCircle,
  Zap,
  Star,
  Globe,
  AlertTriangle,
  RefreshCw,
  BarChart2,
  BookOpenCheck,
  MousePointer2,
  Eye,
  Square,
  ListTodo,
  Timer,
  Bot
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { AppController } from '@/lib/agent/browser/AppController'
import { AgentControlOverlay } from './AgentControlOverlay'
import { MarkdownRenderer, normalizeAgentResponse } from '@/components/shared/MarkdownRenderer'
import type { AgentTask, AgentResult, AgentThought } from '@/types/agent'

interface AgentState {
  goal: string
  plan: AgentTask[]
  steps: AgentResult[]
  thoughts: AgentThought[]
  finalAnswer: string | null
  status: 'thinking' | 'acting' | 'done' | 'error'
  currentTaskId?: string
  totalDurationMs?: number
  errorMessage?: string
}

const SUGGESTIONS = [
  { 
    label: "Lập kế hoạch thiết kế module giao tiếp SPI hoàn chỉnh từ yêu cầu", 
    icon: Brain, 
    color: "#A855F7" 
  },
  { 
    label: "Tự động tối ưu hóa Timing và đề xuất cải thiện kiến trúc RTL", 
    icon: Zap, 
    color: "#EAB308" 
  },
  { 
    label: "Nghiên cứu sâu về kiến trúc Tensor Core và so sánh các dòng chip NPU", 
    icon: Search, 
    color: "#06B6D4" 
  },
  { 
    label: "Xây dựng hệ thống Testbench tự động cho mạch nhân 8-bit", 
    icon: Code2, 
    color: "#10B981" 
  }
]

export function AgentPanel() {
  const router = useRouter()
  const appController = useMemo(() => new AppController(router), [router])
  const [goal, setGoal] = useState('')
  const [state, setState] = useState<AgentState | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [currentAction, setCurrentAction] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [state])

  const runAgent = async (overrideGoal?: string) => {
    const finalGoal = overrideGoal || goal
    if (!finalGoal.trim() || isRunning) return
    
    setIsRunning(true)
    setState({
      goal: finalGoal,
      plan: [],
      steps: [],
      thoughts: [],
      finalAnswer: null,
      status: 'thinking'
    })

    try {
      const response = await fetch('/api/agent/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: finalGoal }) // Use 'input' for new API
      })

      if (!response.body) throw new Error('ReadableStream not supported')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6))
            
            // Handle specific events
            if (data.event === 'plan') {
              setState(prev => prev ? { ...prev, plan: data.plan } : null)
            } else if (data.event === 'task_start') {
              const activeTask = data.plan?.[0]
              setState(prev => prev ? { 
                ...prev, 
                currentTaskId: activeTask?.id, 
                status: 'acting' 
              } : null)
            } else if (data.event === 'task_complete' || data.event === 'done') {
              setState(prev => prev ? {
                ...prev,
                steps: data.steps || prev.steps,
                thoughts: data.thoughts || prev.thoughts,
                finalAnswer: data.finalAnswer || prev.finalAnswer,
                status: data.status || (data.event === 'done' ? 'done' : 'acting'),
                totalDurationMs: data.totalDurationMs
              } : null)
              
              if (data.event === 'done') setIsRunning(false)
            } else if (data.event === 'error') {
              setIsRunning(false)
              setState(prev => prev ? { ...prev, status: 'error', errorMessage: data.error } : null)
            }
          }
        }
      }
    } catch (err: any) {
      console.error(err)
      setIsRunning(false)
      setState(prev => prev ? { ...prev, status: 'error' } : null)
    }
  }

  const getAgentIcon = (agent: string) => {
    switch(agent) {
      case 'plannerAgent': return <ListTodo size={14} />
      case 'researchAgent': return <Search size={14} />
      case 'writerAgent': return <BookOpenCheck size={14} />
      case 'coderAgent': return <Code2 size={14} />
      case 'criticAgent': return <Sparkles size={14} />
      case 'toolAgent': return <Wrench size={14} />
      default: return <Zap size={14} />
    }
  }

  return (
    <div style={{ padding: '24px', maxWidth: '940px', marginLeft: 'auto', marginRight: 'auto' }}>
      {/* ── AGENT INPUT AREA ── */}
      <div style={{
        backgroundColor: 'var(--bg-tertiary)',
        border: '1px solid rgba(124,58,237,0.3)',
        borderRadius: '16px',
        padding: '18px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        marginBottom: '20px'
      }}>
        <textarea
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Mô tả một mục tiêu phức tạp (VD: Lập kế hoạch thiết kế và kiểm thử mạch ALU từ đầu)..."
          style={{
            width: '100%',
            minHeight: '90px',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-primary)',
            fontSize: '15px',
            lineHeight: '1.6',
            resize: 'none',
            fontFamily: 'inherit'
          }}
          onKeyDown={(e) => e.key === 'Enter' && e.ctrlKey && runAgent()}
        />
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '12px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border)'
        }}>
          <div style={{ display: 'flex', gap: '16px' }}>
             <span style={{ fontSize: '12px', color: '#475569' }}>{goal.length}/500</span>
             {isRunning && (
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <Loader2 size={12} className="animate-spin text-[#7C3AED]" />
                 <span style={{ fontSize: '11px', color: '#7C3AED', fontWeight: 700, letterSpacing: '0.05em' }}>AGENTS ĐANG LÀM VIỆC...</span>
               </div>
             )}
          </div>
          <button 
            onClick={() => runAgent()}
            disabled={!goal.trim() || isRunning}
            style={{
              background: isRunning ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #7C3AED, #06B6D4)',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 24px',
              color: isRunning ? '#475569' : 'white',
              fontSize: '14px',
              fontWeight: 700,
              cursor: isRunning ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: isRunning ? 'none' : '0 4px 14px rgba(124, 58, 237, 0.4)'
            }}
          >
            {isRunning ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} strokeWidth={2.5} />}
            {isRunning ? 'AGENT ĐANG THỰC THI' : 'BẮT ĐẦU NHIỆM VỤ'}
          </button>
        </div>
      </div>

      {/* Suggested chips */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '40px' }}>
        {SUGGESTIONS.map(s => (
          <button 
            key={s.label}
            onClick={() => { setGoal(s.label); runAgent(s.label); }}
            style={{
              backgroundColor: 'rgba(124,58,237,0.06)',
              border: '1px solid rgba(124,58,237,0.15)',
              borderRadius: '24px',
              padding: '6px 16px',
              fontSize: '13px',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(124,58,237,0.15)'; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(124,58,237,0.06)'; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.15)' }}
          >
            <s.icon size={13} strokeWidth={2} color={s.color} />
            {s.label}
          </button>
        ))}
      </div>

      {/* ── EXECUTION TRACE ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }} ref={scrollRef}>
        {!state && (
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            padding: '80px 20px',
            opacity: 0.35
          }}>
            <Brain size={64} strokeWidth={1} color="#7C3AED" />
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', textAlign: 'center' }}>
              Hệ thống sẵn sàng thực thi các nhiệm vụ đa bước tự động.<br/>
              Hãy nhập mục tiêu để bắt đầu phiên làm việc tự hành.
            </p>
          </div>
        )}

        {/* ── AUTONOMOUS PLAN VISUALIZATION ── */}
        {state?.plan && state.plan.length > 0 && (
          <div style={{
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <ListTodo size={18} className="text-[#A855F7]" />
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Lộ trình thực thi tự hành</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {state.plan.map((task, i) => {
                const isCompleted = state.steps.some(s => s.taskId === task.id);
                const isActive = state.currentTaskId === task.id;
                
                return (
                  <div key={task.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    backgroundColor: isActive ? 'rgba(124, 58, 237, 0.1)' : 'transparent',
                    border: isActive ? '1px solid rgba(124, 58, 237, 0.3)' : '1px solid transparent',
                    opacity: isCompleted ? 0.5 : 1,
                    transition: 'all 0.3s'
                  }}>
                    <div style={{ 
                      width: '20px', 
                      height: '20px', 
                      borderRadius: '50%', 
                      border: isCompleted ? 'none' : '2px solid var(--border)',
                      backgroundColor: isCompleted ? '#10B981' : (isActive ? 'rgba(124,58,237,0.2)' : 'transparent'),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}>
                      {isCompleted ? <CheckCircle2 size={12} /> : (isActive ? <Loader2 size={10} className="animate-spin" /> : null)}
                    </div>
                    <div style={{ 
                      fontSize: '13px', 
                      color: isActive ? 'white' : 'var(--text-secondary)',
                      fontWeight: isActive ? 600 : 400,
                      flex: 1
                    }}>
                      {task.task}
                    </div>
                    <div style={{ 
                      fontSize: '10px', 
                      fontWeight: 700, 
                      color: '#475569', 
                      textTransform: 'uppercase',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {getAgentIcon(task.agent)} {task.agent.replace('Agent', '')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── STEPS & THOUGHTS ── */}
        {state?.steps.map((step, i) => (
          <div key={i} style={{ animation: 'fade-in 0.4s ease-out' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '8px', 
                backgroundColor: 'rgba(124,58,237,0.1)', 
                border: '1px solid rgba(124,58,237,0.2)', 
                color: '#A855F7', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '14px', 
                fontWeight: 800 
              }}>
                {i + 1}
              </div>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
              <div style={{ fontSize: '11px', color: '#475569', fontWeight: 700, textTransform: 'uppercase' }}>
                HOÀN THÀNH {step.durationMs}ms
              </div>
            </div>

            <div style={{ marginLeft: '44px' }}>
              {/* Agent thoughts */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {step.thoughts.map((thought, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <Sparkles size={14} className="text-[#A855F7] mt-1" />
                    <p style={{ fontSize: '14px', color: '#CBD5E1', margin: 0 }}>{thought}</p>
                  </div>
                ))}
              </div>

              {/* Output Result */}
              <div style={{ 
                padding: '18px 24px', 
                backgroundColor: 'var(--bg-tertiary)', 
                borderRadius: '14px', 
                border: '1px solid var(--border)',
                lineHeight: '1.7'
              }}>
                 <MarkdownRenderer content={normalizeAgentResponse(step.output)} />
              </div>
            </div>
          </div>
        ))}

        {/* Final answer */}
        {state?.finalAnswer && (
          <div style={{ 
            marginTop: '20px', 
            padding: '28px', 
            backgroundColor: 'rgba(16,185,129,0.04)', 
            border: '2px solid rgba(16,185,129,0.2)', 
            borderRadius: '20px',
            position: 'relative'
          }}>
            <div style={{ 
              position: 'absolute', 
              top: '-14px', 
              left: '28px', 
              backgroundColor: '#10B981', 
              color: 'white', 
              padding: '4px 12px', 
              borderRadius: '8px', 
              fontSize: '11px', 
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <CheckCircle2 size={12} /> NHIỆM VỤ HOÀN TẤT
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #10B981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={24} color="white" />
              </div>
              <div>
                 <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'white', margin: 0 }}>Kết quả cuối cùng</h3>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#10B981', marginTop: '2px' }}>
                    <Timer size={12} /> {state.totalDurationMs ? (state.totalDurationMs/1000).toFixed(1) : '...'}s 
                    <span style={{ color: '#444' }}>•</span> 
                    {state.steps.length} bước tự động
                 </div>
              </div>
            </div>

            <div className="prose-agent">
               <MarkdownRenderer content={normalizeAgentResponse(state.finalAnswer)} />
            </div>
          </div>
        )}

        {/* Error handling */}
        {state?.status === 'error' && (
           <div style={{ padding: '20px', backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '14px', borderLeft: '4px solid #EF4444' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', color: '#FCA5A5' }}>
                 <AlertCircle size={18} />
                 <span style={{ fontWeight: 700 }}>LUỒNG THỰC THI BỊ GIÁN ĐOẠN</span>
              </div>
              <p style={{ fontSize: '14px', color: '#FCA5A5', margin: '0 0 16px 0' }}>{state.errorMessage || 'Agent gặp lỗi không xác định. Vui lòng thử lại.'}</p>
              <button 
                onClick={() => runAgent()}
                style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '8px 16px', color: '#FCA5A5', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                <RefreshCw size={14} className="mr-2" /> Thử lại ngay
              </button>
           </div>
        )}
      </div>

      <AgentControlOverlay isActive={!!currentAction} action={currentAction || ''} />
    </div>
  )
}
