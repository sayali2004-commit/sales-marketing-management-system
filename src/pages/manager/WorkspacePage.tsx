import { useState } from 'react'
import { TabPage } from '../../components/ui/Tabs'
import { ScheduleSection } from '../../components/sections/ScheduleSection'
import { SharedInformationSection } from '../../components/sections/SharedInformationSection'
import { useApp } from '../../context/AppContext'
import type { ScheduleItem, SharedRecord } from '../../types'

const tabs = [
  { id: 'schedule', label: 'Schedule' },
  { id: 'shared', label: 'Shared Information' },
]

export function WorkspacePage() {
  const [active, setActive] = useState('schedule')
  const { scheduleItems, sharedRecords } = useApp()
  const [localSchedule, setLocalSchedule] = useState<ScheduleItem[]>([])
  const [localShared, setLocalShared] = useState<SharedRecord[]>([])
  const teamIds = ['emp-004', 'emp-005', 'emp-006', 'emp-007', 'emp-011']

  return (
    <TabPage
      title="Workspace"
      subtitle="Team schedule and shared information"
      tabs={tabs}
      active={active}
      onChange={setActive}
    >
      {active === 'schedule' && (
        <ScheduleSection
          items={[...localSchedule, ...scheduleItems.filter((s) => teamIds.includes(s.employeeId))]}
          scopeLabel="Team schedule with calendar and list views."
          canCreate
          onAddItem={(item) => setLocalSchedule((p) => [item, ...p])}
          onUpdateItem={(updated) =>
            setLocalSchedule((prev) => {
              if (prev.some((p) => p.id === updated.id)) {
                return prev.map((p) => (p.id === updated.id ? updated : p))
              }
              return [updated, ...prev]
            })
          }
        />
      )}
      {active === 'shared' && (
        <SharedInformationSection
          records={[...localShared, ...sharedRecords]}
          scopeLabel="Share documents and updates with your team."
          canShare
          currentEmployeeId="emp-002"
          onShare={(record) => setLocalShared((p) => [{ ...record, sharedById: 'emp-002' }, ...p])}
        />
      )}
    </TabPage>
  )
}
