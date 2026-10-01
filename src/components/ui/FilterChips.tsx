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
      {label && <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">{label}</span>}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = option.value === value
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-lg border transition-colors whitespace-nowrap ${
                active
                  ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-300 hover:border-brand-400 hover:text-brand-700'
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
