import type { ReactNode } from 'react'
import { Search } from 'lucide-react'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchInput({ value, onChange, placeholder = 'Search', className = '' }: SearchInputProps) {
  return (
    <div className={`relative w-full ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-3 py-2.5 text-sm bg-surface text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-600 rounded-xl placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-400/40 focus:border-brand-500 transition-all"
      />
    </div>
  )
}

interface FilterBarProps {
  children: ReactNode
  className?: string
}

export function FilterBar({ children, className = '' }: FilterBarProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap items-center gap-2.5 ${className}`}>
      {children}
    </div>
  )
}

interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="ui-card p-4 sm:p-5 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}

interface StatGridProps {
  children: ReactNode
  cols?: 2 | 4 | 5
  className?: string
}

export function StatGrid({ children, cols = 2, className = '' }: StatGridProps) {
  const colClass =
    cols === 5
      ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
      : cols === 4
        ? 'grid-cols-2 lg:grid-cols-4'
        : 'grid-cols-2'

  return (
    <div className={`grid ${colClass} gap-3 mb-6 [&>*]:min-w-0 ${className}`}>
      {children}
    </div>
  )
}

export function StatTile({
  label,
  value,
  tone = 'text-slate-900 dark:text-slate-50',
  lastOddFull = false,
}: {
  label: string
  value: string | number
  tone?: string
  lastOddFull?: boolean
}) {
  return (
    <div className={`ui-card p-4 ${lastOddFull ? 'col-span-2 sm:col-span-1' : ''}`}>
      <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide truncate">
        {label}
      </p>
      <p className={`text-base sm:text-lg font-bold mt-1.5 break-words ${tone}`}>{value}</p>
    </div>
  )
}
