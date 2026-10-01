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
        className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border bg-white transition-all duration-200 ${
          open
            ? 'border-brand-500 shadow-md ring-2 ring-brand-100'
            : 'border-slate-200 shadow-card hover:border-brand-300 hover:shadow-md'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${open ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-600'}`}>
            <SlidersHorizontal className="w-4 h-4" />
          </span>
          <div className="min-w-0 text-left">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Filters</p>
            <p className="text-sm font-medium text-slate-800 truncate max-w-[220px] sm:max-w-xs">{summary}</p>
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
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Clear all filters"
            >
              <X className="w-4 h-4" />
            </span>
          )}
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180 text-brand-600' : ''}`} />
        </div>
      </button>

      {open && (
        <div className="absolute z-40 mt-2 w-full min-w-[280px] bg-white rounded-2xl border border-slate-200 shadow-modal overflow-hidden animate-in">
          <div className="flex border-b border-slate-100 bg-slate-50/80">
            {groups.map((group) => {
              const isActive = group.id === activeTab
              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => setActiveTab(group.id)}
                  className={`flex-1 px-3 py-3 text-xs sm:text-sm font-medium transition-colors relative ${
                    isActive ? 'text-brand-700 bg-white' : 'text-slate-500 hover:text-slate-700 hover:bg-white/60'
                  }`}
                >
                  {group.label}
                  {isActive && <span className="absolute left-3 right-3 bottom-0 h-0.5 bg-brand-600 rounded-full" />}
                </button>
              )
            })}
          </div>

          <div className="p-2 max-h-72 overflow-y-auto content-scroll">
            <div className="mb-2 px-2 pt-1">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{activeGroup?.label} options</p>
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
                      ? 'bg-brand-600 text-white font-medium shadow-sm'
                      : 'text-slate-700 hover:bg-brand-50 hover:text-brand-800'
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  {active && <Check className="w-4 h-4 shrink-0" />}
                </button>
              )
            })}
          </div>

          <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between gap-2 bg-white">
            <p className="text-[11px] text-slate-400">Switch tabs to change Role, Department or Status</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
