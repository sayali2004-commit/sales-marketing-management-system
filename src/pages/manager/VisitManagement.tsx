import { useState } from 'react'
import { VisitSection } from '../../components/sections/VisitSection'
import { useApp } from '../../context/AppContext'
import type { Visit } from '../../types'

export function VisitManagement() {
  const { visits } = useApp()
  const [localVisits, setLocalVisits] = useState<Visit[]>([])
  const teamIds = ['emp-004', 'emp-005', 'emp-006', 'emp-007', 'emp-011']

  return (
    <VisitSection
      visits={[...localVisits, ...visits.filter((v) => teamIds.includes(v.employeeId))]}
      scopeLabel="Customer visits scheduled by your team. Update outcomes and share visit details."
      canCreate
      canUpdateStatus
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
