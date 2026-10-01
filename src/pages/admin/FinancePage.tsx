import { useState } from 'react'
import { TabPage } from '../../components/ui/Tabs'
import { TravelSection } from '../../components/sections/TravelSection'
import { LocationSection } from '../../components/sections/LocationSection'
import { SalarySection } from './SalarySection'
import { AdvanceSection } from './AdvanceSection'
import { useApp } from '../../context/AppContext'
import type { TravelRecord } from '../../types'

const tabs = [
  { id: 'travel', label: 'Travel' },
  { id: 'location', label: 'Location' },
  { id: 'salary', label: 'Salary' },
  { id: 'advance', label: 'Advance' },
]

export function FinancePage() {
  const [active, setActive] = useState('travel')
  const { travelRecords, locationRecords } = useApp()
  const [localTravel, setLocalTravel] = useState<TravelRecord[]>([])

  return (
    <TabPage
      title="Finance"
      subtitle="Travel, location, salary and advance records in one place"
      tabs={tabs}
      active={active}
      onChange={setActive}
    >
      {active === 'travel' && (
        <TravelSection
          records={[...localTravel, ...travelRecords]}
          scopeLabel="Company-wide travel records with automatic amount calculation and reimbursement tracking."
          canCreate
          canApprove
          onAddRecord={(record) => setLocalTravel((p) => [record, ...p])}
          onUpdateRecord={(updated) =>
            setLocalTravel((prev) => {
              if (prev.some((p) => p.id === updated.id)) {
                return prev.map((p) => (p.id === updated.id ? updated : p))
              }
              return [updated, ...prev]
            })
          }
        />
      )}
      {active === 'location' && (
        <LocationSection
          locations={locationRecords}
          scopeLabel="Track employee starting location, current location, visit location and related lead details."
        />
      )}
      {active === 'salary' && <SalarySection />}
      {active === 'advance' && <AdvanceSection />}
    </TabPage>
  )
}
