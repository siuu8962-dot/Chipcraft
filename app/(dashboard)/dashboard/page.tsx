import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import DashboardClient from '@/components/dashboard/DashboardClient'
import { getAllCourses, getUserEnrollments } from '@/lib/actions/getCourses'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch user profile/stats
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch courses using admin client (bypasses RLS)
  const { courses, error: coursesError } = await getAllCourses()
  console.log('Dashboard - courses received:', courses?.length, coursesError)

  // Fetch user enrollments
  const { enrollments, tableName } = user 
    ? await getUserEnrollments(user.id)
    : { enrollments: [], tableName: null }
  console.log('Dashboard - enrollments received:', enrollments?.length)

  // Fetch learning sessions for today's study time
  const today = new Date().toISOString().split('T')[0]
  const { data: todaySessions } = await supabase
    .from('learning_sessions')
    .select('duration_minutes')
    .eq('user_id', user.id)
    .eq('session_date', today)

  const todayMinutes = todaySessions?.reduce(
    (sum, s) => sum + (s.duration_minutes || 0), 0
  ) || 0

  const totalXP = profile?.xp || 0
  const streak = profile?.streak_days || 0
  const level = profile?.level || 1
  const nextLevelXP = level * 500
  const levelXP = totalXP % 500

  const { count: rank } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .gt('xp', totalXP)
  
  const userRank = (rank || 0) + 1
  
  // Calculate completed courses
  const completedCourses = enrollments?.filter(
    (e: any) => e.progress_percentage >= 100 || e.progress >= 100
  ).length || 0

  return (
    <DashboardClient
      user={user}
      profile={profile}
      courses={courses || []}
      enrollments={enrollments || []}
      stats={{
        totalXP,
        streak,
        completedCourses,
        rank: userRank,
        todayMinutes,
        levelXP,
        nextLevelXP,
        level
      }}
    />
  )
}
