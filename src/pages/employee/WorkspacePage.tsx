import { useMemo, useState } from 'react'
import { TabPage } from '../../components/ui/Tabs'
import { ReportsSection as ReportsModule, buildReports } from '../../components/sections/ReportsSection'
import { SharedInformationSection } from '../../components/sections/SharedInformationSection'
import { useApp } from '../../context/AppContext'
import type { SharedRecord } from '../../types'

const tabs = [
  { id: 'reports', label: 'Reports' },
  { id: 'shared', label: 'Shared Information' },
]

const necessaryReportIds = [
  'employee-performance',
  'lead-report',
  'visit-report',
  'travel-report',
  'travel-reimbursement',
  'salary-report',
  'business-performance',
]

export function WorkspacePage() {
  const [active, setActive] = useState('reports')
  const { currentUser, leads, visits, travelRecords, salaryRecords, advanceRecords, businessRecords, sharedRecords } = useApp()
  const [localShared, setLocalShared] = useState<SharedRecord[]>([])
  const empId = currentUser?.id || 'emp-004'

  const myLeads = useMemo(() => leads.filter((l) => l.assignedEmployeeId === empId), [leads, empId])
  const myVisits = useMemo(() => visits.filter((v) => v.employeeId === empId), [visits, empId])
  const myTravel = useMemo(() => travelRecords.filter((t) => t.employeeId === empId), [travelRecords, empId])
  const mySalary = useMemo(() => salaryRecords.filter((s) => s.employeeId === empId), [salaryRecords, empId])
  const myAdvance = useMemo(() => advanceRecords.filter((a) => a.employeeId === empId), [advanceRecords, empId])
  const myBiz = useMemo(() => businessRecords.filter((b) => b.employeeId === empId), [businessRecords, empId])

  const allReports = useMemo(
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

  const reports = useMemo(() => allReports.filter((r) => necessaryReportIds.includes(r.id)), [allReports])

  return (
    <TabPage
      title="Workspace"
      subtitle="Your essential reports and shared information"
      tabs={tabs}
      active={active}
      onChange={setActive}
    >
      {active === 'reports' && (
        <ReportsModule reports={reports} scopeLabel="Your essential reports." />
      )}
      {active === 'shared' && (
        <SharedInformationSection
          records={[...localShared, ...sharedRecords.filter((r) => r.sharedById === empId || r.sharedWithId === empId)]}
          scopeLabel="Share documents and updates with your manager or team."
          canShare
          currentEmployeeId={empId}
          onShare={(record) => setLocalShared((p) => [{ ...record, sharedById: empId }, ...p])}
        />
      )}
    </TabPage>
  )
}
