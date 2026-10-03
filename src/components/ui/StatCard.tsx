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
  blue: 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400',
  emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  violet: 'bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  rose: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
  cyan: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
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
    <div className="ui-card p-3.5 sm:p-5">
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
            {title}
          </p>
          <p className="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-slate-50 mt-1.5 sm:mt-2 break-words leading-tight">
            {value}
          </p>
          {subtitle && (
            <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 mt-1 truncate">{subtitle}</p>
          )}
          {trend && trendLabel && (
            <div className="flex items-center gap-1 mt-1.5 sm:mt-2">
              {trend === 'up' ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              )}
              <span
                className={`text-[11px] sm:text-xs font-semibold ${
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
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${accents[accent]}`}
        >
          <Icon className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
        </div>
      </div>
    </div>
  )
}
