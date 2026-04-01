// ─────────────────────────────────────────────────────────
// lib/agent/memory/AgentMemory.ts
// Short-term (in-memory) + Long-term (Supabase) memory
// ─────────────────────────────────────────────────────────

import type { ShortTermEntry, LongTermEntry } from '@/types/agent'

// ── SHORT-TERM MEMORY ──────────────────────────────────────
// Lives for the duration of one runMultiAgent() call.
// Passed by reference so all agents and the controller
// can read and write to the same session store.

export class ShortTermMemory {
  private entries: ShortTermEntry[] = []
  private maxEntries: number

  constructor(maxEntries = 50) {
    this.maxEntries = maxEntries
  }

  add(entry: ShortTermEntry): void {
    this.entries.push(entry)
    if (this.entries.length > this.maxEntries) {
      this.entries.shift()
    }
  }

  getAll(): ShortTermEntry[] {
    return [...this.entries]
  }

  /** Returns the last N entries as a context string for prompt injection */
  toContextString(last = 5): string {
    const recent = this.entries.slice(-last)
    if (recent.length === 0) return 'No prior context in this session.'
    return recent
      .map(e => `[${e.agent} — Task ${e.taskId}]\n${e.summary}\n---`)
      .join('\n')
  }

  findByTaskId(taskId: string): ShortTermEntry | undefined {
    return this.entries.find(e => e.taskId === taskId)
  }

  clear(): void {
    this.entries = []
  }

  get size(): number {
    return this.entries.length
  }
}

// ── LONG-TERM MEMORY (Supabase) ────────────────────────────
// Persists across sessions using the `agent_memories` table.

import { createServerSupabaseClient } from '@/lib/supabase-server'

export interface Memory {
  id: string
  userId: string
  memoryType: string
  content: string
  importance: number
  createdAt: string
}

export class LongTermMemory {
  private userId: string

  constructor(userId: string) {
    this.userId = userId
  }

  /** Fetch top N memories by importance (used for prompt injection) */
  async getContextString(limit = 8): Promise<string> {
    const entries = await this.fetch(limit)
    if (entries.length === 0) return 'No long-term memories found for this user.'
    return entries.map(m => `[${m.memoryType}] ${m.content}`).join('\n')
  }

  /** Fetch raw memory entries */
  async fetch(limit = 10): Promise<LongTermEntry[]> {
    try {
      const supabase = await createServerSupabaseClient()
      const { data, error } = await supabase
        .from('agent_memories')
        .select('id, user_id, memory_type, content, importance, created_at')
        .eq('user_id', this.userId)
        .order('importance', { ascending: false })
        .limit(limit)

      if (error || !data) return []
      return data.map(m => ({
        id: m.id,
        userId: m.user_id,
        memoryType: m.memory_type,
        content: m.content,
        importance: m.importance,
        createdAt: m.created_at,
      }))
    } catch {
      return []
    }
  }

  /** Save a new memory entry */
  async save(
    type: string,
    content: string,
    importance: number = 1
  ): Promise<boolean> {
    try {
      const supabase = await createServerSupabaseClient()
      const { error } = await supabase.from('agent_memories').insert({
        user_id: this.userId,
        memory_type: type,
        content: content.slice(0, 1000), // cap length
        importance,
      })
      return !error
    } catch {
      return false
    }
  }

  /** Save final answer as a high-importance memory */
  async saveFinalAnswer(goal: string, answer: string): Promise<void> {
    const content = `Goal: ${goal.slice(0, 200)}\nAnswer: ${answer.slice(0, 600)}`
    await this.save('final_answer', content, 3)
  }

  /** Fetch only memories of a given type */
  async fetchByType(type: string, limit = 5): Promise<LongTermEntry[]> {
    try {
      const supabase = await createServerSupabaseClient()
      const { data, error } = await supabase
        .from('agent_memories')
        .select('id, user_id, memory_type, content, importance, created_at')
        .eq('user_id', this.userId)
        .eq('memory_type', type)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error || !data) return []
      return data.map(m => ({
        id: m.id,
        userId: m.user_id,
        memoryType: m.memory_type,
        content: m.content,
        importance: m.importance,
        createdAt: m.created_at,
      }))
    } catch {
      return []
    }
  }
}

// ── Legacy static helper (backward compat) ──────────────────
export class AgentMemory {
  static async getMemories(userId: string): Promise<string[]> {
    const mem = new LongTermMemory(userId)
    const entries = await mem.fetch(10)
    return entries.map(m => `[${m.memoryType}] ${m.content}`)
  }

  static async saveMemory(
    userId: string,
    type: string,
    content: string,
    importance: number = 1
  ) {
    const mem = new LongTermMemory(userId)
    return mem.save(type, content, importance)
  }
}
