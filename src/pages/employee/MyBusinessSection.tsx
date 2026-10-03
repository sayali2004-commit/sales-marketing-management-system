import { useMemo } from 'react'
import { Briefcase, Navigation, Target, TrendingUp } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { StatCard } from '../../components/ui/StatCard'
import { Badge } from '../../components/ui/Badge'
import { Card, CardHeader } from '../../components/ui/Card'
import { Table } from '../../components/ui/Table'
import { MultiLineChart } from '../../components/charts/Charts'
import { businessMonthlyTrend, formatCurrency } from '../../data/sampleData'

export function MyBusinessSection() {
  const { currentUser, leads, visits, travelRecords, businessRecords } = useApp()
  const empId = currentUser?.id || 'emp-004'

  const myLeads = useMemo(() => leads.filter((l) => l.assignedEmployeeId === empId), [leads, empId])
  const myVisits = useMemo(() => visits.filter((v) => v.employeeId === empId), [visits, empId])
  const myTravel = useMemo(() => travelRecords.filter((t) => t.employeeId === empId), [travelRecords, empId])
  const myBiz = useMemo(() => businessRecords.find((b) => b.employeeId === empId), [businessRecords, empId])

  const converted = myLeads.filter((l) => l.status === 'Converted')
  const generated = converted.reduce((s, l) => s + (l.conversionValue || l.leadValue), 0)
  const travelExpense = myTravel.reduce((s, t) => s + t.totalAmount, 0)
  const benefit = myBiz?.businessBenefit ?? Math.max(0, generated - travelExpense)

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard title="Leads Generated" value={myLeads.length} icon={Target} accent="blue" />
        <StatCard title="Leads Converted" value={converted.length} icon={TrendingUp} accent="emerald" />
        <StatCard title="Visits" value={myVisits.length} icon={Briefcase} accent="violet" />
        <StatCard title="Travel Expense" value={formatCurrency(travelExpense)} icon={Navigation} accent="rose" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader title="My Business Trend" subtitle="Business generated and business benefit" />
          <MultiLineChart
            data={businessMonthlyTrend}
            series={[
              { key: 'generated', name: 'Business Generated', color: '#4f46e5' },
              { key: 'benefit', name: 'Business Benefit', color: '#10b981' },
            ]}
          />
        </Card>
        <Card>
          <CardHeader title="Business Metrics" subtitle="Key performance indicators" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: 'Conversion Rate', value: myLeads.length ? `${Math.round((converted.length / myLeads.length) * 100)}%` : '0%' },
              { label: 'Successful Visits', value: myVisits.filter((v) => v.outcome === 'Successful' || v.outcome === 'Converted').length },
              { label: 'Business Generated', value: formatCurrency(generated) },
              { label: 'Business Benefit', value: formatCurrency(benefit) },
            ].map((m) => (
              <div key={m.label} className="p-4 bg-slate-50 ui-card-muted border-slate-100">
                <p className="text-xs text-slate-500">{m.label}</p>
                <p className="text-lg font-semibold mt-1 text-brand-700">{m.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="My Converted Leads" subtitle="Business Generated is converted lead value. Business Benefit is business generated minus your travel expense and assigned cost." />
        <Table
          columns={[
            { key: 'leadId', header: 'Lead ID', render: (r: (typeof converted)[number]) => <span className="font-medium text-slate-900">{r.leadId}</span> },
            { key: 'customerName', header: 'Customer' },
            { key: 'product', header: 'Product / Service' },
            {
              key: 'conversionValue',
              header: 'Business Value',
              render: (r: (typeof converted)[number]) => (
                <span className="font-semibold text-emerald-700">{formatCurrency(r.conversionValue || r.leadValue)}</span>
              ),
            },
            {
              key: 'convertedDate',
              header: 'Conversion Date',
              render: (r: (typeof converted)[number]) => <span className="text-slate-600">{r.convertedDate}</span>,
            },
            {
              key: 'status',
              header: 'Status',
              render: () => <Badge tone="emerald">Converted</Badge>,
            },
          ]}
          data={converted}
        />
      </Card>
    </div>
  )
}
