import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      width: '100%',
      backgroundColor: 'var(--bg-primary)',
      position: 'relative'
    }}>
      {/* Sidebar - fixed width, scrollable itself if needed */}
      <Sidebar user={user} profile={profile} />

      {/* Main Area - takes remaining space and scrolls page-wide */}
      <div style={{
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)'
      }}>
        <Topbar user={user} profile={profile} />
        <main data-theme-area="main" style={{
          flex: 1,
          width: '100%',
          position: 'relative',
          backgroundColor: 'var(--bg-primary)'
        }}>
          {children}
        </main>
      </div>
    </div>
  )
}


