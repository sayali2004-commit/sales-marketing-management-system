import { DayRouteTracker } from '../../components/sections/DayRouteTracker'
import { useApp } from '../../context/AppContext'

export function MyTravelPage() {
  const { currentUser } = useApp()
  const empId = currentUser?.id || 'emp-004'

  return (
    <div>
      <div className="ui-card p-4 sm:p-5 mb-6">
        <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">My Travel</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Share your current location anytime to build your daily travel history
        </p>
      </div>
      <DayRouteTracker employeeId={empId} />
    </div>
  )
}
