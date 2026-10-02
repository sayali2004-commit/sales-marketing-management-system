import { useState } from 'react'
import { LeadSection } from '../../components/sections/LeadSection'
import { useApp } from '../../context/AppContext'
import type { Lead } from '../../types'

export function LeadManagement() {
  const { leads } = useApp()
  const [localLeads, setLocalLeads] = useState<Lead[]>([])
  const teamIds = ['emp-004', 'emp-005', 'emp-006', 'emp-007', 'emp-011']

  const teamLeads = [...localLeads, ...leads.filter((l) => teamIds.includes(l.assignedEmployeeId))]

  return (
    <LeadSection
      leads={teamLeads}
      scopeLabel="Assign leads to your team. Employees follow up, convert and update status."
      canCreate
      canConvert
      canAssign
      createLabel="Assign Lead"
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
