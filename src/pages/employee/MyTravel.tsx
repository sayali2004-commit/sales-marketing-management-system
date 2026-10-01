import { useState } from 'react'
import { TravelSection } from '../../components/sections/TravelSection'
import { useApp } from '../../context/AppContext'
import type { TravelRecord } from '../../types'

export function MyTravel() {
  const { currentUser, travelRecords } = useApp()
  const [localRecords, setLocalRecords] = useState<TravelRecord[]>([])
  const empId = currentUser?.id || 'emp-004'

  return (
    <TravelSection
      records={[...localRecords, ...travelRecords.filter((t) => t.employeeId === empId)]}
      scopeLabel="Your travel entries. Enter distance and per kilometer rate to calculate the total travel amount automatically."
      canCreate
      canApprove={false}
      currentEmployeeId={empId}
      showReimbursement
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
