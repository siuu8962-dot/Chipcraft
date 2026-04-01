import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createServerSupabaseClient } from '@/lib/supabase-server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' }) // Upgraded to 2.5-flash

const SYSTEM_PROMPT = `
Bạn là ChipCraft AI Tutor, một chuyên gia hàng đầu về thiết kế vi mạch, bán dẫn và lập trình phần cứng (Verilog/VHDL).
Nhiệm vụ của bạn là hỗ trợ học viên trên nền tảng ChipCraft học tập hiệu quả.

QUY TẮC PHẢN HỒI:
1. LUÔN trả lời bằng tiếng Việt thân thiện, chuyên nghiệp.
2. Nếu học viên hỏi về code Verilog, hãy giải thích từng dòng và chỉ ra các lỗi tiềm ẩn (như race conditions).
3. Luôn khuyến khích tư duy phần cứng (hardware mindset) thay vì tư duy phần mềm (sequential loops).
4. Sử dụng Markdown để định dạng mã nguồn và các thuật ngữ quan trọng.
5. Nếu câu hỏi không liên quan đến kỹ thuật chip hoặc bài học, hãy khéo léo từ chối và hướng học viên quay lại chủ đề chính.
6. Giữ câu trả lời ngắn gọn, súc tích nhưng đầy đủ thông tin.

BỐI CẢNH:
- Bạn đang hỗ trợ một học viên trong bài học: {lesson_title}
- Nội dung bài học: {context}
`

export async function POST(req: Request) {
  try {
    const { message, history, lessonId, context, conversationId } = await req.json()
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 0. Check usage limits from ai_usage table
    const now = new Date()
    const monthYear = `${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`
    
    const { data: usage } = await supabase
      .from('ai_usage')
      .select('messages_used')
      .eq('user_id', user.id)
      .eq('month_year', monthYear)
      .single()

    const used = usage?.messages_used || 0
    if (used >= 20) {
      return NextResponse.json({ error: 'Bạn đã hết lượt sử dụng AI tháng này.' }, { status: 403 })
    }

    let activeConversationId = conversationId

    // 1. If no conversationId, create one
    if (!activeConversationId) {
      const { data: newConv, error: convErr } = await supabase
        .from('ai_conversations')
        .insert({
          user_id: user.id,
          title: message.slice(0, 50),
          lesson_id: lessonId || null
        })
        .select()
        .single()
      
      if (convErr) throw convErr
      activeConversationId = newConv.id
    }

    // 2. Save user message
    await supabase.from('ai_messages').insert({
      conversation_id: activeConversationId,
      role: 'user',
      content: message
    })

    const chat = model.startChat({
      history: history || [],
      systemInstruction: {
        role: "system",
        parts: [{ text: SYSTEM_PROMPT.replace('{lesson_title}', lessonId || 'General').replace('{context}', context || 'Học tập vi mạch') }]
      },
    })

    const result = await chat.sendMessage(message)
    const reply = result.response.text()

    // 3. Save assistant message
    await supabase.from('ai_messages').insert({
      conversation_id: activeConversationId,
      role: 'assistant',
      content: reply
    })

    // Update usage count
    const { error: upsertErr } = await supabase
      .from('ai_usage')
      .upsert({
        user_id: user.id,
        month_year: monthYear,
        messages_used: used + 1,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,month_year' })

    if (upsertErr) console.error('Usage update failed:', upsertErr)

    await supabase.from('activity_log').insert({
        user_id: user.id,
        type: 'ai_chat',
        description_vi: `Đã hỏi AI Tutor về bài học`,
        xp_earned: 2
    })

    return NextResponse.json({ reply, conversationId: activeConversationId })
  } catch (error: any) {
    console.error('AI API Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
