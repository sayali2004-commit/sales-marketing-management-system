import { LocationTracking } from '../../components/sections/LocationTracking'

const teamIds = ['emp-004', 'emp-005', 'emp-006', 'emp-007', 'emp-011']

export function LocationTrackingManagerPage() {
  return (
    <LocationTracking
      employeeIds={teamIds}
      scopeLabel="Track daily travel and visited locations for your team members."
    />
  )
}
