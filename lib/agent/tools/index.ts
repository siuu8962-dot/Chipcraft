import { createServerSupabaseClient } from '@/lib/supabase-server'
import { GoogleGenerativeAI } from "@google/generative-ai"

export interface AgentTool {
  name: string
  description: string
  parameters: any
  execute: (input: string) => Promise<string>
  executeLocation?: 'server' | 'client'
}

// ── TOOL 1: WEB SEARCH (Tavily) ──
export const webSearchTool: AgentTool = {
  name: "web_search",
  description: "Search the web for latest info about chip design, Verilog, FPGA, semiconductor news. Input: search query string",
  parameters: { type: "string" },
  execute: async (query: string) => {
    const apiKey = process.env.TAVILY_API_KEY
    if (!apiKey) return "Error: TAVILY_API_KEY not set."
    
    try {
      const response = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: apiKey,
          query,
          search_depth: "basic",
          max_results: 3
        })
      })
      const data = await response.json()
      return data.results.map((r: any) => `${r.title}: ${r.content}\nURL: ${r.url}`).join("\n\n")
    } catch (err: any) {
      return `Error: ${err.message}`
    }
  }
}

// ── TOOL 7: CALCULATOR ──
export const calculatorTool: AgentTool = {
  name: "calculator",
  description: "Calculate timing constraints, clock frequencies, setup/hold times. Input: math expression string",
  parameters: { type: "string" },
  execute: async (expression: string) => {
    try {
      // Basic safety: replace all but math chars
      const safeExpr = expression.replace(/[^0-9+\-*/(). ]/g, '')
      return eval(safeExpr).toString()
    } catch (err: any) {
      return `Error: Invalid expression.`
    }
  }
}

// ── TOOL 2: SEARCH COURSE CONTENT ──
export const searchCourseContentTool: AgentTool = {
  name: "search_course_content",
  description: "Search ChipCraft course lessons and documentation. Input: search term",
  parameters: { type: "string" },
  execute: async (term: string) => {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('lessons')
      .select('title, content_en, courses(title)')
      .ilike('title', `%${term}%`)
      .limit(3)
    
    if (error) return `Error: ${error.message}`
    if (!data || data.length === 0) return "No matching course content found."
    
    return data.map((l: any) => `Lesson: ${l.title} (Course: ${l.courses?.title})\nContent Snippet: ${l.content_en?.slice(0, 150)}...`).join("\n\n")
  }
}

// ── TOOL 3: RUN VERILOG SIMULATION ──
export const runVerilogSimulationTool: AgentTool = {
  name: "run_verilog_simulation",
  description: "Compile and simulate Verilog code. Input: Verilog code string",
  parameters: { type: "string" },
  execute: async (code: string) => {
    // Mocked for now - in production this would call EDA Playground or an internal Docker runner
    return "Simulation successful. Output: [TIME 0] reset=1, out=0; [TIME 10] reset=0, out=1; [TIME 20] out=X... (Mocked Result)"
  }
}

// ── TOOL 4: CHECK USER PROGRESS ──
export const checkUserProgressTool: AgentTool = {
  name: "check_user_progress",
  description: "Look up user progress, completed lessons and weak areas. Input: userId (optional)",
  parameters: { type: "string" },
  execute: async (userId?: string) => {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    const targetId = userId || user?.id
    if (!targetId) return "Error: User not authenticated."

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', targetId).single()
    const { data: activity } = await supabase.from('activity_log').select('*').eq('user_id', targetId).order('created_at', { ascending: false }).limit(5)

    return `User Profil: ${profile?.full_name || 'Student'}\nXP: ${profile?.xp || 0}\nStreak: ${profile?.streak || 0}\nRecent Activity: ${activity?.map((a: any) => a.action).join(", ") || 'No recent activity'}`
  }
}

// ── TOOL 5 & 6: LLM-BASED TOOLS ──
export const createLLMTool = (name: string, description: string, systemPrompt: string, apiKey: string): AgentTool => {
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

  return {
    name,
    description,
    parameters: { type: "string" },
    execute: async (input: string) => {
      try {
        const result = await model.generateContent(`${systemPrompt}\n\nInput: ${input}`)
        return result.response.text()
      } catch (err: any) {
        return `Error: ${err.message}`
      }
    }
  }
}

import { browserController } from '../browser/BrowserService'

export const browserTool: AgentTool = {
  name: 'browser_control',
  description: `Lightweight web browser to:
    - navigate(url): Load any website and read text content
    - search(query): Search DuckDuckGo/Google for info
    - extract(instruction): Pull data from current page
    - get_links(): List all visible links on page
    - read_section(heading): Read a specific section by heading
    
    Input format: { "action": "navigate", "url": "..." }
    Input format: { "action": "search", "query": "..." }
    Input format: { "action": "extract", "instruction": "..." }
    Input format: { "action": "get_links" }
    Input format: { "action": "read_section", "heading": "..." }`,
  parameters: {
    type: 'object',
    properties: {
      action: { type: 'string' },
      url: { type: 'string' },
      query: { type: 'string' },
      instruction: { type: 'string' },
      heading: { type: 'string' }
    }
  },
  execute: async (input: string) => {
    try {
      const params = JSON.parse(input)
      switch (params.action) {
        case 'navigate': return await browserController.navigate(params.url)
        case 'search': return await browserController.searchGoogle(params.query)
        case 'extract': return await browserController.extract(params.instruction)
        case 'get_links': return await browserController.getLinks()
        case 'read_section': return await browserController.readSection(params.heading)
        default: return `Unknown action: ${params.action}`
      }
    } catch (e) {
      return `Browser tool error: ${e}`
    }
  }
}

export const appControlTool: AgentTool = {
  name: 'app_control',
  description: `Control the ChipCraft web application directly.
    Can navigate pages, click buttons, read content, fill forms.
    
    Input format (JSON):
    Navigate:    {"type":"navigate","path":"/courses"}
    Click:       {"type":"click","selector":"button","description":"Bắt đầu bài học"}
    Read page:   {"type":"get_page_content"}
    Fill input:  {"type":"fill_input","selector":"input[name='answer']","value":"always @(posedge clk)"}
    Find elem:   {"type":"find_element","description":"nút nộp bài"}
    
    Available routes: /dashboard, /courses, /courses/[id], /ai-tutor, /achievements, /account`,
  parameters: {
    type: 'object',
    properties: {
      type: { type: 'string' },
      path: { type: 'string' },
      selector: { type: 'string' },
      description: { type: 'string' },
      value: { type: 'string' }
    }
  },
  executeLocation: 'client',
  execute: async (input: string) => {
    return JSON.stringify({ __clientAction: true, input })
  }
}

export const getAllTools = (apiKey: string): AgentTool[] => {
  return [
    appControlTool,
    browserTool,
    webSearchTool,
    calculatorTool,
    searchCourseContentTool,
    runVerilogSimulationTool,
    checkUserProgressTool,
    createLLMTool(
      "generate_practice_exercise",
      "Generate a custom Verilog/HDL exercise. Input: topic and difficulty",
      "You are a Verilog expert. Generate a structured practice exercise including Goal, Constraints, and a Hint/Solution snippet.",
      apiKey
    ),
    createLLMTool(
      "explain_code",
      "Deep analyze and explain Verilog/VHDL code and detect bugs. Input: code block",
      "Analyze the following HDL code for logic errors, race conditions, and optimization opportunities. Provide a clear, technical explanation.",
      apiKey
    )
  ]
}
