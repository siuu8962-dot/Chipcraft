'use client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'

export function normalizeAgentResponse(text: string): string {
  if (!text) return ''
  return text
    .replace(/(\d+\.)\s*/g, '$1 ')
    .replace(/([^\n])\n(#{1,3} )/g, '$1\n\n$2')
    .replace(/([^\n])\n([-*] )/g, '$1\n\n$2')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\\n/g, '\n')
    .trim()
}

interface Props {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className }: Props) {
  return (
    <div className={className} style={{
      fontSize: '14px',
      lineHeight: '1.7',
      color: 'var(--text-primary)',
      wordBreak: 'break-word',
    }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 style={{
              fontSize: '18px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: '16px 0 8px',
              borderBottom: '1px solid var(--border)',
              paddingBottom: '6px'
            }}>{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 style={{
              fontSize: '16px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: '14px 0 6px'
            }}>{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#7C3AED',
              margin: '12px 0 4px'
            }}>{children}</h3>
          ),

          // Paragraph
          p: ({ children }) => (
            <p style={{ margin: '0 0 10px', lineHeight: '1.7', color: 'var(--text-primary)' }}>
              {children}
            </p>
          ),

          // Bold
          strong: ({ children }) => (
            <strong style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
              {children}
            </strong>
          ),

          // Italic
          em: ({ children }) => (
            <em style={{ color: '#7C3AED', fontStyle: 'italic' }}>
              {children}
            </em>
          ),

          // Lists
          ul: ({ children }) => (
            <ul style={{
              margin: '6px 0 10px',
              paddingLeft: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              listStyleType: 'disc'
            }}>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol style={{
              margin: '6px 0 10px',
              paddingLeft: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              listStyleType: 'decimal'
            }}>
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
              {children}
            </li>
          ),

          // Code
          code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '')
            const language = match?.[1] || 'text'

            if (!inline && match) {
              return (
                <div style={{
                  margin: '10px 0',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  border: '1px solid var(--border)'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#1e1e2e',
                    padding: '6px 14px',
                    borderBottom: '1px solid rgba(255,255,255,0.06)'
                  }}>
                    <span style={{
                      fontSize: '11px',
                      color: '#64748B',
                      fontFamily: 'monospace',
                      letterSpacing: '0.05em'
                    }}>
                      {language.toUpperCase()}
                    </span>
                    <button
                      onClick={() => navigator.clipboard.writeText(String(children))}
                      style={{
                        fontSize: '11px',
                        color: '#94A3B8',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}
                    >
                      Copy
                    </button>
                  </div>
                  <SyntaxHighlighter
                    style={oneDark}
                    language={language}
                    PreTag="div"
                    customStyle={{
                      margin: 0,
                      borderRadius: 0,
                      fontSize: '13px',
                      lineHeight: '1.6',
                      padding: '14px',
                      background: '#1a1a2e',
                    }}
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                </div>
              )
            }

            return (
              <code style={{
                backgroundColor: 'rgba(124,58,237,0.12)',
                border: '1px solid rgba(124,58,237,0.25)',
                borderRadius: '4px',
                padding: '1px 6px',
                fontSize: '12px',
                fontFamily: 'JetBrains Mono, Fira Code, monospace',
                color: '#7C3AED',
              }} {...props}>
                {children}
              </code>
            )
          },

          // Blockquote
          blockquote: ({ children }) => (
            <blockquote style={{
              borderLeft: '3px solid #7C3AED',
              margin: '10px 0',
              padding: '8px 14px',
              backgroundColor: 'rgba(124,58,237,0.07)',
              borderRadius: '0 8px 8px 0',
              color: 'var(--text-secondary)',
              fontStyle: 'italic'
            }}>
              {children}
            </blockquote>
          ),

          // Table
          table: ({ children }) => (
            <div style={{ overflowX: 'auto', margin: '10px 0' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '13px'
              }}>{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th style={{
              padding: '8px 12px',
              backgroundColor: 'rgba(124,58,237,0.1)',
              color: '#7C3AED',
              fontWeight: 600,
              textAlign: 'left',
              border: '1px solid var(--border)'
            }}>{children}</th>
          ),
          td: ({ children }) => (
            <td style={{
              padding: '7px 12px',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)'
            }}>{children}</td>
          ),

          // Link
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer"
              style={{
                color: '#7C3AED',
                textDecoration: 'underline',
                textUnderlineOffset: '3px'
              }}>
              {children}
            </a>
          ),

          // Horizontal rule
          hr: () => (
            <hr style={{
              border: 'none',
              borderTop: '1px solid var(--border)',
              margin: '16px 0'
            }} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
