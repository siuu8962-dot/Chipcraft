import ReactMarkdown from 'react-markdown'

export function LessonContent({ lesson }: { lesson: any }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .lesson-content h1, .lesson-content h2, .lesson-content h3 { color: var(--text-primary); font-weight: 700; margin: 24px 0 12px; }
        .lesson-content h2 { font-size: 20px; border-bottom: 1px solid var(--border); padding-bottom: 10px; }
        .lesson-content h3 { font-size: 17px; }
        .lesson-content p { color: var(--text-secondary); font-size: 15px; line-height: 1.8; margin: 0 0 16px; }
        .lesson-content ul, .lesson-content ol { color: var(--text-secondary); font-size: 15px; margin-bottom: 16px; padding-left: 20px; }
        .lesson-content li { margin-bottom: 8px; }
        .lesson-content code { background: rgba(255,255,255,0.04); color: #A855F7; padding: 2px 6px; border-radius: 4px; font-size: 13px; font-family: monospace; }
        .lesson-content pre { background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 8px; padding: 16px 20px; overflow-x: auto; margin: 16px 0; }
        .lesson-content pre code { background: none; color: var(--text-primary); font-size: 13px; line-height: 1.7; padding: 0; }
      `}} />
      <div className="lesson-content" style={{ maxWidth: 760, margin: '0 auto' }} data-theme-area="lesson-content">
        <ReactMarkdown>{lesson.content_vi || 'Nội dung bài học chưa được cập nhật.'}</ReactMarkdown>
      </div>
    </>
  )
}


