import { useMemo } from 'react'
import { Briefcase, TrendingUp, Users } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { StatCard } from '../../components/ui/StatCard'
import { Badge } from '../../components/ui/Badge'
import { Card, CardHeader } from '../../components/ui/Card'
import { Table, type Column } from '../../components/ui/Table'
import { GroupedBarChart, MultiLineChart } from '../../components/charts/Charts'
import { businessMonthlyTrend, employeeName, formatCurrency } from '../../data/sampleData'

export function BusinessPerformance() {
  const { businessRecords } = useApp()
  const teamIds = ['emp-004', 'emp-005', 'emp-006', 'emp-007', 'emp-011']

  const rows = useMemo(
    () =>
      teamIds.map((id) => {
        const b = businessRecords.find((x) => x.employeeId === id)
        return b ? { ...b, rate: b.leadsGenerated ? Math.round((b.leadsConverted / b.leadsGenerated) * 100) : 0 } : null
      }).filter((r): r is (typeof businessRecords)[number] & { rate: number } => Boolean(r)),
    [businessRecords, teamIds],
  )

  const totals = useMemo(
    () => ({
      leads: rows.reduce((s, r) => s + r.leadsGenerated, 0),
      converted: rows.reduce((s, r) => s + r.leadsConverted, 0),
      generated: rows.reduce((s, r) => s + r.businessGenerated, 0),
      benefit: rows.reduce((s, r) => s + r.businessBenefit, 0),
      travel: rows.reduce((s, r) => s + r.travelExpense, 0),
      salary: rows.reduce((s, r) => s + r.salaryCost, 0),
    }),
    [rows],
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Team Business Performance</h1>
        <p className="text-sm text-slate-500 mt-1">
          Business Generated is converted lead value. Business Benefit is business generated minus salary cost and travel expense.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        <StatCard title="Team Leads" value={totals.leads} icon={Users} accent="blue" />
        <StatCard title="Team Conversions" value={totals.converted} icon={TrendingUp} accent="emerald" />
        <StatCard title="Team Business Generated" value={formatCurrency(totals.generated)} icon={Briefcase} accent="violet" />
        <StatCard title="Team Business Benefit" value={formatCurrency(totals.benefit)} icon={TrendingUp} accent="cyan" />
        <StatCard title="Travel Expense" value={formatCurrency(totals.travel)} icon={Briefcase} accent="rose" />
        <StatCard title="Salary Cost" value={formatCurrency(totals.salary)} icon={Briefcase} accent="rose" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader title="Business Generated vs Benefit" subtitle="Team monthly trend" />
          <MultiLineChart
            data={businessMonthlyTrend}
            series={[
              { key: 'generated', name: 'Business Generated', color: '#2547ec' },
              { key: 'benefit', name: 'Business Benefit', color: '#10b981' },
            ]}
          />
        </Card>
        <Card>
          <CardHeader title="Employee Business Generated" subtitle="Converted lead value by team member" />
          <GroupedBarChart
            data={rows.map((r) => ({
              name: employeeName(r.employeeId).split(' ')[0],
              generated: r.businessGenerated,
              benefit: r.businessBenefit,
            }))}
            keys={['generated', 'benefit']}
          />
        </Card>
      </div>

      <Card>
        <CardHeader title="Employee Business Detail" subtitle="Leads, visits, generated value, benefit and costs" />
        <Table
          columns={[
            {
              key: 'employeeId',
              header: 'Employee',
              render: (r: (typeof rows)[number]) => <span className="font-medium text-slate-800">{employeeName(r.employeeId)}</span>,
            },
            { key: 'leadsGenerated', header: 'Leads Generated' },
            { key: 'leadsConverted', header: 'Leads Converted' },
            {
              key: 'rate',
              header: 'Conversion Rate',
              render: (r: (typeof rows)[number]) => <Badge>{r.rate}%</Badge>,
            },
            { key: 'visits', header: 'Visits' },
            { key: 'successfulVisits', header: 'Successful Visits' },
            {
              key: 'businessGenerated',
              header: 'Business Generated',
              render: (r: (typeof rows)[number]) => <span className="font-semibold text-slate-900">{formatCurrency(r.businessGenerated)}</span>,
            },
            {
              key: 'businessBenefit',
              header: 'Business Benefit',
              render: (r: (typeof rows)[number]) => <span className="font-medium text-emerald-700">{formatCurrency(r.businessBenefit)}</span>,
            },
            {
              key: 'travelExpense',
              header: 'Travel Expense',
              render: (r: (typeof rows)[number]) => <span className="text-rose-600">{formatCurrency(r.travelExpense)}</span>,
            },
            {
              key: 'salaryCost',
              header: 'Salary Cost',
              render: (r: (typeof rows)[number]) => <span className="text-rose-600">{formatCurrency(r.salaryCost)}</span>,
            },
            {
              key: 'advanceAmount',
              header: 'Advance',
              render: (r: (typeof rows)[number]) => <span className="text-slate-600">{formatCurrency(r.advanceAmount)}</span>,
            },
          ]}
          data={rows}
        />
      </Card>
    </div>
  )
}
