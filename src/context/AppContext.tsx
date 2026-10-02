import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Employee, LocationCheckpoint, NotificationItem, Role, SharedRecord, SharedTravelPoint } from '../types'
import {
  advanceRecords as sampleAdvances,
  appFiles as sampleFiles,
  businessRecords as sampleBusiness,
  employees as sampleEmployees,
  leads as sampleLeads,
  locationRecords as sampleLocations,
  notifications as sampleNotifications,
  salaryRecords as sampleSalaries,
  scheduleItems as sampleSchedules,
  sharedRecords as sampleShared,
  travelRecords as sampleTravel,
  visits as sampleVisits,
} from '../data/sampleData'

interface AppState {
  employees: Employee[]
  leads: typeof sampleLeads
  visits: typeof sampleVisits
  travelRecords: typeof sampleTravel
  locationRecords: typeof sampleLocations
  salaryRecords: typeof sampleSalaries
  advanceRecords: typeof sampleAdvances
  businessRecords: typeof sampleBusiness
  scheduleItems: typeof sampleSchedules
  sharedRecords: typeof sampleShared
  appFiles: typeof sampleFiles
  notifications: NotificationItem[]
  checkpoints: LocationCheckpoint[]
  sharedTravelPoints: SharedTravelPoint[]
  currentUser: Employee | null
  login: (employeeId: string) => boolean
  logout: () => void
  addSharedRecord: (record: SharedRecord) => void
  addCheckpoint: (checkpoint: LocationCheckpoint) => void
  addSharedTravelPoint: (point: SharedTravelPoint) => void
  markNotificationsRead: () => void
  setActiveEmployeeId: (id: string) => void
  activeEmployeeId: string
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Employee | null>(null)
  const [sharedRecords, setSharedRecords] = useState(sampleShared)
  const [notifications, setNotifications] = useState(sampleNotifications)
  const [checkpoints, setCheckpoints] = useState<LocationCheckpoint[]>([])
  const [sharedTravelPoints, setSharedTravelPoints] = useState<SharedTravelPoint[]>([])
  const [activeEmployeeId, setActiveEmployeeId] = useState('emp-001')

  const value = useMemo<AppState>(
    () => ({
      employees: sampleEmployees,
      leads: sampleLeads,
      visits: sampleVisits,
      travelRecords: sampleTravel,
      locationRecords: sampleLocations,
      salaryRecords: sampleSalaries,
      advanceRecords: sampleAdvances,
      businessRecords: sampleBusiness,
      scheduleItems: sampleSchedules,
      sharedRecords,
      appFiles: sampleFiles,
      notifications,
      checkpoints,
      sharedTravelPoints,
      currentUser,
      login(employeeId: string) {
        const emp = sampleEmployees.find((e) => e.id === employeeId || e.employeeId.toLowerCase() === employeeId.toLowerCase())
        if (!emp || emp.status !== 'Active') return false
        setCurrentUser(emp)
        setActiveEmployeeId(emp.id)
        return true
      },
      logout() {
        setCurrentUser(null)
      },
      addSharedRecord(record: SharedRecord) {
        setSharedRecords((prev) => [record, ...prev])
      },
      addCheckpoint(checkpoint: LocationCheckpoint) {
        setCheckpoints((prev) => [checkpoint, ...prev])
      },
      addSharedTravelPoint(point: SharedTravelPoint) {
        setSharedTravelPoints((prev) => [...prev, point])
      },
      markNotificationsRead() {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      },
      setActiveEmployeeId,
      activeEmployeeId,
    }),
    [currentUser, sharedRecords, notifications, checkpoints, sharedTravelPoints, activeEmployeeId],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

export function useRole(): Role | null {
  return useApp().currentUser?.role ?? null
}
