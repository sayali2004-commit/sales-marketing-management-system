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
      scopeLabel="All leads across the company. Create, assign, convert and track lead performance."
      canCreate
      canConvert
      canAssign
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
