import { DayRouteTracker } from '../../components/sections/DayRouteTracker'
import { useApp } from '../../context/AppContext'

export function MyTravelPage() {
  const { currentUser } = useApp()
  const empId = currentUser?.id || 'emp-004'

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">My Travel</h1>
        <p className="text-sm text-slate-500 mt-1">
          Share your current location anytime to build your daily travel history
        </p>
      </div>
      <DayRouteTracker employeeId={empId} />
    </div>
  )
}
