import { useMemo } from 'react'
import { ArrowLeftRight, ArrowRight, Briefcase, Building2, CheckCircle2, CircleDollarSign, Clock, MapPin, Navigation, Receipt, Target, TrendingUp, UserCheck, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { StatCard } from '../../components/ui/StatCard'
import { Card, CardHeader } from '../../components/ui/Card'
import { GroupedBarChart, MultiLineChart, PieDonutChart, SimpleBarChart } from '../../components/charts/Charts'
import {
  businessMonthlyTrend,
  employeeName,
  formatCurrency,
  formatNumber,
  leadSourceDistribution,
} from '../../data/sampleData'
import { StatusBadge } from '../../components/ui/Badge'
import { Table, type Column } from '../../components/ui/Table'

export function CompanyOverview() {
  const { employees, leads, visits, travelRecords, salaryRecords, advanceRecords, businessRecords } = useApp()

  const stats = useMemo(() => {
    const salesMkt = employees.filter((e) => e.role !== 'admin' && e.department.toLowerCase().includes('sales') || e.department.toLowerCase().includes('marketing') || e.department === 'Sales' || e.department === 'Marketing')
    const newLeads = leads.filter((l) => l.status === 'New').length
    const converted = leads.filter((l) => l.status === 'Converted').length
    const nonConverted = leads.filter((l) => l.status === 'Not Converted' || l.status === 'Closed').length
    const completedVisits = visits.filter((v) => v.status === 'Completed').length
    const upcomingVisits = visits.filter((v) => v.status === 'Scheduled').length
    const totalDistance = travelRecords.reduce((s, t) => s + t.distance, 0)
    const totalTravel = travelRecords.reduce((s, t) => s + t.totalAmount, 0)
    const salaryPaid = salaryRecords.reduce((s, r) => s + r.paidAmount, 0)
    const advanceGiven = advanceRecords.reduce((s, a) => s + a.advanceAmount, 0)
    const businessGenerated = businessRecords.reduce((s, b) => s + b.businessGenerated, 0)
    const businessBenefit = businessRecords.reduce((s, b) => s + b.businessBenefit, 0)
    return {
      totalEmployees: employees.length,
      salesMktEmployees: salesMkt.length,
      totalLeads: leads.length,
      newLeads,
      converted,
      nonConverted,
      totalVisits: visits.length,
      completedVisits,
      upcomingVisits,
      totalDistance,
      totalTravel,
      salaryPaid,
      advanceGiven,
      businessGenerated,
      businessBenefit,
    }
  }, [employees, leads, visits, travelRecords, salaryRecords, advanceRecords, businessRecords])

  const sourceData = useMemo(
    () =>
      leadSourceDistribution.map((s) => ({
        name: s.name,
        generated: s.value,
        converted: leads.filter((l) => l.leadSource === s.name && l.status === 'Converted').length,
      })),
    [leads],
  )

  const recentLeads = useMemo(() => leads.slice(0, 8), [leads])
  const leadColumns: Column<(typeof recentLeads)[number]>[] = [
    { key: 'leadId', header: 'Lead ID', render: (r) => <span className="font-medium text-slate-900">{r.leadId}</span> },
    {
      key: 'customerName',
      header: 'Customer',
      render: (r) => (
        <div>
          <p className="font-medium text-slate-800">{r.customerName}</p>
          <p className="text-xs text-slate-400">{r.product}</p>
        </div>
      ),
    },
    {
      key: 'leadValue',
      header: 'Value',
      render: (r) => <span className="font-medium text-slate-800">{formatCurrency(r.leadValue)}</span>,
    },
    {
      key: 'assignedEmployeeId',
      header: 'Assigned',
      hideOnMobile: true,
      render: (r) => <span className="text-slate-600">{employeeName(r.assignedEmployeeId)}</span>,
    },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  ]

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-accent-600 p-5 sm:p-6 mb-6 shadow-glow">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.35) 0%, transparent 40%), radial-gradient(circle at 10% 80%, rgba(255,255,255,0.15) 0%, transparent 35%)',
          }}
          aria-hidden
        />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Company Overview
            </h1>
            <p className="text-sm text-white/80 mt-1">
              Complete Sales and Marketing department performance at a glance.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/70 hidden sm:inline">Updated just now</span>
            <Link to="/admin/reports">
              <button className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl bg-white/95 text-brand-700 hover:bg-white transition-colors shadow-soft">
                View Reports <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard title="Total Employees" value={formatNumber(stats.totalEmployees)} icon={Users} accent="blue" />
        <StatCard title="Sales and Marketing" value={formatNumber(stats.salesMktEmployees)} icon={Briefcase} accent="violet" />
        <StatCard title="Total Leads" value={formatNumber(stats.totalLeads)} icon={Target} accent="cyan" />
        <StatCard title="Converted Leads" value={formatNumber(stats.converted)} icon={CheckCircle2} accent="emerald" />
        <StatCard title="Total Visits" value={formatNumber(stats.totalVisits)} icon={MapPin} accent="blue" />
        <StatCard title="Travel Expense" value={formatCurrency(stats.totalTravel)} icon={Receipt} accent="rose" />
        <StatCard title="Business Generated" value={formatCurrency(stats.businessGenerated)} icon={TrendingUp} accent="emerald" />
        <StatCard
          title="Business Benefit"
          value={formatCurrency(stats.businessBenefit)}
          icon={UserCheck}
          accent={stats.businessBenefit > 0 ? 'emerald' : 'rose'}
          subtitle={stats.businessBenefit > 0 ? 'Beneficial for company' : 'Needs attention'}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <Card className="xl:col-span-2">
          <CardHeader title="Business Generated vs Benefit" subtitle="Monthly trend of business generated and business benefit" />
          <MultiLineChart
            data={businessMonthlyTrend}
            series={[
              { key: 'generated', name: 'Business Generated', color: '#4f46e5' },
              { key: 'benefit', name: 'Business Benefit', color: '#10b981' },
            ]}
          />
        </Card>
        <Card>
          <CardHeader title="Lead Source Distribution" subtitle="Leads generated by source" />
          <PieDonutChart data={leadSourceDistribution} />
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <Card className="xl:col-span-2">
          <CardHeader title="Lead Pipeline by Source" subtitle="Generated versus converted leads across sources" />
          <GroupedBarChart data={sourceData} keys={['generated', 'converted']} colors={['#4f46e5', '#10b981']} />
        </Card>
        <Card>
          <CardHeader title="Department Snapshot" subtitle="Current department metrics" />
          <div className="space-y-4">
            {[
              { label: 'Leads Converted', value: `${stats.converted} of ${stats.totalLeads}`, pct: Math.round((stats.converted / Math.max(1, stats.totalLeads)) * 100) },
              { label: 'Visits Completed', value: `${stats.completedVisits} of ${stats.totalVisits}`, pct: Math.round((stats.completedVisits / Math.max(1, stats.totalVisits)) * 100) },
              { label: 'Travel Claims Approved', value: `${travelRecords.filter((t) => t.approvalStatus === 'Approved').length} of ${travelRecords.length}`, pct: Math.round((travelRecords.filter((t) => t.approvalStatus === 'Approved').length / Math.max(1, travelRecords.length)) * 100) },
            ].map((row) => (
              <div key={row.label}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-slate-600 dark:text-slate-400">{row.label}</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-800">{row.value}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all"
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
              </div>
            ))}
            <div className="pt-2">
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Business benefit is calculated as business generated minus relevant employee salary cost and travel expense.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Recent Leads" subtitle="Latest leads across the company" action={<Link to="/admin/leads" className="text-sm text-brand-600 hover:text-brand-700 font-medium">View all</Link>} />
        <Table columns={leadColumns} data={recentLeads} />
      </Card>

      <Card className="mt-6">
        <CardHeader title="Business Trend" subtitle="Monthly business generated values" />
        <SimpleBarChart data={businessMonthlyTrend} dataKey="generated" color="#4f46e5" height={240} />
      </Card>

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard title="Building" value="SalesCore HQ" icon={Building2} accent="blue" />
        <StatCard title="Active Travel Claims" value={String(travelRecords.filter((t) => t.approvalStatus === 'Pending').length)} icon={Receipt} accent="amber" />
        <StatCard title="Open Advances" value={String(advanceRecords.filter((a) => a.status !== 'Recovered').length)} icon={CircleDollarSign} accent="rose" />
        <StatCard title="Benefit Ratio" value={`${Math.round((stats.businessBenefit / Math.max(1, stats.businessGenerated)) * 100)}%`} icon={TrendingUp} accent="emerald" subtitle="Benefit to generated" />
      </div>
    </div>
  )
}
