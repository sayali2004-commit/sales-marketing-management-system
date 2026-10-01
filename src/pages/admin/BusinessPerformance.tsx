import { useMemo } from 'react'
import { Briefcase, TrendingUp, Users } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { StatCard } from '../../components/ui/StatCard'
import { Badge } from '../../components/ui/Badge'
import { Card, CardHeader } from '../../components/ui/Card'
import { Table, type Column } from '../../components/ui/Table'
import { MultiLineChart, GroupedBarChart } from '../../components/charts/Charts'
import { employeeName, formatCurrency, businessMonthlyTrend } from '../../data/sampleData'

export function BusinessPerformance() {
  const { businessRecords } = useApp()

  const rows = useMemo(
    () =>
      businessRecords.map((b) => {
        const rate = b.leadsGenerated ? Math.round((b.leadsConverted / b.leadsGenerated) * 100) : 0
        const totalCost = b.salaryCost + b.travelExpense
        return { ...b, rate, totalCost }
      }),
    [businessRecords],
  )

  const totals = useMemo(
    () => ({
      leads: rows.reduce((s, r) => s + r.leadsGenerated, 0),
      converted: rows.reduce((s, r) => s + r.leadsConverted, 0),
      visits: rows.reduce((s, r) => s + r.visits, 0),
      success: rows.reduce((s, r) => s + r.successfulVisits, 0),
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
    {
      key: 'advanceAmount',
      header: 'Advance',
      className: 'whitespace-nowrap',
      hideOnMobile: true,
      render: (r) => <span className="text-slate-600">{formatCurrency(r.advanceAmount)}</span>,
    },
  ]

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Business Performance</h1>
          <p className="text-sm text-slate-500 mt-1">
            Business Generated is the revenue value from converted leads. Business Benefit is business generated minus relevant employee salary cost and travel expense.
          </p>
        </div>
        <ButtonExport />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard title="Total Leads" value={totals.leads} icon={Users} accent="blue" />
        <StatCard title="Converted Leads" value={totals.converted} icon={TrendingUp} accent="emerald" />
        <StatCard title="Business Generated" value={formatCurrency(totals.generated)} icon={Briefcase} accent="violet" />
        <StatCard title="Business Benefit" value={formatCurrency(totals.benefit)} icon={TrendingUp} accent="cyan" subtitle="After salary and travel cost" />
        <StatCard title="Total Visits" value={totals.visits} icon={Users} accent="amber" />
        <StatCard title="Successful Visits" value={totals.success} icon={TrendingUp} accent="emerald" />
        <StatCard title="Travel Expense" value={formatCurrency(totals.travel)} icon={Briefcase} accent="rose" />
        <StatCard title="Salary Cost" value={formatCurrency(totals.salary)} icon={Briefcase} accent="rose" />
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
        <CardHeader title="Employee Business Performance" subtitle="Leads, visits, business generated, benefit and costs" />
        <Table columns={columns} data={rows} />
      </Card>

      <Card className="mt-6">
        <CardHeader title="Calculation Notes" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="p-4 bg-brand-50 rounded-xl">
            <p className="font-semibold text-brand-800">Business Generated</p>
            <p className="text-brand-700 text-xs mt-1">Sum of converted lead business values for the employee.</p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-xl">
            <p className="font-semibold text-emerald-800">Business Benefit</p>
            <p className="text-emerald-700 text-xs mt-1">Business Generated minus salary cost and travel expense. This is not the same as net company profit.</p>
          </div>
          <div className="p-4 bg-rose-50 rounded-xl">
            <p className="font-semibold text-rose-800">Employee Cost</p>
            <p className="text-rose-700 text-xs mt-1">Salary cost plus travel expense. Advance amount is shown separately for reference.</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

function ButtonExport() {
  return (
    <button className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50">
      Export Performance Report
    </button>
  )
}
