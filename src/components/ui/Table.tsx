import { useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

export interface Column<T> {
  key: string
  header: string
  render?: (row: T) => ReactNode
  className?: string
  hideOnMobile?: boolean
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  emptyMessage?: string
  onRowClick?: (row: T) => void
  mobileLimit?: number
}

function cellValue<T>(col: Column<T>, row: T): ReactNode {
  if (col.render) return col.render(row)
  return String((row as Record<string, unknown>)[col.key] ?? '')
}

function rowKey<T>(row: T, index: number): string {
  return (row as { id?: string }).id ?? String(index)
}

export function Table<T>({
  columns,
  data,
  emptyMessage = 'No records found',
  onRowClick,
  mobileLimit = 5,
}: TableProps<T>) {
  const [expandedKey, setExpandedKey] = useState<string | null>(null)
  const [limit, setLimit] = useState(mobileLimit)

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-slate-500 dark:text-slate-400">{emptyMessage}</p>
      </div>
    )
  }

  const mobileCols = columns.filter((c) => c.key !== 'actions')
  const primary = mobileCols[0]
  const secondary = mobileCols[1]
  const badgeCol = mobileCols.find((c) => c.key === 'status') || mobileCols[mobileCols.length - 1]
  const rest = mobileCols.filter((c) => c.key !== primary?.key && c.key !== secondary?.key && c.key !== badgeCol?.key)
  const actionsCol = columns.find((c) => c.key === 'actions')

  const mobileData = data.slice(0, limit)

  return (
    <>
      {/* Mobile: card list — no horizontal scroll */}
      <div className="lg:hidden space-y-2">
        {mobileData.map((row, index) => {
          const key = rowKey(row, index)
          const open = expandedKey === key
          return (
            <div key={key} className="ui-card overflow-hidden">
              <button
                type="button"
                onClick={() => setExpandedKey(open ? null : key)}
                className="w-full flex items-start gap-3 p-3.5 text-left"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  {primary && (
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-900 break-words">
                      {cellValue(primary, row)}
                    </div>
                  )}
                  {secondary && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 break-words">
                      {cellValue(secondary, row)}
                    </div>
                  )}
                  {badgeCol && badgeCol.key !== primary?.key && badgeCol.key !== secondary?.key && (
                    <div className="pt-0.5">{cellValue(badgeCol, row)}</div>
                  )}
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 mt-1 transition-transform ${
                    open ? 'rotate-180 text-brand-600' : ''
                  }`}
                />
              </button>

              {open && (
                <div className="px-3.5 pb-3.5 pt-0 animate-in border-t border-slate-100 dark:border-slate-800">
                  <div className="grid grid-cols-2 gap-x-3 gap-y-2 pt-3">
                    {rest.map((col) => (
                      <div key={col.key} className="min-w-0">
                        <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide truncate">
                          {col.header}
                        </p>
                        <div className="text-xs text-slate-700 dark:text-slate-600 mt-0.5 break-words">
                          {cellValue(col, row)}
                        </div>
                      </div>
                    ))}
                  </div>
                  {actionsCol && (
                    <div className="flex flex-wrap items-center gap-2 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
                      {actionsCol.render?.(row)}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}

        {data.length > limit && (
          <button
            type="button"
            onClick={() => setLimit((n) => n + mobileLimit)}
            className="w-full ui-card py-3 text-sm font-semibold text-brand-600 dark:text-brand-400"
          >
            View more ({data.length - limit} remaining)
          </button>
        )}
      </div>

      {/* Desktop: table */}
      <div className="hidden lg:block overflow-x-auto content-scroll -mx-1 px-1">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`text-left text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2 sm:px-3 py-2.5 ${
                    col.hideOnMobile ? 'hidden md:table-cell' : ''
                  } ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {data.map((row, index) => {
              const key = rowKey(row, index)
              return (
                <tr
                  key={key}
                  className={`transition-colors ${
                    onRowClick ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60' : ''
                  }`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-2 sm:px-3 py-3 text-slate-700 dark:text-slate-600 ${
                        col.hideOnMobile ? 'hidden md:table-cell' : ''
                      } ${col.className || ''}`}
                    >
                      {cellValue(col, row)}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
