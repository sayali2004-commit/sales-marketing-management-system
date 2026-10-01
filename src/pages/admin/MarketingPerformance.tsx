import { useMemo } from 'react'
import { Megaphone, Target, TrendingUp, Users } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { StatCard } from '../../components/ui/StatCard'
import { Badge, StatusBadge } from '../../components/ui/Badge'
import { Card, CardHeader } from '../../components/ui/Card'
import { Table, type Column } from '../../components/ui/Table'
import { GroupedBarChart, PieDonutChart } from '../../components/charts/Charts'
import { employeeName, formatCurrency, leadSourceDistribution } from '../../data/sampleData'
import type { Lead } from '../../types'

const marketingIds = ['emp-008', 'emp-009', 'emp-010', 'emp-012']

export function MarketingPerformance() {
  const { leads, businessRecords } = useApp()

  const mktLeads = useMemo(() => leads.filter((l) => marketingIds.includes(l.assignedEmployeeId)), [leads])

  const stats = useMemo(() => {
    const converted = mktLeads.filter((l) => l.status === 'Converted')
    return {
      leads: mktLeads.length,
      converted: converted.length,
      followups: mktLeads.filter((l) => l.status === 'Follow-up' || l.status === 'Contacted').length,
      newCustomers: converted.length,
      value: converted.reduce((s, l) => s + (l.conversionValue || l.leadValue), 0),
    }
  }, [mktLeads])

  const perEmployee = useMemo(
    () =>
      marketingIds.map((id) => {
        const empLeads = mktLeads.filter((l) => l.assignedEmployeeId === id)
        const converted = empLeads.filter((l) => l.status === 'Converted')
        return {
          name: employeeName(id).split(' ')[0],
          leads: empLeads.length,
          converted: converted.length,
          followups: empLeads.filter((l) => l.status === 'Follow-up' || l.status === 'Contacted').length,
          rate: empLeads.length ? Math.round((converted.length / empLeads.length) * 100) : 0,
        }
      }),
    [mktLeads],
  )

  const sourceRows = useMemo(
    () =>
      leadSourceDistribution.map((s) => ({
        name: s.name,
        generated: s.value,
        converted: leads.filter((l) => l.leadSource === s.name && l.status === 'Converted').length,
      })),
    [leads],
  )

  const columns: Column<(typeof perEmployee)[number]>[] = [
    { key: 'name', header: 'Marketing Employee', render: (r) => <span className="font-medium text-slate-800">{r.name}</span> },
    { key: 'leads', header: 'Leads Generated' },
    { key: 'converted', header: 'Converted Leads' },
    { key: 'followups', header: 'Follow-ups' },
    {
      key: 'rate',
      header: 'Conversion Rate',
      render: (r) => <Badge tone={r.rate >= 40 ? 'emerald' : r.rate >= 20 ? 'amber' : 'slate'}>{r.rate}%</Badge>,
    },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Marketing Performance</h1>
        <p className="text-sm text-slate-500 mt-1">Lead sources, campaigns, follow-ups and marketing conversions.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <StatCard title="Marketing Leads" value={stats.leads} icon={Megaphone} accent="violet" />
        <StatCard title="Lead Sources" value={leadSourceDistribution.length} icon={Target} accent="blue" />
        <StatCard title="New Customers" value={stats.newCustomers} icon={Users} accent="emerald" />
        <StatCard title="Active Follow-ups" value={stats.followups} icon={TrendingUp} accent="amber" />
        <StatCard title="Converted Value" value={formatCurrency(stats.value)} icon={Target} accent="cyan" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <Card className="xl:col-span-2">
          <CardHeader title="Leads by Source" subtitle="Generated versus converted across marketing channels" />
          <GroupedBarChart data={sourceRows} keys={['generated', 'converted']} colors={['#8b5cf6', '#10b981']} />
        </Card>
        <Card>
          <CardHeader title="Source Share" subtitle="Distribution of lead sources" />
          <PieDonutChart data={leadSourceDistribution} />
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader title="Marketing Team Performance" subtitle="Leads generated, conversions, follow-ups and conversion rate" />
        <Table columns={columns} data={perEmployee} />
      </Card>

      <Card>
        <CardHeader title="Recent Marketing Leads" />
        <Table
          columns={[
            { key: 'leadId', header: 'Lead ID', render: (r: Lead) => <span className="font-medium text-slate-900">{r.leadId}</span> },
            { key: 'customerName', header: 'Customer' },
            {
              key: 'leadSource',
              header: 'Source',
              render: (r: Lead) => <Badge tone="violet">{r.leadSource}</Badge>,
            },
            { key: 'product', header: 'Campaign / Service' },
            {
              key: 'assignedEmployeeId',
              header: 'Employee',
              render: (r: Lead) => <span className="text-slate-600">{employeeName(r.assignedEmployeeId)}</span>,
            },
            {
              key: 'leadValue',
              header: 'Lead Value',
              render: (r: Lead) => <span className="font-medium text-slate-800">{formatCurrency(r.leadValue)}</span>,
            },
            {
              key: 'status',
              header: 'Status',
              render: (r: Lead) => <StatusBadge status={r.status} />,
            },
          ]}
          data={mktLeads.slice(0, 12)}
        />
      </Card>

      <Card className="mt-6">
        <CardHeader title="Marketing Notes" />
        <p className="text-sm text-slate-600">
          Marketing performance is measured through leads generated, lead source quality, follow-up activity and converted lead value. Campaign names are represented by the product or service field on each lead.
        </p>
      </Card>
    </div>
  )
}
