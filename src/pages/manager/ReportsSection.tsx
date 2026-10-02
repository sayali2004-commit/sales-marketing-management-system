import { useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { ReportsSection as ReportsModule, buildReports } from '../../components/sections/ReportsSection'

const necessaryReportIds = [
  'employee-performance',
  'team-performance',
  'lead-report',
  'visit-report',
  'travel-report',
  'travel-reimbursement',
  'salary-report',
  'business-performance',
]

export function ReportsSection() {
  const { leads, visits, travelRecords, salaryRecords, advanceRecords, businessRecords } = useApp()
  const teamIds = ['emp-004', 'emp-005', 'emp-006', 'emp-007', 'emp-011']

  const teamLeads = useMemo(() => leads.filter((l) => teamIds.includes(l.assignedEmployeeId)), [leads])
  const teamVisits = useMemo(() => visits.filter((v) => teamIds.includes(v.employeeId)), [visits])
  const teamTravel = useMemo(() => travelRecords.filter((t) => teamIds.includes(t.employeeId)), [travelRecords])
  const teamBusiness = useMemo(() => businessRecords.filter((b) => teamIds.includes(b.employeeId)), [businessRecords])

  const allReports = useMemo(
    () =>
      buildReports({
        leads: teamLeads,
        visits: teamVisits,
        travel: teamTravel,
        salary: salaryRecords,
        advance: advanceRecords,
        business: teamBusiness,
      }),
    [teamLeads, teamVisits, teamTravel, salaryRecords, advanceRecords, teamBusiness],
  )

  const reports = useMemo(() => allReports.filter((r) => necessaryReportIds.includes(r.id)), [allReports])

  return (
    <ReportsModule reports={reports} scopeLabel="Essential reports for your team." />
  )
}
