import { useState } from 'react'
import { LeadSection } from '../../components/sections/LeadSection'
import { useApp } from '../../context/AppContext'
import type { Lead } from '../../types'

export function LeadManagement() {
  const { leads } = useApp()
  const [localLeads, setLocalLeads] = useState<Lead[]>([])

  const allLeads = [...localLeads, ...leads]

  return (
    <LeadSection
      leads={allLeads}
      scopeLabel="Assign leads to employees. Employees follow up, convert and update lead status."
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
