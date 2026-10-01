import { useMemo, useState } from 'react'
import { HandCoins, TrendingUp, Wallet } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { StatCard } from '../../components/ui/StatCard'
import { StatusBadge } from '../../components/ui/Badge'
import { Card, CardHeader } from '../../components/ui/Card'
import { Table, type Column } from '../../components/ui/Table'
import { EmptyState } from '../../components/ui/States'
import { formatCurrency } from '../../data/sampleData'
import type { AdvanceRecord } from '../../types'

export function MyAdvance() {
  const { currentUser, advanceRecords } = useApp()
  const empId = currentUser?.id || 'emp-004'
  const myAdvances = useMemo(() => advanceRecords.filter((a) => a.employeeId === empId), [advanceRecords, empId])

  const stats = useMemo(() => {
    const total = myAdvances.reduce((s, a) => s + a.advanceAmount, 0)
    const recovered = myAdvances.reduce((s, a) => s + a.recoveredAmount, 0)
    const pending = myAdvances.reduce((s, a) => s + a.pendingAmount, 0)
    return { total, recovered, pending }
  }, [myAdvances])

  const columns: Column<AdvanceRecord>[] = [
    {
      key: 'advanceAmount',
      header: 'Advance Amount',
      className: 'whitespace-nowrap',
      render: (r) => <span className="font-medium text-slate-900">{formatCurrency(r.advanceAmount)}</span>,
    },
    { key: 'advanceDate', header: 'Advance Date', className: 'whitespace-nowrap', render: (r) => <span className="text-slate-600">{r.advanceDate}</span> },
    { key: 'reason', header: 'Reason', render: (r) => <span className="text-slate-700">{r.reason}</span> },
    {
      key: 'recoveredAmount',
      header: 'Recovered Amount',
      className: 'whitespace-nowrap',
      render: (r) => <span className="text-emerald-700">{formatCurrency(r.recoveredAmount)}</span>,
    },
    {
      key: 'pendingAmount',
      header: 'Pending Amount',
      className: 'whitespace-nowrap',
      render: (r) => <span className="font-medium text-rose-600">{formatCurrency(r.pendingAmount)}</span>,
    },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">My Advance</h1>
        <p className="text-sm text-slate-500 mt-1">Your advance amounts, recoveries and pending balances.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Wallet className="w-6 h-6" />
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
        <StatCard title="Current Advances" value={myAdvances.length} icon={Wallet} accent="blue" />
        <StatCard title="Recovered" value={myAdvances.filter((a) => a.status === 'Recovered').length} icon={TrendingUp} accent="emerald" />
        <StatCard title="Pending Recovery" value={myAdvances.filter((a) => a.status !== 'Recovered').length} icon={HandCoins} accent="amber" />
      </div>

      <Card>
        <CardHeader title="My Advance Records" subtitle="All advances issued to you" />
        {myAdvances.length === 0 ? (
          <EmptyState title="No advances" description="You do not have any advance records at this time." />
        ) : (
          <Table columns={columns} data={myAdvances} />
        )}
      </Card>
    </div>
  )
}
