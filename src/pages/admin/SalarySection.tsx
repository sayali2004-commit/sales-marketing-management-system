import { useMemo, useState } from 'react'
import { CheckCircle2, Clock, Wallet } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { StatCard } from '../../components/ui/StatCard'
import { StatusBadge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Select } from '../../components/ui/FormControls'
import { Table, type Column } from '../../components/ui/Table'
import { EmptyState } from '../../components/ui/States'
import { FilterPanel } from '../../components/ui/FilterPanel'
import { employeeName, formatCurrency, monthLabel } from '../../data/sampleData'
import type { SalaryRecord } from '../../types'

export function SalarySection() {
  const { salaryRecords } = useApp()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const months = useMemo(() => Array.from(new Set(salaryRecords.map((r) => r.salaryMonth))).sort().reverse(), [salaryRecords])
  const [monthFilter, setMonthFilter] = useState('all')

  const filtered = useMemo(() => {
    return salaryRecords.filter((r) => {
      const q = search.toLowerCase()
      const matchQ = !q || employeeName(r.employeeId).toLowerCase().includes(q)
      const matchStatus = statusFilter === 'all' || r.status === statusFilter
      const matchMonth = monthFilter === 'all' || r.salaryMonth === monthFilter
      return matchQ && matchStatus && matchMonth
    })
  }, [salaryRecords, search, statusFilter, monthFilter])

  const stats = useMemo(() => {
    const totalPaid = salaryRecords.reduce((s, r) => s + r.paidAmount, 0)
    const totalPending = salaryRecords.reduce((s, r) => s + r.pendingAmount, 0)
    return { totalPaid, totalPending }
  }, [salaryRecords])

  const columns: Column<SalaryRecord>[] = [
    {
      key: 'employeeId',
      header: 'Employee Name',
      render: (r) => <span className="font-medium text-slate-800">{employeeName(r.employeeId)}</span>,
    },
    { key: 'salaryMonth', header: 'Salary Month', render: (r) => <span className="text-slate-700">{monthLabel(r.salaryMonth)}</span> },
    {
      key: 'salaryAmount',
      header: 'Salary Amount',
      className: 'whitespace-nowrap',
      render: (r) => <span className="text-slate-800">{formatCurrency(r.salaryAmount)}</span>,
    },
    {
      key: 'paidAmount',
      header: 'Paid Amount',
      className: 'whitespace-nowrap',
      render: (r) => <span className="font-medium text-emerald-700">{formatCurrency(r.paidAmount)}</span>,
    },
    {
      key: 'pendingAmount',
      header: 'Pending Amount',
      className: 'whitespace-nowrap',
      render: (r) => (
        <span className={r.pendingAmount > 0 ? 'font-medium text-rose-600' : 'text-slate-500'}>
          {formatCurrency(r.pendingAmount)}
        </span>
      ),
    },
    {
      key: 'paymentDate',
      header: 'Payment Date',
      hideOnMobile: true,
      render: (r) => <span className="text-slate-600">{r.paymentDate || 'Not paid'}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => (
        <div className="flex items-center gap-1">
          {r.status === 'Paid' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Clock className="w-3.5 h-3.5 text-amber-600" />}
          <StatusBadge status={r.status} />
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (r) => (
        <Button size="sm" variant="secondary" disabled={r.status === 'Paid'}>
          {r.status === 'Paid' ? 'Paid' : 'Mark Paid'}
        </Button>
      ),
    },
  ]

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        <StatCard title="Total Salary Paid" value={formatCurrency(stats.totalPaid)} icon={CheckCircle2} accent="emerald" />
        <StatCard title="Total Pending" value={formatCurrency(stats.totalPending)} icon={Clock} accent="amber" />
        <StatCard title="Records" value={salaryRecords.length} icon={Wallet} accent="blue" />
      </div>

      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
          <h3 className="text-base font-semibold text-slate-900">Salary Records</h3>
          <Button variant="secondary" size="sm">Export Report</Button>
        </div>

        <FilterPanel
          search={search}
          onSearch={setSearch}
          searchPlaceholder="Search by employee"
          groups={[
            {
              id: 'status',
              label: 'Status',
              value: statusFilter,
              options: [
                { value: 'all', label: 'All Statuses' },
                { value: 'Paid', label: 'Paid' },
                { value: 'Partial', label: 'Partial' },
                { value: 'Pending', label: 'Pending' },
              ],
            },
            {
              id: 'month',
              label: 'Month',
              value: monthFilter,
              options: [{ value: 'all', label: 'All Months' }, ...months.map((m) => ({ value: m, label: monthLabel(m) }))],
            },
          ]}
          onChange={(id, value) => {
            if (id === 'status') setStatusFilter(value)
            if (id === 'month') setMonthFilter(value)
          }}
          onClear={() => {
            setStatusFilter('all')
            setMonthFilter('all')
            setSearch('')
          }}
          actions={<Button variant="secondary" size="sm">Export Report</Button>}
        />

        {filtered.length === 0 ? (
          <EmptyState title="No salary records" description="Adjust filters to view salary information." />
        ) : (
          <Table columns={columns} data={filtered} />
        )}
      </Card>
    </div>
  )
}
