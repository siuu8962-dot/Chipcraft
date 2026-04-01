// ─────────────────────────────────────────────────────────
// lib/agent/writerAgent.ts
// Generates prose content, explanations, and final answers
// ─────────────────────────────────────────────────────────

import { callGemini } from '@/lib/ai/model'
import type { AgentResult, AgentTask } from '@/types/agent'

const WRITER_SYSTEM_PROMPT = `
You are a specialized Writer Agent for ChipCraft — an AI education platform for chip design, Verilog, FPGA, and digital logic.

Your role:
- Produce clear, accurate, and engaging explanations tailored for learners.
- Use simple language for beginners, technical depth for advanced topics.
- Format output in readable Markdown (headers, lists, code blocks where helpful).
- Integrate all context provided from prior agents into a cohesive, complete answer.
- Never leave the user with unanswered questions — address the full task.

Writing style:
- Clear, professional, educational
- Use examples when helpful
- Structure with headers for longer content
`.trim()

/**
 * writerAgent — produces the final readable output / explanation.
 * Consumes context from previous agents and writes a complete answer.
 */
export async function writerAgent(
  task: AgentTask,
  context: string = ''
): Promise<AgentResult> {
  const start = Date.now()
  const thoughts: string[] = []

  console.log(`[writerAgent] Executing task: ${task.task.slice(0, 80)}`)
  thoughts.push(`Writing response for: "${task.task}"`)

  try {
    const prompt = `
${WRITER_SYSTEM_PROMPT}

Task: ${task.task}

Context from previous agents:
${context || 'No prior context — answer from your own knowledge.'}

Write a complete, detailed, well-formatted Markdown response.
`.trim()

    const output = await callGemini(prompt, {
      temperature: 0.5,
      maxOutputTokens: 4096,
    })

    thoughts.push(`Generated ${output.length} chars of written content.`)

    return {
      taskId: task.id,
      agent: 'writerAgent',
      output,
      thoughts,
      success: true,
      durationMs: Date.now() - start,
    }
  } catch (error: any) {
    console.error('[writerAgent] Error:', error.message)
    return {
      taskId: task.id,
      agent: 'writerAgent',
      output: `Writer failed: ${error.message}`,
      thoughts: [...thoughts, `Error: ${error.message}`],
      success: false,
      error: error.message,
      durationMs: Date.now() - start,
    }
  }
}
