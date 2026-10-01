import type {
  AdvanceRecord,
  AppFile,
  BusinessRecord,
  Employee,
  Lead,
  LocationRecord,
  NotificationItem,
  SalaryRecord,
  ScheduleItem,
  SharedRecord,
  TravelRecord,
  Visit,
} from '../types'

export const employees: Employee[] = [
  {
    id: 'emp-001',
    name: 'Rajesh Verma',
    employeeId: 'SC-ADM-001',
    role: 'admin',
    department: 'Management',
    mobile: '+91 98100 12345',
    email: 'rajesh.verma@salescore.com',
    joiningDate: '2019-04-15',
    managerId: null,
    monthlySalary: 180000,
    status: 'Active',
    photo: 'RV',
    title: 'Admin Director',
  },
  {
    id: 'emp-002',
    name: 'Priya Sharma',
    employeeId: 'SC-MGR-001',
    role: 'manager',
    department: 'Sales and Marketing',
    mobile: '+91 98100 23456',
    email: 'priya.sharma@salescore.com',
    joiningDate: '2020-01-10',
    managerId: 'emp-001',
    monthlySalary: 95000,
    status: 'Active',
    photo: 'PS',
    title: 'Sales Manager',
  },
  {
    id: 'emp-003',
    name: 'Amit Kumar',
    employeeId: 'SC-MGR-002',
    role: 'manager',
    department: 'Marketing',
    mobile: '+91 98100 34567',
    email: 'amit.kumar@salescore.com',
    joiningDate: '2020-06-20',
    managerId: 'emp-001',
    monthlySalary: 90000,
    status: 'Active',
    photo: 'AK',
    title: 'Marketing Manager',
  },
  {
    id: 'emp-004',
    name: 'Sunita Rao',
    employeeId: 'SC-SAL-001',
    role: 'employee',
    department: 'Sales',
    mobile: '+91 98100 45678',
    email: 'sunita.rao@salescore.com',
    joiningDate: '2021-03-01',
    managerId: 'emp-002',
    monthlySalary: 45000,
    status: 'Active',
    photo: 'SR',
    title: 'Senior Sales Executive',
  },
  {
    id: 'emp-005',
    name: 'Vikram Singh',
    employeeId: 'SC-SAL-002',
    role: 'employee',
    department: 'Sales',
    mobile: '+91 98100 56789',
    email: 'vikram.singh@salescore.com',
    joiningDate: '2021-07-12',
    managerId: 'emp-002',
    monthlySalary: 40000,
    status: 'Active',
    photo: 'VS',
    title: 'Sales Executive',
  },
  {
    id: 'emp-006',
    name: 'Deepa Nair',
    employeeId: 'SC-SAL-003',
    role: 'employee',
    department: 'Sales',
    mobile: '+91 98100 67890',
    email: 'deepa.nair@salescore.com',
    joiningDate: '2022-01-05',
    managerId: 'emp-002',
    monthlySalary: 38000,
    status: 'Active',
    photo: 'DN',
    title: 'Sales Executive',
  },
  {
    id: 'emp-007',
    name: 'Arjun Patel',
    employeeId: 'SC-SAL-004',
    role: 'employee',
    department: 'Sales',
    mobile: '+91 98100 78901',
    email: 'arjun.patel@salescore.com',
    joiningDate: '2022-08-18',
    managerId: 'emp-002',
    monthlySalary: 35000,
    status: 'Active',
    photo: 'AP',
    title: 'Junior Sales Executive',
  },
  {
    id: 'emp-008',
    name: 'Kavita Joshi',
    employeeId: 'SC-MKT-001',
    role: 'employee',
    department: 'Marketing',
    mobile: '+91 98100 89012',
    email: 'kavita.joshi@salescore.com',
    joiningDate: '2021-05-22',
    managerId: 'emp-003',
    monthlySalary: 42000,
    status: 'Active',
    photo: 'KJ',
    title: 'Marketing Executive',
  },
  {
    id: 'emp-009',
    name: 'Rohit Mehta',
    employeeId: 'SC-MKT-002',
    role: 'employee',
    department: 'Marketing',
    mobile: '+91 98100 90123',
    email: 'rohit.mehta@salescore.com',
    joiningDate: '2022-02-14',
    managerId: 'emp-003',
    monthlySalary: 40000,
    status: 'Active',
    photo: 'RM',
    title: 'Marketing Executive',
  },
  {
    id: 'emp-010',
    name: 'Neha Gupta',
    employeeId: 'SC-MKT-003',
    role: 'employee',
    department: 'Marketing',
    mobile: '+91 98101 01234',
    email: 'neha.gupta@salescore.com',
    joiningDate: '2023-01-09',
    managerId: 'emp-003',
    monthlySalary: 36000,
    status: 'Inactive',
    photo: 'NG',
    title: 'Marketing Associate',
  },
  {
    id: 'emp-011',
    name: 'Sanjay Iyer',
    employeeId: 'SC-SAL-005',
    role: 'employee',
    department: 'Sales',
    mobile: '+91 98101 12345',
    email: 'sanjay.iyer@salescore.com',
    joiningDate: '2023-04-03',
    managerId: 'emp-002',
    monthlySalary: 32000,
    status: 'Active',
    photo: 'SI',
    title: 'Junior Sales Executive',
  },
  {
    id: 'emp-012',
    name: 'Farhan Ali',
    employeeId: 'SC-MKT-004',
    role: 'employee',
    department: 'Marketing',
    mobile: '+91 98101 23456',
    email: 'farhan.ali@salescore.com',
    joiningDate: '2023-06-19',
    managerId: 'emp-003',
    monthlySalary: 34000,
    status: 'Active',
    photo: 'FA',
    title: 'Digital Marketing Executive',
  },
]

const months2026 = ['2026-03', '2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09']
const months2025 = ['2025-08', '2025-09', '2025-10', '2025-11', '2025-12']
const monthsAll = [...months2025, ...months2026]

const leadSources = [
  'Website',
  'Referral',
  'Cold Call',
  'Walk-in',
  'LinkedIn',
  'Campaign',
  'Exhibition',
  'Social Media',
]

const products = [
  'ERP Software License',
  'CRM Suite',
  'Cloud Hosting Plan',
  'Mobile App Development',
  'IT Consulting',
  'Managed Services',
  'Data Analytics Platform',
  'Cybersecurity Package',
  'Website Redesign',
  'Digital Marketing Package',
]

const locations = [
  'Mumbai, MH',
  'Pune, MH',
  'Bengaluru, KA',
  'Delhi NCR',
  'Hyderabad, TS',
  'Chennai, TN',
  'Ahmedabad, GJ',
  'Jaipur, RJ',
  'Kolkata, WB',
  'Indore, MP',
  'Surat, GJ',
  'Nagpur, MH',
]

const companies = [
  'Apex Industries',
  'BlueWave Traders',
  'Cityline Retail',
  'Delta Logistics',
  'Evergreen Foods',
  'Falcon Motors',
  'GreenLeaf Agro',
  'Horizon Textiles',
  'Innova Tech',
  'Jupiter Realty',
  'Krishna Pharma',
  'Lakshmi Steel',
  'Meridian Bank',
  'Nova Hospitality',
  'Orbit Telecom',
  'Pinnacle Foods',
  'Quantum Software',
  'Rising Star Media',
  'Sunder Auto Parts',
  'Titan Engineering',
  'UrbanEdge Realty',
  'Velvet Interiors',
  'Westend Malls',
  'Zenith Energy',
  'Atlas Packaging',
  'BrightPath Education',
]

const contacts = [
  'Ramesh Chandra',
  'Anjali Deshmukh',
  'Sanjay Kapoor',
  'Meera Krishnan',
  'Prakash Rao',
  'Divya Menon',
  'Karan Malhotra',
  'Sneha Reddy',
  'Ashok Bhatia',
  'Pooja Kulkarni',
  'Nikhil Sane',
  'Ritu Bansal',
  'Manish Agarwal',
  'Aarti Shah',
  'Suresh Pillai',
  'Nandini Roy',
  'Gaurav Sethi',
  'Shalini Dutta',
  'Harish Nanda',
  'Tanvi Rane',
]

const salesEmployeeIds = ['emp-004', 'emp-005', 'emp-006', 'emp-007', 'emp-011']
const marketingEmployeeIds = ['emp-008', 'emp-009', 'emp-010', 'emp-012']
const allRepIds = [...salesEmployeeIds, ...marketingEmployeeIds]

const leadStatuses: Lead['status'][] = [
  'New',
  'Contacted',
  'Follow-up',
  'Interested',
  'Converted',
  'Converted',
  'Converted',
  'Not Converted',
  'Closed',
  'New',
  'Contacted',
  'Follow-up',
  'Interested',
  'Converted',
  'Not Converted',
]

function pad(n: number, len = 2) {
  return String(n).padStart(len, '0')
}

function dateIn2026(monthIndex: number, day: number) {
  const m = Math.max(0, Math.min(11, monthIndex))
  return `2026-${pad(m + 1)}-${pad(Math.min(28, Math.max(1, day)))}`
}

export const leads: Lead[] = Array.from({ length: 48 }, (_, i) => {
  const company = companies[i % companies.length]
  const contact = contacts[i % contacts.length]
  const status = leadStatuses[i % leadStatuses.length]
  const source = leadSources[i % leadSources.length]
  const product = products[i % products.length]
  const assigned = allRepIds[i % allRepIds.length]
  const leadValue = 25000 + ((i * 7500) % 225000)
  const monthOffset = i % 12
  const createdDate = dateIn2026(monthOffset, (i % 27) + 1)
  const isConverted = status === 'Converted'
  const followUps = Array.from({ length: (i % 3) + 1 }, (_, f) => ({
    id: `fu-${i}-${f}`,
    date: dateIn2026(Math.min(11, monthOffset + f), ((i + f) % 27) + 1),
    notes:
      f === 0
        ? 'Initial contact made. Customer showed interest in the offering.'
        : f === 1
          ? 'Shared pricing and proposal details. Awaiting decision.'
          : 'Follow-up call scheduled. Customer requested a demo.',
    outcome: f === 2 ? 'Demo scheduled' : 'Discussion held',
    nextDate: dateIn2026(Math.min(11, monthOffset + f + 1), ((i + f + 1) % 27) + 1),
  }))

  return {
    id: `lead-${pad(i + 1, 3)}`,
    leadId: `LD-${pad(i + 1, 4)}`,
    customerName: company,
    contactPerson: contact,
    mobile: `+91 9${pad((i % 90) + 10, 2)}${pad(10000 + ((i * 1234) % 90000), 5)}`,
    email: `${contact.split(' ')[0].toLowerCase()}.${company.split(' ')[0].toLowerCase()}@example.com`,
    location: locations[i % locations.length],
    leadSource: source,
    product,
    leadValue,
    assignedEmployeeId: assigned,
    createdDate,
    followUpDate: isConverted ? null : dateIn2026(Math.min(11, monthOffset + 1), ((i + 5) % 27) + 1),
    status,
    notes: isConverted
      ? 'Converted after successful demo and negotiation.'
      : 'Prospect requires more information before proceeding.',
    followUps,
    convertedDate: isConverted ? dateIn2026(Math.min(11, monthOffset + 1), ((i + 3) % 27) + 1) : undefined,
    conversionValue: isConverted ? leadValue : undefined,
  }
})

export const visits: Visit[] = Array.from({ length: 40 }, (_, i) => {
  const empId = allRepIds[i % allRepIds.length]
  const customer = companies[(i + 3) % companies.length]
  const lead = leads[i % leads.length]
  const statusCycle: Visit['status'][] = ['Completed', 'Scheduled', 'Completed', 'Completed', 'Scheduled', 'Cancelled', 'Rescheduled', 'In Progress']
  const outcomeCycle: Visit['outcome'][] = [
    'Successful',
    'Follow-up Required',
    'Converted',
    'Interested',
    'Not Interested',
    'Customer Unavailable',
    'Not Converted',
    '',
  ]
  const status = statusCycle[i % statusCycle.length]
  const outcome = status === 'Scheduled' || status === 'In Progress' ? '' : outcomeCycle[i % outcomeCycle.length]

  return {
    id: `visit-${pad(i + 1, 3)}`,
    visitId: `VST-${pad(i + 1, 4)}`,
    customerName: customer,
    leadId: lead.id,
    employeeId: empId,
    visitDate: dateIn2026(i % 12, ((i * 3) % 27) + 1),
    visitTime: `${pad(9 + (i % 9))}:${pad((i % 2) * 30)}`,
    startingPoint: locations[i % locations.length],
    destination: locations[(i + 4) % locations.length],
    customerLocation: locations[(i + 2) % locations.length],
    purpose: ['Product Demo', 'Follow-up Meeting', 'Proposal Discussion', 'Contract Signing', 'Relationship Building'][i % 5],
    outcome,
    status,
    notes: status === 'Completed' ? 'Visit completed. Notes captured in the CRM system.' : 'Visit details updated by the assigned employee.',
    files:
      i % 3 === 0
        ? [
            {
              id: `vf-${i}`,
              name: `visit-report-${i + 1}.pdf`,
              type: 'PDF',
              size: '240 KB',
              uploadDate: dateIn2026(i % 12, ((i * 3) % 27) + 1),
              uploadedBy: empId,
              category: 'Visit Document' as const,
            },
          ]
        : [],
  }
})

export const travelRecords: TravelRecord[] = Array.from({ length: 36 }, (_, i) => {
  const empId = allRepIds[i % allRepIds.length]
  const distance = 8 + ((i * 11) % 92)
  const perKmRate = [8, 10, 12, 15][i % 4]
  const mode: TravelRecord['travelMode'] = ['Two Wheeler', 'Car', 'Bus', 'Train'][i % 4] as TravelRecord['travelMode']
  const approval: TravelRecord['approvalStatus'] = i % 5 === 0 ? 'Pending' : i % 7 === 0 ? 'Rejected' : 'Approved'
  const payment: TravelRecord['paymentStatus'] = approval === 'Approved' && i % 3 === 0 ? 'Paid' : 'Pending'

  return {
    id: `trv-${pad(i + 1, 3)}`,
    employeeId: empId,
    startDate: locations[i % locations.length],
    destination: locations[(i + 3) % locations.length],
    travelDate: dateIn2026(i % 12, ((i * 2) % 27) + 1),
    purpose: ['Customer Visit', 'Meeting', 'Site Inspection', 'Training', 'Client Presentation'][i % 5],
    distance,
    travelMode: mode,
    perKmRate,
    totalAmount: distance * perKmRate,
    location: locations[(i + 1) % locations.length],
    notes: 'Travel recorded with supporting bill attached.',
    approvalStatus: approval,
    paymentStatus: payment,
  }
})

export const locationRecords: LocationRecord[] = Array.from({ length: 18 }, (_, i) => {
  const empId = allRepIds[i % allRepIds.length]
  return {
    id: `loc-${pad(i + 1, 3)}`,
    employeeId: empId,
    currentLocation: locations[i % locations.length],
    startingLocation: locations[(i + 2) % locations.length],
    visitLocation: locations[(i + 5) % locations.length],
    date: dateIn2026(i % 12, ((i * 4) % 27) + 1),
    time: `${pad(8 + (i % 10))}:${pad((i % 4) * 15)}`,
    relatedLead: leads[i % leads.length].leadId,
    visitStatus: (['Scheduled', 'In Progress', 'Completed'] as Visit['status'][])[i % 3],
  }
})

export const salaryRecords: SalaryRecord[] = (() => {
  const records: SalaryRecord[] = []
  const relevant = employees.filter((e) => e.role !== 'admin')
  let counter = 1
  for (const emp of relevant) {
    for (const month of monthsAll) {
      const status: SalaryRecord['status'] = month === '2026-09' ? 'Pending' : month === '2026-08' && counter % 4 === 0 ? 'Partial' : 'Paid'
      const paidAmount = status === 'Paid' ? emp.monthlySalary : status === 'Partial' ? Math.floor(emp.monthlySalary * 0.6) : 0
      records.push({
        id: `sal-${pad(counter++, 4)}`,
        employeeId: emp.id,
        salaryMonth: month,
        monthlySalary: emp.monthlySalary,
        salaryAmount: emp.monthlySalary,
        paidAmount,
        pendingAmount: emp.monthlySalary - paidAmount,
        paymentDate: status === 'Pending' ? null : `${month}-05`,
        status,
      })
    }
  }
  return records
})()

export const advanceRecords: AdvanceRecord[] = (() => {
  const records: AdvanceRecord[] = []
  const relevant = employees.filter((e) => e.role === 'employee')
  const reasons = ['Medical emergency', 'Family function', 'Vehicle repair', 'Education fees', 'Home renovation', 'Travel advance', 'Festival expenses']
  const statuses: AdvanceRecord['status'][] = ['Pending', 'Partially Recovered', 'Recovered', 'Pending', 'Recovered']
  let counter = 1
  for (let i = 0; i < 22; i++) {
    const emp = relevant[i % relevant.length]
    const amount = 5000 + ((i * 2500) % 30000)
    const status = statuses[i % statuses.length]
    const recovered = status === 'Recovered' ? amount : status === 'Partially Recovered' ? Math.floor(amount * 0.45) : 0
    records.push({
      id: `adv-${pad(counter++, 3)}`,
      employeeId: emp.id,
      advanceAmount: amount,
      advanceDate: dateIn2026(i % 12, ((i * 5) % 27) + 1),
      reason: reasons[i % reasons.length],
      recoveredAmount: recovered,
      pendingAmount: amount - recovered,
      status,
    })
  }
  return records
})()

export const businessRecords: BusinessRecord[] = allRepIds.map((empId, i) => {
  const empLeads = leads.filter((l) => l.assignedEmployeeId === empId)
  const converted = empLeads.filter((l) => l.status === 'Converted')
  const empVisits = visits.filter((v) => v.employeeId === empId)
  const successVisits = empVisits.filter((v) => v.outcome === 'Successful' || v.outcome === 'Converted')
  const empTravel = travelRecords.filter((t) => t.employeeId === empId)
  const travelExpense = empTravel.reduce((s, t) => s + t.totalAmount, 0)
  const businessGenerated = converted.reduce((s, l) => s + (l.conversionValue || l.leadValue), 0)
  const employee = employees.find((e) => e.id === empId)!
  const salaryCost = employee.monthlySalary * 6
  const advanceAmount = advanceRecords.filter((a) => a.employeeId === empId).reduce((s, a) => s + a.advanceAmount, 0)

  return {
    id: `biz-${pad(i + 1, 3)}`,
    employeeId: empId,
    leadsGenerated: empLeads.length,
    leadsConverted: converted.length,
    visits: empVisits.length,
    successfulVisits: successVisits.length,
    businessGenerated,
    businessBenefit: Math.max(0, businessGenerated - salaryCost - travelExpense),
    travelExpense,
    salaryCost,
    advanceAmount,
  }
})

export const scheduleItems: ScheduleItem[] = Array.from({ length: 30 }, (_, i) => {
  const empId = allRepIds[i % allRepIds.length]
  const types: ScheduleItem['type'][] = ['Visit', 'Follow-up', 'Meeting', 'Call', 'Sales Activity', 'Marketing Activity', 'Task']
  const status: ScheduleItem['status'] = i % 6 === 0 ? 'Completed' : i % 9 === 0 ? 'Cancelled' : i % 4 === 0 ? 'In Progress' : 'Scheduled'

  return {
    id: `sch-${pad(i + 1, 3)}`,
    title: ['Client site visit', 'Follow-up call with prospect', 'Team strategy meeting', 'Product demo session', 'Campaign planning', 'Contract review call', 'Market survey task'][i % 7],
    type: types[i % types.length],
    date: dateIn2026(i % 12, ((i * 7) % 27) + 1),
    time: `${pad(9 + (i % 9))}:${pad((i % 2) * 30)}`,
    customer: companies[(i + 5) % companies.length],
    leadId: leads[i % leads.length].id,
    employeeId: empId,
    status,
    notes: 'Scheduled activity for the assigned employee.',
  }
})

export const sharedRecords: SharedRecord[] = Array.from({ length: 16 }, (_, i) => {
  const sharedById = employees[i % employees.length].id
  const sharedWithId = employees[(i + 3) % employees.length].id
  const reasons = [
    'Manager Review',
    'Approval Required',
    'Team Information',
    'Customer Follow-up',
    'Travel Approval',
    'Business Update',
    'Other',
  ]

  return {
    id: `shr-${pad(i + 1, 3)}`,
    sharedById,
    sharedWithId,
    reason: reasons[i % reasons.length],
    note: 'Please review the shared information at the earliest.',
    date: dateIn2026(i % 12, ((i * 6) % 27) + 1),
    time: `${pad(9 + (i % 8))}:${pad((i % 4) * 15)}`,
    status: (['Pending', 'Acknowledged', 'Completed'] as SharedRecord['status'][])[i % 3],
    relatedTo: ['Lead LD-0001', 'Visit VST-0003', 'Travel TRV-0005', 'Salary Record'][i % 4],
    file: i % 3 === 0 ? `document-${i + 1}.pdf` : undefined,
  }
})

export const appFiles: AppFile[] = Array.from({ length: 24 }, (_, i) => {
  const types: AppFile['type'][] = ['PDF', 'XLSX', 'DOCX', 'PNG', 'JPG']
  const categories: AppFile['category'][] = [
    'Lead Document',
    'Visit Document',
    'Travel Bill',
    'Customer Document',
    'Report',
    'Supporting Document',
  ]

  return {
    id: `file-${pad(i + 1, 3)}`,
    name: `document-${categories[i % categories.length].toLowerCase().replace(/\s+/g, '-')}-${i + 1}.${types[i % types.length].toLowerCase()}`,
    type: types[i % types.length],
    size: `${120 + ((i * 47) % 1800)} KB`,
    uploadDate: dateIn2026(i % 12, ((i * 4) % 27) + 1),
    uploadedBy: employees[i % employees.length].id,
    category: categories[i % categories.length],
  }
})

export const notifications: NotificationItem[] = [
  {
    id: 'ntf-001',
    type: 'New lead assigned',
    message: 'New lead LD-0024 assigned to Sunita Rao.',
    date: '2026-09-28',
    time: '09:15',
    read: false,
    employeeId: 'emp-004',
  },
  {
    id: 'ntf-002',
    type: 'Lead converted',
    message: 'Lead LD-0007 converted with business value INR 145,000.',
    date: '2026-09-27',
    time: '11:40',
    read: false,
    employeeId: 'emp-002',
  },
  {
    id: 'ntf-003',
    type: 'Visit scheduled',
    message: 'Customer visit scheduled with Apex Industries on 2026-10-02.',
    date: '2026-09-26',
    time: '14:20',
    read: true,
    employeeId: 'emp-005',
  },
  {
    id: 'ntf-004',
    type: 'Travel approval',
    message: 'Travel claim TRV-0012 requires your approval.',
    date: '2026-09-25',
    time: '10:05',
    read: false,
    employeeId: 'emp-002',
  },
  {
    id: 'ntf-005',
    type: 'Advance update',
    message: 'Advance of INR 12,000 recorded for Deepa Nair.',
    date: '2026-09-24',
    time: '16:30',
    read: true,
    employeeId: 'emp-006',
  },
  {
    id: 'ntf-006',
    type: 'Shared information',
    message: 'Priya Sharma shared the monthly sales report with you.',
    date: '2026-09-23',
    time: '12:10',
    read: false,
    employeeId: 'emp-001',
  },
  {
    id: 'ntf-007',
    type: 'Schedule reminder',
    message: 'Reminder: Strategy meeting scheduled for tomorrow at 10:00.',
    date: '2026-09-22',
    time: '08:00',
    read: true,
    employeeId: 'emp-002',
  },
  {
    id: 'ntf-008',
    type: 'Visit updated',
    message: 'Visit VST-0015 outcome updated to Successful.',
    date: '2026-09-21',
    time: '15:45',
    read: true,
    employeeId: 'emp-004',
  },
]

export const businessMonthlyTrend = monthsAll.map((month) => {
  const key = month.slice(5)
  return {
    month: new Date(`${month}-01`).toLocaleString('en-US', { month: 'short' }),
    generated: 420000 + ((Number(key) * 37000) % 380000),
    benefit: 180000 + ((Number(key) * 19000) % 220000),
  }
})

export const leadSourceDistribution = leadSources.map((source) => ({
  name: source,
  value: leads.filter((l) => l.leadSource === source).length,
}))

export const teamLeadConversion = employees
  .filter((e) => e.role === 'employee')
  .map((e) => {
    const total = leads.filter((l) => l.assignedEmployeeId === e.id).length
    const converted = leads.filter((l) => l.assignedEmployeeId === e.id && l.status === 'Converted').length
    return {
      name: e.name.split(' ')[0],
      total,
      converted,
      rate: total ? Math.round((converted / total) * 100) : 0,
    }
  })

export function getEmployee(id: string) {
  return employees.find((e) => e.id === id)
}

export function employeeName(id: string) {
  return getEmployee(id)?.name || 'Unknown'
}

export function formatCurrency(value: number) {
  return `INR ${new Intl.NumberFormat('en-IN').format(value)}`
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('en-IN').format(value)
}

export function monthLabel(month: string) {
  const [y, m] = month.split('-')
  const d = new Date(Number(y), Number(m) - 1, 1)
  return d.toLocaleString('en-US', { month: 'short', year: 'numeric' })
}
