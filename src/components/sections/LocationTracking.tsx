import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Clock,
  MapPin,
  Navigation,
  Route,
  Search,
  Users,
} from 'lucide-react'
import { Badge, StatusBadge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Select } from '../ui/FormControls'
import { EmptyState } from '../ui/States'
import { StatCard } from '../ui/StatCard'
import {
  employeeLocationSummaries,
  formatDateLong,
  formatTime12,
  getEmployeeDayTravels,
} from '../../data/locationData'
import type { EmployeeDayTravel } from '../../types/location'

interface LocationTrackingProps {
  employeeIds?: string[]
  scopeLabel?: string
}

export function LocationTracking({ employeeIds, scopeLabel }: LocationTrackingProps) {
  const [search, setSearch] = useState('')
  const [employeeFilter, setEmployeeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null)
  const [expandedDate, setExpandedDate] = useState<string | null>(null)

  const allSummaries = useMemo(() => {
    if (!employeeIds || employeeIds.length === 0) return employeeLocationSummaries
    return employeeLocationSummaries.filter((e) => employeeIds.includes(e.employeeId))
  }, [employeeIds])

  const filteredEmployees = useMemo(() => {
    return allSummaries.filter((e) => {
      const q = search.toLowerCase()
      const matchQ =
        !q ||
        e.name.toLowerCase().includes(q) ||
        e.employeeCode.toLowerCase().includes(q) ||
        e.currentLocation.toLowerCase().includes(q)
      const matchEmp = employeeFilter === 'all' || e.employeeId === employeeFilter
      return matchQ && matchEmp
    })
  }, [allSummaries, search, employeeFilter])

  const totals = useMemo(
    () => ({
      employees: allSummaries.length,
      distance: allSummaries.reduce((s, e) => s + e.totalDistanceKm, 0),
      locations: allSummaries.reduce((s, e) => s + e.totalLocations, 0),
      visits: allSummaries.reduce((s, e) => s + e.totalVisits, 0),
    }),
    [allSummaries],
  )

  const selectedEmployee = allSummaries.find((e) => e.employeeId === selectedEmployeeId) || null
  const dayTravels = useMemo(
    () => (selectedEmployeeId ? getEmployeeDayTravels(selectedEmployeeId) : []),
    [selectedEmployeeId],
  )

  const filteredDays = useMemo(() => {
    return dayTravels.filter((day) => {
      if (dateFilter && day.date !== dateFilter) return false
      if (statusFilter !== 'all') {
        return day.entries.some((e) => e.status === statusFilter)
      }
      return true
    })
  }, [dayTravels, dateFilter, statusFilter])

  const clearFilters = () => {
    setSearch('')
    setEmployeeFilter('all')
    setStatusFilter('all')
    setDateFilter('')
  }

  if (selectedEmployee) {
    return (
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-start gap-3">
            <button
              onClick={() => {
                setSelectedEmployeeId(null)
                setExpandedDate(null)
              }}
              className="mt-1 p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              aria-label="Back to employees"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">{selectedEmployee.name}</h1>
              <p className="text-sm text-slate-500 mt-1">
                {selectedEmployee.employeeCode} · {selectedEmployee.role}
              </p>
            </div>
          </div>
          <div className="w-14 h-14 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-lg font-semibold">
            {selectedEmployee.avatar}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <StatCard title="Total Distance" value={`${selectedEmployee.totalDistanceKm} KM`} icon={Navigation} accent="blue" />
          <StatCard title="Locations Visited" value={selectedEmployee.totalLocations} icon={MapPin} accent="emerald" />
          <StatCard title="Total Visits" value={selectedEmployee.totalVisits} icon={Building2} accent="violet" />
          <StatCard title="Last Active" value={selectedEmployee.lastActiveDate} icon={Clock} accent="amber" />
        </div>

        <Card className="mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-xs text-slate-500">Employee Name</p>
              <p className="font-medium text-slate-800 mt-1">{selectedEmployee.name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Employee ID</p>
              <p className="font-medium text-slate-800 mt-1">{selectedEmployee.employeeCode}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Role</p>
              <p className="font-medium text-slate-800 mt-1">{selectedEmployee.role}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Starting Point</p>
              <p className="font-medium text-slate-800 mt-1">{dayTravels[0]?.startingPoint || selectedEmployee.currentLocation}</p>
            </div>
            <div className="col-span-2 sm:col-span-4">
              <p className="text-xs text-slate-500">Latest Location</p>
              <p className="font-medium text-slate-800 mt-1 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                {selectedEmployee.currentLocation}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Date-wise Travel History</h3>
              <p className="text-sm text-slate-500 mt-0.5">Click a date to open full location details for that day</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-500"
              />
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Cancelled">Cancelled</option>
              </Select>
            </div>
          </div>

          {filteredDays.length === 0 ? (
            <EmptyState title="No travel history" description="No travel records found for the selected filters." />
          ) : (
            <div className="space-y-3">
              {filteredDays.map((day) => (
                <DayAccordion
                  key={`${day.employeeId}-${day.date}`}
                  day={day}
                  expanded={expandedDate === day.date}
                  onToggle={() => setExpandedDate(expandedDate === day.date ? null : day.date)}
                />
              ))}
            </div>
          )}
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Location</h1>
        <p className="text-sm text-slate-500 mt-1">
          {scopeLabel || 'Track employee daily travel and visited locations. Click an employee card to view date-wise history.'}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard title="Total Employees Tracked" value={totals.employees} icon={Users} accent="blue" />
        <StatCard title="Total Distance" value={`${totals.distance} KM`} icon={Navigation} accent="emerald" />
        <StatCard title="Total Locations" value={totals.locations} icon={MapPin} accent="violet" />
        <StatCard title="Total Visits" value={totals.visits} icon={Building2} accent="amber" />
      </div>

      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-end gap-3">
          <div className="flex-1 min-w-0 md:max-w-md">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Search</p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search employee or location..."
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-500"
              />
            </div>
          </div>
          <div className="w-full md:w-56">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Employee</p>
            <Select value={employeeFilter} onChange={(e) => setEmployeeFilter(e.target.value)}>
              <option value="all">All Employees</option>
              {allSummaries.map((e) => (
                <option key={e.employeeId} value={e.employeeId}>
                  {e.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="md:pb-0.5">
            <Button variant="secondary" size="sm" className="w-full md:w-auto whitespace-nowrap" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {filteredEmployees.length === 0 ? (
        <Card>
          <EmptyState title="No employees found" description="Try a different search or employee filter." />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredEmployees.map((emp) => (
            <button
              key={emp.employeeId}
              type="button"
              onClick={() => {
                setSelectedEmployeeId(emp.employeeId)
                setExpandedDate(null)
              }}
              className="text-left bg-surface rounded-xl border border-slate-200 shadow-card p-5 hover:border-brand-400 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold shrink-0">
                  {emp.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900 truncate">{emp.name}</p>
                  <p className="text-xs text-slate-500">{emp.employeeCode}</p>
                  <Badge tone="blue" className="mt-1.5">
                    {emp.role}
                  </Badge>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-500 transition-colors" />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Building2 className="w-3 h-3" /> Visits
                  </p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">{emp.totalVisits}</p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Navigation className="w-3 h-3" /> Distance
                  </p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">{emp.totalDistanceKm} KM</p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Locations
                  </p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">{emp.totalLocations}</p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Last Active
                  </p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">{emp.lastActiveDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-2.5 bg-emerald-50 rounded-lg border border-emerald-100">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] text-emerald-700 font-medium">Current Location</p>
                  <p className="text-xs text-emerald-800 truncate">{emp.currentLocation}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function DayAccordion({ day, expanded, onToggle }: { day: EmployeeDayTravel; expanded: boolean; onToggle: () => void }) {
  return (
    <div className={`rounded-xl border overflow-hidden transition-colors ${expanded ? 'border-brand-300 bg-brand-50/30' : 'border-slate-200 bg-surface hover:border-slate-300'}`}>
      <button type="button" onClick={onToggle} className="w-full flex items-center justify-between gap-3 p-4 text-left">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-brand-600" />
            {formatDateLong(day.date)}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-600">
            <span className="flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5 text-slate-400" /> Total Distance: <strong className="text-slate-800">{day.totalDistanceKm} km</strong>
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> Locations Visited: <strong className="text-slate-800">{day.locationsVisited}</strong>
            </span>
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" /> Visits: <strong className="text-slate-800">{day.visits}</strong>
            </span>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180 text-brand-600' : ''}`} />
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-slate-100 pt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-surface rounded-lg border border-slate-200">
              <p className="text-[11px] text-slate-500">Date</p>
              <p className="text-sm font-medium text-slate-800 mt-0.5">{formatDateLong(day.date)}</p>
            </div>
            <div className="p-3 bg-surface rounded-lg border border-slate-200">
              <p className="text-[11px] text-slate-500">Starting Point</p>
              <p className="text-sm font-medium text-slate-800 mt-0.5">{day.startingPoint}</p>
            </div>
            <div className="p-3 bg-surface rounded-lg border border-slate-200">
              <p className="text-[11px] text-slate-500">Total Distance / Visits</p>
              <p className="text-sm font-medium text-slate-800 mt-0.5">
                {day.totalDistanceKm} km · {day.visits} visits
              </p>
            </div>
          </div>

          <div className="p-3 bg-surface rounded-lg border border-slate-200">
            <p className="text-[11px] font-medium text-slate-500 mb-2 flex items-center gap-1.5">
              <Route className="w-3.5 h-3.5 text-brand-600" /> Travel Route
            </p>
            <p className="text-sm text-slate-800">{day.route.join('  →  ')}</p>
          </div>

          <div>
            <p className="text-[11px] font-medium text-slate-500 mb-2">Locations Visited</p>
            <div className="space-y-2">
              {day.entries.map((entry, index) => (
                <div key={entry.id} className="p-3 bg-surface rounded-lg border border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-semibold shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-slate-900">{entry.locationName}</p>
                        <StatusBadge status={entry.status} />
                      </div>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {entry.address}
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-xs">
                        <div>
                          <p className="text-slate-400">Visit Date</p>
                          <p className="text-slate-700 font-medium">{formatDateLong(entry.date)}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Visit Time</p>
                          <p className="text-slate-700 font-medium">{formatTime12(entry.time)}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Starting Point</p>
                          <p className="text-slate-700 font-medium">{entry.startingPoint}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Distance</p>
                          <p className="text-slate-700 font-medium">{entry.distanceKm} km</p>
                        </div>
                      </div>
                      <div className="mt-2 text-xs">
                        <p className="text-slate-400">Purpose</p>
                        <p className="text-slate-700 font-medium">{entry.purpose}</p>
                      </div>
                      {entry.notes && (
                        <p className="text-xs text-slate-500 mt-2 bg-slate-50 rounded-md px-2 py-1.5">{entry.notes}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-brand-50 rounded-lg border border-brand-100">
              <p className="text-[11px] text-brand-700 font-medium">Total Distance</p>
              <p className="text-lg font-semibold text-brand-800 mt-0.5">{day.totalDistanceKm} km</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
              <p className="text-[11px] text-emerald-700 font-medium">Total Visits</p>
              <p className="text-lg font-semibold text-emerald-800 mt-0.5">{day.visits}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
