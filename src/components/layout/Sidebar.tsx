import { NavLink, useNavigate } from 'react-router-dom'
import {
  CalendarDays,
  LayoutDashboard,
  LogOut,
  MapPin,
  Navigation,
  Share2,
  Target,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useScrollLock } from '../../hooks/useScrollLock'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

export const adminNav: NavItem[] = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/employees', label: 'Employees', icon: Users },
  { to: '/admin/leads', label: 'Leads', icon: Target },
  { to: '/admin/visits', label: 'Visits', icon: CalendarDays },
  { to: '/admin/location', label: 'Location', icon: MapPin },
  { to: '/admin/reports', label: 'Reports', icon: LayoutDashboard },
  { to: '/admin/workspace', label: 'Workspace', icon: Share2 },
]

export const employeeNav: NavItem[] = [
  { to: '/employee', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/employee/leads', label: 'My Leads', icon: Target },
  { to: '/employee/visits', label: 'My Visits', icon: CalendarDays },
  { to: '/employee/travel', label: 'My Travel', icon: Navigation },
  { to: '/employee/schedule', label: 'Schedule', icon: CalendarDays },
  { to: '/employee/workspace', label: 'Workspace', icon: Share2 },
]

interface SidebarProps {
  navItems: NavItem[]
  open: boolean
  onClose: () => void
}

export function Sidebar({ navItems, open, onClose }: SidebarProps) {
  useScrollLock(open)

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-ink-deep/60 backdrop-blur-sm lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-ink-deep text-slate-200 transform transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col border-r border-white/5`}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 120% 80% at 0% 0%, rgba(99,102,241,0.18) 0%, transparent 50%), radial-gradient(ellipse 80% 60% at 100% 100%, rgba(124,58,237,0.12) 0%, transparent 50%)',
          }}
          aria-hidden
        />

        <div className="relative h-16 flex items-center gap-3 px-5 border-b border-white/5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center shadow-glow">
            <span className="text-white font-bold text-sm">SC</span>
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight tracking-tight">SalesCore</p>
            <p className="text-[11px] text-slate-400 leading-tight">Sales and Marketing</p>
          </div>
        </div>

        <nav className="relative flex-1 overflow-y-auto sidebar-scroll py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin' || item.to === '/employee'}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-600/90 to-accent-600/80 text-white shadow-glow'
                    : 'text-slate-400 hover:text-white hover:bg-surface/5'
                }`
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <SidebarFooter onClose={onClose} />
      </aside>
    </>
  )
}

function SidebarFooter({ onClose }: { onClose: () => void }) {
  const { currentUser, logout } = useApp()
  const navigate = useNavigate()

  return (
    <div className="relative p-4 border-t border-white/5 shrink-0">
      <div className="flex items-center justify-between gap-2">
        {currentUser && (
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{currentUser.name}</p>
            <p className="text-[11px] text-slate-400 truncate">{currentUser.title}</p>
          </div>
        )}
        <button
          onClick={() => {
            logout()
            onClose()
            navigate('/login')
          }}
          className="ml-auto p-2.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-surface/5 transition-colors shrink-0"
          aria-label="Logout"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
