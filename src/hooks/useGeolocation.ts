import { useCallback, useRef, useState } from 'react'

export interface GeoPosition {
  lat: number
  lng: number
  label: string
  accuracy?: number
  capturedAt: string
}

export interface CaptureResult {
  position: GeoPosition | null
  error: string
}

function isSecureContext(): boolean {
  if (typeof window === 'undefined') return false
  return window.isSecureContext || window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
}

function errorMessageFromError(err: GeolocationPositionError | { code?: number; message?: string }): string {
  const code = (err as GeolocationPositionError).code
  const message = (err as Error)?.message || ''

  if (code === 1) {
    return 'Location permission was blocked. Click the lock icon in the browser address bar, allow Location, then try again.'
  }
  if (code === 2) {
    return 'Your location is unavailable right now. Move to an open area with GPS signal and try again, or type the location manually.'
  }
  if (code === 3) {
    return 'Getting your location took too long. Try again, or type the location manually in the field.'
  }
  if (/secure|https/i.test(message)) {
    return 'Location only works on HTTPS or localhost. Open the site with https:// and try again.'
  }
  return 'Could not get your location. Please allow location permission in the browser and try again, or type the location manually.'
}

function travelErrorMessage(err: GeolocationPositionError | { code?: number; message?: string }): string {
  const code = (err as GeolocationPositionError).code
  const message = (err as Error)?.message || ''

  if (code === 1) {
    return 'Location permission is required to record your travel.'
  }
  if (/secure|https/i.test(message) || code === 2 || code === 3) {
    return 'Unable to get your current location. Please try again.'
  }
  return 'Unable to get your current location. Please try again.'
}

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const coordsLabel = `${lat.toFixed(6)}, ${lng.toFixed(6)}`
  try {
    const controller = new AbortController()
    const timer = window.setTimeout(() => controller.abort(), 6000)
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16`
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })
    window.clearTimeout(timer)
    if (!res.ok) return coordsLabel
    const data = await res.json()
    const a = data.address || {}
    const parts = [a.neighbourhood || a.suburb || a.road || a.hamlet, a.city || a.town || a.village || a.county, a.state]
    const label = parts.filter(Boolean).join(', ')
    return label || coordsLabel
  } catch {
    return coordsLabel
  }
}

function getPosition(options: PositionOptions): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(Object.assign(new Error('Geolocation is not supported'), { code: 2 }))
      return
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  })
}

export function useGeolocation() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const lastErrorRef = useRef('')

  const runCapture = useCallback(async (mode: 'default' | 'travel'): Promise<CaptureResult> => {
    setError('')
    lastErrorRef.current = ''

    if (!isSecureContext()) {
      const message =
        mode === 'travel'
          ? 'Unable to get your current location. Please try again.'
          : 'Location requires a secure connection (https:// or localhost). Open the site using https and try again.'
      setError(message)
      lastErrorRef.current = message
      return { position: null, error: message }
    }

    setLoading(true)
    try {
      let pos: GeolocationPosition
      try {
        pos = await getPosition({
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000,
        })
      } catch (firstError) {
        pos = await getPosition({
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 60000,
        }).catch(() => {
          throw firstError
        })
      }

      const lat = pos.coords.latitude
      const lng = pos.coords.longitude
      const label = await reverseGeocode(lat, lng)
      return {
        position: {
          lat,
          lng,
          label,
          accuracy: pos.coords.accuracy,
          capturedAt: new Date().toISOString(),
        },
        error: '',
      }
    } catch (err) {
      const message =
        mode === 'travel'
          ? travelErrorMessage(err as GeolocationPositionError)
          : errorMessageFromError(err as GeolocationPositionError)
      setError(message)
      lastErrorRef.current = message
      return { position: null, error: message }
    } finally {
      setLoading(false)
    }
  }, [])

  const capture = useCallback(async (): Promise<GeoPosition | null> => {
    const result = await runCapture('default')
    return result.position
  }, [runCapture])

  const captureTravel = useCallback(async (): Promise<CaptureResult> => {
    return runCapture('travel')
  }, [runCapture])

  return { capture, captureTravel, loading, error, setError, lastErrorRef }
}
