// ─────────────────────────────────────────────────────────
// app/api/agent/run/route.ts
// POST /api/agent/run — Multi-Agent SSE streaming endpoint
// Replaces the old single-agent ReAct loop
// ─────────────────────────────────────────────────────────

import { NextRequest } from 'next/server'
import { runMultiAgentStream } from '@/lib/agent/controller'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { MultiAgentOptions } from '@/types/agent'

// Keep bridge for client-side tool actions (backward compat)
import { waitForClientResult } from '@/lib/agent/bridge/ActionBridge'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 120

/**
 * POST /api/agent/run
 * 
 * Body: { input: string, goal?: string, maxIterations?: number, criticThreshold?: number }
 * 
 * Note: "goal" is accepted for backward compatibility with the old AgentPanel component.
 * 
 * Returns: SSE stream of JSON events:
 *   { event: 'start' | 'plan' | 'task_start' | 'task_complete' | 'done' | 'error' | 'close', ...data }
 */
export async function POST(req: NextRequest) {
  const encoder = new TextEncoder()

  function makeStream(handler: (ctrl: ReadableStreamDefaultController) => Promise<void>) {
    return new ReadableStream({ start: handler })
  }

  // ── Parse body
  let body: {
    input?: string
    goal?: string   // legacy field
    maxIterations?: number
    criticThreshold?: number
    conversationId?: string  // legacy field
  }
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Accept both "input" (new) and "goal" (legacy) field names
  const rawInput = body.input || body.goal || ''
  if (!rawInput.trim()) {
    return new Response(
      JSON.stringify({ error: 'Field "input" (or "goal") is required.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const maxIterations = Math.min(Math.max(body.maxIterations ?? 8, 1), 20)
  const criticThreshold = Math.min(Math.max(body.criticThreshold ?? 0.6, 0), 1)

  // ── Auth (optional — public requests skip long-term memory)
  let userId: string | undefined
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    userId = user?.id
  } catch { /* allow unauthenticated */ }

  const options: MultiAgentOptions = {
    maxIterations,
    criticThreshold,
    userId,
    streaming: true,
  }

  // ── SSE stream
  const stream = makeStream(async controller => {
    function send(data: Record<string, any>) {
      controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
    }

    try {
      const generator = runMultiAgentStream(rawInput.trim(), options)

      for await (const chunk of generator) {
        send(chunk)

        if (chunk.event === 'done' || chunk.event === 'error') {
          send({ event: 'close' })
          break
        }
      }
    } catch (error: any) {
      console.error('[/api/agent/run] Fatal stream error:', error.message)
      send({
        event: 'error',
        error: process.env.NODE_ENV === 'development'
          ? error.message
          : 'Agent gặp lỗi. Vui lòng thử lại.',
        // Legacy format for backward-compat with old AgentPanel
        status: 'error',
        errorMessage: error.message,
      })
      send({ event: 'close' })
    } finally {
      controller.close()
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}

/**
 * GET /api/agent/run — API documentation / health check
 */
export async function GET() {
  return Response.json({
    status: 'ok',
    version: '2.0.0',
    description: 'ChipCraft Multi-Agent AI System',
    agents: ['plannerAgent', 'researchAgent', 'writerAgent', 'coderAgent', 'criticAgent', 'toolAgent'],
    endpoint: {
      method: 'POST',
      body: {
        input: 'string — user request (required)',
        maxIterations: 'number — max loop iterations, default 8 (range 1–20)',
        criticThreshold: 'number — quality threshold 0–1, default 0.6',
      },
      response: 'text/event-stream (SSE)',
      events: ['start', 'plan', 'task_start', 'task_complete', 'done', 'error', 'close'],
    },
  })
}
