import { useMemo } from 'react'
import { Briefcase, TrendingUp, Users } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { StatCard } from '../../components/ui/StatCard'
import { Badge } from '../../components/ui/Badge'
import { Card, CardHeader } from '../../components/ui/Card'
import { Table, type Column } from '../../components/ui/Table'
import { MultiLineChart, GroupedBarChart } from '../../components/charts/Charts'
import { employeeName, formatCurrency, businessMonthlyTrend } from '../../data/sampleData'

export function AdminBusinessPerformance() {
  const { businessRecords } = useApp()

  const rows = useMemo(
    () =>
      businessRecords.map((b) => {
        const rate = b.leadsGenerated ? Math.round((b.leadsConverted / b.leadsGenerated) * 100) : 0
        return { ...b, rate }
      }),
    [businessRecords],
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

  const columns: Column<(typeof rows)[number]>[] = [
    {
      key: 'employeeId',
      header: 'Employee',
      render: (r) => <span className="font-medium text-slate-800">{employeeName(r.employeeId)}</span>,
    },
    { key: 'leadsGenerated', header: 'Leads Generated', className: 'whitespace-nowrap' },
    { key: 'leadsConverted', header: 'Leads Converted', className: 'whitespace-nowrap' },
    {
      key: 'rate',
      header: 'Conversion Rate',
      render: (r) => <Badge tone={r.rate >= 40 ? 'emerald' : r.rate >= 20 ? 'amber' : 'slate'}>{r.rate}%</Badge>,
    },
    { key: 'visits', header: 'Visits' },
    { key: 'successfulVisits', header: 'Successful Visits' },
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
    {
      key: 'travelExpense',
      header: 'Travel Expense',
      className: 'whitespace-nowrap',
      render: (r) => <span className="text-rose-600">{formatCurrency(r.travelExpense)}</span>,
    },
    {
      key: 'salaryCost',
      header: 'Salary Cost',
      className: 'whitespace-nowrap',
      render: (r) => <span className="text-rose-600">{formatCurrency(r.salaryCost)}</span>,
    },
  ]

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard title="Total Leads" value={totals.leads} icon={Users} accent="blue" />
        <StatCard title="Converted Leads" value={totals.converted} icon={TrendingUp} accent="emerald" />
        <StatCard title="Business Generated" value={formatCurrency(totals.generated)} icon={Briefcase} accent="violet" />
        <StatCard title="Business Benefit" value={formatCurrency(totals.benefit)} icon={TrendingUp} accent="cyan" subtitle="After salary and travel cost" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader title="Business Generated vs Benefit" subtitle="Monthly company trend" />
          <MultiLineChart
            data={businessMonthlyTrend}
            series={[
              { key: 'generated', name: 'Business Generated', color: '#2547ec' },
              { key: 'benefit', name: 'Business Benefit', color: '#10b981' },
            ]}
          />
        </Card>
        <Card>
          <CardHeader title="Top Employee Business Generated" subtitle="Comparison across team members" />
          <GroupedBarChart
            data={rows.slice().sort((a, b) => b.businessGenerated - a.businessGenerated).slice(0, 8).map((r) => ({
              name: employeeName(r.employeeId).split(' ')[0],
              generated: r.businessGenerated,
              benefit: r.businessBenefit,
            }))}
            keys={['generated', 'benefit']}
            colors={['#2547ec', '#10b981']}
          />
        </Card>
      </div>

      <Card>
        <CardHeader title="Employee Business Performance" subtitle="Business Generated is converted lead value. Business Benefit is business generated minus salary cost and travel expense." />
        <Table columns={columns} data={rows} />
      </Card>
    </div>
  )
}
