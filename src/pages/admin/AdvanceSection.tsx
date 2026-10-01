import { useMemo, useState } from 'react'
import { CircleDollarSign, HandCoins, TrendingUp } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { StatCard } from '../../components/ui/StatCard'
import { StatusBadge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Select } from '../../components/ui/FormControls'
import { Table, type Column } from '../../components/ui/Table'
import { EmptyState } from '../../components/ui/States'
import { FilterPanel } from '../../components/ui/FilterPanel'
import { employeeName, formatCurrency } from '../../data/sampleData'
import type { AdvanceRecord } from '../../types'

export function AdvanceSection() {
  const { advanceRecords } = useApp()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = useMemo(() => {
    return advanceRecords.filter((r) => {
      const q = search.toLowerCase()
      const matchQ = !q || employeeName(r.employeeId).toLowerCase().includes(q) || r.reason.toLowerCase().includes(q)
      const matchStatus = statusFilter === 'all' || r.status === statusFilter
      return matchQ && matchStatus
    })
  }, [advanceRecords, search, statusFilter])

  const stats = useMemo(() => {
    const total = advanceRecords.reduce((s, a) => s + a.advanceAmount, 0)
    const recovered = advanceRecords.reduce((s, a) => s + a.recoveredAmount, 0)
    const pending = advanceRecords.reduce((s, a) => s + a.pendingAmount, 0)
    return { total, recovered, pending }
  }, [advanceRecords])

  const columns: Column<AdvanceRecord>[] = [
    {
      key: 'employeeId',
      header: 'Employee Name',
      render: (r) => (
        <div>
          <p className="font-medium text-slate-800">{employeeName(r.employeeId)}</p>
          <p className="text-xs text-slate-400">{r.reason}</p>
        </div>
      ),
    },
    {
      key: 'advanceAmount',
      header: 'Advance Amount',
      className: 'whitespace-nowrap',
      render: (r) => <span className="font-medium text-slate-900">{formatCurrency(r.advanceAmount)}</span>,
    },
    { key: 'advanceDate', header: 'Advance Date', className: 'whitespace-nowrap', render: (r) => <span className="text-slate-600">{r.advanceDate}</span> },
    {
      key: 'recoveredAmount',
      header: 'Recovered',
      className: 'whitespace-nowrap',
      render: (r) => <span className="text-emerald-700">{formatCurrency(r.recoveredAmount)}</span>,
    },
    {
      key: 'pendingAmount',
      header: 'Pending',
      className: 'whitespace-nowrap',
      render: (r) => <span className="font-medium text-rose-600">{formatCurrency(r.pendingAmount)}</span>,
    },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (r) => (
        <Button size="sm" variant="secondary" disabled={r.status === 'Recovered'}>
          {r.status === 'Recovered' ? 'Closed' : 'Record Recovery'}
        </Button>
      ),
    },
  ]

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <CircleDollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Advance Given</p>
              <p className="text-2xl font-semibold text-slate-900 mt-1">{formatCurrency(stats.total)}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Advance Recovered</p>
              <p className="text-2xl font-semibold text-emerald-700 mt-1">{formatCurrency(stats.recovered)}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <HandCoins className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Advance Pending</p>
              <p className="text-2xl font-semibold text-amber-700 mt-1">{formatCurrency(stats.pending)}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        <StatCard title="Current Employee Advances" value={advanceRecords.length} icon={CircleDollarSign} accent="blue" />
        <StatCard title="Fully Recovered" value={advanceRecords.filter((a) => a.status === 'Recovered').length} icon={TrendingUp} accent="emerald" />
        <StatCard title="Partially Recovered" value={advanceRecords.filter((a) => a.status === 'Partially Recovered').length} icon={HandCoins} accent="amber" />
      </div>

      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
          <h3 className="text-base font-semibold text-slate-900">Employee Advances</h3>
          <Button variant="secondary" size="sm">Export Report</Button>
        </div>

        <FilterPanel
          search={search}
          onSearch={setSearch}
          searchPlaceholder="Search employee or reason"
          groups={[
            {
              id: 'status',
              label: 'Status',
              value: statusFilter,
              options: [
                { value: 'all', label: 'All Statuses' },
                { value: 'Pending', label: 'Pending' },
                { value: 'Partially Recovered', label: 'Partially Recovered' },
                { value: 'Recovered', label: 'Recovered' },
              ],
            },
          ]}
          onChange={(_, value) => setStatusFilter(value)}
          onClear={() => {
            setStatusFilter('all')
            setSearch('')
          }}
          actions={<Button variant="secondary" size="sm">Export Report</Button>}
        />

        {filtered.length === 0 ? (
          <EmptyState title="No advance records" description="Adjust filters to view advance information." />
        ) : (
          <Table columns={columns} data={filtered} />
        )}
      </Card>
    </div>
  )
}
