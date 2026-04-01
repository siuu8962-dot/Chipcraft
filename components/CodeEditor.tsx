'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface CodeEditorProps {
  code: string
  language: string
  onCodeChange?: (code: string) => void
  isLabMode?: boolean
}

export function CodeEditor({ code, language, onCodeChange, isLabMode = false }: CodeEditorProps) {
  const [editorCode, setEditorCode] = useState(code)
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value
    setEditorCode(newCode)
    onCodeChange?.(newCode)
  }

  const handleRun = async () => {
    setIsRunning(true)
    // Simulate code execution
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setOutput(
      `Compilation successful!\n$ ./program\nLED sequence started...\nPattern: ON-OFF-ON (500ms intervals)\nStatus: Running`
    )
    setIsRunning(false)
  }

  const languageMap: Record<string, string> = {
    c: 'C',
    python: 'Python',
    assembly: 'Assembly',
  }

  return (
    <div className="space-y-4">
      <Card className="bg-black border-border overflow-hidden flex flex-col h-full">
        {/* Header */}
        <div className="bg-muted/50 px-4 py-3 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground">
              {languageMap[language] || language}
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs font-mono text-muted-foreground">{editorCode.split('\n').length} lines</span>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="text-xs"
              onClick={() => setEditorCode(code)}
            >
              Reset
            </Button>
            {isLabMode && (
              <Button
                size="sm"
                className="text-xs"
                onClick={handleRun}
                disabled={isRunning}
              >
                {isRunning ? '▶ Running...' : '▶ Run'}
              </Button>
            )}
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-hidden">
          <textarea
            value={editorCode}
            onChange={handleCodeChange}
            className="w-full h-full p-4 bg-black text-green-400 font-mono text-sm resize-none focus:outline-none border-0"
            spellCheck="false"
            readOnly={!isLabMode}
          />
        </div>
      </Card>

      {/* Output */}
      {isLabMode && (
        <Card className="bg-black border-border p-4">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-mono">Terminal Output</p>
            <div className="bg-black text-green-400 font-mono text-xs p-3 rounded min-h-20 max-h-40 overflow-auto">
              {output || (
                <span className="text-muted-foreground">Click Run to execute code...</span>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
