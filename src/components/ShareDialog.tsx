import { useState } from 'react'
import { Modal, ModalActions } from './ui/Modal'
import { Select, Textarea } from './ui/FormControls'
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
    })
    setRecipient('')
    setReason('')
    setNote('')
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

        {error && <p className="text-xs text-rose-600">{error}</p>}
      </div>
    </Modal>
  )
}
