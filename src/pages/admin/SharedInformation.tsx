import { useState } from 'react'
import { SharedInformationSection } from '../../components/sections/SharedInformationSection'
import { useApp } from '../../context/AppContext'
import type { SharedRecord } from '../../types'

export function SharedInformation() {
  const { sharedRecords } = useApp()
  const [localRecords, setLocalRecords] = useState<SharedRecord[]>([])

  return (
    <SharedInformationSection
      records={[...localRecords, ...sharedRecords]}
      scopeLabel="Sharing history with recipient, reason, note and status for company-wide coordination."
      canShare
      currentEmployeeId="emp-001"
      onShare={(record) => setLocalRecords((p) => [{ ...record, sharedById: 'emp-001' }, ...p])}
    />
  )
}
