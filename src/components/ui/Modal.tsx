import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { Button } from './Button'

interface ModalProps {
  open: boolean
  title: string
  subtitle?: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

export function Modal({ open, title, subtitle, onClose, children, footer, size = 'md' }: ModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative bg-white shadow-modal w-full ${sizes[size]} max-h-[92vh] sm:max-h-[90vh] flex flex-col rounded-t-2xl sm:rounded-xl`}
      >
        <div className="flex items-start justify-between px-4 sm:px-6 py-4 border-b border-slate-200">
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-semibold text-slate-900 truncate">{title}</h2>
            {subtitle && <p className="text-sm text-slate-500 mt-0.5 truncate">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-4 sm:px-6 py-4 sm:py-5 overflow-y-auto content-scroll flex-1">{children}</div>
        {footer && (
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-200 flex flex-wrap justify-end gap-2">{footer}</div>
        )}
      </div>
    </div>
  )
}

export function ModalActions({ onClose, onSubmit, submitLabel = 'Save', submitting }: { onClose: () => void; onSubmit: () => void; submitLabel?: string; submitting?: boolean }) {
  return (
    <>
      <Button variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      <Button onClick={onSubmit} disabled={submitting}>
        {submitLabel}
      </Button>
    </>
  )
}
