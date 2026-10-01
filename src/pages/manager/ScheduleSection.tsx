import { useState } from 'react'
import { ScheduleSection as ScheduleModule } from '../../components/sections/ScheduleSection'
import { useApp } from '../../context/AppContext'
import type { ScheduleItem } from '../../types'

export function ScheduleSection() {
  const { scheduleItems } = useApp()
  const [localItems, setLocalItems] = useState<ScheduleItem[]>([])
  const teamIds = ['emp-004', 'emp-005', 'emp-006', 'emp-007', 'emp-011']

  return (
    <ScheduleModule
      items={[...localItems, ...scheduleItems.filter((s) => teamIds.includes(s.employeeId))]}
      scopeLabel="Team schedule with calendar and list views. Coordinate visits, follow-ups and meetings."
      canCreate
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
