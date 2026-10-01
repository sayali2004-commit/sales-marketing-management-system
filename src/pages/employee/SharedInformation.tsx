import { useState } from 'react'
import { SharedInformationSection } from '../../components/sections/SharedInformationSection'
import { useApp } from '../../context/AppContext'
import type { SharedRecord } from '../../types'

export function SharedInformation() {
  const { currentUser, sharedRecords } = useApp()
  const [localRecords, setLocalRecords] = useState<SharedRecord[]>([])
  const empId = currentUser?.id || 'emp-004'

  return (
    <SharedInformationSection
      records={[...localRecords, ...sharedRecords.filter((r) => r.sharedById === empId || r.sharedWithId === empId)]}
      scopeLabel="Share documents and updates with your manager or team using a mandatory reason."
      canShare
      currentEmployeeId={empId}
      onShare={(record) => setLocalRecords((p) => [{ ...record, sharedById: empId }, ...p])}
    />
  )
}
