import { useMemo, useState } from 'react'
import { MapPin, Navigation } from 'lucide-react'
import { Badge, StatusBadge } from '../ui/Badge'
import { Card } from '../ui/Card'
import { Select } from '../ui/FormControls'
import { Table, type Column } from '../ui/Table'
import { EmptyState } from '../ui/States'
import { FilterPanel } from '../ui/FilterPanel'
import { employeeName } from '../../data/sampleData'
import type { LocationRecord } from '../../types'

interface LocationSectionProps {
  locations: LocationRecord[]
  scopeLabel: string
  title?: string
  compact?: boolean
}

export function LocationSection({ locations, scopeLabel, title = 'Location', compact = false }: LocationSectionProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = useMemo(() => {
    return locations.filter((l) => {
      const q = search.toLowerCase()
      const matchQ =
        !q ||
        employeeName(l.employeeId).toLowerCase().includes(q) ||
        l.currentLocation.toLowerCase().includes(q) ||
        l.relatedLead.toLowerCase().includes(q)
      const matchStatus = statusFilter === 'all' || l.visitStatus === statusFilter
      return matchQ && matchStatus
    })
  }, [locations, search, statusFilter])

  const columns: Column<LocationRecord>[] = [
    {
      key: 'employeeId',
      header: 'Employee Name',
      render: (r) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-semibold">
            {employeeName(r.employeeId).split(' ').map((p) => p[0]).join('').slice(0, 2)}
          </div>
          <span className="font-medium text-slate-800">{employeeName(r.employeeId)}</span>
        </div>
      ),
    },
    {
      key: 'currentLocation',
      header: 'Current Location',
      render: (r) => (
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-slate-700">{r.currentLocation}</span>
        </div>
      ),
    },
    {
      key: 'startingLocation',
      header: 'Starting Location',
      hideOnMobile: true,
      render: (r) => (
        <div className="flex items-center gap-1.5">
          <Navigation className="w-3.5 h-3.5 text-brand-600" />
          <span className="text-slate-600">{r.startingLocation}</span>
        </div>
      ),
    },
    {
      key: 'visitLocation',
      header: 'Visit Location',
      hideOnMobile: true,
      render: (r) => <span className="text-slate-600">{r.visitLocation}</span>,
    },
    {
      key: 'date',
      header: 'Date / Time',
      className: 'whitespace-nowrap',
      render: (r) => (
        <div>
          <p className="text-slate-700">{r.date}</p>
          <p className="text-xs text-slate-400">{r.time}</p>
        </div>
      ),
    },
    {
      key: 'relatedLead',
      header: 'Related Lead',
      hideOnMobile: true,
      render: (r) => <Badge tone="blue">{r.relatedLead}</Badge>,
    },
    { key: 'visitStatus', header: 'Visit Status', render: (r) => <StatusBadge status={r.visitStatus} /> },
  ]

  return (
    <div>
      {!compact && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Records', value: String(locations.length) },
            {
              label: 'In Progress',
              value: String(locations.filter((l) => l.visitStatus === 'In Progress').length),
            },
            {
              label: 'Scheduled',
              value: String(locations.filter((l) => l.visitStatus === 'Scheduled').length),
            },
            {
              label: 'Completed',
              value: String(locations.filter((l) => l.visitStatus === 'Completed').length),
            },
          ].map((s) => (
            <div key={s.label} className="ui-card p-4">
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide truncate">
                {s.label}
              </p>
              <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-50 mt-1.5 break-words">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="ui-card p-4 sm:p-5 mb-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-50 tracking-tight">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{scopeLabel}</p>
      </div>

      <Card>

        <FilterPanel
          search={search}
          onSearch={setSearch}
          searchPlaceholder="Search location records"
          groups={[
            {
              id: 'status',
              label: 'Visit Status',
              value: statusFilter,
              options: [
                { value: 'all', label: 'All' },
                { value: 'Scheduled', label: 'Scheduled' },
                { value: 'In Progress', label: 'In Progress' },
                { value: 'Completed', label: 'Completed' },
              ],
            },
          ]}
          onChange={(_, value) => setStatusFilter(value)}
          onClear={() => {
            setStatusFilter('all')
            setSearch('')
          }}
        />

        {filtered.length === 0 ? (
          <EmptyState title="No location records" description="Location tracking records will appear here." />
        ) : (
          <Table columns={columns} data={filtered} />
        )}
      </Card>
    </div>
  )
}
