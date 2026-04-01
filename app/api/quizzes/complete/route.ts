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

    const { courseId, quizId, score, totalQuestions } = await req.json()

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 })
    }

    const isPerfect = score === totalQuestions
    const action = isPerfect ? 'quiz_perfect' : 'quiz_pass'

    // 1. Record quiz completion in database (if table exists)
    // For now, we'll just award XP as per user request for "real" feedback
    
    // 2. Award XP
    const xpResult = await awardXP(user.id, action, quizId || courseId)
    
    // 3. Update streak
    await updateStreak(user.id)

    return NextResponse.json({
      success: true,
      ...xpResult
    })
  } catch (error: any) {
    console.error('Error completing quiz:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
