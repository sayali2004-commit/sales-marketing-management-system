import { NavLink } from 'react-router-dom'
import {
  Building2,
  CalendarDays,
  LayoutDashboard,
  MapPin,
  Navigation,
  Share2,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useApp } from '../../context/AppContext'

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
  { to: '/admin/performance', label: 'Performance', icon: TrendingUp },
  { to: '/admin/reports', label: 'Reports', icon: LayoutDashboard },
  { to: '/admin/workspace', label: 'Workspace', icon: Share2 },
]

export const managerNav: NavItem[] = [
  { to: '/manager', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/manager/team', label: 'Team', icon: Users },
  { to: '/manager/leads', label: 'Leads', icon: Target },
  { to: '/manager/visits', label: 'Visits', icon: CalendarDays },
  { to: '/manager/location', label: 'Location', icon: MapPin },
  { to: '/manager/reports', label: 'Reports', icon: LayoutDashboard },
  { to: '/manager/workspace', label: 'Workspace', icon: Share2 },
]

export const employeeNav: NavItem[] = [
  { to: '/employee', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/employee/leads', label: 'My Leads', icon: Target },
  { to: '/employee/visits', label: 'My Visits', icon: CalendarDays },
  { to: '/employee/travel', label: 'My Travel', icon: Navigation },
  { to: '/employee/performance', label: 'Performance', icon: TrendingUp },
  { to: '/employee/schedule', label: 'Schedule', icon: CalendarDays },
  { to: '/employee/workspace', label: 'Workspace', icon: Share2 },
]

interface SidebarProps {
  navItems: NavItem[]
  open: boolean
  onClose: () => void
}

export function Sidebar({ navItems, open, onClose }: SidebarProps) {
  const { currentUser } = useApp()

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-slate-900/50 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-200 transform transition-transform duration-200 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
      >
        <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-800 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">SC</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-tight">SalesCore</p>
            <p className="text-[11px] text-slate-400 leading-tight">Sales and Marketing</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto sidebar-scroll py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin' || item.to === '/manager' || item.to === '/employee'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-brand-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {currentUser && (
          <div className="p-4 border-t border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand-700 flex items-center justify-center text-white text-xs font-semibold">
                {currentUser.photo}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{currentUser.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{currentUser.title}</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
