import { useApp } from '../../context/AppContext'
import { LocationSection as LocationModule } from '../../components/sections/LocationSection'

export function LocationSection() {
  const { locationRecords } = useApp()

  return (
    <LocationModule
      locations={locationRecords}
      scopeLabel="Track employee starting location, current location, visit location and related lead details."
    />
  )
}
