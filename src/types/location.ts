export interface LocationVisitEntry {
  id: string
  employeeId: string
  locationName: string
  address: string
  date: string
  time: string
  startingPoint: string
  distanceKm: number
  purpose: string
  status: 'Completed' | 'Scheduled' | 'In Progress' | 'Cancelled'
  notes?: string
  order: number
}

export interface EmployeeDayTravel {
  employeeId: string
  date: string
  startingPoint: string
  route: string[]
  totalDistanceKm: number
  locationsVisited: number
  visits: number
  entries: LocationVisitEntry[]
}

export interface EmployeeLocationSummary {
  employeeId: string
  name: string
  employeeCode: string
  role: string
  avatar: string
  totalVisits: number
  totalDistanceKm: number
  totalLocations: number
  currentLocation: string
  lastActiveDate: string
}
