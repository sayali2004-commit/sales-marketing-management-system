type BadgeTone = 'slate' | 'blue' | 'emerald' | 'amber' | 'rose' | 'violet' | 'cyan'

interface BadgeProps {
  children: React.ReactNode
  tone?: BadgeTone
  className?: string
}

const tones: Record<BadgeTone, string> = {
  slate: 'bg-slate-100 text-slate-700 border-slate-200',
  blue: 'bg-brand-50 text-brand-700 border-brand-200',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  rose: 'bg-rose-50 text-rose-700 border-rose-200',
  violet: 'bg-violet-50 text-violet-700 border-violet-200',
  cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200',
}

export function Badge({ children, tone = 'slate', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}

export function statusTone(status: string): BadgeTone {
  const map: Record<string, BadgeTone> = {
    New: 'blue',
    Contacted: 'cyan',
    'Follow-up': 'amber',
    Interested: 'violet',
    Converted: 'emerald',
    'Not Converted': 'rose',
    Closed: 'slate',
    Scheduled: 'blue',
    'In Progress': 'amber',
    Completed: 'emerald',
    Cancelled: 'rose',
    Rescheduled: 'violet',
    Successful: 'emerald',
    'Follow-up Required': 'amber',
    'Not Interested': 'rose',
    'Customer Unavailable': 'slate',
    Approved: 'emerald',
    Pending: 'amber',
    Rejected: 'rose',
    Paid: 'emerald',
    Active: 'emerald',
    Inactive: 'slate',
    Partial: 'amber',
    'Partially Recovered': 'amber',
    Recovered: 'emerald',
    Acknowledged: 'blue',
  }
  return map[status] || 'slate'
}

export function StatusBadge({ status }: { status: string }) {
  return <Badge tone={statusTone(status)}>{status}</Badge>
}
