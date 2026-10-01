import { Crosshair, Loader2, MapPin } from 'lucide-react'
import { Input } from './ui/FormControls'
import { Button } from './ui/Button'
import { useGeolocation } from '../hooks/useGeolocation'

interface LocationFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  helper?: string
}

export function LocationField({ label, value, onChange, placeholder, helper }: LocationFieldProps) {
  const { capture, loading, error, setError } = useGeolocation()

  const handleCapture = async () => {
    setError('')
    const pos = await capture()
    if (pos) onChange(pos.label)
  }

  return (
    <div>
      <Input
        label={label}
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          if (error) setError('')
        }}
        placeholder={placeholder}
      />
      <div className="flex flex-wrap items-center gap-2 mt-2">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={handleCapture}
          disabled={loading}
          icon={loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Crosshair className="w-3.5 h-3.5" />}
        >
          {loading ? 'Getting location' : 'Use my location'}
        </Button>
        {value && (
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 min-w-0">
            <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
            <span className="truncate">{value}</span>
          </span>
        )}
      </div>
      {helper && <p className="text-[11px] text-slate-400 mt-1">{helper}</p>}
      {error && (
        <div className="mt-1.5">
          <p className="text-[11px] text-rose-600 leading-relaxed">{error}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            You can also type the location manually in the field above.
          </p>
        </div>
      )}
    </div>
  )
}
