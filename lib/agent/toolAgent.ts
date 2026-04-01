// ─────────────────────────────────────────────────────────
// lib/agent/toolAgent.ts
// Executes registered tools by name with flexible input
// ─────────────────────────────────────────────────────────

import { callGemini, extractJSON } from '@/lib/ai/model'
import type { AgentResult, AgentTask } from '@/types/agent'
import { getAllTools, type AgentTool } from './tools/index'

const TOOL_SYSTEM_PROMPT = `
You are a Tool Agent for ChipCraft. Your job is to determine which tool to use for the task.

Available tools will be listed. You must return a JSON object:
{
  "toolName": "name_of_tool",
  "toolInput": "input string or JSON string for the tool"
}

Rules:
- Pick exactly ONE tool per invocation.
- Provide the best possible input for that tool.
- If no tool fits, use "calculator" with input "0" as a fallback.
- Respond ONLY with JSON.
`.trim()

// Tool registry — initialized lazily
let toolRegistry: Map<string, AgentTool> | null = null

function getToolRegistry(): Map<string, AgentTool> {
  if (!toolRegistry) {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || ''
    const tools = getAllTools(apiKey).filter(t => t.executeLocation !== 'client')
    toolRegistry = new Map(tools.map(t => [t.name, t]))
  }
  return toolRegistry
}

/**
 * executeTool — low-level tool executor.
 * Call directly when you know the tool name and input.
 */
export async function executeTool(
  name: string,
  input: any
): Promise<string> {
  const registry = getToolRegistry()
  const tool = registry.get(name) || registry.get(name.toLowerCase().replace(/\s/g, '_'))
  if (!tool) {
    const available = Array.from(registry.keys()).join(', ')
    return `Tool "${name}" not found. Available tools: ${available}`
  }

  const inputStr = typeof input === 'string' ? input : JSON.stringify(input)
  try {
    return await Promise.race([
      tool.execute(inputStr),
      new Promise<string>((_, reject) =>
        setTimeout(() => reject(new Error(`Tool "${name}" timed out after 15s`)), 15_000)
      ),
    ])
  } catch (err: any) {
    return `Tool error: ${err.message}`
  }
}

/**
 * toolAgent — reasoning agent that selects the right tool for a task.
 * Asks the LLM to pick the best tool, then executes it.
 */
export async function toolAgent(
  task: AgentTask,
  context: string = ''
): Promise<AgentResult> {
  const start = Date.now()
  const thoughts: string[] = []

  console.log(`[toolAgent] Executing task: ${task.task.slice(0, 80)}`)
  thoughts.push(`Selecting tool for: "${task.task}"`)

  const registry = getToolRegistry()
  const toolList = Array.from(registry.values())
    .map(t => `- ${t.name}: ${t.description.slice(0, 100)}`)
    .join('\n')

  try {
    // Step 1: Ask LLM to select the best tool
    const selectionPrompt = `
${TOOL_SYSTEM_PROMPT}

Available tools:
${toolList}

Task: ${task.task}
Context: ${context.slice(0, 500) || 'None'}

Select the tool and provide the input. Return JSON only.
`.trim()

    const selection = await callGemini(selectionPrompt, {
      temperature: 0.1,
      maxOutputTokens: 256,
    })

    let toolName: string
    let toolInput: any

    try {
      const parsed = extractJSON<{ toolName: string; toolInput: any }>(selection)
      toolName = parsed.toolName
      toolInput = parsed.toolInput
    } catch {
      // Fallback: use web_search with the task as query
      toolName = 'web_search'
      toolInput = task.task
    }

    thoughts.push(`Selected tool: "${toolName}" with input: ${String(toolInput).slice(0, 80)}`)

    // Step 2: Execute the selected tool
    const toolResult = await executeTool(toolName, toolInput)
    thoughts.push(`Tool returned ${toolResult.length} chars.`)

    // Step 3: Summarize result if it's too long
    let finalOutput = toolResult
    if (toolResult.length > 2000) {
      const summaryPrompt = `
Summarize the following tool output to answer the task.
Task: ${task.task}
Tool output:
${toolResult.slice(0, 3000)}
`.trim()
      finalOutput = await callGemini(summaryPrompt, {
        temperature: 0.3,
        maxOutputTokens: 1024,
      })
      thoughts.push('Summarized long tool output via LLM.')
    }

    return {
      taskId: task.id,
      agent: 'toolAgent',
      output: `**Tool used:** \`${toolName}\`\n\n${finalOutput}`,
      thoughts,
      success: true,
      durationMs: Date.now() - start,
    }
  } catch (error: any) {
    console.error('[toolAgent] Error:', error.message)
    return {
      taskId: task.id,
      agent: 'toolAgent',
      output: `Tool execution failed: ${error.message}`,
      thoughts: [...thoughts, `Error: ${error.message}`],
      success: false,
      error: error.message,
      durationMs: Date.now() - start,
    }
  }
}
