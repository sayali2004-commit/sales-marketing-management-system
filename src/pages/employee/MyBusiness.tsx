import { useMemo } from 'react'
import { Briefcase, Navigation, Target, TrendingUp } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { StatCard } from '../../components/ui/StatCard'
import { Badge } from '../../components/ui/Badge'
import { Card, CardHeader } from '../../components/ui/Card'
import { Table, type Column } from '../../components/ui/Table'
import { MultiLineChart } from '../../components/charts/Charts'
import { businessMonthlyTrend, formatCurrency } from '../../data/sampleData'

export function MyBusiness() {
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

  const metrics = [
    { label: 'Leads Generated', value: myLeads.length },
    { label: 'Leads Converted', value: converted.length },
    { label: 'Conversion Rate', value: myLeads.length ? `${Math.round((converted.length / myLeads.length) * 100)}%` : '0%' },
    { label: 'Visits', value: myVisits.length },
    { label: 'Successful Visits', value: myVisits.filter((v) => v.outcome === 'Successful' || v.outcome === 'Converted').length },
    { label: 'Business Generated', value: formatCurrency(generated), isCurrency: true },
    { label: 'Business Benefit', value: formatCurrency(benefit), isCurrency: true },
    { label: 'Travel Expense', value: formatCurrency(travelExpense), isCurrency: true },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">My Business</h1>
        <p className="text-sm text-slate-500 mt-1">
          Business Generated is the value of your converted leads. Business Benefit is business generated minus your travel expense and assigned cost.
        </p>
      </div>

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
              { key: 'generated', name: 'Business Generated', color: '#2547ec' },
              { key: 'benefit', name: 'Business Benefit', color: '#10b981' },
            ]}
          />
        </Card>
        <Card>
          <CardHeader title="Business Metrics" subtitle="Your key performance indicators" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {metrics.map((m) => (
              <div key={m.label} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500">{m.label}</p>
                <p className={`text-lg font-semibold mt-1 ${m.isCurrency ? 'text-brand-700' : 'text-slate-900'}`}>{m.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="My Converted Leads" subtitle="Leads that generated business value for you" />
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

      <Card className="mt-6">
        <CardHeader title="Calculation Notes" />
        <p className="text-sm text-slate-600">
          Business Generated is the sum of converted lead values assigned to you. Business Benefit reflects that amount after deducting travel expense and your assigned employee cost. These figures are clearly labeled and should not be confused with overall company profit.
        </p>
      </Card>
    </div>
  )
}
