import { createServerSupabaseClient } from '@/lib/supabase-server'
import { calculateLevel, xpToNextLevel } from '@/lib/achievements/AchievementService'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [profileRes, userBadgesRes, allBadgesRes, streakRes, recentXPRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('user_badges').select('*, badge:badges(*)').eq('user_id', user.id),
      supabase.from('badges').select('*').order('rarity', { ascending: true }),
      supabase.from('user_streaks').select('*').eq('user_id', user.id).single(),
      supabase.from('xp_transactions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10)
    ])

    const profile = profileRes.data
    const totalXP = profile?.xp || 0
    const level = profile?.level || calculateLevel(totalXP)
    const levelProgress = xpToNextLevel(totalXP)
    
    const userBadges = userBadgesRes.data || []
    const allBadges = allBadgesRes.data || []
    const earnedBadgeIds = new Set(userBadges.map(ub => ub.badge_id))
    
    const badgesWithStatus = allBadges.map(badge => ({
      ...badge,
      earned: earnedBadgeIds.has(badge.id),
      earned_at: userBadges.find(ub => ub.badge_id === badge.id)?.earned_at || null
    }))

    const nextGoals = badgesWithStatus
      .filter(b => !b.earned)
      .slice(0, 3)

    return NextResponse.json({
      totalXP,
      level,
      levelProgress,
      streak: streakRes.data?.current_streak || 0,
      longestStreak: streakRes.data?.longest_streak || 0,
      badges: badgesWithStatus,
      earnedCount: userBadges.length,
      totalCount: allBadges.length,
      nextGoals,
      recentXP: recentXPRes.data || []
    })
  } catch (error: any) {
    console.error('Error fetching achievements:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
