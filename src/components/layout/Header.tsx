import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Menu, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'

interface HeaderProps {
  onMenuClick: () => void
  title: string
}

export function Header({ onMenuClick, title }: HeaderProps) {
  const { notifications, markNotificationsRead, logout } = useApp()
  const [showNotifications, setShowNotifications] = useState(false)
  const navigate = useNavigate()

  const unread = notifications.filter((n) => !n.read).length

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-20">
      <div className="flex items-center gap-2 min-w-0">
        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 shrink-0" aria-label="Toggle menu">
          <Menu className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <h2 className="text-sm sm:text-base font-semibold text-slate-900 truncate max-w-[50vw] sm:max-w-none">{title}</h2>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <div className="relative">
          <button
            onClick={() => setShowNotifications((v) => !v)}
            className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-600 text-white text-[10px] font-semibold flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-80 sm:max-w-96 bg-white rounded-xl border border-slate-200 shadow-modal z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-900">Notifications</p>
                <div className="flex items-center gap-2">
                  {unread > 0 && (
                    <button onClick={markNotificationsRead} className="text-xs text-brand-600 hover:text-brand-700 font-medium">
                      Mark all read
                    </button>
                  )}
                  <button onClick={() => setShowNotifications(false)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto content-scroll">
                {notifications.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-8">No notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className={`px-4 py-3 border-b border-slate-50 last:border-0 ${!n.read ? 'bg-brand-50/40' : ''}`}>
                      <div className="flex items-start gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-brand-700">{n.type}</p>
                          <p className="text-sm text-slate-700 mt-0.5">{n.message}</p>
                          <p className="text-[11px] text-slate-400 mt-1">
                            {n.date} · {n.time}
                          </p>
                        </div>
                        {!n.read && <span className="w-2 h-2 rounded-full bg-brand-600 mt-1.5 shrink-0" />}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
