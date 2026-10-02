import { useState } from 'react'
import { VisitSection } from '../../components/sections/VisitSection'
import { useApp } from '../../context/AppContext'
import type { Visit } from '../../types'

export function VisitManagement() {
  const { visits } = useApp()
  const [localVisits, setLocalVisits] = useState<Visit[]>([])

  return (
    <VisitSection
      visits={[...localVisits, ...visits]}
      scopeLabel="View all customer visits. Employees create visits and save locations. Admin tracks progress and outcomes."
      canCreate={false}
      canUpdateStatus
      simpleUI
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
