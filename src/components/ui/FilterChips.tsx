interface FilterChipsProps {
  label?: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  className?: string
}

export function FilterChips({ label, value, onChange, options, className = '' }: FilterChipsProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
          {label}
        </span>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = option.value === value
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl border transition-all whitespace-nowrap ${
                active
                  ? 'bg-gradient-to-r from-brand-600 to-accent-600 text-white border-transparent shadow-glow'
                  : 'bg-surface text-slate-600 dark:text-slate-600 border-slate-300 dark:border-slate-600 hover:border-brand-400 hover:text-brand-700 dark:hover:text-brand-400'
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
