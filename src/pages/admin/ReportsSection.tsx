import { useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { ReportsSection as ReportsModule, buildReports } from '../../components/sections/ReportsSection'
import { employees } from '../../data/sampleData'

export function ReportsSection() {
  const { leads, visits, travelRecords, salaryRecords, advanceRecords, businessRecords } = useApp()

  const reports = useMemo(
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

  return (
    <ReportsModule
      reports={reports}
      scopeLabel="Professional reports with date, employee, manager and status filters. Export options are available on every report."
      employeesList={employees.filter((e) => e.status === 'Active').map((e) => ({ id: e.id, name: e.name }))}
    />
  )
}
