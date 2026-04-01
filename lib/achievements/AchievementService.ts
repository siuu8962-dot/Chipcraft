import { createServerSupabaseClient } from '@/lib/supabase-server'

// XP per action
export const XP_REWARDS = {
  lesson_complete:  100,
  quiz_pass:         50,
  quiz_perfect:     100,
  first_login:       20,
  daily_login:       10,
  streak_bonus:      25,
  lab_complete:     150,
  badge_earned:      0, // Dynamic per badge
}

// Level thresholds
const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 1000, 1750, 2750, 4000, 5500, 7500, 10000
]

export function calculateLevel(totalXP: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVEL_THRESHOLDS[i]) return i + 1
  }
  return 1
}

export function xpToNextLevel(totalXP: number) {
  const level = calculateLevel(totalXP)
  const currentLevelXP = LEVEL_THRESHOLDS[level - 1] || 0
  const nextLevelXP = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]
  const required = nextLevelXP - currentLevelXP
  const current = totalXP - currentLevelXP
  const percentage = Math.min(Math.round((current / required) * 100), 100)
  
  return { current, required, percentage, nextLevelXP }
}

export async function awardXP(
  userId: string,
  action: keyof typeof XP_REWARDS,
  referenceId?: string
) {
  const supabase = await createServerSupabaseClient()
  const xpAmount = XP_REWARDS[action]

  // 1. Record XP transaction
  await supabase.from('xp_transactions').insert({
    user_id: userId,
    amount: xpAmount,
    reason: action,
    reference_id: referenceId
  })

  // 2. Update profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('xp, level')
    .eq('id', userId)
    .single()

  if (!profile) return { error: 'Profile not found' }

  const newTotalXP = (profile.xp || 0) + xpAmount
  const newLevel = calculateLevel(newTotalXP)
  const leveledUp = newLevel > (profile.level || 1)

  await supabase
    .from('profiles')
    .update({ 
      xp: newTotalXP, 
      level: newLevel,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)

  // 3. Check and unlock new badges
  const newBadges = await checkAndUnlockBadges(userId, newTotalXP, newLevel)

  return {
    xpGained: xpAmount,
    totalXP: newTotalXP,
    newLevel: leveledUp ? newLevel : null,
    newBadges
  }
}

async function checkAndUnlockBadges(
  userId: string,
  totalXP: number,
  level: number
) {
  const supabase = await createServerSupabaseClient()

  // Get earned badge IDs
  const { data: earnedBadges } = await supabase
    .from('user_badges')
    .select('badge_id')
    .eq('user_id', userId)

  const earnedBadgeIds = earnedBadges?.map(b => b.badge_id) || []

  // Get unearned badges
  let query = supabase.from('badges').select('*')
  if (earnedBadgeIds.length > 0) {
    query = query.not('id', 'in', `(${earnedBadgeIds.join(',')})`)
  }
  const { data: allBadges } = await query

  if (!allBadges) return []

  const newlyUnlocked = []

  for (const badge of allBadges) {
    let condition = {}
    try {
      condition = typeof badge.condition_json === 'string' 
        ? JSON.parse(badge.condition_json) 
        : badge.condition_json || {}
    } catch (e) {}

    let unlocked = false
    const condType = (condition as any).type || badge.condition_type
    const condValue = (condition as any).value || badge.condition_value

    switch (condType) {
      case 'total_xp':
        unlocked = totalXP >= condValue
        break
      case 'level':
        unlocked = level >= condValue
        break
      case 'lesson_count': {
        const { count } = await supabase
          .from('lesson_progress')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('completed', true)
        unlocked = (count || 0) >= condValue
        break
      }
      case 'streak': {
        const { data: streak } = await supabase
          .from('user_streaks')
          .select('longest_streak')
          .eq('user_id', userId)
          .single()
        unlocked = (streak?.longest_streak || 0) >= condValue
        break
      }
    }

    if (unlocked) {
      await supabase.from('user_badges').insert({
        user_id: userId,
        badge_id: badge.id
      })
      
      if (badge.xp_reward > 0) {
        await awardXP(userId, 'badge_earned', badge.id)
      }
      newlyUnlocked.push(badge)
    }
  }

  return newlyUnlocked
}
