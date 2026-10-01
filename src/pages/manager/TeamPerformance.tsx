import { useMemo } from 'react'
import { Users } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { StatCard } from '../../components/ui/StatCard'
import { Badge } from '../../components/ui/Badge'
import { Card, CardHeader } from '../../components/ui/Card'
import { Table, type Column } from '../../components/ui/Table'
import { GroupedBarChart, SimpleBarChart } from '../../components/charts/Charts'
import { employeeName, formatCurrency } from '../../data/sampleData'

export function TeamPerformance() {
  const { leads, visits, travelRecords, businessRecords, scheduleItems } = useApp()
  const teamIds = ['emp-004', 'emp-005', 'emp-006', 'emp-007', 'emp-011']

  const rows = useMemo(
    () =>
      teamIds.map((id) => {
        const tLeads = leads.filter((l) => l.assignedEmployeeId === id)
        const converted = tLeads.filter((l) => l.status === 'Converted').length
        const pending = tLeads.filter((l) => !['Converted', 'Not Converted', 'Closed'].includes(l.status)).length
        const tVisits = visits.filter((v) => v.employeeId === id)
        const success = tVisits.filter((v) => v.outcome === 'Successful' || v.outcome === 'Converted').length
        const tTravel = travelRecords.filter((t) => t.employeeId === id)
        const biz = businessRecords.find((b) => b.employeeId === id)
        const completedTasks = scheduleItems.filter((s) => s.employeeId === id && s.status === 'Completed').length

        return {
          id,
          name: employeeName(id),
          leadsGenerated: tLeads.length,
          leadsConverted: converted,
          conversionRate: tLeads.length ? Math.round((converted / tLeads.length) * 100) : 0,
          visits: tVisits.length,
          successfulVisits: success,
          travelDistance: tTravel.reduce((s, t) => s + t.distance, 0),
          travelExpense: tTravel.reduce((s, t) => s + t.totalAmount, 0),
          businessGenerated: biz?.businessGenerated || 0,
          businessBenefit: biz?.businessBenefit || 0,
          pendingLeads: pending,
          completedTasks,
        }
      }),
    [leads, visits, travelRecords, businessRecords, scheduleItems],
  )

  const columns: Column<(typeof rows)[number]>[] = [
    {
      key: 'name',
      header: 'Employee',
      render: (r) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-semibold">
            {r.name.split(' ').map((p) => p[0]).join('').slice(0, 2)}
          </div>
          <span className="font-medium text-slate-800">{r.name}</span>
        </div>
      ),
    },
    { key: 'leadsGenerated', header: 'Leads Generated', className: 'whitespace-nowrap' },
    { key: 'leadsConverted', header: 'Leads Converted', className: 'whitespace-nowrap' },
    {
      key: 'conversionRate',
      header: 'Conversion Rate',
      render: (r) => <Badge tone={r.conversionRate >= 40 ? 'emerald' : r.conversionRate >= 20 ? 'amber' : 'slate'}>{r.conversionRate}%</Badge>,
    },
    { key: 'visits', header: 'Visits' },
    { key: 'successfulVisits', header: 'Successful Visits' },
    { key: 'travelDistance', header: 'Travel Distance', className: 'whitespace-nowrap', render: (r) => <span>{r.travelDistance} KM</span> },
    {
      key: 'travelExpense',
      header: 'Travel Expense',
      className: 'whitespace-nowrap',
      render: (r) => <span className="text-rose-600">{formatCurrency(r.travelExpense)}</span>,
    },
    {
      key: 'businessGenerated',
      header: 'Business Generated',
      className: 'whitespace-nowrap',
      render: (r) => <span className="font-semibold text-slate-900">{formatCurrency(r.businessGenerated)}</span>,
    },
    {
      key: 'businessBenefit',
      header: 'Business Benefit',
      className: 'whitespace-nowrap',
      render: (r) => <span className="font-medium text-emerald-700">{formatCurrency(r.businessBenefit)}</span>,
    },
    { key: 'pendingLeads', header: 'Pending Leads' },
    { key: 'completedTasks', header: 'Completed Tasks' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Team Performance</h1>
        <p className="text-sm text-slate-500 mt-1">Compare employees on leads, conversions, visits, travel and business contribution.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard title="Team Members" value={rows.length} icon={Users} accent="blue" />
        <StatCard title="Total Leads" value={rows.reduce((s, r) => s + r.leadsGenerated, 0)} icon={Users} accent="cyan" />
        <StatCard title="Total Visits" value={rows.reduce((s, r) => s + r.visits, 0)} icon={Users} accent="violet" />
        <StatCard title="Team Business Generated" value={formatCurrency(rows.reduce((s, r) => s + r.businessGenerated, 0))} icon={Users} accent="emerald" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader title="Leads Generated vs Converted" subtitle="Employee comparison" />
          <GroupedBarChart data={rows.map((r) => ({ name: r.name.split(' ')[0], leads: r.leadsGenerated, converted: r.leadsConverted }))} keys={['leads', 'converted']} />
        </Card>
        <Card>
          <CardHeader title="Business Generated by Employee" subtitle="Converted lead business value" />
          <SimpleBarChart data={rows.map((r) => ({ name: r.name.split(' ')[0], generated: r.businessGenerated }))} dataKey="generated" />
        </Card>
      </div>

      <Card>
        <CardHeader title="Full Team Comparison" subtitle="All tracked performance metrics per employee" />
        <Table columns={columns} data={rows} />
      </Card>
    </div>
  )
}
