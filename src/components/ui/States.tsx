import type { ReactNode } from 'react'
import { SearchX } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
}

export function EmptyState({ title = 'No data available', description = 'There are no records to display for the selected filters.', icon, action }: EmptyStateProps) {
  return (
    <div className="text-center py-14 px-6">
      <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
        {icon || <SearchX className="w-7 h-7" />}
      </div>
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function LoadingState({ label = 'Loading data' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-8 h-8 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      <p className="text-sm text-slate-500 mt-4">{label}</p>
    </div>
  )
}
