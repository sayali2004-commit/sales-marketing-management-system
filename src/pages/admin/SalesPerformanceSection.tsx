import { useMemo } from 'react'
import { BarChart3, CheckCircle2, Target, TrendingUp, Users } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { StatCard } from '../../components/ui/StatCard'
import { Badge, StatusBadge } from '../../components/ui/Badge'
import { Card, CardHeader } from '../../components/ui/Card'
import { Table, type Column } from '../../components/ui/Table'
import { GroupedBarChart } from '../../components/charts/Charts'
import { employeeName, formatCurrency } from '../../data/sampleData'
import type { Lead } from '../../types'

const salesIds = ['emp-004', 'emp-005', 'emp-006', 'emp-007', 'emp-011']

export function SalesPerformanceSection() {
  const { leads, businessRecords } = useApp()
  const salesLeads = useMemo(() => leads.filter((l) => salesIds.includes(l.assignedEmployeeId)), [leads])

  const stats = useMemo(() => {
    const converted = salesLeads.filter((l) => l.status === 'Converted')
    return {
      leads: salesLeads.length,
      converted: converted.length,
      rate: salesLeads.length ? Math.round((converted.length / salesLeads.length) * 100) : 0,
      sales: converted.reduce((s, l) => s + (l.conversionValue || l.leadValue), 0),
    }
  }, [salesLeads])

  const perEmployee = useMemo(
    () =>
      salesIds.map((id) => {
        const empLeads = salesLeads.filter((l) => l.assignedEmployeeId === id)
        const converted = empLeads.filter((l) => l.status === 'Converted')
        const biz = businessRecords.find((b) => b.employeeId === id)
        return {
          name: employeeName(id).split(' ')[0],
          leads: empLeads.length,
          converted: converted.length,
          rate: empLeads.length ? Math.round((converted.length / empLeads.length) * 100) : 0,
          generated: converted.reduce((s, l) => s + (l.conversionValue || l.leadValue), 0),
          visits: biz?.visits || 0,
        }
      }),
    [salesLeads, businessRecords],
  )

  const columns: Column<(typeof perEmployee)[number]>[] = [
    { key: 'name', header: 'Sales Employee', render: (r) => <span className="font-medium text-slate-800">{r.name}</span> },
    { key: 'leads', header: 'Leads' },
    { key: 'converted', header: 'Converted Leads' },
    {
      key: 'rate',
      header: 'Conversion Rate',
      render: (r) => <Badge tone={r.rate >= 40 ? 'emerald' : r.rate >= 20 ? 'amber' : 'slate'}>{r.rate}%</Badge>,
    },
    { key: 'visits', header: 'Customer Visits' },
    {
      key: 'generated',
      header: 'Business Generated',
      render: (r) => <span className="font-semibold text-slate-900">{formatCurrency(r.generated)}</span>,
    },
  ]

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard title="Sales Leads" value={stats.leads} icon={Target} accent="blue" />
        <StatCard title="Converted Leads" value={stats.converted} icon={CheckCircle2} accent="emerald" />
        <StatCard title="Conversion Rate" value={`${stats.rate}%`} icon={TrendingUp} accent="violet" />
        <StatCard title="Sales Value" value={formatCurrency(stats.sales)} icon={BarChart3} accent="cyan" />
      </div>

      <Card className="mb-6">
        <CardHeader title="Sales Leads vs Conversions" subtitle="By employee" />
        <GroupedBarChart data={perEmployee} keys={['leads', 'converted']} colors={['#2547ec', '#10b981']} />
      </Card>

      <Card className="mb-6">
        <CardHeader title="Sales Team Performance" subtitle="Leads, conversions, rate and business value" />
        <Table columns={columns} data={perEmployee} />
      </Card>

      <Card>
        <CardHeader title="Recent Converted Sales Leads" />
        <Table
          columns={[
            { key: 'leadId', header: 'Lead ID', render: (r: Lead) => <span className="font-medium text-slate-900">{r.leadId}</span> },
            { key: 'customerName', header: 'Customer' },
            {
              key: 'conversionValue',
              header: 'Business Value',
              render: (r: Lead) => <span className="font-semibold text-emerald-700">{formatCurrency(r.conversionValue || r.leadValue)}</span>,
            },
            {
              key: 'assignedEmployeeId',
              header: 'Employee',
              render: (r: Lead) => <span className="text-slate-600">{employeeName(r.assignedEmployeeId)}</span>,
            },
            { key: 'convertedDate', header: 'Conversion Date', render: (r: Lead) => <span className="text-slate-600">{r.convertedDate}</span> },
            {
              key: 'status',
              header: 'Status',
              render: (r: Lead) => <StatusBadge status={r.status} />,
            },
          ]}
          data={salesLeads.filter((l) => l.status === 'Converted').slice(0, 8)}
        />
      </Card>
    </div>
  )
}
