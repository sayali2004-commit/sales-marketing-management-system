import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeftRight,
  CalendarClock,
  CheckCircle2,
  Phone,
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
import { FilterPanel } from '../ui/FilterPanel'
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
  createLabel?: string
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
  createLabel = 'Create Lead',
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
  const [showConvertForm, setShowConvertForm] = useState(false)
  const convertFormRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (showConvertForm && convertFormRef.current) {
      convertFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [showConvertForm])

  const [followUpNote, setFollowUpNote] = useState('')
  const [followUpTypeDetail, setFollowUpTypeDetail] = useState<'Call' | 'Visit'>('Call')
  const [convertAmount, setConvertAmount] = useState('')
  const [convertNote, setConvertNote] = useState('')
  const [convertError, setConvertError] = useState('')
  const [form, setForm] = useState({
    customerName: '',
    contactPerson: '',
    mobile: '',
    email: '',
    location: '',
    assignedEmployeeId: canAssign ? '' : currentEmployeeId || '',
    followUpEnabled: false,
    followUpType: 'Call' as 'Call' | 'Visit',
    followUpDate: '',
    followUpTime: '',
    followUpNote: '',
    notes: '',
  })

  const followUpTypes = useMemo(() => Array.from(new Set(leads.map((l) => l.followUpType).filter(Boolean))) as string[], [leads])

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
      const matchSource = sourceFilter === 'all' || (l.followUpType || 'None') === sourceFilter
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
      header: 'Follow-up',
      hideOnMobile: true,
      render: (row) => (
        <Badge tone={row.followUpType === 'Visit' ? 'violet' : row.followUpType === 'Call' ? 'blue' : 'slate'}>
          {row.followUpType || 'None'}
        </Badge>
      ),
    },
    {
      key: 'leadSource',
      header: 'Follow-up Date',
      hideOnMobile: true,
      render: (row) => (
        <span className="text-slate-600">
          {row.followUpDate ? `${row.followUpDate}${row.followUpTime ? ` · ${row.followUpTime}` : ''}` : 'Not scheduled'}
        </span>
      ),
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
          {canConvert && row.status !== 'Converted' && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setSelected(row)
                setConvertAmount('')
                setConvertNote('')
                setConvertError('')
                setShowConvertForm(true)
                setShowDetail(true)
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
      leadSource: '',
      product: '',
      leadValue: 0,
      assignedEmployeeId: form.assignedEmployeeId,
      createdDate: new Date().toISOString().slice(0, 10),
      followUpDate: form.followUpEnabled && form.followUpDate ? form.followUpDate : null,
      followUpType: form.followUpEnabled ? form.followUpType : null,
      followUpTime: form.followUpEnabled && form.followUpTime ? form.followUpTime : null,
      followUpNote: form.followUpEnabled && form.followUpNote ? form.followUpNote : null,
      status: 'New',
      notes: form.notes,
      followUps:
        form.followUpEnabled && form.followUpDate
          ? [
              {
                id: `fu-${Date.now()}`,
                date: form.followUpDate,
                time: form.followUpTime,
                type: form.followUpType,
                notes: form.followUpNote || `${form.followUpType} follow-up scheduled.`,
                outcome: `Next ${form.followUpType} planned`,
                nextDate: form.followUpDate,
              },
            ]
          : [],
    }
    onAddLead?.(lead)
    setShowCreate(false)
    setForm({
      customerName: '',
      contactPerson: '',
      mobile: '',
      email: '',
      location: '',
      assignedEmployeeId: canAssign ? '' : currentEmployeeId || '',
      followUpEnabled: false,
      followUpType: 'Call',
      followUpDate: '',
      followUpTime: '',
      followUpNote: '',
      notes: '',
    })
  }

  const handleConvert = () => {
    if (!selected) return
    const amount = Number(convertAmount)
    if (!convertAmount || Number.isNaN(amount) || amount <= 0) {
      setConvertError('Please enter the converted amount in rupees.')
      return
    }
    setConvertError('')
    const convertedOn = new Date().toISOString().slice(0, 10)
    const updated: Lead = {
      ...selected,
      status: 'Converted',
      convertedDate: convertedOn,
      conversionValue: amount,
      followUps: [
        ...selected.followUps,
        {
          id: `fu-${Date.now()}`,
          date: convertedOn,
          time: new Date().toTimeString().slice(0, 5),
          notes: convertNote.trim() || `Lead converted. Business value: ${formatCurrency(amount)}.`,
          outcome: 'Converted',
        },
      ],
    }
    onUpdateLead?.(updated)
    setSelected(updated)
    setConvertAmount('')
    setConvertNote('')
    setShowConvertForm(false)
  }

  const handleStatusChange = (status: LeadStatus) => {
    if (!selected) return
    if (status === 'Converted' && selected.status !== 'Converted') {
      setShowConvertForm(true)
      setConvertAmount('')
      setConvertNote('')
      setConvertError('')
      setShowDetail(true)
      return
    }
    setShowConvertForm(false)
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
          time: new Date().toTimeString().slice(0, 5),
          type: followUpTypeDetail,
          notes: followUpNote,
          outcome: `${followUpTypeDetail} follow-up`,
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
        <div className="mb-4">
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500 mt-0.5">{scopeLabel}</p>
        </div>

        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <SearchInput value={search} onChange={setSearch} placeholder="Search by lead, customer or employee" className="w-full sm:w-80" />
          {canCreate && (
            <Button size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => setShowCreate(true)}>
              {createLabel}
            </Button>
          )}
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No leads found" description="Adjust the filters or create a new lead to get started." />
        ) : (
          <Table columns={columns} data={filtered} onRowClick={(row) => { setSelected(row); setShowDetail(true) }} />
        )}
      </Card>

      <Modal open={showCreate} title={createLabel} subtitle={canAssign ? 'Assign a lead to an employee for follow-up' : 'Add customer details and plan the next follow-up'} onClose={() => setShowCreate(false)} size="lg" footer={<ModalActions onClose={() => setShowCreate(false)} onSubmit={handleCreate} submitLabel={createLabel} />}>
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Customer / Company Name" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} placeholder="Company name" />
            <Input label="Contact Person" value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} placeholder="Full name" />
            <Input label="Mobile Number" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} placeholder="+91" />
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="City, State" />
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
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div>
                <p className="text-sm font-semibold text-slate-800">Follow-up</p>
                <p className="text-xs text-slate-500 mt-0.5">Choose Call or Visit, then set date, time and note</p>
              </div>
              <button
                type="button"
                onClick={() => setForm({ ...form, followUpEnabled: !form.followUpEnabled })}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  form.followUpEnabled
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'bg-white text-slate-600 border-slate-300 hover:border-brand-400'
                }`}
              >
                {form.followUpEnabled ? 'Follow-up Added' : 'Add Follow-up'}
              </button>
            </div>

            {form.followUpEnabled && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, followUpType: 'Call' })}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border transition-all ${
                      form.followUpType === 'Call'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-brand-400 hover:text-brand-700'
                    }`}
                  >
                    <Phone className="w-4 h-4" /> Call
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, followUpType: 'Visit' })}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border transition-all ${
                      form.followUpType === 'Visit'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-brand-400 hover:text-brand-700'
                    }`}
                  >
                    <CalendarClock className="w-4 h-4" /> Visit
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label={`${form.followUpType} Date`}
                    type="date"
                    value={form.followUpDate}
                    onChange={(e) => setForm({ ...form, followUpDate: e.target.value })}
                  />
                  <Input
                    label={`${form.followUpType} Time`}
                    type="time"
                    value={form.followUpTime}
                    onChange={(e) => setForm({ ...form, followUpTime: e.target.value })}
                  />
                  <div className="sm:col-span-2">
                    <Textarea
                      label={`${form.followUpType} Note`}
                      value={form.followUpNote}
                      onChange={(e) => setForm({ ...form, followUpNote: e.target.value })}
                      placeholder={form.followUpType === 'Call' ? 'What to discuss on the call' : 'Purpose and details of the visit'}
                    />
                  </div>
                </div>

                <p className="text-[11px] text-slate-400">
                  This creates a {form.followUpType.toLowerCase()} follow-up activity on the lead for the selected date and time.
                </p>
              </div>
            )}
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
              <div><p className="text-xs text-slate-400">Follow-up Type</p><p className="mt-1 font-medium text-slate-800">{selected.followUpType || 'None'}</p></div>
              <div><p className="text-xs text-slate-400">Follow-up Date</p><p className="mt-1 font-medium text-slate-800">{selected.followUpDate || 'Not scheduled'}</p></div>
              <div><p className="text-xs text-slate-400">Follow-up Time</p><p className="mt-1 font-medium text-slate-800">{selected.followUpTime || 'Not set'}</p></div>
              <div><p className="text-xs text-slate-400">Lead Value</p><p className="mt-1 font-medium text-slate-800">{formatCurrency(selected.leadValue)}</p></div>
              <div>
                <p className="text-xs text-slate-400">Converted Amount</p>
                <p className="mt-1 font-medium text-emerald-700">
                  {selected.status === 'Converted' && selected.conversionValue
                    ? formatCurrency(selected.conversionValue)
                    : 'Not converted yet'}
                </p>
              </div>
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

              {selected.status === 'Converted' ? (
                <div className="mt-3 px-3 py-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-sm">
                  <p className="text-emerald-800 font-medium">Converted Amount: {formatCurrency(selected.conversionValue || 0)}</p>
                  <p className="text-xs text-emerald-700 mt-0.5">Converted on {selected.convertedDate || 'today'}</p>
                </div>
              ) : showConvertForm ? (
                <div ref={convertFormRef} className="mt-3 space-y-2 rounded-lg border border-brand-200 bg-brand-50/40 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-brand-800">Enter converted amount</p>
                    <button
                      type="button"
                      onClick={() => setShowConvertForm(false)}
                      className="text-xs text-slate-500 hover:text-rose-600 font-medium"
                    >
                      Close
                    </button>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1">
                      <Input
                        type="number"
                        value={convertAmount}
                        onChange={(e) => {
                          setConvertAmount(e.target.value)
                          setConvertError('')
                        }}
                        placeholder="Converted amount in rupees"
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        value={convertNote}
                        onChange={(e) => setConvertNote(e.target.value)}
                        placeholder="Convert note (optional)"
                      />
                    </div>
                    <Button size="sm" className="sm:mt-0" icon={<CheckCircle2 className="w-4 h-4" />} onClick={handleConvert}>
                      Convert
                    </Button>
                  </div>
                  {convertError && <p className="text-xs text-rose-600">{convertError}</p>}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setShowConvertForm(true)
                    setConvertAmount('')
                    setConvertNote('')
                    setConvertError('')
                  }}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-300 bg-white text-slate-700 hover:border-brand-400 hover:text-brand-700 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Convert
                </button>
              )}
            </div>

            <div>
              <p className="text-xs font-medium text-slate-600 mb-2">Add Follow-up</p>
              <div className="flex flex-wrap gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setFollowUpTypeDetail('Call')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    followUpTypeDetail === 'Call' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" /> Call
                </button>
                <button
                  type="button"
                  onClick={() => setFollowUpTypeDetail('Visit')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    followUpTypeDetail === 'Visit' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200'
                  }`}
                >
                  <CalendarClock className="w-3.5 h-3.5" /> Visit
                </button>
              </div>
              <div className="flex gap-2">
                <Input value={followUpNote} onChange={(e) => setFollowUpNote(e.target.value)} placeholder={`${followUpTypeDetail} follow-up notes`} />
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
                        <span className="text-xs font-medium text-slate-700">{f.date}{f.time ? ` · ${f.time}` : ''}</span>
                        <div className="flex items-center gap-1.5">
                          {f.type && <Badge tone={f.type === 'Visit' ? 'violet' : 'blue'}>{f.type}</Badge>}
                          <Badge tone={f.outcome === 'Converted' ? 'emerald' : 'cyan'}>{f.outcome}</Badge>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{f.notes}</p>
                      {f.outcome === 'Converted' && selected.conversionValue ? (
                        <p className="text-xs font-semibold text-emerald-700 mt-1.5">
                          Converted Amount: {formatCurrency(selected.conversionValue)}
                        </p>
                      ) : null}
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
