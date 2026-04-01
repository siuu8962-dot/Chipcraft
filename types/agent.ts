// ─────────────────────────────────────────────────────────
// types/agent.ts  — Shared types for the Multi-Agent system
// ─────────────────────────────────────────────────────────

/** Name of every available specialist agent */
export type AgentName =
  | 'plannerAgent'
  | 'researchAgent'
  | 'writerAgent'
  | 'coderAgent'
  | 'criticAgent'
  | 'toolAgent'

/** A single step in the multi-agent execution plan */
export interface AgentTask {
  id: string
  agent: AgentName
  task: string
  priority: number
  dependsOn?: string[]   // IDs of tasks that must complete first
}

/** The result produced by one agent for one task */
export interface AgentResult {
  taskId: string
  agent: AgentName
  output: string
  thoughts: string[]
  success: boolean
  error?: string
  durationMs: number
}

/** A thought/log entry produced during execution */
export interface AgentThought {
  timestamp: number
  agent: AgentName | 'controller'
  message: string
  level: 'info' | 'warn' | 'error' | 'debug'
}

/** Critic evaluation of a previous agent result */
export interface CriticEvaluation {
  taskId: string
  quality: number          // 0–1
  feedback: string
  approved: boolean
  suggestedRevision?: string
}

/** Short-term memory entry (in-memory, current session) */
export interface ShortTermEntry {
  taskId: string
  agent: AgentName
  summary: string
  output: string
  timestamp: number
}

/** Long-term memory entry (persisted to Supabase) */
export interface LongTermEntry {
  id: string
  userId: string
  memoryType: string
  content: string
  importance: number
  createdAt: string
}

/** Complete output of one runMultiAgent() call */
export interface MultiAgentOutput {
  finalAnswer: string
  steps: AgentResult[]
  thoughts: AgentThought[]
  memory: ShortTermEntry[]
  plan: AgentTask[]
  iterations: number
  totalDurationMs: number
  status?: 'thinking' | 'acting' | 'done' | 'error'
}

/** Options for the multi-agent controller */
export interface MultiAgentOptions {
  maxIterations?: number        // default 8
  criticThreshold?: number      // quality threshold 0–1, default 0.6
  userId?: string               // for long-term memory
  streaming?: boolean
}
