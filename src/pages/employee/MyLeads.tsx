import { useState } from 'react'
import { LeadSection } from '../../components/sections/LeadSection'
import { useApp } from '../../context/AppContext'
import type { Lead } from '../../types'

export function MyLeads() {
  const { currentUser, leads } = useApp()
  const [localLeads, setLocalLeads] = useState<Lead[]>([])
  const empId = currentUser?.id || 'emp-004'

  return (
    <LeadSection
      leads={[...localLeads, ...leads.filter((l) => l.assignedEmployeeId === empId)]}
      scopeLabel="Your assigned leads. Add leads, update status, add follow-ups and convert prospects."
      canCreate
      canConvert
      currentEmployeeId={empId}
      onAddLead={(lead) => setLocalLeads((p) => [lead, ...p])}
      onUpdateLead={(updated) =>
        setLocalLeads((prev) => {
          if (prev.some((p) => p.id === updated.id)) {
            return prev.map((p) => (p.id === updated.id ? updated : p))
          }
          return [updated, ...prev]
        })
      }
    />
  )
}
