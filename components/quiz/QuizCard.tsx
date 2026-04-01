// components/quiz/QuizCard.tsx
'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Loader2, CheckCircle2, RefreshCw, ArrowRight } from 'lucide-react'

interface QuizCardProps {
  questions: any[]
  courseId?: string
  quizId?: string
}

export function QuizCard({ questions, courseId, quizId }: QuizCardProps) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const currentQ = questions[currentIdx]

  const handleNext = async () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1)
      setSelectedIdx(null)
      setIsAnswered(false)
    } else {
      // Quiz Finished - Submit to API
      if (courseId) {
        setSubmitting(true)
        try {
          const res = await fetch('/api/quizzes/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              courseId,
              quizId,
              score,
              totalQuestions: questions.length
            })
          })
          const data = await res.json()
          if (data.success) {
            const msg = `🎉 +${data.xpGained} XP! ${data.newLevel ? `Bạn đã lên Level ${data.newLevel}!` : ''}`
            toast.success(msg)
            if (data.newBadges?.length > 0) {
              data.newBadges.forEach((b: any) => {
                toast.success(`🎖️ Nhận huy hiệu mới: ${b.name_vi}`, { duration: 5000 })
              })
            }
          }
        } catch (err) {
          console.error('Failed to submit quiz:', err)
        } finally {
          setSubmitting(false)
          setIsFinished(true)
        }
      } else {
        setIsFinished(true)
      }
    }
  }

  const handlePrev = () => {
    if (currentIdx > 0 && !isAnswered) {
      setCurrentIdx(currentIdx - 1)
      setSelectedIdx(null)
      setIsAnswered(false) 
    }
  }

  const handleSkip = () => {
    if (!isAnswered) {
      handleNext()
    }
  }

  const handleAnswer = (index: number) => {
    if (isAnswered) return
    setSelectedIdx(index)
    setIsAnswered(true)
    if (index === currentQ.correct_option) {
      setScore(score + 1)
    }
  }

  const handleRetry = () => {
    setCurrentIdx(0)
    setSelectedIdx(null)
    setIsAnswered(false)
    setScore(0)
    setIsFinished(false)
  }

  const formatSubscript = (text: string) => {
    if (!text) return text
    const map: Record<string, string> = {'₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9'}
    return text.replace(/([₀-₉]+)/g, match => {
      const numbers = match.split('').map(c => map[c]).join('')
      return `<span><sub style="font-size:10px;color:#94A3B8;">${numbers}</sub></span>`
    })
  }

  if (isFinished) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 36px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: '20px', maxWidth: 680, margin: '40px auto', fontFamily: 'var(--font-be-vietnam), sans-serif' }}>
        <div style={{ width: 120, height: 120, borderRadius: '50%', border: '8px solid var(--border)', borderTopColor: '#8B5CF6', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)' }}>{Math.round((score/questions.length)*100)}%</span>
        </div>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 12px 0' }}>{score} / {questions.length} CÂU ĐÚNG</h2>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 32 }}>Xuất sắc! Kết quả đã được ghi nhận vào bảng thành tích của bạn.</p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <button onClick={handleRetry} style={{ padding: '12px 24px', borderRadius: '12px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <RefreshCw size={18} /> Làm lại
          </button>
          <button onClick={() => window.history.back()} style={{ padding: '12px 24px', borderRadius: '12px', background: '#8B5CF6', color: 'white', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            Tiếp tục học <ArrowRight size={18} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 680, margin: '40px auto', fontFamily: 'var(--font-be-vietnam), sans-serif' }}>
      {/* Progress */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>CÂU HỎI HIỆN TẠI</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#8B5CF6' }}>{currentIdx + 1} / {questions.length}</span>
        </div>
        <div style={{ background: 'var(--border)', borderRadius: 10, height: 6, overflow: 'hidden' }}>
          <div style={{ background: '#8B5CF6', width: ((currentIdx + 1) / questions.length) * 100 + '%', height: '100%', transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
        </div>
      </div>

      <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: '20px', padding: '32px' }}>
        {submitting ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: 16 }}>
            <Loader2 className="animate-spin" size={40} color="#8B5CF6" />
            <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>ĐANG LƯU KẾT QUẢ...</p>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: 28 }}
              dangerouslySetInnerHTML={{ __html: formatSubscript(currentQ.question_vi) }} 
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {currentQ.options_vi.map((option: string, i: number) => {
                const label = String.fromCharCode(65 + i)
                const isSelected = selectedIdx === i
                const isCorrectTarget = isAnswered && i === currentQ.correct_option
                
                let borderColor = 'var(--border)'
                let background = 'rgba(255,255,255,0.02)'
                let labelColor = 'var(--text-muted)'

                if (isAnswered) {
                  if (isCorrectTarget) { borderColor = '#10B981'; background = 'rgba(16, 185, 129, 0.1)'; labelColor = '#10B981' }
                  else if (isSelected) { borderColor = '#EF4444'; background = 'rgba(239, 68, 68, 0.1)'; labelColor = '#EF4444' }
                } else if (isSelected) {
                  borderColor = '#8B5CF6'; background = 'rgba(139, 92, 246, 0.1)'; labelColor = '#8B5CF6'
                }

                return (
                  <button key={i} disabled={isAnswered} onClick={() => handleAnswer(i)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px',
                      background, border: `1px solid ${borderColor}`, borderRadius: '12px',
                      cursor: isAnswered ? 'default' : 'pointer', transition: 'all 0.15s',
                      textAlign: 'left', width: '100%', position: 'relative'
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 800, color: labelColor }}>{label}</span>
                    <span style={{ fontSize: 15, color: 'var(--text-primary)', flex: 1 }} dangerouslySetInnerHTML={{ __html: formatSubscript(option) }} />
                    {isAnswered && isCorrectTarget && <CheckCircle2 size={18} color="#10B981" />}
                  </button>
                )
              })}
            </div>

            {isAnswered && (
              <div style={{ 
                marginTop: 24, padding: '16px', borderRadius: '12px', 
                background: selectedIdx === currentQ.correct_option ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                border: `1px solid ${selectedIdx === currentQ.correct_option ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6
              }}>
                <strong style={{ color: selectedIdx === currentQ.correct_option ? '#10B981' : '#EF4444', marginRight: 6 }}>
                  {selectedIdx === currentQ.correct_option ? '✓ Chính xác!' : '✗ Chưa đúng.'}
                </strong>
                <span dangerouslySetInnerHTML={{ __html: formatSubscript(currentQ.explanation_vi) }} />
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
              <button disabled={currentIdx === 0 || isAnswered} onClick={handlePrev}
                style={{ padding: '10px 16px', borderRadius: '10px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: 13, fontWeight: 600, cursor: 'pointer', opacity: (currentIdx === 0 || isAnswered) ? 0.3 : 1 }}
              >
                ← Câu trước
              </button>
              <button disabled={isAnswered} onClick={handleSkip}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: 13, fontWeight: 600, cursor: 'pointer', opacity: isAnswered ? 0.3 : 1 }}
              >
                Bỏ qua
              </button>
              <button disabled={!isAnswered && currentIdx === questions.length - 1} onClick={handleNext}
                style={{ padding: '10px 24px', borderRadius: '10px', background: '#8B5CF6', color: 'white', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
              >
                {currentIdx === questions.length - 1 ? (isAnswered ? 'Nộp bài' : 'Câu tiếp theo →') : 'Câu tiếp theo →'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
