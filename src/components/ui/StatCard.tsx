import type { LucideIcon } from 'lucide-react'
import { TrendingDown, TrendingUp } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  subtitle?: string
  trend?: 'up' | 'down'
  trendLabel?: string
  accent?: 'blue' | 'emerald' | 'violet' | 'amber' | 'rose' | 'cyan'
}

const accents: Record<string, string> = {
  blue: 'from-brand-500 to-brand-700 text-white',
  emerald: 'from-emerald-500 to-teal-600 text-white',
  violet: 'from-violet-500 to-purple-700 text-white',
  amber: 'from-amber-500 to-orange-600 text-white',
  rose: 'from-rose-500 to-pink-600 text-white',
  cyan: 'from-cyan-500 to-blue-600 text-white',
}

export function StatCard({
  title,
  value,
  icon: Icon,
  subtitle,
  trend,
  trendLabel,
  accent = 'blue',
}: StatCardProps) {
  return (
    <div className="group relative bg-surface rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-card p-5 overflow-hidden transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5">
      <div
        className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity bg-gradient-to-br ${accents[accent]}`}
        aria-hidden
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
            {title}
          </p>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 mt-2 truncate tracking-tight">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 truncate">{subtitle}</p>
          )}
          {trend && trendLabel && (
            <div className="flex items-center gap-1 mt-2">
              {trend === 'up' ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              )}
              <span
                className={`text-xs font-semibold ${
                  trend === 'up'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {trendLabel}
              </span>
            </div>
          )}
        </div>
        <div
          className={`w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0 shadow-soft ${accents[accent]}`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  )
}
