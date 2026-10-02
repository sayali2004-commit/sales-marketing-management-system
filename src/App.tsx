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

import { ManagerDashboard } from './pages/manager/ManagerDashboard'
import { TeamPerformance } from './pages/manager/TeamPerformance'
import { LeadManagement as ManagerLeads } from './pages/manager/LeadManagement'
import { VisitManagement as ManagerVisits } from './pages/manager/VisitManagement'
import { LocationTrackingManagerPage as ManagerLocation } from './pages/manager/LocationTrackingPage'
import { ReportsSection as ManagerReports } from './pages/manager/ReportsSection'
import { WorkspacePage as ManagerWorkspace } from './pages/manager/WorkspacePage'

import { EmployeeDashboard } from './pages/employee/EmployeeDashboard'
import { MyLeads } from './pages/employee/MyLeads'
import { MyVisits } from './pages/employee/MyVisits'
import { MyTravelPage as MyTravel } from './pages/employee/MyTravelPage'
import { PerformancePage as MyPerformance } from './pages/employee/PerformancePage'
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

      <Route path="/manager" element={<DashboardLayout role="manager" />}>
        <Route index element={<ManagerDashboard />} />
        <Route path="team" element={<TeamPerformance />} />
        <Route path="leads" element={<ManagerLeads />} />
        <Route path="visits" element={<ManagerVisits />} />
        <Route path="location" element={<ManagerLocation />} />
        <Route path="reports" element={<ManagerReports />} />
        <Route path="workspace" element={<ManagerWorkspace />} />
      </Route>

      <Route path="/employee" element={<DashboardLayout role="employee" />}>
        <Route index element={<EmployeeDashboard />} />
        <Route path="leads" element={<MyLeads />} />
        <Route path="visits" element={<MyVisits />} />
        <Route path="travel" element={<MyTravel />} />
        <Route path="performance" element={<MyPerformance />} />
        <Route path="schedule" element={<MySchedule />} />
        <Route path="workspace" element={<MyWorkspace />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
