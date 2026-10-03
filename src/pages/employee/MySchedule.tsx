import { useState } from 'react'
import { ScheduleSection as ScheduleModule } from '../../components/sections/ScheduleSection'
import { useApp } from '../../context/AppContext'
import type { ScheduleItem } from '../../types'

export function MySchedule() {
  const { currentUser, scheduleItems } = useApp()
  const [localItems, setLocalItems] = useState<ScheduleItem[]>([])
  const empId = currentUser?.id || 'emp-004'

  return (
    <ScheduleModule
      items={[...localItems, ...scheduleItems.filter((s) => s.employeeId === empId)]}
      title="My Schedule"
      scopeLabel="Your activities including visits, follow-ups, meetings, calls, sales and marketing tasks."
      canCreate
      currentEmployeeId={empId}
      onAddItem={(item) => setLocalItems((p) => [item, ...p])}
      onUpdateItem={(updated) =>
        setLocalItems((prev) => {
          if (prev.some((p) => p.id === updated.id)) {
            return prev.map((p) => (p.id === updated.id ? updated : p))
          }
          return [updated, ...prev]
        })
      }
    />
  )
}
