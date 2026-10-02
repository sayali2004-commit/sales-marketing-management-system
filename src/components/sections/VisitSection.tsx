import { useMemo, useState } from 'react'
import { CalendarPlus, Share2 } from 'lucide-react'
import { Badge, StatusBadge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Input, Select, Textarea } from '../ui/FormControls'
import { Modal, ModalActions } from '../ui/Modal'
import { Table, type Column } from '../ui/Table'
import { EmptyState } from '../ui/States'
import { FilterBar, SearchInput } from '../ui/Inputs'
import { FilterPanel } from '../ui/FilterPanel'
import { FileList } from '../FileManager'
import { ShareDialog } from '../ShareDialog'
import { LocationField } from '../LocationField'
import { employeeName, leads } from '../../data/sampleData'
import type { AppFile, Visit, VisitOutcome, VisitStatus } from '../../types'

const outcomes: VisitOutcome[] = ['Successful', 'Follow-up Required', 'Interested', 'Not Interested', 'Converted', 'Not Converted', 'Customer Unavailable', 'Rescheduled']
const visitStatuses: VisitStatus[] = ['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Rescheduled']

interface VisitSectionProps {
  visits: Visit[]
  scopeLabel: string
  canCreate: boolean
  canUpdateStatus: boolean
  currentEmployeeId?: string
  onAddVisit?: (visit: Visit) => void
  onUpdateVisit?: (visit: Visit) => void
  title?: string
}

export function VisitSection({
  visits,
  scopeLabel,
  canCreate,
  canUpdateStatus,
  currentEmployeeId,
  onAddVisit,
  onUpdateVisit,
  title = 'Visit Management',
}: VisitSectionProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [outcomeFilter, setOutcomeFilter] = useState('all')
  const [selected, setSelected] = useState<Visit | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [newFiles, setNewFiles] = useState<AppFile[]>([])
  const [form, setForm] = useState({
    customerName: '',
    leadId: '',
    visitDate: '',
    visitTime: '',
    startingPoint: '',
    destination: '',
    customerLocation: '',
    purpose: 'Product Demo',
    notes: '',
  })

  const filtered = useMemo(() => {
    return visits.filter((v) => {
      const q = search.toLowerCase()
      const matchQ = !q || v.customerName.toLowerCase().includes(q) || v.visitId.toLowerCase().includes(q) || employeeName(v.employeeId).toLowerCase().includes(q)
      const matchStatus = statusFilter === 'all' || v.status === statusFilter
      const matchOutcome = outcomeFilter === 'all' || v.outcome === outcomeFilter
      return matchQ && matchStatus && matchOutcome
    })
  }, [visits, search, statusFilter, outcomeFilter])

  const stats = useMemo(() => {
    const total = visits.length
    const completed = visits.filter((v) => v.status === 'Completed').length
    const upcoming = visits.filter((v) => v.status === 'Scheduled').length
    const successful = visits.filter((v) => v.outcome === 'Successful' || v.outcome === 'Converted').length
    const unsuccessful = visits.filter((v) => v.outcome === 'Not Interested' || v.outcome === 'Not Converted').length
    return { total, completed, upcoming, successful, unsuccessful }
  }, [visits])

  const columns: Column<Visit>[] = [
    { key: 'visitId', header: 'Visit ID', render: (r) => <span className="font-medium text-slate-900">{r.visitId}</span> },
    {
      key: 'customerName',
      header: 'Customer',
      render: (r) => (
        <div>
          <p className="font-medium text-slate-800">{r.customerName}</p>
          <p className="text-xs text-slate-400">{r.purpose}</p>
        </div>
      ),
    },
    {
      key: 'employeeId',
      header: 'Employee',
      hideOnMobile: true,
      render: (r) => <span className="text-slate-600">{employeeName(r.employeeId)}</span>,
    },
    {
      key: 'visitDate',
      header: 'Date / Time',
      className: 'whitespace-nowrap',
      render: (r) => (
        <div>
          <p className="text-slate-700">{r.visitDate}</p>
          <p className="text-xs text-slate-400">{r.visitTime}</p>
        </div>
      ),
    },
    {
      key: 'destination',
      header: 'Destination',
      hideOnMobile: true,
      render: (r) => <span className="text-slate-600">{r.destination}</span>,
    },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    {
      key: 'outcome',
      header: 'Outcome',
      hideOnMobile: true,
      render: (r) => (r.outcome ? <Badge tone="cyan">{r.outcome}</Badge> : <span className="text-slate-400">Pending</span>),
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); setSelected(r); setShowShare(true) }}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  const handleCreate = () => {
    if (!form.customerName || !form.visitDate) return
    const visit: Visit = {
      id: `visit-${Date.now()}`,
      visitId: `VST-${String(visits.length + 1).padStart(4, '0')}`,
      customerName: form.customerName,
      leadId: form.leadId || null,
      employeeId: currentEmployeeId || 'emp-004',
      visitDate: form.visitDate,
      visitTime: form.visitTime,
      startingPoint: form.startingPoint,
      destination: form.destination,
      customerLocation: form.customerLocation,
      purpose: form.purpose,
      outcome: '',
      status: 'Scheduled',
      notes: form.notes,
      files: newFiles,
    }
    onAddVisit?.(visit)
    setShowCreate(false)
    setForm({ customerName: '', leadId: '', visitDate: '', visitTime: '', startingPoint: '', destination: '', customerLocation: '', purpose: 'Product Demo', notes: '' })
    setNewFiles([])
  }

  const handleUpdateVisit = (updates: Partial<Visit>) => {
    if (!selected) return
    const updated = { ...selected, ...updates }
    onUpdateVisit?.(updated)
    setSelected(updated)
  }

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        {[
          { label: 'Total Visits', value: String(stats.total) },
          { label: 'Completed', value: String(stats.completed) },
          { label: 'Upcoming', value: String(stats.upcoming) },
          { label: 'Successful', value: String(stats.successful) },
          { label: 'Unsuccessful', value: String(stats.unsuccessful) },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 shadow-card p-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{s.label}</p>
            <p className="text-2xl font-semibold text-slate-900 mt-1.5">{s.value}</p>
          </div>
        ))}
      </div>

      <Card>
        <div className="mb-4">
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500 mt-0.5">{scopeLabel}</p>
        </div>

        <FilterPanel
          search={search}
          onSearch={setSearch}
          searchPlaceholder="Search visits"
          groups={[
            {
              id: 'status',
              label: 'Status',
              value: statusFilter,
              options: [{ value: 'all', label: 'All Statuses' }, ...visitStatuses.map((s) => ({ value: s, label: s }))],
            },
            {
              id: 'outcome',
              label: 'Outcome',
              value: outcomeFilter,
              options: [{ value: 'all', label: 'All Outcomes' }, ...outcomes.map((o) => ({ value: o, label: o }))],
            },
          ]}
          onChange={(id, value) => {
            if (id === 'status') setStatusFilter(value)
            if (id === 'outcome') setOutcomeFilter(value)
          }}
          onClear={() => {
            setStatusFilter('all')
            setOutcomeFilter('all')
            setSearch('')
          }}
          actions={
            canCreate && (
              <Button size="sm" icon={<CalendarPlus className="w-4 h-4" />} onClick={() => setShowCreate(true)}>
                Create Visit
              </Button>
            )
          }
        />

        {filtered.length === 0 ? (
          <EmptyState title="No visits found" description="Create a customer visit or adjust the current filters." />
        ) : (
          <Table columns={columns} data={filtered} onRowClick={(r) => { setSelected(r); setShowDetail(true) }} />
        )}
      </Card>

      <Modal open={showCreate} title="Create Visit" subtitle="Schedule a new customer visit" onClose={() => setShowCreate(false)} size="lg" footer={<ModalActions onClose={() => setShowCreate(false)} onSubmit={handleCreate} submitLabel="Create Visit" />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Customer Name" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
          <Select label="Related Lead (Optional)" value={form.leadId} onChange={(e) => setForm({ ...form, leadId: e.target.value })}>
            <option value="">No linked lead</option>
            {leads.slice(0, 20).map((l) => (
              <option key={l.id} value={l.id}>{l.leadId} · {l.customerName}</option>
            ))}
          </Select>
          <Input label="Visit Date" type="date" value={form.visitDate} onChange={(e) => setForm({ ...form, visitDate: e.target.value })} />
          <Input label="Visit Time" type="time" value={form.visitTime} onChange={(e) => setForm({ ...form, visitTime: e.target.value })} />
          <LocationField
            label="Starting Point"
            value={form.startingPoint}
            onChange={(v) => setForm({ ...form, startingPoint: v })}
            placeholder="Where you are starting from"
            helper="Use mobile GPS to capture your exact start point"
          />
          <LocationField
            label="Destination"
            value={form.destination}
            onChange={(v) => setForm({ ...form, destination: v })}
            placeholder="Customer site or destination"
            helper="Exact point you need to go to"
          />
          <LocationField
            label="Customer Location"
            value={form.customerLocation}
            onChange={(v) => setForm({ ...form, customerLocation: v })}
            placeholder="Where you reached or the customer address"
            helper="Capture when you reach the customer location"
          />
          <Select label="Visit Purpose" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })}>
            {['Product Demo', 'Follow-up Meeting', 'Proposal Discussion', 'Contract Signing', 'Relationship Building'].map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </Select>
          <div className="sm:col-span-2">
            <Textarea label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
        </div>
      </Modal>

      <Modal open={showDetail && !!selected} title={selected?.visitId || 'Visit'} subtitle={selected?.customerName} onClose={() => setShowDetail(false)} size="lg" footer={
        <>
          {selected && <Button variant="secondary" icon={<Share2 className="w-4 h-4" />} onClick={() => { setShowDetail(false); setShowShare(true) }}>Share</Button>}
          <Button onClick={() => setShowDetail(false)}>Close</Button>
        </>
      }>
        {selected && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div><p className="text-xs text-slate-400">Status</p><div className="mt-1"><StatusBadge status={selected.status} /></div></div>
              <div><p className="text-xs text-slate-400">Outcome</p><div className="mt-1">{selected.outcome ? <Badge tone="cyan">{selected.outcome}</Badge> : <span className="text-slate-400">Pending</span>}</div></div>
              <div><p className="text-xs text-slate-400">Employee</p><p className="mt-1 font-medium text-slate-800">{employeeName(selected.employeeId)}</p></div>
              <div><p className="text-xs text-slate-400">Visit Date</p><p className="mt-1 font-medium text-slate-800">{selected.visitDate} at {selected.visitTime}</p></div>
              <div><p className="text-xs text-slate-400">Starting Point</p><p className="mt-1 font-medium text-slate-800">{selected.startingPoint}</p></div>
              <div><p className="text-xs text-slate-400">Destination</p><p className="mt-1 font-medium text-slate-800">{selected.destination}</p></div>
              <div><p className="text-xs text-slate-400">Customer Location</p><p className="mt-1 font-medium text-slate-800">{selected.customerLocation}</p></div>
              <div><p className="text-xs text-slate-400">Purpose</p><p className="mt-1 font-medium text-slate-800">{selected.purpose}</p></div>
            </div>

            {canUpdateStatus && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select label="Update Status" value={selected.status} onChange={(e) => handleUpdateVisit({ status: e.target.value as VisitStatus })}>
                  {visitStatuses.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </Select>
                <Select label="Update Outcome" value={selected.outcome} onChange={(e) => handleUpdateVisit({ outcome: e.target.value as VisitOutcome })}>
                  <option value="">Select outcome</option>
                  {outcomes.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </Select>
              </div>
            )}

            <div>
              <p className="text-xs font-medium text-slate-600 mb-2">Visit Notes</p>
              <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3">{selected.notes || 'No notes added.'}</p>
            </div>

            <FileList files={selected.files} title="Uploaded Files" />
          </div>
        )}
      </Modal>

      {selected && (
        <ShareDialog open={showShare} onClose={() => setShowShare(false)} relatedTo={`Visit ${selected.visitId}`} onShare={() => setShowShare(false)} />
      )}
    </div>
  )
}


