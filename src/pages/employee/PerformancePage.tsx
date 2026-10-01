import { useState } from 'react'
import { TabPage } from '../../components/ui/Tabs'
import { MyBusinessSection } from './MyBusinessSection'
import { MyAdvanceSection } from './MyAdvanceSection'

const tabs = [
  { id: 'business', label: 'Business' },
  { id: 'advance', label: 'Advance' },
]

export function PerformancePage() {
  const [active, setActive] = useState('business')

  return (
    <TabPage
      title="Performance"
      subtitle="Your business results and advance information"
      tabs={tabs}
      active={active}
      onChange={setActive}
    >
      {active === 'business' && <MyBusinessSection />}
      {active === 'advance' && <MyAdvanceSection />}
    </TabPage>
  )
}
