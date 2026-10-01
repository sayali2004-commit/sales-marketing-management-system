import { useMemo, useState } from 'react'
import { CalendarDays, CalendarPlus, List, Plus } from 'lucide-react'
import { Badge, StatusBadge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Input, Select, Textarea } from '../ui/FormControls'
import { Modal, ModalActions } from '../ui/Modal'
import { EmptyState } from '../ui/States'
import { FilterBar, SearchInput } from '../ui/Inputs'
import { employeeName, leads } from '../../data/sampleData'
import type { ScheduleItem, ScheduleStatus } from '../../types'

const activityTypes = ['Visit', 'Follow-up', 'Meeting', 'Call', 'Sales Activity', 'Marketing Activity', 'Task']
const statuses: ScheduleStatus[] = ['Scheduled', 'In Progress', 'Completed', 'Cancelled']

interface ScheduleSectionProps {
  items: ScheduleItem[]
  scopeLabel: string
  canCreate: boolean
  currentEmployeeId?: string
  onAddItem?: (item: ScheduleItem) => void
  onUpdateItem?: (item: ScheduleItem) => void
  title?: string
}

export function ScheduleSection({
  items,
  scopeLabel,
  canCreate,
  currentEmployeeId,
  onAddItem,
  onUpdateItem,
  title = 'Schedule',
}: ScheduleSectionProps) {
  const [view, setView] = useState<'calendar' | 'list'>('list')
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({
    title: '',
    type: 'Visit',
    date: '',
    time: '',
    customer: '',
    leadId: '',
    notes: '',
  })

  const filtered = useMemo(() => {
    return items.filter((i) => {
      const q = search.toLowerCase()
      const matchQ = !q || i.title.toLowerCase().includes(q) || i.customer.toLowerCase().includes(q) || employeeName(i.employeeId).toLowerCase().includes(q)
      const matchType = typeFilter === 'all' || i.type === typeFilter
      const matchStatus = statusFilter === 'all' || i.status === statusFilter
      return matchQ && matchType && matchStatus
    })
  }, [items, search, typeFilter, statusFilter])

  const grouped = useMemo(() => {
    const map = new Map<string, ScheduleItem[]>()
    filtered
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date))
      .forEach((item) => {
        const list = map.get(item.date) || []
        list.push(item)
        map.set(item.date, list)
      })
    return Array.from(map.entries())
  }, [filtered])

  const handleCreate = () => {
    if (!form.title || !form.date) return
    onAddItem?.({
      id: `sch-${Date.now()}`,
      title: form.title,
      type: form.type as ScheduleItem['type'],
      date: form.date,
      time: form.time,
      customer: form.customer,
      leadId: form.leadId || null,
      employeeId: currentEmployeeId || 'emp-004',
      status: 'Scheduled',
      notes: form.notes,
    })
    setShowCreate(false)
    setForm({ title: '', type: 'Visit', date: '', time: '', customer: '', leadId: '', notes: '' })
  }

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Activities', value: String(items.length) },
          {
            label: 'Scheduled',
            value: String(items.filter((i) => i.status === 'Scheduled').length),
          },
          {
            label: 'In Progress',
            value: String(items.filter((i) => i.status === 'In Progress').length),
          },
          {
            label: 'Completed',
            value: String(items.filter((i) => i.status === 'Completed').length),
          },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 shadow-card p-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{s.label}</p>
            <p className="text-2xl font-semibold text-slate-900 mt-1.5">{s.value}</p>
          </div>
        ))}
      </div>

      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-500 mt-0.5">{scopeLabel}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-slate-300 overflow-hidden">
              <button
                onClick={() => setView('list')}
                className={`px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 ${view === 'list' ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
              >
                <List className="w-3.5 h-3.5" /> List
              </button>
              <button
                onClick={() => setView('calendar')}
                className={`px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 ${view === 'calendar' ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
              >
                <CalendarDays className="w-3.5 h-3.5" /> Calendar
              </button>
            </div>
            {canCreate && (
              <Button size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => setShowCreate(true)}>
                Add Activity
              </Button>
            )}
          </div>
        </div>

        <FilterBar className="mb-4">
          <SearchInput value={search} onChange={setSearch} placeholder="Search schedule" className="w-full sm:w-64" />
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="all">All Activity Types</option>
            {activityTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
        </FilterBar>

        {grouped.length === 0 ? (
          <EmptyState title="No schedule items" description="Add visits, follow-ups, meetings or tasks to your schedule." />
        ) : view === 'list' ? (
          <div className="space-y-4">
            {grouped.map(([date, list]) => (
              <div key={date}>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">{date}</p>
                <div className="space-y-2">
                  {list.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3 bg-slate-50 rounded-lg border border-slate-100 hover:bg-white transition-colors">
                      <div className="w-14 text-center shrink-0">
                        <p className="text-sm font-semibold text-brand-700">{item.time}</p>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-medium text-slate-800">{item.title}</p>
                          <Badge tone="cyan">{item.type}</Badge>
                          <StatusBadge status={item.status} />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {item.customer} · {employeeName(item.employeeId)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value={item.status}
                          className="w-full sm:w-36 !py-1.5 text-xs"
                          onChange={(e) => onUpdateItem?.({ ...item, status: e.target.value as ScheduleStatus })}
                        >
                          {statuses.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {grouped.map(([date, list]) => (
              <div key={date} className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold">
                  {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
                <div className="p-3 space-y-2 min-h-[80px]">
                  {list.map((item) => (
                    <div key={item.id} className="px-3 py-2 rounded-lg bg-brand-50 border border-brand-100">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-medium text-slate-800 truncate">{item.time} · {item.title}</p>
                        <StatusBadge status={item.status} />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.customer}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal open={showCreate} title="Add Schedule Activity" subtitle="Visits, follow-ups, meetings, calls and tasks" onClose={() => setShowCreate(false)} footer={<ModalActions onClose={() => setShowCreate(false)} onSubmit={handleCreate} submitLabel="Add Activity" />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Activity title" />
          <Select label="Activity Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            {activityTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
          <Input label="Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <Input label="Time" type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
          <Input label="Customer" value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} />
          <Select label="Related Lead" value={form.leadId} onChange={(e) => setForm({ ...form, leadId: e.target.value })}>
            <option value="">No linked lead</option>
            {leads.slice(0, 15).map((l) => (
              <option key={l.id} value={l.id}>{l.leadId} · {l.customerName}</option>
            ))}
          </Select>
          <div className="sm:col-span-2">
            <Textarea label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
        </div>
      </Modal>
    </div>
  )
}

export function TodaySchedule({ items, employeeId }: { items: ScheduleItem[]; employeeId: string }) {
  const today = new Date().toISOString().slice(0, 10)
  const mine = items.filter((i) => i.employeeId === employeeId)

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <CalendarPlus className="w-4 h-4 text-brand-600" />
        <h3 className="text-base font-semibold text-slate-900">My Schedule</h3>
      </div>
      {mine.length === 0 ? (
        <EmptyState title="No schedule items" description="Your upcoming activities will appear here." />
      ) : (
        <div className="space-y-2">
          {mine.slice(0, 6).map((item) => (
            <div key={item.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-slate-100 bg-slate-50">
              <div className="w-12 text-center shrink-0">
                <p className="text-xs font-semibold text-brand-700">{item.time}</p>
                <p className="text-[10px] text-slate-400">{item.date === today ? 'Today' : item.date}</p>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-800 truncate">{item.title}</p>
                <p className="text-xs text-slate-500 truncate">{item.customer} · {item.type}</p>
              </div>
              <StatusBadge status={item.status} />
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
