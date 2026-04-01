// ─────────────────────────────────────────────────────────
// lib/agent/plannerAgent.ts
// Decomposes user input into a structured AgentTask[] plan
// ─────────────────────────────────────────────────────────

import { callGemini, extractJSON } from '@/lib/ai/model'
import type { AgentTask, AgentName, ShortTermEntry } from '@/types/agent'
import { randomUUID } from 'crypto'

const PLANNER_SYSTEM_PROMPT = `
You are a master planning agent for an AI system called ChipCraft.
Your job: break down the user's request into a structured execution plan.

Rules:
- Return ONLY a valid JSON array of task objects.
- Each task must have: id (string), agent (one of the agents below), task (clear instruction), priority (1=highest).
- Use 2–6 steps. Avoid redundancy.
- The last step should almost always be "writerAgent" to produce a clean final answer.
- If the request needs research, start with "researchAgent".
- If the request involves code, include "coderAgent".
- Always include "criticAgent" as the second-to-last step to review the output.
- Use "dependsOn" with an array of task IDs when a task needs prior results.

Available agents:
- researchAgent: Search the web, ChipCraft course content, and gather information.
- writerAgent: Generate explanations, summaries, and prose content.
- coderAgent: Generate Verilog, VHDL, TypeScript, or other code.
- criticAgent: Review and evaluate previous agent outputs.
- toolAgent: Call external APIs, database queries, or run simulations.
- plannerAgent: Re-plan if the task has fundamentally changed.

Output format (JSON array):
[
  { "id": "t1", "agent": "researchAgent", "task": "...", "priority": 1 },
  { "id": "t2", "agent": "coderAgent", "task": "...", "priority": 2, "dependsOn": ["t1"] },
  { "id": "t3", "agent": "criticAgent", "task": "Review the code from t2", "priority": 3, "dependsOn": ["t2"] },
  { "id": "t4", "agent": "writerAgent", "task": "Compile results into a final answer", "priority": 4, "dependsOn": ["t1","t2","t3"] }
]
`.trim()

/**
 * plannerAgent — converts a user intent string into a prioritized AgentTask[].
 * @param input  The raw user request
 * @param context  Optional short-term memory context string
 */
export async function plannerAgent(
  input: string,
  context: string = ''
): Promise<AgentTask[]> {
  console.log('[plannerAgent] Planning task:', input.slice(0, 80))

  const prompt = `
${PLANNER_SYSTEM_PROMPT}

${context ? `Session context:\n${context}\n` : ''}
User request: ${input}

Respond ONLY with the JSON array. No explanation.
`.trim()

  const response = await callGemini(prompt, { temperature: 0.2, maxOutputTokens: 1024 })

  let tasks: AgentTask[]
  try {
    tasks = extractJSON<AgentTask[]>(response)
  } catch {
    // Fallback: single writerAgent task
    console.warn('[plannerAgent] Failed to parse JSON plan, using fallback.')
    tasks = [
      {
        id: `t${randomUUID().slice(0, 6)}`,
        agent: 'writerAgent' as AgentName,
        task: input,
        priority: 1,
      },
    ]
  }

  // Ensure every task has a stable ID
  return tasks.map(t => ({
    ...t,
    id: t.id || `t${randomUUID().slice(0, 6)}`,
  }))
}
