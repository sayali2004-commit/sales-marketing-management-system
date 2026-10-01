import { useState } from 'react'
import { ScheduleSection as ScheduleModule } from '../../components/sections/ScheduleSection'
import { useApp } from '../../context/AppContext'
import type { ScheduleItem } from '../../types'

export function ScheduleSection() {
  const { scheduleItems } = useApp()
  const [localItems, setLocalItems] = useState<ScheduleItem[]>([])

  return (
    <ScheduleModule
      items={[...localItems, ...scheduleItems]}
      scopeLabel="Company schedule with calendar and list views. Manage visits, follow-ups, meetings, calls and tasks."
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
