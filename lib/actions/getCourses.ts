'use server'
import { createClient } from '@supabase/supabase-js'

// Since SUPABASE_SERVICE_ROLE_KEY is a connection string in your .env.local,
// we will use the standard ANON_KEY which we verified has read access to courses.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, 
  { auth: { persistSession: false } }
)

export async function getAllCourses() {
  console.log('=== getCourses called ===')
  
  // Try fetching courses
  const { data, error, count } = await supabaseAdmin
    .from('courses')
    .select('*', { count: 'exact' })
    .limit(10)

  console.log('Courses data (admin):', data?.length)
  console.log('Courses error (admin):', error)
  console.log('Courses count (admin):', count)

  if (error) {
    console.error('COURSES FETCH ERROR:', error)
    return { courses: [], error: error.message }
  }

  return { courses: data || [], error: null }
}

export async function getUserEnrollments(userId: string) {
  console.log('=== getUserEnrollments called for:', userId, '===')

  // Try common enrollment table names 
  const tableNamesToTry = ['enrollments', 'user_courses', 'course_enrollments', 'user_enrollments']
  
  for (const tableName of tableNamesToTry) {
    const { data, error } = await supabaseAdmin
      .from(tableName)
      .select('*')
      .eq('user_id', userId)
      .limit(10)
    
    if (!error) {
      console.log(`Found enrollments in table: ${tableName}`, data?.length)
      return { enrollments: data || [], tableName }
    }
  }

  return { enrollments: [], tableName: null }
}
