import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, SlidersHorizontal, X } from 'lucide-react'

export interface FilterOption {
  value: string
  label: string
}

interface FilterGroup {
  id: string
  label: string
  value: string
  options: FilterOption[]
}

interface CombinedFilterProps {
  groups: FilterGroup[]
  onChange: (groupId: string, value: string) => void
  onClear?: () => void
  className?: string
}

export function CombinedFilter({ groups, onChange, onClear, className = '' }: CombinedFilterProps) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState(groups[0]?.id || '')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const activeGroup = groups.find((g) => g.id === activeTab) || groups[0]
  const summary = groups
    .map((g) => {
      const selected = g.options.find((o) => o.value === g.value)
      return selected?.label || g.label
    })
    .join('  ·  ')

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border bg-surface transition-all duration-200 ${
          open
            ? 'border-brand-500 shadow-md ring-2 ring-brand-200 dark:ring-brand-800'
            : 'border-slate-200 dark:border-slate-600 shadow-card hover:border-brand-300 hover:shadow-md'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
              open
                ? 'bg-gradient-to-br from-brand-600 to-accent-600 text-white'
                : 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </span>
          <div className="min-w-0 text-left">
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Filters
            </p>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate max-w-[220px] sm:max-w-xs">
              {summary}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {onClear && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation()
                onClear()
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  e.stopPropagation()
                  onClear()
                }
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
              title="Clear all filters"
            >
              <X className="w-4 h-4" />
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${
              open ? 'rotate-180 text-brand-600 dark:text-brand-400' : ''
            }`}
          />
        </div>
      </button>

      {open && (
        <div className="absolute z-40 mt-2 w-full min-w-[280px] bg-surface rounded-2xl border border-slate-200 dark:border-slate-700 shadow-modal overflow-hidden animate-in">
          <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40">
            {groups.map((group) => {
              const isActive = group.id === activeTab
              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => setActiveTab(group.id)}
                  className={`flex-1 px-3 py-3 text-xs sm:text-sm font-medium transition-colors relative ${
                    isActive
                      ? 'text-brand-700 dark:text-brand-300 bg-surface'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-surface/60'
                  }`}
                >
                  {group.label}
                  {isActive && (
                    <span className="absolute left-3 right-3 bottom-0 h-0.5 bg-gradient-to-r from-brand-600 to-accent-600 rounded-full" />
                  )}
                </button>
              )
            })}
          </div>

          <div className="p-2 max-h-72 overflow-y-auto content-scroll">
            <div className="mb-2 px-2 pt-1">
              <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                {activeGroup?.label} options
              </p>
            </div>
            {activeGroup?.options.map((option) => {
              const active = option.value === activeGroup.value
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onChange(activeGroup.id, option.value)}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm text-left transition-all duration-150 mb-1 ${
                    active
                      ? 'bg-gradient-to-r from-brand-600 to-accent-600 text-white font-medium shadow-sm'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:text-brand-800 dark:hover:text-brand-300'
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  {active && <Check className="w-4 h-4 shrink-0" />}
                </button>
              )
            })}
          </div>

          <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 bg-surface">
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Switch tabs to change Role, Department or Status
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-brand-600 to-accent-600 text-white hover:opacity-90 transition-opacity"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
