import { useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { ReportsSection as ReportsModule, buildReports } from '../../components/sections/ReportsSection'
import { employees } from '../../data/sampleData'

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

  const allReports = useMemo(
    () =>
      buildReports({
        leads,
        visits,
        travel: travelRecords,
        salary: salaryRecords,
        advance: advanceRecords,
        business: businessRecords,
      }),
    [leads, visits, travelRecords, salaryRecords, advanceRecords, businessRecords],
  )

  const reports = useMemo(() => allReports.filter((r) => necessaryReportIds.includes(r.id)), [allReports])

  return (
    <ReportsModule
      reports={reports}
      scopeLabel="Essential reports with date, employee and status filters."
      employeesList={employees.filter((e) => e.status === 'Active').map((e) => ({ id: e.id, name: e.name }))}
    />
  )
}
