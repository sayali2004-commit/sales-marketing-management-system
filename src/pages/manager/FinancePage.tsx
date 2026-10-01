import { useState } from 'react'
import { TabPage } from '../../components/ui/Tabs'
import { TravelSection } from '../../components/sections/TravelSection'
import { useApp } from '../../context/AppContext'
import type { TravelRecord } from '../../types'

const tabs = [{ id: 'travel', label: 'Travel Claims' }]

export function FinancePage() {
  const [active] = useState('travel')
  const { travelRecords } = useApp()
  const [localRecords, setLocalRecords] = useState<TravelRecord[]>([])
  const teamIds = ['emp-004', 'emp-005', 'emp-006', 'emp-007', 'emp-011']

  return (
    <TabPage
      title="Finance"
      subtitle="Team travel records with reimbursement approval"
      tabs={tabs}
      active={active}
      onChange={() => {}}
    >
      <TravelSection
        records={[...localRecords, ...travelRecords.filter((t) => teamIds.includes(t.employeeId))]}
        scopeLabel="Review, approve or reject team travel reimbursement claims."
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
    </TabPage>
  )
}
