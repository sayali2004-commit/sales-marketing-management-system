import { useState } from 'react'
import { Check } from 'lucide-react'
import { statusTone } from './Badge'

export interface FilterOption {
  value: string
  label: string
}

export interface FilterGroup {
  id: string
  label: string
  value: string
  options: FilterOption[]
}

interface SegmentedFilterProps {
  groups: FilterGroup[]
  onChange: (groupId: string, value: string) => void
  onClear?: () => void
  className?: string
}

const toneStyles: Record<string, { idle: string; active: string }> = {
  slate: {
    idle: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700',
    active: 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 border-slate-800 dark:border-slate-200',
  },
  blue: {
    idle: 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 border-brand-200 dark:border-brand-800 hover:bg-brand-100 dark:hover:bg-brand-900/50',
    active: 'bg-brand-600 text-white border-brand-600',
  },
  cyan: {
    idle: 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800 hover:bg-cyan-100 dark:hover:bg-cyan-900/50',
    active: 'bg-cyan-600 text-white border-cyan-600',
  },
  emerald: {
    idle: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50',
    active: 'bg-emerald-600 text-white border-emerald-600',
  },
  amber: {
    idle: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/50',
    active: 'bg-amber-500 text-white border-amber-500',
  },
  rose: {
    idle: 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/50',
    active: 'bg-rose-600 text-white border-rose-600',
  },
  violet: {
    idle: 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800 hover:bg-violet-100 dark:hover:bg-violet-900/50',
    active: 'bg-violet-600 text-white border-violet-600',
  },
}

function optionClasses(value: string, active: boolean) {
  const tone = statusTone(value)
  const style = toneStyles[tone] || toneStyles.slate
  return active ? style.active : style.idle
}

export function SegmentedFilter({ groups, onChange, onClear, className = '' }: SegmentedFilterProps) {
  const [activeTab, setActiveTab] = useState(groups[0]?.id || '')
  const activeGroup = groups.find((g) => g.id === activeTab) || groups[0]

  return (
    <div className={className}>
      <div className="flex justify-center">
        <div className="inline-flex flex-wrap items-center justify-center gap-1 p-1.5 rounded-full bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 shadow-inner w-full max-w-xl">
          {groups.map((group) => {
            const active = group.id === activeTab
            return (
              <button
                key={group.id}
                type="button"
                onClick={() => setActiveTab(group.id)}
                className={`flex-1 min-w-[90px] sm:min-w-[120px] px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-wide uppercase transition-all duration-300 ${
                  active
                    ? 'bg-gradient-to-r from-brand-600 to-accent-600 text-white shadow-md shadow-brand-600/30'
                    : 'text-slate-500 dark:text-slate-400 hover:text-brand-700 dark:hover:text-brand-300 hover:bg-surface/70 dark:hover:bg-slate-700/60'
                }`}
              >
                {group.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-3">
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {activeGroup?.options.map((option) => {
            const active = option.value === activeGroup.value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange(activeGroup.id, option.value)}
                className={`inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-medium border transition-all duration-200 shadow-sm ${optionClasses(option.value, active)}`}
              >
                {active && <Check className="w-3 h-3" />}
                {option.label}
              </button>
            )
          })}
          {onClear && (
            <button
              type="button"
              onClick={onClear}
              className="px-3 py-1.5 rounded-full text-[11px] font-medium text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
