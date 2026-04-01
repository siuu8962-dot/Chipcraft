import { createServerSupabaseClient } from '@/lib/supabase-server'
import { awardXP } from '@/lib/achievements/AchievementService'
import { updateStreak } from '@/lib/achievements/StreakService'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { lessonId, courseId } = await req.json()

    if (!lessonId) {
      return NextResponse.json({ error: 'Lesson ID is required' }, { status: 400 })
    }

    // 1. Mark lesson as complete
    const { error: progressError } = await supabase
      .from('lesson_progress')
      .upsert({
        user_id: user.id,
        lesson_id: lessonId,
        is_completed: true,
        last_viewed_at: new Date().toISOString()
      }, { onConflict: 'user_id,lesson_id' })

    if (progressError) throw progressError

    // 2. Award XP
    const xpResult = await awardXP(user.id, 'lesson_complete', lessonId)
    
    // 3. Update streak
    await updateStreak(user.id)

    return NextResponse.json({
      success: true,
      ...xpResult
    })
  } catch (error: any) {
    console.error('Error completing lesson:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
