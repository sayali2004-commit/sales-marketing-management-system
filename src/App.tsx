import { Navigate, Route, Routes } from 'react-router-dom'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { LoginPage } from './pages/Login'

import { CompanyOverview } from './pages/admin/CompanyOverview'
import { EmployeeManagement } from './pages/admin/EmployeeManagement'
import { LeadManagement as AdminLeads } from './pages/admin/LeadManagement'
import { VisitManagement as AdminVisits } from './pages/admin/VisitManagement'
import { LocationTrackingPage as AdminLocation } from './pages/admin/LocationTrackingPage'
import { ReportsSection as AdminReports } from './pages/admin/ReportsSection'
import { WorkspacePage as AdminWorkspace } from './pages/admin/WorkspacePage'

import { EmployeeDashboard } from './pages/employee/EmployeeDashboard'
import { MyLeads } from './pages/employee/MyLeads'
import { MyVisits } from './pages/employee/MyVisits'
import { MyTravelPage as MyTravel } from './pages/employee/MyTravelPage'
import { MySchedule } from './pages/employee/MySchedule'
import { WorkspacePage as MyWorkspace } from './pages/employee/WorkspacePage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />

      <Route path="/admin" element={<DashboardLayout role="admin" />}>
        <Route index element={<CompanyOverview />} />
        <Route path="employees" element={<EmployeeManagement />} />
        <Route path="leads" element={<AdminLeads />} />
        <Route path="visits" element={<AdminVisits />} />
        <Route path="location" element={<AdminLocation />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="workspace" element={<AdminWorkspace />} />
      </Route>

      <Route path="/employee" element={<DashboardLayout role="employee" />}>
        <Route index element={<EmployeeDashboard />} />
        <Route path="leads" element={<MyLeads />} />
        <Route path="visits" element={<MyVisits />} />
        <Route path="travel" element={<MyTravel />} />
        <Route path="schedule" element={<MySchedule />} />
        <Route path="workspace" element={<MyWorkspace />} />
      </Route>

      <Route path="/manager" element={<Navigate to="/admin" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
