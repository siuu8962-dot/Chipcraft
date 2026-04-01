import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { lessonId, minutes } = await req.json()

    if (typeof minutes !== 'number' || minutes <= 0) {
      return NextResponse.json({ error: 'Invalid minutes' }, { status: 400 })
    }

    // Upsert today's session
    const today = new Date().toISOString().split('T')[0]
    
    // Check if a session for this user and today already exists
    const { data: existing, error: selectError } = await supabase
      .from('learning_sessions')
      .select('id, duration_minutes')
      .eq('user_id', user.id)
      .eq('session_date', today)
      .single()

    if (selectError && selectError.code !== 'PGRST116') {
      throw selectError
    }

    if (existing) {
      const { error: updateError } = await supabase
        .from('learning_sessions')
        .update({ duration_minutes: existing.duration_minutes + minutes })
        .eq('id', existing.id)
      
      if (updateError) throw updateError
    } else {
      const { error: insertError } = await supabase
        .from('learning_sessions')
        .insert({ 
          user_id: user.id, 
          session_date: today,
          duration_minutes: minutes, 
          lesson_id: lessonId 
        })
      
      if (insertError) throw insertError
    }

    // Also update profile total study time if needed
    await supabase.rpc('increment_study_time', { p_user_id: user.id, p_minutes: minutes })
    // Note: If RPC doesn't exist, we can just update the profile directly
    // But for now let's keep it simple as the user didn't request total time in profiles specifically in their SQL.

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error tracking study time:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
