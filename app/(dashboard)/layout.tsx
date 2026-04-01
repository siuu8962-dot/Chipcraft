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
      {/* Sidebar - Shared Client Drawer */}
      <Sidebar user={user} profile={profile} />

      {/* Main Area */}
      <div 
        className="flex-1 min-w-0 flex flex-col min-h-screen bg-[var(--bg-primary)] transition-all duration-300"
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          width: '100%',
        }} className="md:pl-[210px]">
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
    </div>
  )
}


