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
    idle: 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200',
    active: 'bg-slate-800 text-white border-slate-800',
  },
  blue: {
    idle: 'bg-brand-50 text-brand-700 border-brand-200 hover:bg-brand-100',
    active: 'bg-brand-600 text-white border-brand-600',
  },
  cyan: {
    idle: 'bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100',
    active: 'bg-cyan-600 text-white border-cyan-600',
  },
  emerald: {
    idle: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
    active: 'bg-emerald-600 text-white border-emerald-600',
  },
  amber: {
    idle: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
    active: 'bg-amber-500 text-white border-amber-500',
  },
  rose: {
    idle: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100',
    active: 'bg-rose-600 text-white border-rose-600',
  },
  violet: {
    idle: 'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100',
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
        <div className="inline-flex flex-wrap items-center justify-center gap-1 p-1.5 rounded-full bg-slate-100/80 border border-slate-200/80 shadow-inner w-full max-w-xl">
          {groups.map((group) => {
            const active = group.id === activeTab
            return (
              <button
                key={group.id}
                type="button"
                onClick={() => setActiveTab(group.id)}
                className={`flex-1 min-w-[90px] sm:min-w-[120px] px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-wide uppercase transition-all duration-300 ${
                  active
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                    : 'text-slate-500 hover:text-brand-700 hover:bg-white/70'
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
              className="px-3 py-1.5 rounded-full text-[11px] font-medium text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
