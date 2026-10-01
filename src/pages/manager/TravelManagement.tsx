import { useState } from 'react'
import { TravelSection } from '../../components/sections/TravelSection'
import { useApp } from '../../context/AppContext'
import type { TravelRecord } from '../../types'

export function TravelManagement() {
  const { travelRecords } = useApp()
  const [localRecords, setLocalRecords] = useState<TravelRecord[]>([])
  const teamIds = ['emp-004', 'emp-005', 'emp-006', 'emp-007', 'emp-011']

  return (
    <TravelSection
      records={[...localRecords, ...travelRecords.filter((t) => teamIds.includes(t.employeeId))]}
      scopeLabel="Team travel records. Review, approve or reject reimbursement claims."
      canCreate
      canApprove
      onAddRecord={(record) => setLocalRecords((p) => [record, ...p])}
      onUpdateRecord={(updated) =>
        setLocalRecords((prev) => {
          if (prev.some((p) => p.id === updated.id)) {
            return prev.map((p) => (p.id === updated.id ? updated : p))
          }
          return [updated, ...prev]
        })
      }
    />
  )
}
