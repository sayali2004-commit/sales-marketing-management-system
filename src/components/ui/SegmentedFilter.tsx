import { useState } from 'react'
import { Check } from 'lucide-react'

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

interface SegmentedFilterProps {
  groups: FilterGroup[]
  onChange: (groupId: string, value: string) => void
  onClear?: () => void
  className?: string
}

export function SegmentedFilter({ groups, onChange, onClear, className = '' }: SegmentedFilterProps) {
  const [activeTab, setActiveTab] = useState(groups[0]?.id || '')
  const activeGroup = groups.find((g) => g.id === activeTab) || groups[0]

  return (
    <div className={className}>
      <div className="inline-flex flex-wrap items-center gap-1 p-1.5 rounded-full bg-slate-100/80 border border-slate-200/80 shadow-inner">
        {groups.map((group) => {
          const active = group.id === activeTab
          return (
            <button
              key={group.id}
              type="button"
              onClick={() => setActiveTab(group.id)}
              className={`relative px-5 sm:px-7 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide uppercase transition-all duration-300 ${
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

      <div className="mt-4">
        <div className="flex flex-wrap items-center gap-2">
          {activeGroup?.options.map((option) => {
            const active = option.value === activeGroup.value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange(activeGroup.id, option.value)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                  active
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-brand-400 hover:text-brand-700 hover:bg-brand-50/40'
                }`}
              >
                {active && <Check className="w-3.5 h-3.5" />}
                {option.label}
              </button>
            )
          })}
          {onClear && (
            <button
              type="button"
              onClick={onClear}
              className="px-3 py-2 rounded-full text-xs font-medium text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1"
            >
              Clear all
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
