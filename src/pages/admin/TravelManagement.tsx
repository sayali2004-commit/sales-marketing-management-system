import { useState } from 'react'
import { TravelSection } from '../../components/sections/TravelSection'
import { useApp } from '../../context/AppContext'
import type { TravelRecord } from '../../types'

export function TravelManagement() {
  const { travelRecords } = useApp()
  const [localRecords, setLocalRecords] = useState<TravelRecord[]>([])

  return (
    <TravelSection
      records={[...localRecords, ...travelRecords]}
      scopeLabel="Company-wide travel records with automatic amount calculation and reimbursement tracking."
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
