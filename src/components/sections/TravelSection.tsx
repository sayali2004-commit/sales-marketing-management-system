import { useMemo, useState } from 'react'
import { CheckCircle2, Plus, Share2, XCircle, IndianRupee } from 'lucide-react'
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
import { LocationField } from '../LocationField'
import { employeeName, formatCurrency } from '../../data/sampleData'
import type { TravelRecord } from '../../types'

const travelModes = ['Car', 'Two Wheeler', 'Bus', 'Train', 'Flight', 'Other']

interface TravelSectionProps {
  records: TravelRecord[]
  scopeLabel: string
  canCreate: boolean
  canApprove: boolean
  currentEmployeeId?: string
  onAddRecord?: (record: TravelRecord) => void
  onUpdateRecord?: (record: TravelRecord) => void
  showReimbursement?: boolean
  title?: string
  perKmRate?: number
}

export function TravelSection({
  records,
  scopeLabel,
  canCreate,
  canApprove,
  currentEmployeeId,
  onAddRecord,
  onUpdateRecord,
  showReimbursement = true,
  title = 'Travel Management',
  perKmRate = 10,
}: TravelSectionProps) {
  const [search, setSearch] = useState('')
  const [approvalFilter, setApprovalFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [modeFilter, setModeFilter] = useState('all')
  const [showCreate, setShowCreate] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [sharedRecord, setSharedRecord] = useState<TravelRecord | null>(null)
  const [distance, setDistance] = useState('')
  const [rate, setRate] = useState(String(perKmRate))
  const [form, setForm] = useState({
    startDate: '',
    destination: '',
    travelDate: '',
    purpose: 'Customer Visit',
    travelMode: 'Two Wheeler',
    location: '',
    notes: '',
  })

  const filtered = useMemo(() => {
    return records.filter((r) => {
      const q = search.toLowerCase()
      const matchQ =
        !q ||
        employeeName(r.employeeId).toLowerCase().includes(q) ||
        r.destination.toLowerCase().includes(q) ||
        r.purpose.toLowerCase().includes(q)
      const matchApproval = approvalFilter === 'all' || r.approvalStatus === approvalFilter
      const matchPayment = paymentFilter === 'all' || r.paymentStatus === paymentFilter
      const matchMode = modeFilter === 'all' || r.travelMode === modeFilter
      return matchQ && matchApproval && matchPayment && matchMode
    })
  }, [records, search, approvalFilter, paymentFilter, modeFilter])

  const stats = useMemo(() => {
    const totalDistance = records.reduce((s, r) => s + r.distance, 0)
    const totalAmount = records.reduce((s, r) => s + r.totalAmount, 0)
    const pendingClaims = records.filter((r) => r.approvalStatus === 'Pending').length
    const paid = records.filter((r) => r.paymentStatus === 'Paid').reduce((s, r) => s + r.totalAmount, 0)
    return { totalDistance, totalAmount, pendingClaims, paid }
  }, [records])

  const autoTotal = (Number(distance) || 0) * (Number(rate) || 0)

  const reimbursementColumns: Column<TravelRecord>[] = [
    {
      key: 'employeeId',
      header: 'Employee Name',
      render: (r) => <span className="font-medium text-slate-800">{employeeName(r.employeeId)}</span>,
    },
    { key: 'travelDate', header: 'Date', className: 'whitespace-nowrap', render: (r) => <span className="text-slate-700">{r.travelDate}</span> },
    { key: 'startDate', header: 'Starting Point', hideOnMobile: true, render: (r) => <span className="text-slate-600">{r.startDate}</span> },
    { key: 'destination', header: 'Destination', render: (r) => <span className="text-slate-600">{r.destination}</span> },
    { key: 'distance', header: 'Distance', className: 'whitespace-nowrap', render: (r) => <span>{r.distance} KM</span> },
    { key: 'perKmRate', header: 'Per KM Rate', hideOnMobile: true, className: 'whitespace-nowrap', render: (r) => <span>{formatCurrency(r.perKmRate)}</span> },
    {
      key: 'totalAmount',
      header: 'Total Amount',
      className: 'whitespace-nowrap',
      render: (r) => <span className="font-semibold text-slate-900">{formatCurrency(r.totalAmount)}</span>,
    },
    { key: 'approvalStatus', header: 'Approval', render: (r) => <StatusBadge status={r.approvalStatus} /> },
    { key: 'paymentStatus', header: 'Payment', render: (r) => <StatusBadge status={r.paymentStatus} /> },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (r) =>
        canApprove && r.approvalStatus === 'Pending' ? (
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onUpdateRecord?.({ ...r, approvalStatus: 'Approved' })
              }}
              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50"
              title="Approve"
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onUpdateRecord?.({ ...r, approvalStatus: 'Rejected' })
              }}
              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
              title="Reject"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setSharedRecord(r)
              setShowShare(true)
            }}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 ml-auto"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        ),
    },
  ]

  const handleCreate = () => {
    if (!form.destination || !form.travelDate || !distance) return
    const rec: TravelRecord = {
      id: `trv-${Date.now()}`,
      employeeId: currentEmployeeId || 'emp-004',
      startDate: form.startDate,
      destination: form.destination,
      travelDate: form.travelDate,
      purpose: form.purpose,
      distance: Number(distance),
      travelMode: form.travelMode as TravelRecord['travelMode'],
      perKmRate: Number(rate) || 10,
      totalAmount: autoTotal,
      location: form.location,
      notes: form.notes,
      approvalStatus: 'Pending',
      paymentStatus: 'Pending',
    }
    onAddRecord?.(rec)
    setShowCreate(false)
    setDistance('')
    setForm({ startDate: '', destination: '', travelDate: '', purpose: 'Customer Visit', travelMode: 'Two Wheeler', location: '', notes: '' })
  }

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Travel Distance', value: `${stats.totalDistance.toLocaleString('en-IN')} KM`, icon: 'dist' },
          { label: 'Total Travel Expense', value: formatCurrency(stats.totalAmount), icon: 'amt' },
          { label: 'Pending Claims', value: String(stats.pendingClaims), icon: 'pend' },
          { label: 'Total Paid', value: formatCurrency(stats.paid), icon: 'paid' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 shadow-card p-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{s.label}</p>
            <p className="text-lg font-semibold text-slate-900 mt-1.5">{s.value}</p>
          </div>
        ))}
      </div>

      {canCreate && (
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-900">Quick Travel Entry</h3>
            <Badge tone="blue">Auto Calculation</Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input label="Distance (KM)" type="number" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="25" />
            <Input label="Per KM Rate (INR)" type="number" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="10" />
            <div className="flex items-end">
              <div className="w-full px-4 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                <p className="text-xs text-emerald-700 font-medium">Total Travel Amount</p>
                <p className="text-lg font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
                  <IndianRupee className="w-4 h-4" />
                  {autoTotal.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
            <div className="flex items-end">
              <Button className="w-full" icon={<Plus className="w-4 h-4" />} onClick={() => setShowCreate(true)}>
                Record Travel
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-500 mt-0.5">{scopeLabel}</p>
          </div>
        </div>

        <FilterPanel
          search={search}
          onSearch={setSearch}
          searchPlaceholder="Search travel records"
          groups={[
            {
              id: 'approval',
              label: 'Approval',
              value: approvalFilter,
              options: [
                { value: 'all', label: 'All' },
                { value: 'Pending', label: 'Pending' },
                { value: 'Approved', label: 'Approved' },
                { value: 'Rejected', label: 'Rejected' },
              ],
            },
            ...(showReimbursement
              ? [
                  {
                    id: 'payment',
                    label: 'Payment',
                    value: paymentFilter,
                    options: [
                      { value: 'all', label: 'All' },
                      { value: 'Pending', label: 'Pending' },
                      { value: 'Paid', label: 'Paid' },
                    ],
                  },
                ]
              : []),
            {
              id: 'mode',
              label: 'Mode',
              value: modeFilter,
              options: [{ value: 'all', label: 'All Modes' }, ...travelModes.map((m) => ({ value: m, label: m }))],
            },
          ]}
          onChange={(id, value) => {
            if (id === 'approval') setApprovalFilter(value)
            if (id === 'payment') setPaymentFilter(value)
            if (id === 'mode') setModeFilter(value)
          }}
          onClear={() => {
            setApprovalFilter('all')
            setPaymentFilter('all')
            setModeFilter('all')
            setSearch('')
          }}
        />

        {filtered.length === 0 ? (
          <EmptyState title="No travel records" description="Record travel details or adjust the filters." />
        ) : (
          <Table columns={reimbursementColumns} data={filtered} emptyMessage="No travel records found." />
        )}
      </Card>

      <Modal open={showCreate} title="Record Travel" subtitle="Use mobile GPS for start and destination points. Amount is distance multiplied by per kilometer rate." onClose={() => setShowCreate(false)} footer={<ModalActions onClose={() => setShowCreate(false)} onSubmit={handleCreate} submitLabel="Save Travel Record" />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <LocationField
            label="Starting Point"
            value={form.startDate}
            onChange={(v) => setForm({ ...form, startDate: v })}
            placeholder="Where you are starting from"
            helper="Tap Use my location to capture your exact GPS point"
          />
          <LocationField
            label="Destination"
            value={form.destination}
            onChange={(v) => setForm({ ...form, destination: v })}
            placeholder="Where you are going"
            helper="Capture the destination location from your phone"
          />
          <Input label="Travel Date" type="date" value={form.travelDate} onChange={(e) => setForm({ ...form, travelDate: e.target.value })} />
          <Select label="Travel Purpose" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })}>
            {['Customer Visit', 'Meeting', 'Site Inspection', 'Training', 'Client Presentation'].map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </Select>
          <Input label="Distance (KM)" type="number" value={distance} onChange={(e) => setDistance(e.target.value)} />
          <Select label="Travel Mode" value={form.travelMode} onChange={(e) => setForm({ ...form, travelMode: e.target.value })}>
            {travelModes.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </Select>
          <Input label="Per KM Rate (INR)" type="number" value={rate} onChange={(e) => setRate(e.target.value)} />
          <div className="flex items-end">
            <div className="w-full px-4 py-2.5 rounded-lg bg-brand-50 border border-brand-200">
              <p className="text-xs text-brand-700 font-medium">Total Travel Amount</p>
              <p className="text-lg font-semibold text-brand-700">{formatCurrency(autoTotal)}</p>
            </div>
          </div>
          <LocationField
            label="Current Location"
            value={form.location}
            onChange={(v) => setForm({ ...form, location: v })}
            placeholder="Your live location while traveling"
          />
          <div className="sm:col-span-2">
            <Textarea label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
        </div>
      </Modal>

      {sharedRecord && (
        <ShareDialog
          open={showShare}
          onClose={() => setShowShare(false)}
          relatedTo={`Travel claim for ${employeeName(sharedRecord.employeeId)}`}
          onShare={() => setShowShare(false)}
        />
      )}
    </div>
  )
}
