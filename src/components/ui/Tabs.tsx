interface TabItem {
  id: string
  label: string
}

interface TabsProps {
  tabs: TabItem[]
  active: string
  onChange: (id: string) => void
}

export function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className="border-b border-slate-200 dark:border-slate-700 mb-6 overflow-x-auto content-scroll">
      <nav className="flex gap-1 min-w-max">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
              active === tab.id
                ? 'border-brand-600 text-brand-700 dark:text-brand-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  )
}

interface TabPageProps {
  title: string
  subtitle?: string
  tabs: TabItem[]
  active: string
  onChange: (id: string) => void
  children: React.ReactNode
  actions?: React.ReactNode
}

export function TabPage({ title, subtitle, tabs, active, onChange, children, actions }: TabPageProps) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-900 tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
      <Tabs tabs={tabs} active={active} onChange={onChange} />
      {children}
    </div>
  )
}
