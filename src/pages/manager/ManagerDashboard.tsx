import { useMemo } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Navigation,
  Target,
  TrendingUp,
  Users,
  XCircle,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { StatCard } from '../../components/ui/StatCard'
import { Card, CardHeader } from '../../components/ui/Card'
import { GroupedBarChart, MultiLineChart } from '../../components/charts/Charts'
import { Badge, StatusBadge } from '../../components/ui/Badge'
import { Table, type Column } from '../../components/ui/Table'
import { businessMonthlyTrend, employeeName, formatCurrency } from '../../data/sampleData'

export function ManagerDashboard() {
  const { currentUser, leads, visits, travelRecords, businessRecords } = useApp()
  const managerId = currentUser?.id || 'emp-002'

  const teamIds = useMemo(
    () => ['emp-004', 'emp-005', 'emp-006', 'emp-007', 'emp-011'],
    [],
  )

  const teamLeads = useMemo(() => leads.filter((l) => teamIds.includes(l.assignedEmployeeId)), [leads, teamIds])
  const teamVisits = useMemo(() => visits.filter((v) => teamIds.includes(v.employeeId)), [visits, teamIds])
  const teamTravel = useMemo(() => travelRecords.filter((t) => teamIds.includes(t.employeeId)), [travelRecords, teamIds])

  const stats = useMemo(() => {
    const converted = teamLeads.filter((l) => l.status === 'Converted').length
    const pending = teamLeads.filter((l) => !['Converted', 'Not Converted', 'Closed'].includes(l.status)).length
    const generated = teamLeads.filter((l) => l.status === 'Converted').reduce((s, l) => s + (l.conversionValue || l.leadValue), 0)
    return {
      members: teamIds.length,
      leads: teamLeads.length,
      newLeads: teamLeads.filter((l) => l.status === 'New').length,
      converted,
      pending,
      visits: teamVisits.length,
      successful: teamVisits.filter((v) => v.outcome === 'Successful' || v.outcome === 'Converted').length,
      unsuccessful: teamVisits.filter((v) => v.outcome === 'Not Interested' || v.outcome === 'Not Converted').length,
      travel: teamTravel.reduce((s, t) => s + t.totalAmount, 0),
      distance: teamTravel.reduce((s, t) => s + t.distance, 0),
      businessGenerated: generated,
    }
  }, [teamLeads, teamVisits, teamTravel, teamIds])

  const teamPerf = useMemo(
    () =>
      teamIds.map((id) => {
        const tLeads = teamLeads.filter((l) => l.assignedEmployeeId === id)
        const converted = tLeads.filter((l) => l.status === 'Converted').length
        return {
          name: employeeName(id).split(' ')[0],
          leads: tLeads.length,
          converted,
          rate: tLeads.length ? Math.round((converted / tLeads.length) * 100) : 0,
        }
      }),
    [teamIds, teamLeads],
  )

  const leadColumns: Column<(typeof teamLeads)[number]>[] = [
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
      key: 'assignedEmployeeId',
      header: 'Employee',
      render: (r) => <span className="text-slate-600">{employeeName(r.assignedEmployeeId)}</span>,
    },
    {
      key: 'leadValue',
      header: 'Value',
      className: 'whitespace-nowrap',
      render: (r) => <span className="font-medium text-slate-800">{formatCurrency(r.leadValue)}</span>,
    },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  ]

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Manager Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Team performance overview for {employeeName(managerId)}.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone="violet">Sales Manager</Badge>
          <Link to="/manager/reports">
            <button className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg bg-brand-600 text-white hover:bg-brand-700">
              Team Reports <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-6">
        <StatCard title="Total Team Members" value={stats.members} icon={Users} accent="blue" />
        <StatCard title="Total Leads" value={stats.leads} icon={Target} accent="cyan" />
        <StatCard title="New Leads" value={stats.newLeads} icon={Target} accent="amber" />
        <StatCard title="Converted Leads" value={stats.converted} icon={CheckCircle2} accent="emerald" />
        <StatCard title="Pending Leads" value={stats.pending} icon={Clock} accent="rose" />
        <StatCard title="Total Visits" value={stats.visits} icon={Users} accent="violet" />
        <StatCard title="Successful Visits" value={stats.successful} icon={CheckCircle2} accent="emerald" />
        <StatCard title="Unsuccessful Visits" value={stats.unsuccessful} icon={XCircle} accent="rose" />
        <StatCard title="Total Travel" value={formatCurrency(stats.travel)} icon={Navigation} accent="amber" subtitle={`${stats.distance} KM`} />
        <StatCard title="Business Generated" value={formatCurrency(stats.businessGenerated)} icon={TrendingUp} accent="emerald" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader title="Team Lead Conversion" subtitle="Leads generated versus converted by employee" />
          <GroupedBarChart data={teamPerf} keys={['leads', 'converted']} colors={['#2547ec', '#10b981']} />
        </Card>
        <Card>
          <CardHeader title="Team Business Trend" subtitle="Monthly business generated and benefit" />
          <MultiLineChart
            data={businessMonthlyTrend}
            series={[
              { key: 'generated', name: 'Business Generated', color: '#2547ec' },
              { key: 'benefit', name: 'Business Benefit', color: '#10b981' },
            ]}
          />
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader
          title="Team Performance Snapshot"
          subtitle="Conversion rate and business contribution by team member"
          action={<Link to="/manager/team" className="text-sm text-brand-600 hover:text-brand-700 font-medium">Compare team</Link>}
        />
        <Table
          columns={[
            {
              key: 'name',
              header: 'Employee',
              render: (r: (typeof teamPerf)[number]) => <span className="font-medium text-slate-800">{r.name}</span>,
            },
            { key: 'leads', header: 'Leads' },
            { key: 'converted', header: 'Converted' },
            {
              key: 'rate',
              header: 'Conversion Rate',
              render: (r: (typeof teamPerf)[number]) => (
                <Badge tone={r.rate >= 40 ? 'emerald' : r.rate >= 20 ? 'amber' : 'slate'}>{r.rate}%</Badge>
              ),
            },
            {
              key: 'business',
              header: 'Business Generated',
              render: (r: (typeof teamPerf)[number]) => {
                const biz = businessRecords.find((b) => b.employeeId === teamIds[teamPerf.indexOf(r)])
                return <span className="font-medium text-slate-900">{formatCurrency(biz?.businessGenerated || 0)}</span>
              },
            },
          ]}
          data={teamPerf}
        />
      </Card>

      <Card>
        <CardHeader
          title="Recent Team Leads"
          subtitle="Latest leads assigned to your team"
          action={<Link to="/manager/leads" className="text-sm text-brand-600 hover:text-brand-700 font-medium">Manage leads</Link>}
        />
        <Table columns={leadColumns} data={teamLeads.slice(0, 8)} />
      </Card>
    </div>
  )
}
