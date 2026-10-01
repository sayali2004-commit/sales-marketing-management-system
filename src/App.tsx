import { Navigate, Route, Routes } from 'react-router-dom'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { LoginPage } from './pages/Login'

import { CompanyOverview } from './pages/admin/CompanyOverview'
import { EmployeeManagement } from './pages/admin/EmployeeManagement'
import { LeadManagement as AdminLeads } from './pages/admin/LeadManagement'
import { VisitManagement as AdminVisits } from './pages/admin/VisitManagement'
import { TravelManagement as AdminTravel } from './pages/admin/TravelManagement'
import { LocationSection as AdminLocation } from './pages/admin/LocationSection'
import { SalaryManagement } from './pages/admin/SalaryManagement'
import { AdvanceManagement as AdminAdvance } from './pages/admin/AdvanceManagement'
import { BusinessPerformance as AdminBusiness } from './pages/admin/BusinessPerformance'
import { SalesPerformance } from './pages/admin/SalesPerformance'
import { MarketingPerformance } from './pages/admin/MarketingPerformance'
import { ReportsSection as AdminReports } from './pages/admin/ReportsSection'
import { ScheduleSection as AdminSchedule } from './pages/admin/ScheduleSection'
import { SharedInformation as AdminShared } from './pages/admin/SharedInformation'
import { FileManagement } from './pages/admin/FileManagement'

import { ManagerDashboard } from './pages/manager/ManagerDashboard'
import { TeamPerformance } from './pages/manager/TeamPerformance'
import { LeadManagement as ManagerLeads } from './pages/manager/LeadManagement'
import { VisitManagement as ManagerVisits } from './pages/manager/VisitManagement'
import { TravelManagement as ManagerTravel } from './pages/manager/TravelManagement'
import { BusinessPerformance as ManagerBusiness } from './pages/manager/BusinessPerformance'
import { ReportsSection as ManagerReports } from './pages/manager/ReportsSection'
import { ScheduleSection as ManagerSchedule } from './pages/manager/ScheduleSection'
import { SharedInformation as ManagerShared } from './pages/manager/SharedInformation'

import { EmployeeDashboard } from './pages/employee/EmployeeDashboard'
import { MyLeads } from './pages/employee/MyLeads'
import { MyVisits } from './pages/employee/MyVisits'
import { MyTravel } from './pages/employee/MyTravel'
import { MyLocation } from './pages/employee/MyLocation'
import { MyBusiness } from './pages/employee/MyBusiness'
import { MySchedule } from './pages/employee/MySchedule'
import { MyAdvance } from './pages/employee/MyAdvance'
import { ReportsSection as MyReports } from './pages/employee/ReportsSection'
import { SharedInformation as MyShared } from './pages/employee/SharedInformation'

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
        <Route path="travel" element={<AdminTravel />} />
        <Route path="location" element={<AdminLocation />} />
        <Route path="salary" element={<SalaryManagement />} />
        <Route path="advance" element={<AdminAdvance />} />
        <Route path="business" element={<AdminBusiness />} />
        <Route path="sales" element={<SalesPerformance />} />
        <Route path="marketing" element={<MarketingPerformance />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="schedule" element={<AdminSchedule />} />
        <Route path="shared" element={<AdminShared />} />
        <Route path="files" element={<FileManagement />} />
      </Route>

      <Route path="/manager" element={<DashboardLayout role="manager" />}>
        <Route index element={<ManagerDashboard />} />
        <Route path="team" element={<TeamPerformance />} />
        <Route path="leads" element={<ManagerLeads />} />
        <Route path="visits" element={<ManagerVisits />} />
        <Route path="travel" element={<ManagerTravel />} />
        <Route path="business" element={<ManagerBusiness />} />
        <Route path="reports" element={<ManagerReports />} />
        <Route path="schedule" element={<ManagerSchedule />} />
        <Route path="shared" element={<ManagerShared />} />
      </Route>

      <Route path="/employee" element={<DashboardLayout role="employee" />}>
        <Route index element={<EmployeeDashboard />} />
        <Route path="leads" element={<MyLeads />} />
        <Route path="visits" element={<MyVisits />} />
        <Route path="travel" element={<MyTravel />} />
        <Route path="location" element={<MyLocation />} />
        <Route path="business" element={<MyBusiness />} />
        <Route path="schedule" element={<MySchedule />} />
        <Route path="advance" element={<MyAdvance />} />
        <Route path="reports" element={<MyReports />} />
        <Route path="shared" element={<MyShared />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
