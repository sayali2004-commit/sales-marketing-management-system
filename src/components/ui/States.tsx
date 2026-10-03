import type { ReactNode } from 'react'
import { SearchX } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
}

export function EmptyState({
  title = 'No data available',
  description = 'There are no records to display for the selected filters.',
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="text-center py-14 px-6">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-50 to-accent-50 dark:from-brand-900/30 dark:to-accent-900/20 flex items-center justify-center mx-auto mb-4 text-brand-500 dark:text-brand-400 shadow-soft">
        {icon || <SearchX className="w-8 h-8" />}
      </div>
      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 max-w-sm mx-auto leading-relaxed">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function LoadingState({ label = 'Loading data' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-brand-200 dark:border-brand-900" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-600 dark:border-t-brand-400 animate-spin" />
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 font-medium">{label}</p>
    </div>
  )
}
