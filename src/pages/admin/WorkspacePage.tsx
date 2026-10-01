import { useState } from 'react'
import { TabPage } from '../../components/ui/Tabs'
import { ScheduleSection } from '../../components/sections/ScheduleSection'
import { SharedInformationSection } from '../../components/sections/SharedInformationSection'
import { FileManagementSection } from './FileManagementSection'
import { useApp } from '../../context/AppContext'
import type { ScheduleItem, SharedRecord } from '../../types'

const tabs = [
  { id: 'schedule', label: 'Schedule' },
  { id: 'shared', label: 'Shared Information' },
  { id: 'files', label: 'Files' },
]

export function WorkspacePage() {
  const [active, setActive] = useState('schedule')
  const { scheduleItems, sharedRecords } = useApp()
  const [localSchedule, setLocalSchedule] = useState<ScheduleItem[]>([])
  const [localShared, setLocalShared] = useState<SharedRecord[]>([])

  return (
    <TabPage
      title="Workspace"
      subtitle="Schedule, shared information and files together"
      tabs={tabs}
      active={active}
      onChange={setActive}
    >
      {active === 'schedule' && (
        <ScheduleSection
          items={[...localSchedule, ...scheduleItems]}
          scopeLabel="Company schedule with calendar and list views."
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
          scopeLabel="Sharing history with recipient, reason and status."
          canShare
          currentEmployeeId="emp-001"
          onShare={(record) => setLocalShared((p) => [{ ...record, sharedById: 'emp-001' }, ...p])}
        />
      )}
      {active === 'files' && <FileManagementSection />}
    </TabPage>
  )
}
