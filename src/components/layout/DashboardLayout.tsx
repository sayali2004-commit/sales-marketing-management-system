import { useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Sidebar, adminNav, employeeNav, managerNav } from './Sidebar'
import { Header } from './Header'
import { useApp } from '../../context/AppContext'
import type { Role } from '../../types'

const navMap: Record<Role, typeof adminNav> = {
  admin: adminNav,
  manager: managerNav,
  employee: employeeNav,
}

const titleMap: Record<string, string> = {
  '/admin': 'Company Overview',
  '/admin/employees': 'Employee Management',
  '/admin/leads': 'Lead Management',
  '/admin/visits': 'Visit Management',
  '/admin/travel': 'Travel Management',
  '/admin/location': 'Location',
  '/admin/salary': 'Salary Management',
  '/admin/advance': 'Advance Management',
  '/admin/business': 'Business Performance',
  '/admin/sales': 'Sales Performance',
  '/admin/marketing': 'Marketing Performance',
  '/admin/reports': 'Reports',
  '/admin/schedule': 'Schedule',
  '/admin/shared': 'Shared Information',
  '/admin/files': 'File Management',
  '/manager': 'Dashboard',
  '/manager/team': 'Team Performance',
  '/manager/leads': 'Lead Management',
  '/manager/visits': 'Visit Management',
  '/manager/travel': 'Travel Management',
  '/manager/business': 'Business Performance',
  '/manager/reports': 'Reports',
  '/manager/schedule': 'Schedule',
  '/manager/shared': 'Shared Information',
  '/employee': 'My Dashboard',
  '/employee/leads': 'My Leads',
  '/employee/visits': 'My Visits',
  '/employee/travel': 'My Travel',
  '/employee/location': 'My Location',
  '/employee/business': 'My Business',
  '/employee/schedule': 'My Schedule',
  '/employee/advance': 'My Advance',
  '/employee/reports': 'My Reports',
  '/employee/shared': 'Shared Information',
}

export function DashboardLayout({ role }: { role: Role }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { currentUser } = useApp()
  const location = useLocation()

  if (!currentUser) return <Navigate to="/login" replace />
  if (currentUser.role !== role) {
    const home = currentUser.role === 'admin' ? '/admin' : currentUser.role === 'manager' ? '/manager' : '/employee'
    return <Navigate to={home} replace />
  }

  const title = titleMap[location.pathname] || 'Dashboard'

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar navItems={navMap[role]} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Header onMenuClick={() => setSidebarOpen(true)} title={title} />
        <main className="flex-1 p-4 sm:p-6 max-w-[1600px] w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
