import { useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { ReportsSection as ReportsModule, buildReports } from '../../components/sections/ReportsSection'

export function ReportsSection() {
  const { currentUser, leads, visits, travelRecords, salaryRecords, advanceRecords, businessRecords } = useApp()
  const empId = currentUser?.id || 'emp-004'

  const myLeads = useMemo(() => leads.filter((l) => l.assignedEmployeeId === empId), [leads, empId])
  const myVisits = useMemo(() => visits.filter((v) => v.employeeId === empId), [visits, empId])
  const myTravel = useMemo(() => travelRecords.filter((t) => t.employeeId === empId), [travelRecords, empId])
  const mySalary = useMemo(() => salaryRecords.filter((s) => s.employeeId === empId), [salaryRecords, empId])
  const myAdvance = useMemo(() => advanceRecords.filter((a) => a.employeeId === empId), [advanceRecords, empId])
  const myBiz = useMemo(() => businessRecords.filter((b) => b.employeeId === empId), [businessRecords, empId])

  const reports = useMemo(
    () =>
      buildReports({
        leads: myLeads,
        visits: myVisits,
        travel: myTravel,
        salary: mySalary,
        advance: myAdvance,
        business: myBiz,
      }),
    [myLeads, myVisits, myTravel, mySalary, myAdvance, myBiz],
  )

  return (
    <ReportsModule
      reports={reports}
      scopeLabel="Personal reports covering your leads, visits, travel, salary, advance and business performance."
    />
  )
}
