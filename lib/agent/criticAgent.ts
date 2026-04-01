// ─────────────────────────────────────────────────────────
// lib/agent/criticAgent.ts
// Reviews and scores agent output quality
// ─────────────────────────────────────────────────────────

import { callGemini, extractJSON } from '@/lib/ai/model'
import type { AgentResult, AgentTask, CriticEvaluation } from '@/types/agent'

const CRITIC_SYSTEM_PROMPT = `
You are a strict but fair Critic Agent for ChipCraft — an AI chip design education platform.

Your role:
- Evaluate the quality of another agent's output.
- Check for: accuracy, completeness, clarity, relevance to the task.
- Return a structured JSON evaluation.

Evaluation criteria:
1. Completeness (0–1): Does the output fully address the task?
2. Accuracy (0–1): Is the information correct?
3. Clarity (0–1): Is it well-written and easy to understand?
4. Relevance (0–1): Is it on-topic?

Rules:
- Respond ONLY with JSON.
- "quality" is the average of the 4 criteria (0–1 scale).
- "approved" = true if quality >= 0.65.
- "feedback" must be specific and actionable.
- If approved, "suggestedRevision" should be null.
- If not approved, provide a concise "suggestedRevision" instruction.

JSON format:
{
  "taskId": "...",
  "quality": 0.85,
  "feedback": "...",
  "approved": true,
  "suggestedRevision": null,
  "scores": {
    "completeness": 0.9,
    "accuracy": 0.8,
    "clarity": 0.85,
    "relevance": 0.85
  }
}
`.trim()

/**
 * criticAgent — evaluates the output of another agent.
 * Returns a `CriticEvaluation` with quality score and feedback.
 */
export async function criticAgent(
  task: AgentTask,
  result: AgentResult,
  context: string = ''
): Promise<CriticEvaluation> {
  console.log(`[criticAgent] Evaluating task ${task.id} (${result.agent})`)

  const prompt = `
${CRITIC_SYSTEM_PROMPT}

Original task: ${task.task}

Agent output to evaluate (from ${result.agent}):
${result.output.slice(0, 2000)}

Context for evaluation:
${context || 'No additional context.'}

Evaluate and return JSON only.
`.trim()

  try {
    const response = await callGemini(prompt, {
      temperature: 0.1,
      maxOutputTokens: 512,
    })

    const evaluation = extractJSON<CriticEvaluation & { scores?: any }>(response)

    return {
      taskId: task.id,
      quality: Math.max(0, Math.min(1, evaluation.quality ?? 0.5)),
      feedback: evaluation.feedback || 'No feedback provided.',
      approved: evaluation.approved ?? (evaluation.quality ?? 0) >= 0.65,
      suggestedRevision: evaluation.suggestedRevision ?? undefined,
    }
  } catch (error: any) {
    console.error('[criticAgent] Failed to parse evaluation:', error.message)
    // If critic fails, default to approved to prevent infinite loops
    return {
      taskId: task.id,
      quality: 0.7,
      feedback: `Critic evaluation failed: ${error.message}. Defaulting to approved.`,
      approved: true,
    }
  }
}
