type BadgeTone = 'slate' | 'blue' | 'emerald' | 'amber' | 'rose' | 'violet' | 'cyan'

interface BadgeProps {
  children: React.ReactNode
  tone?: BadgeTone
  className?: string
}

const tones: Record<BadgeTone, string> = {
  slate: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-700 border-slate-200 dark:border-slate-700',
  blue: 'bg-brand-50 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 border-brand-200 dark:border-brand-800',
  emerald: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  amber: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  rose: 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  violet: 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800',
  cyan: 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
}

export function Badge({ children, tone = 'slate', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${tones[tone]} ${className}`}
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
