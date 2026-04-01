import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export const geminiModel = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash', // Upgraded to 2.5-flash as per user request
  generationConfig: {
    temperature: 0.7,
    topP: 0.95,
    maxOutputTokens: 2048,
  },
})

export const SYSTEM_PROMPT = `You are ChipCraft AI Tutor — an expert semiconductor and chip design educator.
You specialize in: Verilog, VHDL, SystemVerilog, RTL design, ASIC design flow, FPGA, digital logic, timing analysis, and chip architecture.
You respond in the same language the user writes in (Vietnamese or English).
For Vietnamese questions, respond in Vietnamese. For English questions, respond in English.
When showing code, always use Verilog unless asked otherwise.
Be encouraging, precise, and practical. Reference industry tools (Synopsys, Cadence, OpenROAD) where relevant.
Keep responses concise but complete. Use code examples whenever helpful.`

export async function chatWithGemini(
  messages: { role: 'user' | 'model'; parts: { text: string }[] }[],
  userMessage: string
) {
  const chat = geminiModel.startChat({
    history: [
      { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
      { role: 'model', parts: [{ text: 'Understood. I am ChipCraft AI Tutor, ready to help with chip design questions.' }] },
      ...messages,
    ],
  })
  const result = await chat.sendMessage(userMessage)
  return result.response.text()
}
