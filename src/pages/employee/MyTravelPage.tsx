import { useState } from 'react'
import { TabPage } from '../../components/ui/Tabs'
import { TravelSection } from '../../components/sections/TravelSection'
import { LocationSection } from '../../components/sections/LocationSection'
import { DayRouteTracker } from '../../components/sections/DayRouteTracker'
import { useApp } from '../../context/AppContext'
import type { TravelRecord } from '../../types'

const tabs = [
  { id: 'route', label: "Today's Route" },
  { id: 'travel', label: 'Travel Records' },
  { id: 'location', label: 'Location History' },
]

export function MyTravelPage() {
  const [active, setActive] = useState('route')
  const { currentUser, travelRecords, locationRecords } = useApp()
  const [localRecords, setLocalRecords] = useState<TravelRecord[]>([])
  const empId = currentUser?.id || 'emp-004'

  return (
    <TabPage
      title="My Travel"
      subtitle="Capture start point, destination and every location you visit during the day using mobile GPS"
      tabs={tabs}
      active={active}
      onChange={setActive}
    >
      {active === 'route' && <DayRouteTracker employeeId={empId} />}
      {active === 'travel' && (
        <TravelSection
          records={[...localRecords, ...travelRecords.filter((t) => t.employeeId === empId)]}
          scopeLabel="Travel entries with GPS start and destination points. Amount is auto calculated from distance and per kilometer rate."
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
      )}
      {active === 'location' && (
        <LocationSection
          locations={locationRecords.filter((l) => l.employeeId === empId)}
          scopeLabel="Your starting location, current location, visit location and related lead details."
          title="My Location"
          compact
        />
      )}
    </TabPage>
  )
}
