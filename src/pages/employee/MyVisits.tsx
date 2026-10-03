import { useState } from 'react'
import { VisitSection } from '../../components/sections/VisitSection'
import { useApp } from '../../context/AppContext'
import type { Visit } from '../../types'

export function MyVisits() {
  const { currentUser, visits } = useApp()
  const [localVisits, setLocalVisits] = useState<Visit[]>([])
  const empId = currentUser?.id || 'emp-004'

  return (
    <VisitSection
      visits={[...localVisits, ...visits.filter((v) => v.employeeId === empId)]}
      title="My Visits"
      scopeLabel="Your customer visits. Create visits, update outcomes and upload supporting files."
      canCreate
      canUpdateStatus
      simpleUI
      currentEmployeeId={empId}
      onAddVisit={(visit) => setLocalVisits((p) => [visit, ...p])}
      onUpdateVisit={(updated) =>
        setLocalVisits((prev) => {
          if (prev.some((p) => p.id === updated.id)) {
            return prev.map((p) => (p.id === updated.id ? updated : p))
          }
          return [updated, ...prev]
        })
      }
    />
  )
}
