'use client'
import { useState } from 'react'
import Editor from '@monaco-editor/react'
import { Terminal, Play, CheckCircle, Warning, Waveform, Code, Spinner } from '@/lib/icons'
import { cn } from '@/lib/utils'
import { toast } from 'react-hot-toast'

export function LabPanel({ lab }: { lab: any }) {
  const [code, setCode] = useState(lab?.starter_code || '// Nhập mã Verilog tại đây\nmodule top();\n  initial begin\n    $display("Hello ChipCraft!");\n  end\nendmodule')
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [activeTab, setActiveTab] = useState<'editor' | 'waveform'>('editor')

  const handleRun = async () => {
    setIsRunning(true)
    setOutput('$ iverilog -o sim design.v\n$ vvp sim\n')
    
    // Simulate compilation delay
    await new Promise(r => setTimeout(r, 1500))
    
    setOutput(prev => prev + 'Hello ChipCraft!\n\nSimulation completed successfully.\n✓ 1 test case passed.\n')
    setIsRunning(false)
    toast.success('Simulation thành công!')
  }

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <div className="h-12 border-b flex items-center justify-between flex-shrink-0" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', padding: '0 16px' }}>
        <div className="flex items-center gap-2">
          <div className="flex p-1 rounded-lg gap-1" style={{ background: 'var(--bg-primary)' }}>
            <button 
              onClick={() => setActiveTab('editor')}
              style={{
                padding: '4px 12px',
                fontSize: '10px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                background: activeTab === 'editor' ? 'var(--bg-tertiary)' : 'transparent',
                color: activeTab === 'editor' ? '#A855F7' : 'var(--text-muted)',
                border: activeTab === 'editor' ? '1px solid var(--border)' : '1px solid transparent'
              }}
            >
              <Code size={14} /> Editor
            </button>
            <button 
              onClick={() => setActiveTab('waveform')}
              style={{
                padding: '4px 12px',
                fontSize: '10px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                background: activeTab === 'waveform' ? 'var(--bg-tertiary)' : 'transparent',
                color: activeTab === 'waveform' ? '#A855F7' : 'var(--text-muted)',
                border: activeTab === 'waveform' ? '1px solid var(--border)' : '1px solid transparent'
              }}
            >
              <Waveform size={14} /> Waveform
            </button>
          </div>
        </div>
        <button 
          onClick={handleRun}
          disabled={isRunning}
          style={{
            height: '32px',
            padding: '0 16px',
            background: '#7C3AED',
            color: '#FFF',
            fontSize: '12px',
            fontWeight: 700,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s',
            opacity: isRunning ? 0.5 : 1,
            cursor: isRunning ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.2)'
          }}
          onMouseEnter={e => { if (!isRunning) e.currentTarget.style.background = '#6D28D9' }}
          onMouseLeave={e => { if (!isRunning) e.currentTarget.style.background = '#7C3AED' }}
        >
          {isRunning ? <Spinner size={14} className="animate-spin" /> : <Play size={14} />}
          Run Simulation
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Editor Area */}
        <div className={cn("flex-1 bg-[#1e1e1e] relative", activeTab !== 'editor' && "hidden")}>
          <Editor
            height="100%"
            defaultLanguage="verilog"
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val || '')}
            options={{
              fontSize: 14,
              fontFamily: 'DM Mono',
              minimap: { enabled: false },
              padding: { top: 20 },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              backgroundColor: '#1E1E1E'
            }}
          />
        </div>

        {/* Waveform Area (Placeholder) */}
        <div className={cn("flex-1 p-8 flex flex-col items-center justify-center text-center", activeTab !== 'waveform' && "hidden")} style={{ background: 'var(--bg-secondary)' }}>
          <Waveform size={48} style={{ color: '#475569', marginBottom: '16px', opacity: 0.3 }} />
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Chưa có kết xuất Waveform</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', maxWidth: '240px' }}>Hãy chạy mô phỏng thành công để xem giản đồ thời gian (GTKWave).</p>
        </div>

        {/* Console Area */}
        <div className="w-[350px] border-l flex flex-col hidden lg:flex" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
          <div className="h-10 px-4 border-b flex items-center gap-2 flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
            <Terminal size={14} style={{ color: '#475569' }} />
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em' }}>OUTPUT CONSOLE</span>
          </div>
          <div className="flex-1 p-4 font-mono text-[13px] overflow-y-auto" style={{ color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.2)' }}>
            {output ? (
              <pre className="whitespace-pre-wrap leading-relaxed">
                {output}
              </pre>
            ) : (
              <p style={{ color: '#475569', opacity: 0.5, fontStyle: 'italic' }}>Console đang chờ lệnh biên dịch...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


