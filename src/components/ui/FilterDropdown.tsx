import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'

interface FilterDropdownProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  className?: string
}

export function FilterDropdown({ label, value, onChange, options, className = '' }: FilterDropdownProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const selected = options.find((o) => o.value === value) || options[0]

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

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">{label}</p>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
          open
            ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-900/20 text-brand-800 dark:text-brand-300 shadow-sm ring-2 ring-brand-200 dark:ring-brand-800'
            : 'border-slate-200 dark:border-slate-600 bg-surface text-slate-800 dark:text-slate-700 hover:border-brand-300 hover:bg-slate-50 dark:hover:bg-slate-800'
        }`}
      >
        <span className="truncate">{selected?.label || label}</span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0 transition-transform duration-200 ${open ? 'rotate-180 text-brand-600 dark:text-brand-400' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute z-40 mt-2 w-full min-w-[200px] bg-surface rounded-xl border border-slate-200 dark:border-slate-700 shadow-modal overflow-hidden animate-in">
          <div className="max-h-64 overflow-y-auto content-scroll py-1">
            {options.map((option) => {
              const active = option.value === value
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value)
                    setOpen(false)
                  }}
                  className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm text-left transition-colors ${
                    active
                      ? 'bg-gradient-to-r from-brand-600 to-accent-600 text-white font-medium'
                      : 'text-slate-700 dark:text-slate-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:text-brand-800 dark:hover:text-brand-300'
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  {active && <Check className="w-4 h-4 shrink-0" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
