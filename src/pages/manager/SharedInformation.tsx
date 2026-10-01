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
      scopeLabel="Share documents and updates with your team using a reason for every share."
      canShare
      currentEmployeeId="emp-002"
      onShare={(record) => setLocalRecords((p) => [{ ...record, sharedById: 'emp-002' }, ...p])}
    />
  )
}
