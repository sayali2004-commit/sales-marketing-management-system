import type { ReactNode } from 'react'

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
}

export function Table<T>({ columns, data, emptyMessage = 'No records found', onRowClick }: TableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-slate-500">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto content-scroll -mx-1 px-1">
      <table className="w-full text-sm min-w-[640px]">
        <thead>
          <tr className="border-b border-slate-200">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`text-left text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 sm:px-3 py-2.5 ${col.hideOnMobile ? 'hidden md:table-cell' : ''} ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((row, index) => {
            const rowId = (row as { id?: string }).id ?? String(index)
            return (
              <tr
                key={rowId}
                className={`transition-colors ${onRowClick ? 'cursor-pointer hover:bg-slate-50' : ''}`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-2 sm:px-3 py-3 text-slate-700 ${col.hideOnMobile ? 'hidden md:table-cell' : ''} ${col.className || ''}`}
                  >
                    {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
