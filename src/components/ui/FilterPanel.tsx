import type { ReactNode } from 'react'
import { SearchInput } from './Inputs'
import { SegmentedFilter, type FilterGroup } from './SegmentedFilter'

interface FilterPanelProps {
  search?: string
  onSearch?: (value: string) => void
  searchPlaceholder?: string
  groups: FilterGroup[]
  onChange: (groupId: string, value: string) => void
  onClear?: () => void
  actions?: ReactNode
}

export function FilterPanel({
  search,
  onSearch,
  searchPlaceholder = 'Search',
  groups,
  onChange,
  onClear,
  actions,
}: FilterPanelProps) {
  return (
    <div className="mb-6 space-y-5">
      {(onSearch || actions) && (
        <div className="flex flex-col lg:flex-row lg:items-end gap-3">
          {onSearch && (
            <div className="flex-1 max-w-md">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Search</p>
              <SearchInput value={search || ''} onChange={onSearch} placeholder={searchPlaceholder} />
            </div>
          )}
          {actions && <div className="flex flex-wrap items-center gap-2 lg:ml-auto">{actions}</div>}
        </div>
      )}
      <SegmentedFilter groups={groups} onChange={onChange} onClear={onClear} />
    </div>
  )
}
