// ─────────────────────────────────────────────────────────
// lib/agent/researchAgent.ts
// Gathers information via web search and course DB lookup
// ─────────────────────────────────────────────────────────

import { callGemini } from '@/lib/ai/model'
import type { AgentResult, AgentTask } from '@/types/agent'
import { webSearchTool, searchCourseContentTool } from './tools/index'

const RESEARCH_SYSTEM_PROMPT = `
You are a specialized Research Agent for ChipCraft — an AI education platform focused on chip design, Verilog, FPGA, and digital logic.

Your role:
1. Analyze the provided task and context.
2. Identify key information needed.
3. Use the search results provided to synthesize a comprehensive, accurate research report.
4. Be factual, cite sources where relevant.
5. End with a clear "Research Summary" section.

Format your output as:
## Research Findings
[detailed findings]

## Key Points
- ...
- ...

## Research Summary
[concise summary for downstream agents]
`.trim()

/**
 * researchAgent — gathers information to support a task.
 * Runs web search + course content search then synthesizes results via LLM.
 */
export async function researchAgent(
  task: AgentTask,
  context: string = ''
): Promise<AgentResult> {
  const start = Date.now()
  const thoughts: string[] = []

  console.log(`[researchAgent] Executing task: ${task.task.slice(0, 80)}`)
  thoughts.push(`Starting research for: "${task.task}"`)

  try {
    // Step 1: Extract search keywords using a quick LLM call
    const keywordPrompt = `
Extract 1-3 concise search queries for the following task. Return as JSON array of strings only.
Task: ${task.task}
Context: ${context.slice(0, 300)}
`.trim()

    const keywordResponse = await callGemini(keywordPrompt, {
      temperature: 0.1,
      maxOutputTokens: 128,
    })

    let queries: string[] = []
    try {
      const match = keywordResponse.match(/\[[\s\S]+?\]/)
      queries = match ? JSON.parse(match[0]) : [task.task]
    } catch {
      queries = [task.task]
    }
    thoughts.push(`Generated search queries: ${queries.join(', ')}`)

    // Step 2: Execute searches in parallel
    const searchPromises = queries.slice(0, 2).map(async q => {
      const [webResult, courseResult] = await Promise.allSettled([
        webSearchTool.execute(q),
        searchCourseContentTool.execute(q),
      ])
      return [
        webResult.status === 'fulfilled' ? `[Web] ${webResult.value}` : '',
        courseResult.status === 'fulfilled' ? `[Course DB] ${courseResult.value}` : '',
      ].filter(Boolean).join('\n\n')
    })

    const searchResults = await Promise.all(searchPromises)
    const combinedResults = searchResults.join('\n\n---\n\n').slice(0, 4000)
    thoughts.push(`Collected ${combinedResults.length} chars of search results.`)

    // Step 3: Synthesize findings via LLM
    const synthesisPrompt = `
${RESEARCH_SYSTEM_PROMPT}

Task: ${task.task}

Session context:
${context || 'No prior context.'}

Search results:
${combinedResults}

Synthesize the above into a clear research report.
`.trim()

    const synthesis = await callGemini(synthesisPrompt, {
      temperature: 0.3,
      maxOutputTokens: 2048,
    })

    thoughts.push('Research synthesis complete.')
    return {
      taskId: task.id,
      agent: 'researchAgent',
      output: synthesis,
      thoughts,
      success: true,
      durationMs: Date.now() - start,
    }
  } catch (error: any) {
    console.error('[researchAgent] Error:', error.message)
    return {
      taskId: task.id,
      agent: 'researchAgent',
      output: `Research failed: ${error.message}`,
      thoughts: [...thoughts, `Error: ${error.message}`],
      success: false,
      error: error.message,
      durationMs: Date.now() - start,
    }
  }
}
