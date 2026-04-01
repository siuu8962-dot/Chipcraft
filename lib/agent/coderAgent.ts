// ─────────────────────────────────────────────────────────
// lib/agent/coderAgent.ts
// Generates and validates code (Verilog, TypeScript, etc.)
// ─────────────────────────────────────────────────────────

import { callGemini } from '@/lib/ai/model'
import type { AgentResult, AgentTask } from '@/types/agent'
import { runVerilogSimulationTool } from './tools/index'

const CODER_SYSTEM_PROMPT = `
You are a specialized Code Generation Agent for ChipCraft — a chip design education platform.

Expertise:
- Verilog / SystemVerilog / VHDL
- Digital logic design (gates, flip-flops, FSMs, pipelines)
- TypeScript / JavaScript
- Hardware description and simulation

Rules:
1. Always produce complete, runnable code — never partial snippets.
2. Include comments explaining key logic.
3. For Verilog: always include a testbench module.
4. Wrap code in proper \`\`\`language blocks.
5. After the code, add a "## Explanation" section.
6. If a simulation result is provided, include it in the output.

Format:
\`\`\`verilog
// your code
\`\`\`

## Explanation
[explains the design choices]

## Testbench
\`\`\`verilog
// testbench code
\`\`\`
`.trim()

/**
 * coderAgent — generates code artifacts based on task + context.
 * For Verilog tasks, it also runs a simulation tool automatically.
 */
export async function coderAgent(
  task: AgentTask,
  context: string = ''
): Promise<AgentResult> {
  const start = Date.now()
  const thoughts: string[] = []

  console.log(`[coderAgent] Executing task: ${task.task.slice(0, 80)}`)
  thoughts.push(`Generating code for: "${task.task}"`)

  try {
    const prompt = `
${CODER_SYSTEM_PROMPT}

Task: ${task.task}

Context from prior agents:
${context || 'No prior context — generate from task description only.'}

Generate the complete implementation now.
`.trim()

    const codeOutput = await callGemini(prompt, {
      temperature: 0.2,
      maxOutputTokens: 4096,
    })

    thoughts.push(`Initial code generated (${codeOutput.length} chars).`)

    // Auto-detect Verilog code blocks and run simulation
    const verilogMatch = codeOutput.match(/```(?:verilog|systemverilog)([\s\S]+?)```/)
    let simulationResult = ''

    if (verilogMatch) {
      thoughts.push('Detected Verilog code — running simulation tool.')
      try {
        simulationResult = await Promise.race([
          runVerilogSimulationTool.execute(verilogMatch[1].trim()),
          new Promise<string>((_, reject) =>
            setTimeout(() => reject(new Error('Simulation timeout')), 10_000)
          ),
        ])
        thoughts.push(`Simulation result: ${simulationResult.slice(0, 100)}`)
      } catch (simErr: any) {
        thoughts.push(`Simulation skipped: ${simErr.message}`)
      }
    }

    const finalOutput = simulationResult
      ? `${codeOutput}\n\n## Simulation Output\n\`\`\`\n${simulationResult}\n\`\`\``
      : codeOutput

    return {
      taskId: task.id,
      agent: 'coderAgent',
      output: finalOutput,
      thoughts,
      success: true,
      durationMs: Date.now() - start,
    }
  } catch (error: any) {
    console.error('[coderAgent] Error:', error.message)
    return {
      taskId: task.id,
      agent: 'coderAgent',
      output: `Code generation failed: ${error.message}`,
      thoughts: [...thoughts, `Error: ${error.message}`],
      success: false,
      error: error.message,
      durationMs: Date.now() - start,
    }
  }
}
