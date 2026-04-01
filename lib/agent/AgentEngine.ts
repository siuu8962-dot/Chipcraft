import { getAgentSystemPrompt } from "./prompts/agentSystemPrompt"

export interface AgentStep {
  thought: string
  action: string
  actionInput: string
  observation: string
}

export interface AgentState {
  goal: string
  steps: AgentStep[]
  finalAnswer: string | null
  status: 'thinking' | 'acting' | 'reflecting' | 'done' | 'error'
  iterations: number
  maxIterations: number
  errorMessage?: string
}

export interface Tool {
  name: string
  description: string
  parameters: any
  execute: (input: string) => Promise<string>
  executeLocation?: 'server' | 'client'
}

export class AgentEngine {
  private tools: Map<string, Tool> = new Map()
  private apiKey: string

  constructor(apiKey: string, tools: Tool[]) {
    this.apiKey = apiKey
    tools.forEach(tool => this.tools.set(tool.name, tool))
  }

  private async callLLMWithRetry(prompt: string, maxRetries = 3): Promise<string> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.callLLM(prompt)
      } catch (error: any) {
        const is429 = error.message?.includes('429') || error.message?.includes('RESOURCE_EXHAUSTED')
        
        if (is429 && attempt < maxRetries) {
          const waitMs = Math.pow(2, attempt) * 1000 // 2s, 4s, 8s
          console.log(`Rate limited. Waiting ${waitMs/1000}s before retry ${attempt}/${maxRetries}`)
          await new Promise(resolve => setTimeout(resolve, waitMs))
          continue
        }
        throw error
      }
    }
    throw new Error('Hết lượt request API. Vui lòng thử lại sau.')
  }

  private async callLLM(prompt: string): Promise<string> {
    const MODEL_FALLBACKS = [
      'gemini-2.5-flash',
    ]

    for (const model of MODEL_FALLBACKS) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ 
                role: 'user', 
                parts: [{ text: prompt }] 
              }],
              generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 2048,
                stopSequences: ['Observation:']
              }
            }),
            signal: AbortSignal.timeout(30000)
          }
        )

        if (response.status === 429) {
          console.warn(`Model ${model} rate limited, trying next fallback...`)
          continue
        }

        if (!response.ok) {
          const err = await response.json()
          throw new Error(`Gemini API error: ${JSON.stringify(err)}`)
        }

        const data = await response.json()
        return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
      } catch (error: any) {
        if (error.message?.includes('429') || error.message?.includes('rate limit')) {
          continue
        }
        throw error
      }
    }
    throw new Error('Tất cả các mô hình AI đều đang bận hoặc hết hạn mức request. (429)')
  }

  private parseAgentResponse(text: string) {
    // Extract Thought
    const thoughtMatch = text.match(/Thought:\s*([\s\S]+?)(?=\nAction:|Final Answer:|$)/)
    const thought = thoughtMatch?.[1]?.trim() || text.slice(0, 200)

    // Check for Final Answer first
    const finalMatch = text.match(/Final Answer:\s*([\s\S]+)/)
    if (finalMatch) {
      return { 
        thought, 
        action: null, 
        actionInput: null, 
        finalAnswer: finalMatch[1].trim() 
      }
    }

    // Extract Action
    const actionMatch = text.match(/Action:\s*(.+?)(?=\n|$)/)
    const action = actionMatch?.[1]?.trim() || null

    // Extract Action Input
    const inputMatch = text.match(/Action Input:\s*([\s\S]+?)(?=\nObservation:|$)/)
    const actionInput = inputMatch?.[1]?.trim() || null

    // If no structured format found, treat whole response as final answer
    if (!action) {
      return { 
        thought, 
        action: null, 
        actionInput: null, 
        finalAnswer: text.trim() 
      }
    }

    return { thought, action, actionInput, finalAnswer: null }
  }

  async *run(goal: string, maxIterations = 8): AsyncGenerator<AgentState, void, string | undefined> {
    let state: AgentState = {
      goal,
      steps: [],
      finalAnswer: null,
      status: 'thinking',
      iterations: 0,
      maxIterations
    }

    while (state.iterations < state.maxIterations && !state.finalAnswer) {
      state.iterations++
      state.status = 'thinking'
      yield { ...state }

      try {
        const prompt = this.constructPrompt(state)
        const llmResponse = await this.callLLMWithRetry(prompt)
        const parsed = this.parseAgentResponse(llmResponse)

        if (parsed.finalAnswer) {
          state.finalAnswer = parsed.finalAnswer
          state.status = 'done'
          yield { ...state }
          break
        }

        if (!parsed.action) {
          // Fallback if LLM didn't follow format
          state.finalAnswer = llmResponse
          state.status = 'done'
          yield { ...state }
          break
        }

        // Execute tool safely
        state.status = 'acting'
        const action = parsed.action
        const tool = this.tools.get(action) || 
                     this.tools.get(action.toLowerCase().replace(/\s/g, '_'))
        
        let observation: string
        if (!tool) {
          observation = `Tool "${action}" not found. Available: ${Array.from(this.tools.keys()).join(', ')}`
        } else if (tool.executeLocation === 'client') {
          // Send request for client-side execution
          const clientActionInput = parsed.actionInput || ''
          state.steps.push({
            thought: parsed.thought,
            action: action,
            actionInput: clientActionInput,
            observation: '__WAITING_FOR_CLIENT__'
          })
          
          // Yield state to API route so it can send SSE event to client
          // The API route will wait for client result and then call .next() with the REAL observation
          const externalObservation = yield { ...state }
          
          // Update the last step with the real observation received from client
          if (typeof externalObservation === 'string') {
            state.steps[state.steps.length - 1].observation = externalObservation.slice(0, 500)
          } else {
            state.steps[state.steps.length - 1].observation = 'Error: Client action result not received.'
          }
          
          yield { ...state }
          continue // Move to next iteration with the new observation
        } else {
          try {
            observation = await Promise.race([
              tool.execute(parsed.actionInput || ''),
              new Promise<string>((_, reject) => 
                setTimeout(() => reject(new Error('Tool execution timeout (15s)')), 15000)
              )
            ])
          } catch (toolError: any) {
            observation = `Tool error: ${toolError.message}`
          }
        }

        state.steps.push({
          thought: parsed.thought,
          action: action,
          actionInput: parsed.actionInput || '',
          observation: observation.slice(0, 500)
        })

        yield { ...state }

      } catch (iterError: any) {
        console.error('Agent iteration error:', iterError)
        state.status = 'error'
        state.errorMessage = iterError.message
        yield { ...state }
        return
      }
    }

    if (!state.finalAnswer && state.status !== 'error') {
      state.finalAnswer = state.steps.length > 0
        ? `Dựa trên quá trình phân tích:\n\n${state.steps.map(s => s.observation).filter(Boolean).join('\n\n')}`
        : 'Không thể hoàn thành mục tiêu. Vui lòng thử lại với mô tả cụ thể hơn.'
      state.status = 'done'
      yield { ...state }
    }
  }

  private constructPrompt(state: AgentState): string {
    const toolsList = Array.from(this.tools.values())
      .map(t => `- ${t.name}: ${t.description}`)
      .join('\n')

    // Only pass last 3 steps to LLM to save tokens
    const recentSteps = state.steps.slice(-3)
    const scratchpad = recentSteps.map(s => (
      `Thought: ${s.thought}\nAction: ${s.action}\nAction Input: ${s.actionInput}\nObservation: ${s.observation?.slice(0, 300)}`
    )).join('\n\n')

    return `
${getAgentSystemPrompt(toolsList)}

User's goal: ${state.goal}

Previous steps taken:
${scratchpad}

Begin!
`.trim()
  }
}
