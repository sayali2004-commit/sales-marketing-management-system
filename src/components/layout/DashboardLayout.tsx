import { useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Sidebar, adminNav, employeeNav } from './Sidebar'
import { Header } from './Header'
import { useApp } from '../../context/AppContext'
import type { Role } from '../../types'

const navMap: Record<string, typeof adminNav> = {
  admin: adminNav,
  employee: employeeNav,
}

const titleMap: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/employees': 'Employees',
  '/admin/leads': 'Leads',
  '/admin/visits': 'Visits',
  '/admin/location': 'Location',
  '/admin/reports': 'Reports',
  '/admin/workspace': 'Workspace',
  '/employee': 'Dashboard',
  '/employee/leads': 'My Leads',
  '/employee/visits': 'My Visits',
  '/employee/travel': 'My Travel',
  '/employee/schedule': 'Schedule',
  '/employee/workspace': 'Workspace',
}

export function DashboardLayout({ role }: { role: Role }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { currentUser } = useApp()
  const location = useLocation()

  if (!currentUser) return <Navigate to="/login" replace />

  if (role === 'manager' || currentUser.role === 'manager') {
    return <Navigate to="/admin" replace />
  }
  if (currentUser.role !== role) {
    const home = currentUser.role === 'admin' ? '/admin' : '/employee'
    return <Navigate to={home} replace />
  }

  const title = titleMap[location.pathname] || 'Dashboard'

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar navItems={navMap[role] || adminNav} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Header onMenuClick={() => setSidebarOpen(true)} title={title} />
        <main className="flex-1 p-3 sm:p-4 md:p-6 w-full max-w-[1600px] mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
