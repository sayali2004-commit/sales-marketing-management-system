import { useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { ReportsSection as ReportsModule, buildReports } from '../../components/sections/ReportsSection'

export function ReportsSection() {
  const { leads, visits, travelRecords, salaryRecords, advanceRecords, businessRecords } = useApp()
  const teamIds = ['emp-004', 'emp-005', 'emp-006', 'emp-007', 'emp-011']

  const teamLeads = useMemo(() => leads.filter((l) => teamIds.includes(l.assignedEmployeeId)), [leads])
  const teamVisits = useMemo(() => visits.filter((v) => teamIds.includes(v.employeeId)), [visits])
  const teamTravel = useMemo(() => travelRecords.filter((t) => teamIds.includes(t.employeeId)), [travelRecords])
  const teamBusiness = useMemo(() => businessRecords.filter((b) => teamIds.includes(b.employeeId)), [businessRecords])

  const reports = useMemo(
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

  return (
    <ReportsModule
      reports={reports}
      scopeLabel="Reports limited to your assigned team. Use filters to narrow by date, employee and status."
    />
  )
}
