import { useMemo } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  MapPin,
  Navigation,
  Target,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { StatCard } from '../../components/ui/StatCard'
import { Card, CardHeader } from '../../components/ui/Card'
import { StatusBadge } from '../../components/ui/Badge'
import { Table, type Column } from '../../components/ui/Table'
import { TodaySchedule } from '../../components/sections/ScheduleSection'
import { MultiLineChart } from '../../components/charts/Charts'
import { businessMonthlyTrend, employeeName, formatCurrency } from '../../data/sampleData'

export function EmployeeDashboard() {
  const { currentUser, leads, visits, travelRecords, businessRecords, scheduleItems } = useApp()
  const empId = currentUser?.id || 'emp-004'

  const myLeads = useMemo(() => leads.filter((l) => l.assignedEmployeeId === empId), [leads, empId])
  const myVisits = useMemo(() => visits.filter((v) => v.employeeId === empId), [visits, empId])
  const myTravel = useMemo(() => travelRecords.filter((t) => t.employeeId === empId), [travelRecords, empId])
  const myBiz = useMemo(() => businessRecords.find((b) => b.employeeId === empId), [businessRecords, empId])
  const mySchedule = useMemo(() => scheduleItems.filter((s) => s.employeeId === empId), [scheduleItems, empId])

  const stats = useMemo(() => {
    const converted = myLeads.filter((l) => l.status === 'Converted')
    return {
      total: myLeads.length,
      newLeads: myLeads.filter((l) => l.status === 'New').length,
      converted: converted.length,
      pending: myLeads.filter((l) => !['Converted', 'Not Converted', 'Closed'].includes(l.status)).length,
      visits: myVisits.length,
      upcoming: myVisits.filter((v) => v.status === 'Scheduled').length,
      completed: myVisits.filter((v) => v.status === 'Completed').length,
      travelDistance: myTravel.reduce((s, t) => s + t.distance, 0),
      travelAllowance: myTravel.reduce((s, t) => s + t.totalAmount, 0),
      businessGenerated: myBiz?.businessGenerated || converted.reduce((s, l) => s + (l.conversionValue || l.leadValue), 0),
      businessBenefit: myBiz?.businessBenefit || 0,
      schedule: mySchedule.length,
    }
  }, [myLeads, myVisits, myTravel, myBiz, mySchedule])

  const leadColumns: Column<(typeof myLeads)[number]>[] = [
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
      className: 'whitespace-nowrap',
      render: (r) => <span className="font-medium text-slate-800">{formatCurrency(r.leadValue)}</span>,
    },
    {
      key: 'followUpDate',
      header: 'Follow-up',
      hideOnMobile: true,
      render: (r) => <span className="text-slate-600">{r.followUpDate || 'Not scheduled'}</span>,
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
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">My Dashboard</h1>
            <p className="text-sm text-white/80 mt-1">
              Personal performance overview for {employeeName(empId)}.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/15 text-white text-xs font-semibold border border-white/20">
              {currentUser?.title || 'Sales Executive'}
            </span>
            <Link to="/employee/leads">
              <button className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl bg-white/95 text-brand-700 hover:bg-white transition-colors shadow-soft">
                My Leads <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3 mb-6">
        <StatCard title="My Leads" value={stats.total} icon={Target} accent="blue" />
        <StatCard title="New Leads" value={stats.newLeads} icon={Target} accent="cyan" />
        <StatCard title="Converted Leads" value={stats.converted} icon={CheckCircle2} accent="emerald" />
        <StatCard title="Pending Leads" value={stats.pending} icon={Clock} accent="amber" />
        <StatCard title="My Visits" value={stats.visits} icon={MapPin} accent="violet" />
        <StatCard title="Upcoming Visits" value={stats.upcoming} icon={Clock} accent="amber" />
        <StatCard title="Completed Visits" value={stats.completed} icon={CheckCircle2} accent="emerald" />
        <StatCard title="My Travel" value={`${stats.travelDistance} KM`} icon={Navigation} accent="cyan" />
        <StatCard title="Travel Allowance" value={formatCurrency(stats.travelAllowance)} icon={Wallet} accent="rose" />
        <StatCard title="My Business Generated" value={formatCurrency(stats.businessGenerated)} icon={TrendingUp} accent="emerald" />
        <StatCard title="My Business Benefit" value={formatCurrency(stats.businessBenefit)} icon={TrendingUp} accent="violet" subtitle="After employee cost" />
        <StatCard title="My Schedule" value={stats.schedule} icon={Clock} accent="blue" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <Card className="xl:col-span-2">
          <CardHeader title="My Business Trend" subtitle="Business generated and business benefit over time" />
          <MultiLineChart
            data={businessMonthlyTrend}
            series={[
              { key: 'generated', name: 'Business Generated', color: '#4f46e5' },
              { key: 'benefit', name: 'Business Benefit', color: '#10b981' },
            ]}
          />
        </Card>
        <TodaySchedule items={scheduleItems} employeeId={empId} />
      </div>

      <Card>
        <CardHeader
          title="My Recent Leads"
          subtitle="Leads currently assigned to you"
          action={<Link to="/employee/leads" className="text-sm text-brand-600 hover:text-brand-700 font-medium">View all</Link>}
        />
        <Table columns={leadColumns} data={myLeads.slice(0, 8)} />
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
        {[
          { label: 'My Visits', to: '/employee/visits' },
          { label: 'My Travel', to: '/employee/travel' },
          { label: 'My Schedule', to: '/employee/schedule' },
          { label: 'Workspace', to: '/employee/workspace' },
        ].map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="group flex items-center justify-between p-4 bg-surface rounded-2xl border border-slate-200 dark:border-slate-700 shadow-card hover:shadow-card-hover hover:border-brand-300 dark:hover:border-brand-700 transition-all hover:-translate-y-0.5"
          >
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{link.label}</p>
            <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  )
}
