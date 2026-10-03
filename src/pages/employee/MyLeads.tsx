import { useMemo, useState } from 'react'
import { LeadSection } from '../../components/sections/LeadSection'
import { useApp } from '../../context/AppContext'
import type { Lead } from '../../types'

export function MyLeads() {
  const { currentUser, leads } = useApp()
  const [localLeads, setLocalLeads] = useState<Lead[]>([])
  const empId = currentUser?.id || 'emp-004'

  const employeeLeads = useMemo(
    () => leads.filter((l) => l.assignedEmployeeId === empId),
    [leads, empId],
  )

  const allLeads = useMemo(() => {
    const localIds = new Set(localLeads.map((l) => l.id))
    return [...localLeads, ...employeeLeads.filter((l) => !localIds.has(l.id))]
  }, [localLeads, employeeLeads])

  return (
    <LeadSection
      leads={allLeads}
      title="My Leads"
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
