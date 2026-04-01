import { createServerSupabaseClient } from '@/lib/supabase-server'
import { awardXP } from './AchievementService'

export async function updateStreak(userId: string) {
  const supabase = await createServerSupabaseClient()
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  const { data: streak } = await supabase
    .from('user_streaks')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (!streak) {
    await supabase.from('user_streaks').insert({
      user_id: userId,
      current_streak: 1,
      longest_streak: 1,
      last_activity_at: now.toISOString()
    })
    return
  }

  const lastActivity = streak.last_activity_at ? new Date(streak.last_activity_at) : null
  if (!lastActivity) {
    await supabase.from('user_streaks').update({
      current_streak: 1,
      longest_streak: 1,
      last_activity_at: now.toISOString()
    }).eq('user_id', userId)
    return
  }

  const lastDay = new Date(
    lastActivity.getFullYear(), 
    lastActivity.getMonth(), 
    lastActivity.getDate()
  )
  const diffDays = Math.round(
    (today.getTime() - lastDay.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (diffDays === 0) return  // Already logged today

  if (diffDays === 1) {
    // Consecutive day — extend streak
    const newStreak = streak.current_streak + 1
    const newLongest = Math.max(newStreak, streak.longest_streak)
    await supabase.from('user_streaks').update({ 
      current_streak: newStreak, 
      longest_streak: newLongest,
      last_activity_at: now.toISOString()
    }).eq('user_id', userId)
    
    // Award streak bonus XP
    await awardXP(userId, 'streak_bonus')
  } else {
    // Streak broken
    await supabase.from('user_streaks').update({
      current_streak: 1,
      last_activity_at: now.toISOString()
    }).eq('user_id', userId)
  }
}
