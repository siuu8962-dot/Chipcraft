// ─────────────────────────────────────────────────────────
// lib/agent/controller.ts
// Main Multi-Agent orchestration engine
// ─────────────────────────────────────────────────────────

import type {
  AgentTask,
  AgentResult,
  AgentThought,
  MultiAgentOutput,
  MultiAgentOptions,
  ShortTermEntry,
  CriticEvaluation,
} from '@/types/agent'

import { plannerAgent } from './plannerAgent'
import { researchAgent } from './researchAgent'
import { writerAgent } from './writerAgent'
import { coderAgent } from './coderAgent'
import { criticAgent } from './criticAgent'
import { toolAgent } from './toolAgent'
import { ShortTermMemory, LongTermMemory } from './memory/AgentMemory'

// ── Constants ──────────────────────────────────────────────
const DEFAULT_MAX_ITERATIONS = 8
const DEFAULT_CRITIC_THRESHOLD = 0.6
const MAX_REVISION_ATTEMPTS = 2

// ── Logger ──────────────────────────────────────────────────
function createLogger(thoughts: AgentThought[]) {
  return {
    info: (agent: AgentThought['agent'], message: string) => {
      const entry: AgentThought = { timestamp: Date.now(), agent, message, level: 'info' }
      thoughts.push(entry)
      console.log(`[${agent}] ℹ️  ${message}`)
    },
    warn: (agent: AgentThought['agent'], message: string) => {
      const entry: AgentThought = { timestamp: Date.now(), agent, message, level: 'warn' }
      thoughts.push(entry)
      console.warn(`[${agent}] ⚠️  ${message}`)
    },
    error: (agent: AgentThought['agent'], message: string) => {
      const entry: AgentThought = { timestamp: Date.now(), agent, message, level: 'error' }
      thoughts.push(entry)
      console.error(`[${agent}] ❌ ${message}`)
    },
    debug: (agent: AgentThought['agent'], message: string) => {
      const entry: AgentThought = { timestamp: Date.now(), agent, message, level: 'debug' }
      thoughts.push(entry)
      console.debug(`[${agent}] 🔍 ${message}`)
    },
  }
}

// ── Agent Dispatcher ─────────────────────────────────────────
async function dispatchAgent(
  task: AgentTask,
  context: string
): Promise<AgentResult> {
  switch (task.agent) {
    case 'researchAgent': return researchAgent(task, context)
    case 'writerAgent':   return writerAgent(task, context)
    case 'coderAgent':    return coderAgent(task, context)
    case 'toolAgent':     return toolAgent(task, context)
    case 'criticAgent': {
      // If criticAgent is in the plan as a task, it reviews the last result
      // This handles the case where the planner made it an explicit step
      const fakeResult: AgentResult = {
        taskId: task.id,
        agent: 'writerAgent',
        output: context,
        thoughts: [],
        success: true,
        durationMs: 0,
      }
      const eval_ = await criticAgent(task, fakeResult, context)
      return {
        taskId: task.id,
        agent: 'criticAgent',
        output: `**Quality Score:** ${(eval_.quality * 100).toFixed(0)}%\n\n**Feedback:** ${eval_.feedback}${eval_.suggestedRevision ? `\n\n**Suggested Revision:** ${eval_.suggestedRevision}` : ''}`,
        thoughts: [`Quality: ${eval_.quality}`, `Approved: ${eval_.approved}`, eval_.feedback],
        success: eval_.approved,
        durationMs: 0,
      }
    }
    case 'plannerAgent': {
      // Re-planning step
      const newPlan = await plannerAgent(task.task, context)
      return {
        taskId: task.id,
        agent: 'plannerAgent',
        output: JSON.stringify(newPlan, null, 2),
        thoughts: [`Re-planned with ${newPlan.length} steps.`],
        success: true,
        durationMs: 0,
      }
    }
    default: {
      return writerAgent(task, context)
    }
  }
}

// ── Resolve task dependencies ──────────────────────────────
function resolveDependencies(
  tasks: AgentTask[],
  completedIds: Set<string>
): AgentTask[] {
  return tasks.filter(task => {
    if (completedIds.has(task.id)) return false
    if (!task.dependsOn || task.dependsOn.length === 0) return true
    return task.dependsOn.every(dep => completedIds.has(dep))
  })
}

// ── Main Controller ───────────────────────────────────────────
/**
 * runMultiAgent — the main entry point for the multi-agent system.
 * Orchestrates: plan → execute → critique → refine → finalize.
 */
export async function runMultiAgent(
  input: string,
  options: MultiAgentOptions = {}
): Promise<MultiAgentOutput> {
  const startTime = Date.now()
  const maxIterations = options.maxIterations ?? DEFAULT_MAX_ITERATIONS
  const criticThreshold = options.criticThreshold ?? DEFAULT_CRITIC_THRESHOLD

  // ── Initialize memory
  const shortTerm = new ShortTermMemory(50)
  const longTerm = options.userId ? new LongTermMemory(options.userId) : null

  // ── Initialize logging
  const thoughts: AgentThought[] = []
  const log = createLogger(thoughts)
  const allResults: AgentResult[] = []

  log.info('controller', `Starting multi-agent run. Input: "${input.slice(0, 80)}"`)
  log.info('controller', `Options: maxIterations=${maxIterations}, criticThreshold=${criticThreshold}`)

  // ── Load long-term context
  let longTermContext = ''
  if (longTerm) {
    longTermContext = await longTerm.getContextString(6)
    log.debug('controller', `Loaded long-term memory: ${longTermContext.slice(0, 80)}`)
  }

  // ── STEP 1: Plan
  log.info('plannerAgent', `Breaking down task into steps...`)
  let plan: AgentTask[]
  try {
    plan = await plannerAgent(input, shortTerm.toContextString() + '\n' + longTermContext)
    log.info('plannerAgent', `Plan created with ${plan.length} steps.`)
  } catch (err: any) {
    log.error('plannerAgent', `Planning failed: ${err.message}`)
    // Emergency single-step fallback
    plan = [{
      id: 't1',
      agent: 'writerAgent',
      task: input,
      priority: 1,
    }]
  }

  // Sort plan by priority
  plan.sort((a, b) => a.priority - b.priority)

  // ── STEP 2: Execute loop
  const completedIds = new Set<string>()
  let iterations = 0
  let finalAnswer = ''

  while (iterations < maxIterations) {
    iterations++
    log.info('controller', `─── Iteration ${iterations}/${maxIterations} ───`)

    // Find next executable tasks (dependencies satisfied)
    const readyTasks = resolveDependencies(plan, completedIds)
    if (readyTasks.length === 0) {
      log.info('controller', 'No more tasks to execute. Plan complete.')
      break
    }

    // Execute the highest-priority ready task
    const task = readyTasks[0]
    log.info('controller', `Executing: [${task.agent}] "${task.task.slice(0, 60)}"`)

    // Build context from short-term memory + long-term memory
    const context = [
      longTermContext ? `Long-term context:\n${longTermContext}` : '',
      shortTerm.toContextString(4),
    ].filter(Boolean).join('\n\n---\n\n')

    // ── Execute agent
    let result = await dispatchAgent(task, context)
    allResults.push(result)
    log.info(task.agent, `Completed in ${result.durationMs}ms. Success: ${result.success}`)

    // ── Critique agent output (skip if this task IS the critic)
    if (task.agent !== 'criticAgent' && task.agent !== 'plannerAgent') {
      log.info('criticAgent', `Evaluating output of task ${task.id}...`)
      let evaluation: CriticEvaluation | null = null
      let revisionAttempt = 0

      while (revisionAttempt < MAX_REVISION_ATTEMPTS) {
        evaluation = await criticAgent(task, result, context)
        log.info(
          'criticAgent',
          `Task ${task.id} quality: ${(evaluation.quality * 100).toFixed(0)}% — ${evaluation.approved ? '✅ Approved' : '❌ Needs revision'}`
        )

        if (evaluation.approved || evaluation.quality >= criticThreshold) break

        // Request revision if threshold not met
        revisionAttempt++
        log.warn('controller', `Revision attempt ${revisionAttempt}/${MAX_REVISION_ATTEMPTS} for task ${task.id}`)

        const revisionTask: AgentTask = {
          ...task,
          task: evaluation.suggestedRevision
            ? `${evaluation.suggestedRevision}\n\nOriginal task: ${task.task}`
            : task.task,
        }

        result = await dispatchAgent(revisionTask, context)
        allResults.push(result)
        log.info(task.agent, `Revision complete. Length: ${result.output.length} chars.`)
      }
    }

    // ── Store in short-term memory
    const memEntry: ShortTermEntry = {
      taskId: task.id,
      agent: task.agent,
      summary: result.output.slice(0, 300),
      output: result.output,
      timestamp: Date.now(),
    }
    shortTerm.add(memEntry)
    completedIds.add(task.id)

    // ── Update final answer with latest writerAgent output
    if (task.agent === 'writerAgent' || (task.agent === 'coderAgent' && plan.every(
      t => completedIds.has(t.id) || t.id === task.id
    ))) {
      finalAnswer = result.output
    }
  }

  // ── STEP 3: Determine final answer
  if (!finalAnswer) {
    // Use the last successful result as the final answer
    const lastSuccess = allResults.slice().reverse().find(r => r.success)
    finalAnswer = lastSuccess?.output
      ?? allResults.at(-1)?.output
      ?? 'Unable to complete the task. Please try again with a more specific request.'
  }

  log.info('controller', `Multi-agent run complete. ${allResults.length} steps, ${iterations} iterations.`)

  // ── STEP 4: Persist to long-term memory
  if (longTerm && finalAnswer) {
    await longTerm.saveFinalAnswer(input, finalAnswer)
    log.debug('controller', 'Final answer saved to long-term memory.')
  }

  return {
    finalAnswer,
    steps: allResults,
    thoughts,
    memory: shortTerm.getAll(),
    plan,
    iterations,
    totalDurationMs: Date.now() - startTime,
  }
}

// ── Streaming variant using AsyncGenerator ────────────────────
/**
 * runMultiAgentStream — streaming version that yields partial results.
 * Use with SSE or async iteration.
 */
export async function* runMultiAgentStream(
  input: string,
  options: MultiAgentOptions = {}
): AsyncGenerator<Partial<MultiAgentOutput> & { event: string }> {
  const maxIterations = options.maxIterations ?? DEFAULT_MAX_ITERATIONS
  const criticThreshold = options.criticThreshold ?? DEFAULT_CRITIC_THRESHOLD

  const shortTerm = new ShortTermMemory(50)
  const longTerm = options.userId ? new LongTermMemory(options.userId) : null
  const thoughts: AgentThought[] = []
  const allResults: AgentResult[] = []

  const log = createLogger(thoughts)
  log.info('controller', `Stream starting for: "${input.slice(0, 60)}"`)
  yield { event: 'start', thoughts: [...thoughts] }

  // Load long-term memory
  let longTermContext = ''
  if (longTerm) {
    longTermContext = await longTerm.getContextString(6)
  }

  // Plan
  let plan: AgentTask[]
  try {
    plan = await plannerAgent(input, longTermContext)
    log.info('plannerAgent', `Plan: ${plan.length} steps`)
    yield { event: 'plan', plan: [...plan], thoughts: [...thoughts] }
  } catch (err: any) {
    plan = [{ id: 't1', agent: 'writerAgent', task: input, priority: 1 }]
    log.warn('plannerAgent', `Fallback plan used: ${err.message}`)
  }

  plan.sort((a, b) => a.priority - b.priority)

  const completedIds = new Set<string>()
  let iterations = 0
  let finalAnswer = ''

  while (iterations < maxIterations) {
    iterations++
    const readyTasks = resolveDependencies(plan, completedIds)
    if (readyTasks.length === 0) break

    const task = readyTasks[0]
    log.info('controller', `Dispatching [${task.agent}] task ${task.id}`)
    yield { event: 'task_start', plan: [task], thoughts: [...thoughts] }

    const context = [
      longTermContext ? `Long-term:\n${longTermContext}` : '',
      shortTerm.toContextString(4),
    ].filter(Boolean).join('\n\n')

    const result = await dispatchAgent(task, context)
    allResults.push(result)
    log.info(task.agent, `Done. Success: ${result.success}`)

    // Critique
    if (task.agent !== 'criticAgent' && task.agent !== 'plannerAgent') {
      const evaluation = await criticAgent(task, result, context)
      log.info('criticAgent', `Quality: ${(evaluation.quality * 100).toFixed(0)}%`)
    }

    shortTerm.add({
      taskId: task.id,
      agent: task.agent,
      summary: result.output.slice(0, 300),
      output: result.output,
      timestamp: Date.now(),
    })
    completedIds.add(task.id)

    if (task.agent === 'writerAgent') finalAnswer = result.output

    yield {
      event: 'task_complete',
      status: 'acting',
      steps: [...allResults],
      memory: shortTerm.getAll(),
      thoughts: [...thoughts],
    }
  }

  if (!finalAnswer) {
    finalAnswer = allResults.slice().reverse().find(r => r.success)?.output
      ?? 'Task could not be completed.'
  }

  if (longTerm) await longTerm.saveFinalAnswer(input, finalAnswer)

  yield {
    event: 'done',
    status: 'done',
    finalAnswer,
    steps: allResults,
    thoughts,
    memory: shortTerm.getAll(),
    plan,
    iterations,
    totalDurationMs: 0,
  }
}
