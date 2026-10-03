import { useMemo, useState } from 'react'
import { ChevronDown, ChevronUp, Crosshair, History, Loader2, MapPin, Navigation } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Card, CardHeader } from '../ui/Card'
import { EmptyState } from '../ui/States'
import { useGeolocation } from '../../hooks/useGeolocation'
import { useApp } from '../../context/AppContext'
import type { SharedTravelPoint } from '../../types'
import { formatDateLong, formatKm, formatTime12, haversineKm, todayISODate } from '../../utils/geo'

interface DayTravel {
  date: string
  points: SharedTravelPoint[]
  totalKm: number
}

function daySummary(points: SharedTravelPoint[]): DayTravel {
  const sorted = [...points].sort((a, b) => a.locationNumber - b.locationNumber)
  return {
    date: sorted[0]?.date || '',
    points: sorted,
    totalKm: Math.round(sorted.reduce((sum, p) => sum + p.distanceFromPrevious, 0) * 100) / 100,
  }
}

function Timeline({ points, totalKm }: { points: SharedTravelPoint[]; totalKm: number }) {
  if (points.length === 0) {
    return (
      <EmptyState
        title="No locations shared yet"
        description="Press Share Current Location to start today's travel timeline."
        icon={<Navigation className="w-6 h-6" />}
      />
    )
  }

  return (
    <div>
      <div className="space-y-0">
        {points.map((point, index) => (
          <div key={point.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-semibold shrink-0">
                {point.locationNumber}
              </div>
              {index < points.length - 1 && <div className="w-px flex-1 bg-slate-200 mt-1 min-h-[28px]" />}
            </div>
            <div className="flex-1 pb-2 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium text-slate-800 truncate">Location {point.locationNumber}</p>
                <span className="text-xs text-slate-400">{formatTime12(point.time)}</span>
              </div>
              <p className="text-sm text-slate-600 mt-0.5 break-words">{point.address}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                GPS: {point.latitude.toFixed(6)}, {point.longitude.toFixed(6)}
              </p>
              {index < points.length - 1 && (
                <div className="mt-2 mb-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-medium">
                    <span className="text-slate-400">↓</span>
                    {formatKm(points[index + 1].distanceFromPrevious)}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap gap-4 text-xs text-slate-500">
        <span>
          Locations: <span className="font-semibold text-slate-700">{points.length}</span>
        </span>
        <span>
          Total Distance: <span className="font-semibold text-slate-700">{formatKm(totalKm)}</span>
        </span>
      </div>
    </div>
  )
}

function SummaryBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 min-w-0">
      <p className="text-[11px] text-slate-500 truncate">{label}</p>
      <p className="text-sm font-semibold text-slate-800 mt-0.5 truncate">{value}</p>
    </div>
  )
}

export function DayRouteTracker({ employeeId }: { employeeId: string }) {
  const { sharedTravelPoints, addSharedTravelPoint } = useApp()
  const { captureTravel, loading } = useGeolocation()
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [expandedDate, setExpandedDate] = useState<string | null>(null)

  const today = todayISODate()

  const todayTravel = useMemo(() => {
    const todayPoints = sharedTravelPoints.filter((p) => p.employeeId === employeeId && p.date === today)
    return daySummary(todayPoints)
  }, [sharedTravelPoints, employeeId, today])

  const historyTravels = useMemo(() => {
    const byDate = new Map<string, SharedTravelPoint[]>()
    for (const p of sharedTravelPoints) {
      if (p.employeeId !== employeeId || p.date === today) continue
      const list = byDate.get(p.date) || []
      list.push(p)
      byDate.set(p.date, list)
    }
    return [...byDate.values()]
      .map((list) => daySummary(list))
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [sharedTravelPoints, employeeId, today])

  const handleShare = async () => {
    setFeedback(null)
    const result = await captureTravel()
    if (!result.position) {
      setFeedback({
        type: 'error',
        text: result.error || 'Unable to get your current location. Please try again.',
      })
      return
    }

    const pos = result.position
    const now = new Date()
    const date = todayISODate()
    const time = now.toTimeString().slice(0, 5)
    const todays = sharedTravelPoints
      .filter((p) => p.employeeId === employeeId && p.date === date)
      .sort((a, b) => a.locationNumber - b.locationNumber)
    const previous = todays[todays.length - 1]
    const distanceFromPrevious = previous
      ? haversineKm(previous.latitude, previous.longitude, pos.lat, pos.lng)
      : 0

    addSharedTravelPoint({
      id: `stp-${Date.now()}`,
      employeeId,
      date,
      locationNumber: todays.length + 1,
      latitude: pos.lat,
      longitude: pos.lng,
      address: pos.label,
      time,
      timestamp: now.toISOString(),
      distanceFromPrevious,
    })

    setFeedback({ type: 'success', text: 'Location recorded successfully.' })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-1">
          <CardHeader title="Share Current Location" subtitle="Record your travel one location at a time" />
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500">Current date</p>
                <p className="text-sm font-medium text-slate-800 truncate">{formatDateLong(today)}</p>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={handleShare}
              disabled={loading}
              icon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crosshair className="w-4 h-4" />}
            >
              {loading ? 'Getting location...' : 'Share Current Location'}
            </Button>

            <p className="text-xs text-slate-500">Share your current location to record your travel.</p>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <History className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                Locations today:{' '}
                <span className="font-semibold text-slate-700">{todayTravel.points.length}</span>
              </span>
            </div>

            {feedback && (
              <div
                className={`rounded-lg border px-3 py-2 text-xs ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-rose-50 border-rose-200 text-rose-700'
                }`}
              >
                {feedback.text}
              </div>
            )}

            <p className="text-[11px] text-slate-400">
              Uses browser GPS. Allow location permission when prompted. Each share adds the next sequential location.
            </p>
          </div>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader
            title="Today's Travel"
            subtitle={`${todayTravel.points.length} location${todayTravel.points.length === 1 ? '' : 's'} shared today`}
            action={<Badge tone="blue">{formatDateLong(today)}</Badge>}
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-5">
            <SummaryBox label="Locations" value={String(todayTravel.points.length)} />
            <SummaryBox label="Total KM" value={formatKm(todayTravel.totalKm)} />
            <SummaryBox
              label="Start Time"
              value={todayTravel.points[0] ? formatTime12(todayTravel.points[0].time) : '—'}
            />
            <SummaryBox
              label="Last Update"
              value={
                todayTravel.points.length
                  ? formatTime12(todayTravel.points[todayTravel.points.length - 1].time)
                  : '—'
              }
            />
          </div>
          <Timeline points={todayTravel.points} totalKm={todayTravel.totalKm} />
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Travel History"
          subtitle="Previous days with shared locations"
          action={
            historyTravels.length > 0 ? (
              <Badge tone="slate">{historyTravels.length} day{historyTravels.length === 1 ? '' : 's'}</Badge>
            ) : undefined
          }
        />
        {historyTravels.length === 0 ? (
          <EmptyState
            title="No travel history yet"
            description="Locations you share on previous days will appear here."
            icon={<History className="w-6 h-6" />}
          />
        ) : (
          <div className="space-y-2">
            {historyTravels.map((day) => {
              const open = expandedDate === day.date
              return (
                <div key={day.date} className="border border-slate-200 ui-card-muted overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setExpandedDate(open ? null : day.date)}
                    className="w-full flex flex-wrap items-center justify-between gap-3 px-4 py-3 hover:bg-slate-50 text-left"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800">{formatDateLong(day.date)}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {day.points.length} location{day.points.length === 1 ? '' : 's'} ·{' '}
                        {formatKm(day.totalKm)}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-700 shrink-0">
                      {open ? 'Hide details' : 'View timeline'}
                      {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>
                  {open && (
                    <div className="px-4 pb-4 pt-1 border-t border-slate-100 bg-slate-50/50">
                      <Timeline points={day.points} totalKm={day.totalKm} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}
