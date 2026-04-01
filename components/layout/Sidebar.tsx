'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  BookOpen, 
  Sparkles, 
  Trophy, 
  UserCircle,
  Star as StarIcon,
  ChevronRight,
  Zap,
  Bell,
  LogOut,
  Cpu
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase'
import { useNavigation } from '@/lib/contexts'
import { X } from 'lucide-react'

const supabase = createClient()

const NAV = [
  { href: '/dashboard',    icon: LayoutDashboard, label: 'Bảng điều khiển' },
  { href: '/courses',      icon: BookOpen,        label: 'Khóa học' },
  { href: '/ai-tutor',     icon: Sparkles,        label: 'AI Tutor', special: true },
  { href: '/achievements', icon: Trophy,          label: 'Thành tích' },
]

export function Sidebar({ user, profile }: { user: any, profile: any }) {
  const pathname = usePathname()
  const { isSidebarOpen, setSidebarOpen } = useNavigation()

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="mobile-only"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            transition: 'opacity 0.3s'
          }}
        />
      )}

      <aside 
        data-sidebar
        className={cn(
          "transition-transform duration-300 ease-in-out",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
        style={{
          width: 'var(--sidebar-width)',
          minWidth: 'var(--sidebar-width)',
          height: '100vh',
          backgroundColor: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: 110,
        }}
      >
        {/* Brand Logo area */}
        <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '8px', 
              background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)'
            }}>
              <Cpu color="white" size={18} strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>ChipCraft</span>
          </div>

          {/* Close button for mobile */}
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="mobile-only"
            style={{ 
              background: 'transparent', border: 'none', color: 'var(--text-secondary)',
              padding: '4px', cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {NAV.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '13.5px',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'rgba(124, 58, 237, 0.12)' : 'transparent',
                  borderLeft: isActive ? '3px solid #7C3AED' : '3px solid transparent',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon 
                  size={18} 
                  strokeWidth={isActive ? 2.5 : 2} 
                  style={{ 
                    color: isActive ? '#7C3AED' : 'inherit',
                    transition: 'color 0.2s'
                  }} 
                />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User area */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--border)' }}>
          <button 
            onClick={async () => {
              await supabase.auth.signOut()
              window.location.href = '/'
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <LogOut size={16} />
            Đăng xuất
          </button>
        </div>
      </aside>
    </>
  )
}
