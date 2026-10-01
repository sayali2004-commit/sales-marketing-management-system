import { useState } from 'react'
import { TabPage } from '../../components/ui/Tabs'
import { AdminBusinessPerformance } from './BusinessPerformanceSection'
import { SalesPerformanceSection } from './SalesPerformanceSection'
import { MarketingPerformanceSection } from './MarketingPerformanceSection'

const tabs = [
  { id: 'business', label: 'Business' },
  { id: 'sales', label: 'Sales' },
  { id: 'marketing', label: 'Marketing' },
]

export function PerformancePage() {
  const [active, setActive] = useState('business')

  return (
    <TabPage
      title="Performance"
      subtitle="Business, sales and marketing performance in one view"
      tabs={tabs}
      active={active}
      onChange={setActive}
    >
      {active === 'business' && <AdminBusinessPerformance />}
      {active === 'sales' && <SalesPerformanceSection />}
      {active === 'marketing' && <MarketingPerformanceSection />}
    </TabPage>
  )
}
