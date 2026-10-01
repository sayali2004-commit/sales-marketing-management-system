import { useMemo, useState } from 'react'
import { Download, FileText } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Select } from '../ui/FormControls'
import { Table, type Column } from '../ui/Table'
import { EmptyState } from '../ui/States'
import { FilterBar, SearchInput } from '../ui/Inputs'
import { employeeName } from '../../data/sampleData'

export interface ReportOption {
  id: string
  name: string
  description: string
  columns: { key: string; header: string }[]
  rows: Record<string, string | number>[]
}

interface ReportsSectionProps {
  reports: ReportOption[]
  scopeLabel: string
  title?: string
  employeesList?: { id: string; name: string }[]
}

export function ReportsSection({ reports, scopeLabel, title = 'Reports', employeesList = [] }: ReportsSectionProps) {
  const [selectedId, setSelectedId] = useState(reports[0]?.id || '')
  const [search, setSearch] = useState('')
  const [employeeFilter, setEmployeeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [exported, setExported] = useState(false)

  const report = reports.find((r) => r.id === selectedId) || reports[0]

  const statusValues = useMemo(() => {
    if (!report) return []
    const set = new Set<string>()
    report.rows.forEach((row) => {
      const status = (row.status || row.Status || row['Approval Status'] || row['Payment Status'] || row['Lead Status']) as string
      if (status) set.add(status)
    })
    return Array.from(set)
  }, [report])

  const rows = useMemo(() => {
    if (!report) return []
    return report.rows.filter((row) => {
      const q = search.toLowerCase()
      const matchQ = !q || Object.values(row).some((v) => String(v).toLowerCase().includes(q))
      const emp = (row.employee || row['Employee Name'] || row['Assigned To'] || row['Shared By'] || row['Lead Name'] || '') as string
      const matchEmp = employeeFilter === 'all' || String(emp).toLowerCase().includes(employeeFilter.toLowerCase())
      const status = (row.status || row.Status || row['Approval Status'] || row['Payment Status'] || row['Lead Status'] || '') as string
      const matchStatus = statusFilter === 'all' || String(status) === statusFilter
      const date = (row.date || row.Date || row['Visit Date'] || row['Travel Date'] || row['Created Date'] || row['Salary Month'] || row['Advance Date'] || row['Follow-up Date'] || row['Joined'] || '') as string
      const matchFrom = !fromDate || String(date) >= fromDate
      const matchTo = !toDate || String(date) <= toDate
      return matchQ && matchEmp && matchStatus && matchFrom && matchTo
    })
  }, [report, search, employeeFilter, statusFilter, fromDate, toDate])

  const columns: Column<Record<string, string | number>>[] = useMemo(() => {
    if (!report) return []
    return report.columns.map((col) => ({
      key: col.key,
      header: col.header,
      render: (row) => {
        const value = row[col.key]
        if (col.key.toLowerCase().includes('status')) {
          return <Badge>{String(value)}</Badge>
        }
        return <span className="text-slate-700">{String(value ?? '')}</span>
      },
    }))
  }, [report])

  const handleExport = () => {
    setExported(true)
    window.setTimeout(() => setExported(false), 2000)
  }

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Available Reports', value: String(reports.length) },
          { label: 'Report Rows', value: String(report?.rows.length || 0) },
          { label: 'Filtered Rows', value: String(rows.length) },
          { label: 'Date Range', value: fromDate && toDate ? `${fromDate} to ${toDate}` : 'All dates' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 shadow-card p-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{s.label}</p>
            <p className="text-lg font-semibold text-slate-900 mt-1.5 truncate">{s.value}</p>
          </div>
        ))}
      </div>

      <Card className="mb-6">
        <h3 className="text-base font-semibold text-slate-900 mb-3">{title}</h3>
        <p className="text-sm text-slate-500 mb-4">{scopeLabel}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedId(r.id)}
              className={`text-left p-4 rounded-xl border transition-colors ${
                selectedId === r.id
                  ? 'border-brand-500 bg-brand-50/60'
                  : 'border-slate-200 bg-white hover:border-brand-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${selectedId === r.id ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800">{r.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{r.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">{report?.name || 'Report'}</h3>
            <p className="text-sm text-slate-500 mt-0.5">{report?.description}</p>
          </div>
          <Button size="sm" variant="secondary" icon={<Download className="w-4 h-4" />} onClick={handleExport}>
            {exported ? 'Export Ready' : 'Export / Download'}
          </Button>
        </div>

        <FilterBar className="mb-4">
          <SearchInput value={search} onChange={setSearch} placeholder="Search report data" className="w-full sm:w-56" />
          {employeesList.length > 0 && (
            <Select value={employeeFilter} onChange={(e) => setEmployeeFilter(e.target.value)}>
              <option value="all">All Employees</option>
              {employeesList.map((e) => (
                <option key={e.id} value={e.name}>{e.name}</option>
              ))}
            </Select>
          )}
          {statusValues.length > 0 && (
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              {statusValues.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          )}
          <Select value="" onChange={() => {}}>
            <option value="">Manager filter</option>
          </Select>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-500"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-500"
          />
        </FilterBar>

        {rows.length === 0 ? (
          <EmptyState title="No report data" description="Adjust the filters to view report records." />
        ) : (
          <Table columns={columns} data={rows.map((r, i) => ({ ...r, id: String(i) }))} />
        )}
      </Card>
    </div>
  )
}

export function buildReports(data: {
  leads: { leadId: string; customerName: string; status: string; assignedEmployeeId: string; leadValue: number; createdDate: string; product: string; leadSource: string; convertedDate?: string; conversionValue?: number }[]
  visits: { visitId: string; customerName: string; employeeId: string; visitDate: string; status: string; outcome: string; purpose: string; destination: string }[]
  travel: { employeeId: string; travelDate: string; destination: string; distance: number; perKmRate: number; totalAmount: number; approvalStatus: string; paymentStatus: string; startDate: string }[]
  salary: { employeeId: string; salaryMonth: string; salaryAmount: number; paidAmount: number; pendingAmount: number; status: string; paymentDate: string | null }[]
  advance: { employeeId: string; advanceAmount: number; advanceDate: string; reason: string; recoveredAmount: number; pendingAmount: number; status: string }[]
  business: { employeeId: string; leadsGenerated: number; leadsConverted: number; visits: number; successfulVisits: number; businessGenerated: number; businessBenefit: number; travelExpense: number; salaryCost: number }[]
  teamPerformance?: { employeeId: string; name: string; leadsGenerated: number; leadsConverted: number; conversionRate: number; visits: number; successfulVisits: number; businessGenerated: number }[]
}): ReportOption[] {
  return [
    {
      id: 'employee-performance',
      name: 'Employee Performance Report',
      description: 'Compare employees by leads, visits, conversions and business generated.',
      columns: [
        { key: 'employee', header: 'Employee Name' },
        { key: 'leads', header: 'Leads Generated' },
        { key: 'converted', header: 'Leads Converted' },
        { key: 'rate', header: 'Conversion Rate' },
        { key: 'visits', header: 'Visits' },
        { key: 'success', header: 'Successful Visits' },
        { key: 'generated', header: 'Business Generated' },
        { key: 'benefit', header: 'Business Benefit' },
        { key: 'status', header: 'Status' },
      ],
      rows: data.business.map((b) => {
        const emp = data.leads.find((l) => l.assignedEmployeeId === b.employeeId)
        const rate = b.leadsGenerated ? Math.round((b.leadsConverted / b.leadsGenerated) * 100) : 0
        return {
          employee: employeeName(b.employeeId),
          leads: b.leadsGenerated,
          converted: b.leadsConverted,
          rate: `${rate}%`,
          visits: b.visits,
          success: b.successfulVisits,
          generated: `INR ${b.businessGenerated.toLocaleString('en-IN')}`,
          benefit: `INR ${b.businessBenefit.toLocaleString('en-IN')}`,
          status: emp?.status || 'Active',
          date: '',
        }
      }),
    },
    {
      id: 'team-performance',
      name: 'Team Performance Report',
      description: 'Team level performance summary for managers and admin.',
      columns: [
        { key: 'employee', header: 'Employee Name' },
        { key: 'leads', header: 'Leads' },
        { key: 'converted', header: 'Converted' },
        { key: 'rate', header: 'Conversion Rate' },
        { key: 'visits', header: 'Visits' },
        { key: 'generated', header: 'Business Generated' },
        { key: 'status', header: 'Status' },
      ],
      rows: (data.teamPerformance || data.business.map((b) => ({ employeeId: b.employeeId, name: employeeName(b.employeeId), leadsGenerated: b.leadsGenerated, leadsConverted: b.leadsConverted, conversionRate: b.leadsGenerated ? Math.round((b.leadsConverted / b.leadsGenerated) * 100) : 0, visits: b.visits, successfulVisits: b.successfulVisits, businessGenerated: b.businessGenerated }))).map((t) => ({
        employee: t.name,
        leads: t.leadsGenerated,
        converted: t.leadsConverted,
        rate: `${t.conversionRate}%`,
        visits: t.visits,
        generated: `INR ${t.businessGenerated.toLocaleString('en-IN')}`,
        status: 'Active',
        date: '',
      })),
    },
    {
      id: 'lead-report',
      name: 'Lead Report',
      description: 'All leads with source, value, assignment and status.',
      columns: [
        { key: 'lead', header: 'Lead ID' },
        { key: 'customer', header: 'Customer' },
        { key: 'product', header: 'Product / Service' },
        { key: 'source', header: 'Lead Source' },
        { key: 'employee', header: 'Assigned To' },
        { key: 'value', header: 'Lead Value' },
        { key: 'status', header: 'Lead Status' },
        { key: 'date', header: 'Created Date' },
      ],
      rows: data.leads.map((l) => ({
        lead: l.leadId,
        customer: l.customerName,
        product: l.product,
        source: l.leadSource,
        employee: employeeName(l.assignedEmployeeId),
        value: `INR ${l.leadValue.toLocaleString('en-IN')}`,
        status: l.status,
        date: l.createdDate,
      })),
    },
    {
      id: 'lead-conversion',
      name: 'Lead Conversion Report',
      description: 'Converted leads with business value and conversion details.',
      columns: [
        { key: 'lead', header: 'Lead ID' },
        { key: 'customer', header: 'Lead Name' },
        { key: 'employee', header: 'Employee Name' },
        { key: 'product', header: 'Product / Service' },
        { key: 'value', header: 'Business Value' },
        { key: 'date', header: 'Conversion Date' },
        { key: 'status', header: 'Status' },
      ],
      rows: data.leads
        .filter((l) => l.status === 'Converted')
        .map((l) => ({
          lead: l.leadId,
          customer: l.customerName,
          employee: employeeName(l.assignedEmployeeId),
          product: l.product,
          value: `INR ${(l.conversionValue || l.leadValue).toLocaleString('en-IN')}`,
          date: l.convertedDate || l.createdDate,
          status: 'Converted',
        })),
    },
    {
      id: 'visit-report',
      name: 'Visit Report',
      description: 'Customer visits with outcome and status details.',
      columns: [
        { key: 'visit', header: 'Visit ID' },
        { key: 'customer', header: 'Customer Name' },
        { key: 'employee', header: 'Employee Name' },
        { key: 'date', header: 'Visit Date' },
        { key: 'purpose', header: 'Purpose' },
        { key: 'destination', header: 'Destination' },
        { key: 'outcome', header: 'Visit Outcome' },
        { key: 'status', header: 'Status' },
      ],
      rows: data.visits.map((v) => ({
        visit: v.visitId,
        customer: v.customerName,
        employee: employeeName(v.employeeId),
        date: v.visitDate,
        purpose: v.purpose,
        destination: v.destination,
        outcome: v.outcome || 'Pending',
        status: v.status,
      })),
    },
    {
      id: 'travel-report',
      name: 'Travel Report',
      description: 'All travel entries with distance, rate and amount.',
      columns: [
        { key: 'employee', header: 'Employee Name' },
        { key: 'date', header: 'Travel Date' },
        { key: 'start', header: 'Starting Point' },
        { key: 'destination', header: 'Destination' },
        { key: 'distance', header: 'Distance' },
        { key: 'rate', header: 'Per KM Rate' },
        { key: 'amount', header: 'Total Amount' },
        { key: 'status', header: 'Approval Status' },
      ],
      rows: data.travel.map((t) => ({
        employee: employeeName(t.employeeId),
        date: t.travelDate,
        start: t.startDate,
        destination: t.destination,
        distance: `${t.distance} KM`,
        rate: `INR ${t.perKmRate}`,
        amount: `INR ${t.totalAmount.toLocaleString('en-IN')}`,
        status: t.approvalStatus,
      })),
    },
    {
      id: 'travel-reimbursement',
      name: 'Travel Reimbursement Report',
      description: 'Claims with approval and payment status for reimbursement tracking.',
      columns: [
        { key: 'employee', header: 'Employee Name' },
        { key: 'date', header: 'Date' },
        { key: 'start', header: 'Starting Point' },
        { key: 'destination', header: 'Destination' },
        { key: 'distance', header: 'Distance' },
        { key: 'amount', header: 'Total Amount' },
        { key: 'approval', header: 'Approval Status' },
        { key: 'status', header: 'Payment Status' },
      ],
      rows: data.travel.map((t) => ({
        employee: employeeName(t.employeeId),
        date: t.travelDate,
        start: t.startDate,
        destination: t.destination,
        distance: `${t.distance} KM`,
        amount: `INR ${t.totalAmount.toLocaleString('en-IN')}`,
        approval: t.approvalStatus,
        status: t.paymentStatus,
      })),
    },
    {
      id: 'salary-report',
      name: 'Salary Report',
      description: 'Salary payments with paid, pending and month details.',
      columns: [
        { key: 'employee', header: 'Employee Name' },
        { key: 'month', header: 'Salary Month' },
        { key: 'amount', header: 'Salary Amount' },
        { key: 'paid', header: 'Paid Amount' },
        { key: 'pending', header: 'Pending Amount' },
        { key: 'date', header: 'Payment Date' },
        { key: 'status', header: 'Status' },
      ],
      rows: data.salary.map((s) => ({
        employee: employeeName(s.employeeId),
        month: s.salaryMonth,
        amount: `INR ${s.salaryAmount.toLocaleString('en-IN')}`,
        paid: `INR ${s.paidAmount.toLocaleString('en-IN')}`,
        pending: `INR ${s.pendingAmount.toLocaleString('en-IN')}`,
        date: s.paymentDate || 'Not paid',
        status: s.status,
      })),
    },
    {
      id: 'advance-report',
      name: 'Advance Report',
      description: 'Employee advances with recovery and pending amounts.',
      columns: [
        { key: 'employee', header: 'Employee Name' },
        { key: 'date', header: 'Advance Date' },
        { key: 'amount', header: 'Advance Amount' },
        { key: 'reason', header: 'Reason' },
        { key: 'recovered', header: 'Recovered Amount' },
        { key: 'pending', header: 'Pending Amount' },
        { key: 'status', header: 'Status' },
      ],
      rows: data.advance.map((a) => ({
        employee: employeeName(a.employeeId),
        date: a.advanceDate,
        amount: `INR ${a.advanceAmount.toLocaleString('en-IN')}`,
        reason: a.reason,
        recovered: `INR ${a.recoveredAmount.toLocaleString('en-IN')}`,
        pending: `INR ${a.pendingAmount.toLocaleString('en-IN')}`,
        status: a.status,
      })),
    },
    {
      id: 'business-performance',
      name: 'Business Performance Report',
      description: 'Business generated, benefit, travel and salary cost per employee.',
      columns: [
        { key: 'employee', header: 'Employee Name' },
        { key: 'leads', header: 'Leads Generated' },
        { key: 'converted', header: 'Leads Converted' },
        { key: 'visits', header: 'Visits' },
        { key: 'success', header: 'Successful Visits' },
        { key: 'generated', header: 'Business Generated' },
        { key: 'benefit', header: 'Business Benefit' },
        { key: 'travel', header: 'Travel Expense' },
        { key: 'salary', header: 'Salary Cost' },
      ],
      rows: data.business.map((b) => ({
        employee: employeeName(b.employeeId),
        leads: b.leadsGenerated,
        converted: b.leadsConverted,
        visits: b.visits,
        success: b.successfulVisits,
        generated: `INR ${b.businessGenerated.toLocaleString('en-IN')}`,
        benefit: `INR ${b.businessBenefit.toLocaleString('en-IN')}`,
        travel: `INR ${b.travelExpense.toLocaleString('en-IN')}`,
        salary: `INR ${b.salaryCost.toLocaleString('en-IN')}`,
      })),
    },
    {
      id: 'sales-report',
      name: 'Sales Report',
      description: 'Sales focused report on leads, conversions and revenue.',
      columns: [
        { key: 'employee', header: 'Employee Name' },
        { key: 'leads', header: 'Leads' },
        { key: 'converted', header: 'Converted Leads' },
        { key: 'rate', header: 'Conversion Rate' },
        { key: 'visits', header: 'Customer Visits' },
        { key: 'generated', header: 'Business Generated' },
        { key: 'status', header: 'Status' },
      ],
      rows: data.business.map((b) => ({
        employee: employeeName(b.employeeId),
        leads: b.leadsGenerated,
        converted: b.leadsConverted,
        rate: b.leadsGenerated ? `${Math.round((b.leadsConverted / b.leadsGenerated) * 100)}%` : '0%',
        visits: b.visits,
        generated: `INR ${b.businessGenerated.toLocaleString('en-IN')}`,
        status: 'Active',
      })),
    },
    {
      id: 'marketing-report',
      name: 'Marketing Report',
      description: 'Marketing lead sources, campaigns and conversion outcomes.',
      columns: [
        { key: 'employee', header: 'Employee Name' },
        { key: 'leads', header: 'Leads Generated' },
        { key: 'source', header: 'Primary Source' },
        { key: 'followups', header: 'Follow-ups' },
        { key: 'converted', header: 'Converted Leads' },
        { key: 'status', header: 'Status' },
      ],
      rows: data.business.map((b) => {
        const empLeads = data.leads.filter((l) => l.assignedEmployeeId === b.employeeId)
        const sources = empLeads.map((l) => l.leadSource)
        const primary = sources.sort((a, c) => sources.filter((s) => s === c).length - sources.filter((s) => s === a).length)[0] || 'N/A'
        return {
          employee: employeeName(b.employeeId),
          leads: b.leadsGenerated,
          source: primary,
          followups: empLeads.filter((l) => l.status === 'Follow-up' || l.status === 'Contacted').length,
          converted: b.leadsConverted,
          status: 'Active',
        }
      }),
    },
  ]
}
