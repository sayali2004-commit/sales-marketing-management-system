import { useMemo, useState } from 'react'
import { Share2 } from 'lucide-react'
import { Badge, StatusBadge } from '../ui/Badge'
import { Card } from '../ui/Card'
import { Table, type Column } from '../ui/Table'
import { EmptyState } from '../ui/States'
import { SearchInput } from '../ui/Inputs'
import { ShareDialog } from '../ShareDialog'
import { employeeName } from '../../data/sampleData'
import type { SharedRecord } from '../../types'

interface SharedInformationProps {
  records: SharedRecord[]
  scopeLabel: string
  canShare: boolean
  currentEmployeeId?: string
  onShare?: (record: SharedRecord) => void
  title?: string
}

export function SharedInformationSection({
  records,
  scopeLabel,
  canShare,
  currentEmployeeId,
  onShare,
  title = 'Shared Information',
}: SharedInformationProps) {
  const [search, setSearch] = useState('')
  const [showShare, setShowShare] = useState(false)

  const filtered = useMemo(() => {
    return records.filter((r) => {
      const q = search.toLowerCase()
      return (
        !q ||
        employeeName(r.sharedById).toLowerCase().includes(q) ||
        employeeName(r.sharedWithId).toLowerCase().includes(q) ||
        r.reason.toLowerCase().includes(q) ||
        r.relatedTo.toLowerCase().includes(q)
      )
    })
  }, [records, search])

  const columns: Column<SharedRecord>[] = [
    {
      key: 'sharedById',
      header: 'Shared By',
      render: (r) => <span className="font-medium text-slate-800">{employeeName(r.sharedById)}</span>,
    },
    {
      key: 'sharedWithId',
      header: 'Shared With',
      render: (r) => <span className="text-slate-700">{employeeName(r.sharedWithId)}</span>,
    },
    {
      key: 'reason',
      header: 'Reason',
      render: (r) => <Badge tone="blue">{r.reason}</Badge>,
    },
    {
      key: 'note',
      header: 'Note',
      hideOnMobile: true,
      render: (r) => <span className="text-slate-600 text-xs">{r.note || 'No note added.'}</span>,
    },
    {
      key: 'relatedTo',
      header: 'Related To',
      hideOnMobile: true,
      render: (r) => <span className="text-slate-600">{r.relatedTo}</span>,
    },
    {
      key: 'date',
      header: 'Date / Time',
      className: 'whitespace-nowrap',
      render: (r) => (
        <div>
          <p className="text-slate-700">{r.date}</p>
          <p className="text-xs text-slate-400">{r.time}</p>
        </div>
      ),
    },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  ]

  return (
    <Card>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500 mt-0.5">{scopeLabel}</p>
        </div>
        {canShare && (
          <button
            onClick={() => setShowShare(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg bg-brand-600 text-white hover:bg-brand-700"
          >
            <Share2 className="w-4 h-4" /> Share Information
          </button>
        )}
      </div>

      <div className="mb-4 max-w-md">
        <SearchInput value={search} onChange={setSearch} placeholder="Search shared records" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No shared information" description="Share documents or updates with your team using the Share button." />
      ) : (
        <Table columns={columns} data={filtered} />
      )}

      <ShareDialog
        open={showShare}
        onClose={() => setShowShare(false)}
        relatedTo="Selected record"
        onShare={(record) => {
          onShare?.({
            ...record,
            sharedById: currentEmployeeId || record.sharedById,
          })
          setShowShare(false)
        }}
      />
    </Card>
  )
}
