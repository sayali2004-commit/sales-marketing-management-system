import { useApp } from '../../context/AppContext'
import { LocationSection as LocationModule } from '../../components/sections/LocationSection'

export function MyLocation() {
  const { currentUser, locationRecords } = useApp()
  const empId = currentUser?.id || 'emp-004'

  return (
    <LocationModule
      locations={locationRecords.filter((l) => l.employeeId === empId)}
      scopeLabel="Your recorded starting location, current location, visit location and related lead details."
      title="My Location"
    />
  )
}
