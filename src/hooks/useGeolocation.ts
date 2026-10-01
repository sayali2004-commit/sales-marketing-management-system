import { useCallback, useState } from 'react'

export interface GeoPosition {
  lat: number
  lng: number
  label: string
  accuracy?: number
  capturedAt: string
}

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16`
    const res = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!res.ok) return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    const data = await res.json()
    const a = data.address || {}
    const parts = [a.neighbourhood || a.suburb || a.road, a.city || a.town || a.village || a.county, a.state]
    const label = parts.filter(Boolean).join(', ')
    return label || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
  } catch {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
  }
}

export function useGeolocation() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const capture = useCallback(async (): Promise<GeoPosition | null> => {
    setError('')
    if (!('geolocation' in navigator)) {
      setError('Location is not supported on this device or browser.')
      return null
    }
    setLoading(true)
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 12000,
          maximumAge: 0,
        })
      })
      const lat = pos.coords.latitude
      const lng = pos.coords.longitude
      const label = await reverseGeocode(lat, lng)
      return {
        lat,
        lng,
        label,
        accuracy: pos.coords.accuracy,
        capturedAt: new Date().toISOString(),
      }
    } catch {
      setError('Could not get your location. Please allow location permission in the browser and try again.')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { capture, loading, error, setError }
}
