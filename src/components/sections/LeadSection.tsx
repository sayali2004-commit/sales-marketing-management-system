import { useMemo, useState } from 'react'
import {
  ArrowLeftRight,
  CalendarClock,
  CheckCircle2,
  Plus,
  Share2,
} from 'lucide-react'
import { Badge, StatusBadge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Input, Select, Textarea } from '../ui/FormControls'
import { Modal, ModalActions } from '../ui/Modal'
import { Table, type Column } from '../ui/Table'
import { EmptyState } from '../ui/States'
import { FilterBar, SearchInput } from '../ui/Inputs'
import { ShareDialog } from '../ShareDialog'
import { employeeName, employees, formatCurrency, formatNumber } from '../../data/sampleData'
import type { Lead, LeadStatus } from '../../types'

const statuses: LeadStatus[] = ['New', 'Contacted', 'Follow-up', 'Interested', 'Converted', 'Not Converted', 'Closed']

interface LeadSectionProps {
  leads: Lead[]
  scopeLabel: string
  canCreate: boolean
  canConvert: boolean
  canAssign?: boolean
  currentEmployeeId?: string
  onAddLead?: (lead: Lead) => void
  onUpdateLead?: (lead: Lead) => void
  title?: string
}

export function LeadSection({
  leads,
  scopeLabel,
  canCreate,
  canConvert,
  canAssign,
  currentEmployeeId,
  onAddLead,
  onUpdateLead,
  title = 'Lead Management',
}: LeadSectionProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [selected, setSelected] = useState<Lead | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [showConvert, setShowConvert] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [followUpNote, setFollowUpNote] = useState('')
  const [form, setForm] = useState({
    customerName: '',
    contactPerson: '',
    mobile: '',
    email: '',
    location: '',
    leadSource: 'Website',
    product: 'ERP Software License',
    leadValue: '',
    assignedEmployeeId: canAssign ? '' : currentEmployeeId || '',
    followUpDate: '',
    notes: '',
  })

  const sources = useMemo(() => Array.from(new Set(leads.map((l) => l.leadSource))), [leads])

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      const q = search.toLowerCase()
      const matchQ =
        !q ||
        l.customerName.toLowerCase().includes(q) ||
        l.leadId.toLowerCase().includes(q) ||
        l.contactPerson.toLowerCase().includes(q) ||
        employeeName(l.assignedEmployeeId).toLowerCase().includes(q)
      const matchStatus = statusFilter === 'all' || l.status === statusFilter
      const matchSource = sourceFilter === 'all' || l.leadSource === sourceFilter
      return matchQ && matchStatus && matchSource
    })
  }, [leads, search, statusFilter, sourceFilter])

  const stats = useMemo(() => {
    const total = leads.length
    const converted = leads.filter((l) => l.status === 'Converted').length
    const pending = leads.filter((l) => !['Converted', 'Not Converted', 'Closed'].includes(l.status)).length
    const value = leads.reduce((s, l) => s + l.leadValue, 0)
    const convertedValue = leads.filter((l) => l.status === 'Converted').reduce((s, l) => s + (l.conversionValue || l.leadValue), 0)
    return { total, converted, pending, value, convertedValue }
  }, [leads])

  const columns: Column<Lead>[] = [
    {
      key: 'leadId',
      header: 'Lead ID',
      render: (row) => <span className="font-medium text-slate-900">{row.leadId}</span>,
    },
    {
      key: 'customerName',
      header: 'Customer / Company',
      render: (row) => (
        <div>
          <p className="font-medium text-slate-800">{row.customerName}</p>
          <p className="text-xs text-slate-400">{row.contactPerson}</p>
        </div>
      ),
    },
    {
      key: 'product',
      header: 'Product / Service',
      hideOnMobile: true,
      render: (row) => <span className="text-slate-600">{row.product}</span>,
    },
    {
      key: 'leadSource',
      header: 'Source',
      hideOnMobile: true,
      render: (row) => <Badge tone="cyan">{row.leadSource}</Badge>,
    },
    {
      key: 'leadValue',
      header: 'Lead Value',
      className: 'whitespace-nowrap',
      render: (row) => <span className="font-medium text-slate-900">{formatCurrency(row.leadValue)}</span>,
    },
    {
      key: 'assignedEmployeeId',
      header: 'Assigned To',
      hideOnMobile: true,
      render: (row) => <span className="text-slate-600">{employeeName(row.assignedEmployeeId)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setSelected(row)
              setShowShare(true)
            }}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
          {canConvert && row.status !== 'Converted' && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setSelected(row)
                setShowConvert(true)
              }}
              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50"
              title="Convert lead"
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ]

  const handleCreate = () => {
    if (!form.customerName || !form.assignedEmployeeId) return
    const lead: Lead = {
      id: `lead-${Date.now()}`,
      leadId: `LD-${String(leads.length + 1).padStart(4, '0')}`,
      customerName: form.customerName,
      contactPerson: form.contactPerson,
      mobile: form.mobile,
      email: form.email,
      location: form.location,
      leadSource: form.leadSource,
      product: form.product,
      leadValue: Number(form.leadValue) || 0,
      assignedEmployeeId: form.assignedEmployeeId,
      createdDate: new Date().toISOString().slice(0, 10),
      followUpDate: form.followUpDate || null,
      status: 'New',
      notes: form.notes,
      followUps: [],
    }
    onAddLead?.(lead)
    setShowCreate(false)
    setForm({
      customerName: '',
      contactPerson: '',
      mobile: '',
      email: '',
      location: '',
      leadSource: 'Website',
      product: 'ERP Software License',
      leadValue: '',
      assignedEmployeeId: canAssign ? '' : currentEmployeeId || '',
      followUpDate: '',
      notes: '',
    })
  }

  const handleConvert = () => {
    if (!selected) return
    const updated: Lead = {
      ...selected,
      status: 'Converted',
      convertedDate: new Date().toISOString().slice(0, 10),
      conversionValue: selected.leadValue,
      followUps: [
        ...selected.followUps,
        {
          id: `fu-${Date.now()}`,
          date: new Date().toISOString().slice(0, 10),
          notes: 'Lead converted successfully.',
          outcome: 'Converted',
        },
      ],
    }
    onUpdateLead?.(updated)
    setShowConvert(false)
    setSelected(updated)
  }

  const handleStatusChange = (status: LeadStatus) => {
    if (!selected) return
    const updated = { ...selected, status }
    onUpdateLead?.(updated)
    setSelected(updated)
  }

  const handleAddFollowUp = () => {
    if (!selected || !followUpNote.trim()) return
    const updated: Lead = {
      ...selected,
      status: selected.status === 'New' ? 'Contacted' : selected.status === 'Contacted' ? 'Follow-up' : selected.status,
      followUps: [
        ...selected.followUps,
        {
          id: `fu-${Date.now()}`,
          date: new Date().toISOString().slice(0, 10),
          notes: followUpNote,
          outcome: 'Follow-up added',
        },
      ],
    }
    onUpdateLead?.(updated)
    setSelected(updated)
    setFollowUpNote('')
  }

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        {[
          { label: 'Total Leads', value: formatNumber(stats.total), tone: 'text-slate-900' },
          { label: 'Converted', value: formatNumber(stats.converted), tone: 'text-emerald-600' },
          { label: 'Pending', value: formatNumber(stats.pending), tone: 'text-amber-600' },
          { label: 'Total Lead Value', value: formatCurrency(stats.value), tone: 'text-brand-600' },
          { label: 'Converted Value', value: formatCurrency(stats.convertedValue), tone: 'text-violet-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 shadow-card p-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{s.label}</p>
            <p className={`text-lg font-semibold mt-1.5 ${s.tone}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-500 mt-0.5">{scopeLabel}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={<ArrowLeftRight className="w-4 h-4" />}
              onClick={() => {
                setStatusFilter('all')
                setSourceFilter('all')
                setSearch('')
              }}
            >
              Reset Filters
            </Button>
            {canCreate && (
              <Button size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => setShowCreate(true)}>
                Create Lead
              </Button>
            )}
          </div>
        </div>

        <FilterBar className="mb-4">
          <SearchInput value={search} onChange={setSearch} placeholder="Search by lead, customer or employee" className="w-full sm:w-72" />
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
          <Select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}>
            <option value="all">All Sources</option>
            {sources.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </FilterBar>

        {filtered.length === 0 ? (
          <EmptyState title="No leads found" description="Adjust the filters or create a new lead to get started." />
        ) : (
          <Table columns={columns} data={filtered} onRowClick={(row) => { setSelected(row); setShowDetail(true) }} />
        )}
      </Card>

      <Modal open={showCreate} title="Create Lead" subtitle="Add a new sales or marketing lead" onClose={() => setShowCreate(false)} size="lg" footer={<ModalActions onClose={() => setShowCreate(false)} onSubmit={handleCreate} submitLabel="Create Lead" />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Customer / Company Name" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} placeholder="Company name" />
          <Input label="Contact Person" value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} placeholder="Full name" />
          <Input label="Mobile Number" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} placeholder="+91" />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="City, State" />
          <Select label="Lead Source" value={form.leadSource} onChange={(e) => setForm({ ...form, leadSource: e.target.value })}>
            {['Website', 'Referral', 'Cold Call', 'Walk-in', 'LinkedIn', 'Campaign', 'Exhibition', 'Social Media'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
          <Select label="Product / Service" value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })}>
            {['ERP Software License', 'CRM Suite', 'Cloud Hosting Plan', 'Mobile App Development', 'IT Consulting', 'Managed Services', 'Data Analytics Platform', 'Cybersecurity Package', 'Website Redesign', 'Digital Marketing Package'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
          <Input label="Lead Value (INR)" type="number" value={form.leadValue} onChange={(e) => setForm({ ...form, leadValue: e.target.value })} placeholder="0" />
          {canAssign ? (
            <Select label="Assigned Employee" value={form.assignedEmployeeId} onChange={(e) => setForm({ ...form, assignedEmployeeId: e.target.value })}>
              <option value="">Select employee</option>
              {employees.filter((e) => e.status === 'Active' && e.role === 'employee').map((e) => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </Select>
          ) : (
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Assigned Employee</label>
              <div className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-600">
                {employeeName(currentEmployeeId || '')}
              </div>
            </div>
          )}
          <Input label="Follow-up Date" type="date" value={form.followUpDate} onChange={(e) => setForm({ ...form, followUpDate: e.target.value })} />
          <div className="sm:col-span-2">
            <Textarea label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Add any relevant notes" />
          </div>
        </div>
      </Modal>

      <Modal open={showConvert} title="Convert Lead" subtitle={selected ? `${selected.leadId} · ${selected.customerName}` : ''} onClose={() => setShowConvert(false)} size="sm" footer={<ModalActions onClose={() => setShowConvert(false)} onSubmit={handleConvert} submitLabel="Confirm Conversion" />}>
        <div className="space-y-3">
          <p className="text-sm text-slate-600">Mark this lead as converted. This will record the conversion date and business value.</p>
          <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Lead Name</span><span className="font-medium text-slate-800">{selected?.customerName}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Employee</span><span className="font-medium text-slate-800">{employeeName(selected?.assignedEmployeeId || '')}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Product / Service</span><span className="font-medium text-slate-800">{selected?.product}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Business Value</span><span className="font-medium text-emerald-600">{formatCurrency(selected?.conversionValue || selected?.leadValue || 0)}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Customer Location</span><span className="font-medium text-slate-800">{selected?.location}</span></div>
          </div>
        </div>
      </Modal>

      <Modal open={showDetail && !!selected} title={selected?.leadId || 'Lead'} subtitle={selected?.customerName} onClose={() => setShowDetail(false)} size="lg" footer={
        <>
          {selected && <Button variant="secondary" icon={<Share2 className="w-4 h-4" />} onClick={() => { setShowDetail(false); setShowShare(true) }}>Share</Button>}
          <Button onClick={() => setShowDetail(false)}>Close</Button>
        </>
      }>
        {selected && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div><p className="text-xs text-slate-400">Status</p><div className="mt-1"><StatusBadge status={selected.status} /></div></div>
              <div><p className="text-xs text-slate-400">Contact Person</p><p className="mt-1 font-medium text-slate-800">{selected.contactPerson}</p></div>
              <div><p className="text-xs text-slate-400">Mobile</p><p className="mt-1 font-medium text-slate-800">{selected.mobile}</p></div>
              <div><p className="text-xs text-slate-400">Email</p><p className="mt-1 font-medium text-slate-800 break-all">{selected.email}</p></div>
              <div><p className="text-xs text-slate-400">Location</p><p className="mt-1 font-medium text-slate-800">{selected.location}</p></div>
              <div><p className="text-xs text-slate-400">Source</p><p className="mt-1 font-medium text-slate-800">{selected.leadSource}</p></div>
              <div><p className="text-xs text-slate-400">Product</p><p className="mt-1 font-medium text-slate-800">{selected.product}</p></div>
              <div><p className="text-xs text-slate-400">Lead Value</p><p className="mt-1 font-medium text-slate-800">{formatCurrency(selected.leadValue)}</p></div>
              <div><p className="text-xs text-slate-400">Assigned To</p><p className="mt-1 font-medium text-slate-800">{employeeName(selected.assignedEmployeeId)}</p></div>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-600 mb-2">Update Status</p>
              <div className="flex flex-wrap gap-1.5">
                {statuses.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      selected.status === s ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-600 mb-2">Add Follow-up</p>
              <div className="flex gap-2">
                <Input value={followUpNote} onChange={(e) => setFollowUpNote(e.target.value)} placeholder="Follow-up notes" />
                <Button size="sm" icon={<CalendarClock className="w-4 h-4" />} onClick={handleAddFollowUp}>Add</Button>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-600 mb-2">Lead History</p>
              {selected.followUps.length === 0 ? (
                <p className="text-xs text-slate-400">No follow-up history yet.</p>
              ) : (
                <div className="space-y-2">
                  {selected.followUps.map((f) => (
                    <div key={f.id} className="px-3 py-2.5 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-700">{f.date}</span>
                        <Badge tone="cyan">{f.outcome}</Badge>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{f.notes}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {selected && (
        <ShareDialog
          open={showShare}
          onClose={() => setShowShare(false)}
          relatedTo={`Lead ${selected.leadId}`}
          onShare={() => setShowShare(false)}
        />
      )}
    </div>
  )
}
