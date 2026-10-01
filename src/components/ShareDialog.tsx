import { useState } from 'react'
import { FileText } from 'lucide-react'
import { Modal, ModalActions } from './ui/Modal'
import { Select, Textarea, Input } from './ui/FormControls'
import { employees } from '../data/sampleData'
import type { SharedRecord } from '../types'

const shareReasons = [
  'Manager Review',
  'Approval Required',
  'Team Information',
  'Customer Follow-up',
  'Travel Approval',
  'Business Update',
  'Other',
]

interface ShareDialogProps {
  open: boolean
  onClose: () => void
  relatedTo: string
  onShare: (record: SharedRecord) => void
}

export function ShareDialog({ open, onClose, relatedTo, onShare }: ShareDialogProps) {
  const [recipient, setRecipient] = useState('')
  const [reason, setReason] = useState('')
  const [note, setNote] = useState('')
  const [fileName, setFileName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    if (!recipient || !reason) {
      setError('Recipient and reason are required.')
      return
    }
    const now = new Date()
    onShare({
      id: `shr-${Date.now()}`,
      sharedById: 'current',
      sharedWithId: recipient,
      reason,
      note,
      date: now.toISOString().slice(0, 10),
      time: now.toTimeString().slice(0, 5),
      status: 'Pending',
      relatedTo,
      file: fileName || undefined,
    })
    setRecipient('')
    setReason('')
    setNote('')
    setFileName('')
    setError('')
    onClose()
  }

  return (
    <Modal
      open={open}
      title="Share Information"
      subtitle={`Sharing ${relatedTo}`}
      onClose={onClose}
      footer={<ModalActions onClose={onClose} onSubmit={handleSubmit} submitLabel="Share" />}
    >
      <div className="space-y-4">
        <Select
          label="Select Recipient"
          value={recipient}
          onChange={(e) => {
            setRecipient(e.target.value)
            setError('')
          }}
        >
          <option value="">Choose an employee</option>
          {employees
            .filter((e) => e.status === 'Active')
            .map((e) => (
              <option key={e.id} value={e.id}>
                {e.name} ({e.title})
              </option>
            ))}
        </Select>

        <Select
          label="Reason for Sharing"
          value={reason}
          onChange={(e) => {
            setReason(e.target.value)
            setError('')
          }}
        >
          <option value="">Select a reason</option>
          {shareReasons.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </Select>

        <Textarea
          label="Note (Optional)"
          placeholder="Add a short note for the recipient"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">File or Document (Optional)</label>
          <label className="flex items-center gap-3 px-4 py-3 border border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-brand-400 hover:bg-brand-50/40 transition-colors">
            <FileText className="w-5 h-5 text-slate-400" />
            <div>
              <p className="text-sm text-slate-700">{fileName || 'Click to attach a file'}</p>
              <p className="text-xs text-slate-400">PDF, DOCX, XLSX or image files</p>
            </div>
            <input
              type="file"
              className="hidden"
              onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
            />
          </label>
        </div>

        {error && <p className="text-xs text-rose-600">{error}</p>}
      </div>
    </Modal>
  )
}

export function ShareReasonInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <Input label="Reason" value={value} onChange={(e) => onChange(e.target.value)} />
}
