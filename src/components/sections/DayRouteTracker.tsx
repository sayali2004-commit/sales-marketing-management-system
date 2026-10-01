import { useMemo, useState } from 'react'
import { Crosshair, Loader2, MapPin, Navigation, Route } from 'lucide-react'
import { Badge, StatusBadge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Card, CardHeader } from '../ui/Card'
import { EmptyState } from '../ui/States'
import { useGeolocation } from '../../hooks/useGeolocation'
import { useApp } from '../../context/AppContext'
import type { LocationCheckpoint } from '../../types'

export function DayRouteTracker({ employeeId }: { employeeId: string }) {
  const { checkpoints, addCheckpoint } = useApp()
  const { capture, loading, error } = useGeolocation()
  const [label, setLabel] = useState('')
  const [note, setNote] = useState('')

  const today = new Date().toISOString().slice(0, 10)
  const todayList = useMemo(
    () =>
      checkpoints
        .filter((c) => c.employeeId === employeeId && c.date === today)
        .sort((a, b) => a.time.localeCompare(b.time)),
    [checkpoints, employeeId, today],
  )

  const handleAdd = async (type: LocationCheckpoint['type']) => {
    const pos = await capture()
    if (!pos) return
    const now = new Date()
    addCheckpoint({
      id: `cp-${Date.now()}`,
      employeeId,
      type,
      label: label.trim() || pos.label,
      latitude: pos.lat,
      longitude: pos.lng,
      date: today,
      time: now.toTimeString().slice(0, 5),
      notes: note.trim(),
      address: pos.label,
    })
    setLabel('')
    setNote('')
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <Card className="xl:col-span-1">
        <CardHeader title="Add Location Check-in" subtitle="Capture your exact mobile location for today" />
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Place name (optional)</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Office, customer site, landmark"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Note (optional)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Arrived for meeting, starting trip, etc."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-500"
            />
          </div>
          <div className="grid grid-cols-1 gap-2">
            <Button onClick={() => handleAdd('Start')} disabled={loading} icon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crosshair className="w-4 h-4" />}>
              I am starting from here
            </Button>
            <Button variant="secondary" onClick={() => handleAdd('Visited')} disabled={loading} icon={<MapPin className="w-4 h-4" />}>
              I reached this location
            </Button>
            <Button variant="secondary" onClick={() => handleAdd('Destination')} disabled={loading} icon={<Navigation className="w-4 h-4" />}>
              Set as destination point
            </Button>
          </div>
          {loading && <p className="text-xs text-slate-500">Getting GPS location from your device...</p>}
          {error && <p className="text-xs text-rose-600">{error}</p>}
          <p className="text-[11px] text-slate-400">
            Location uses your browser GPS. Allow location permission when prompted. Multiple check-ins can be added on the same day.
          </p>
        </div>
      </Card>

      <Card className="xl:col-span-2">
        <CardHeader
          title="Today's Route"
          subtitle={`${todayList.length} location point${todayList.length === 1 ? '' : 's'} recorded today`}
          action={<Badge tone="blue">{today}</Badge>}
        />
        {todayList.length === 0 ? (
          <EmptyState
            title="No locations yet today"
            description="Add your starting point and each place you visit to build today's route."
            icon={<Route className="w-6 h-6" />}
          />
        ) : (
          <div className="space-y-3">
            {todayList.map((c, index) => (
              <div key={c.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                      c.type === 'Start'
                        ? 'bg-brand-600 text-white'
                        : c.type === 'Destination'
                          ? 'bg-amber-500 text-white'
                          : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < todayList.length - 1 && <div className="w-px flex-1 bg-slate-200 mt-1" />}
                </div>
                <div className="flex-1 pb-3 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-slate-800 truncate">{c.label}</p>
                    <Badge tone={c.type === 'Start' ? 'blue' : c.type === 'Destination' ? 'amber' : 'emerald'}>
                      {c.type === 'Start' ? 'Starting Point' : c.type === 'Destination' ? 'Destination' : 'Visited'}
                    </Badge>
                    <span className="text-xs text-slate-400">{c.time}</span>
                    {c.latitude && (
                      <StatusBadge status="Active" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 break-all">
                    {c.address || `${c.latitude?.toFixed(5)}, ${c.longitude?.toFixed(5)}`}
                  </p>
                  {c.notes && <p className="text-xs text-slate-400 mt-0.5">{c.notes}</p>}
                  {c.latitude != null && c.longitude != null && (
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      GPS: {c.latitude.toFixed(6)}, {c.longitude.toFixed(6)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
