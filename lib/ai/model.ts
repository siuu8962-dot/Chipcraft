// ─────────────────────────────────────────────────────────
// lib/ai/model.ts  — Shared Gemini API wrapper
// ─────────────────────────────────────────────────────────

const GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
] as const

export interface GeminiCallOptions {
  temperature?: number
  maxOutputTokens?: number
  stopSequences?: string[]
  timeoutMs?: number
  maxRetries?: number
}

const DEFAULT_OPTIONS: Required<GeminiCallOptions> = {
  temperature: 0.4,
  maxOutputTokens: 4096,
  stopSequences: [],
  timeoutMs: 45_000,
  maxRetries: 3,
}

/**
 * Calls the Gemini API with automatic model fallback and exponential-backoff retry.
 * Returns the text content of the first candidate.
 */
export async function callGemini(
  prompt: string,
  opts: GeminiCallOptions = {}
): Promise<string> {
  const options = { ...DEFAULT_OPTIONS, ...opts }
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set in environment variables.')

  let lastError: Error | null = null

  for (const model of GEMINI_MODELS) {
    for (let attempt = 1; attempt <= options.maxRetries; attempt++) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: options.temperature,
                maxOutputTokens: options.maxOutputTokens,
                stopSequences: options.stopSequences,
              },
            }),
            signal: AbortSignal.timeout(options.timeoutMs),
          }
        )

        if (response.status === 429) {
          const waitMs = Math.pow(2, attempt) * 1500
          console.warn(`[Gemini] Rate limited on ${model}, attempt ${attempt}. Waiting ${waitMs}ms`)
          await sleep(waitMs)
          continue
        }

        if (!response.ok) {
          const err = await response.json().catch(() => ({}))
          throw new Error(`Gemini API error [${response.status}]: ${JSON.stringify(err)}`)
        }

        const data = await response.json()
        const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
        if (!text) throw new Error('Gemini returned empty response.')
        return text

      } catch (error: any) {
        lastError = error
        const isRateLimit = error.message?.includes('429') || error.message?.includes('RESOURCE_EXHAUSTED')
        if (isRateLimit && attempt < options.maxRetries) {
          const waitMs = Math.pow(2, attempt) * 1500
          console.warn(`[Gemini] 429 on ${model}. Retrying in ${waitMs}ms (${attempt}/${options.maxRetries})`)
          await sleep(waitMs)
          continue
        }
        // Non-recoverable error for this model — try next model
        console.warn(`[Gemini] Error on ${model}: ${error.message}. Trying next model...`)
        break
      }
    }
  }

  throw lastError ?? new Error('All Gemini models are unavailable.')
}

/**
 * Parses a JSON blob from LLM output, extracting from markdown fences if needed.
 */
export function extractJSON<T>(text: string): T {
  // Try to extract from ```json ... ``` block
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]+?)```/)
  const raw = fenceMatch ? fenceMatch[1].trim() : text.trim()
  return JSON.parse(raw) as T
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
