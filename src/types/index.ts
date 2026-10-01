export type Role = 'admin' | 'manager' | 'employee'

export type EmployeeStatus = 'Active' | 'Inactive'

export interface Employee {
  id: string
  name: string
  employeeId: string
  role: Role
  department: 'Sales' | 'Marketing' | 'Sales and Marketing' | 'Management'
  mobile: string
  email: string
  joiningDate: string
  managerId: string | null
  monthlySalary: number
  status: EmployeeStatus
  photo: string
  title: string
}

export type LeadStatus = 'New' | 'Contacted' | 'Follow-up' | 'Interested' | 'Converted' | 'Not Converted' | 'Closed'

export interface LeadFollowUp {
  id: string
  date: string
  notes: string
  outcome: string
  nextDate?: string
}

export interface Lead {
  id: string
  leadId: string
  customerName: string
  contactPerson: string
  mobile: string
  email: string
  location: string
  leadSource: string
  product: string
  leadValue: number
  assignedEmployeeId: string
  createdDate: string
  followUpDate: string | null
  status: LeadStatus
  notes: string
  followUps: LeadFollowUp[]
  convertedDate?: string
  conversionValue?: number
}

export type VisitOutcome =
  | 'Successful'
  | 'Follow-up Required'
  | 'Interested'
  | 'Not Interested'
  | 'Converted'
  | 'Not Converted'
  | 'Customer Unavailable'
  | 'Rescheduled'

export type VisitStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled' | 'Rescheduled'

export interface Visit {
  id: string
  visitId: string
  customerName: string
  leadId: string | null
  employeeId: string
  visitDate: string
  visitTime: string
  startingPoint: string
  destination: string
  customerLocation: string
  purpose: string
  outcome: VisitOutcome | ''
  status: VisitStatus
  notes: string
  files: AppFile[]
}

export type TravelMode = 'Car' | 'Two Wheeler' | 'Bus' | 'Train' | 'Flight' | 'Other'

export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected'
export type PaymentStatus = 'Pending' | 'Paid'

export interface TravelRecord {
  id: string
  employeeId: string
  startDate: string
  destination: string
  travelDate: string
  purpose: string
  distance: number
  travelMode: TravelMode
  perKmRate: number
  totalAmount: number
  location: string
  notes: string
  approvalStatus: ApprovalStatus
  paymentStatus: PaymentStatus
}

export interface LocationRecord {
  id: string
  employeeId: string
  currentLocation: string
  startingLocation: string
  visitLocation: string
  date: string
  time: string
  relatedLead: string
  visitStatus: VisitStatus
}

export type SalaryStatus = 'Paid' | 'Pending' | 'Partial'

export interface SalaryRecord {
  id: string
  employeeId: string
  salaryMonth: string
  monthlySalary: number
  salaryAmount: number
  paidAmount: number
  pendingAmount: number
  paymentDate: string | null
  status: SalaryStatus
}

export type AdvanceStatus = 'Pending' | 'Partially Recovered' | 'Recovered'

export interface AdvanceRecord {
  id: string
  employeeId: string
  advanceAmount: number
  advanceDate: string
  reason: string
  recoveredAmount: number
  pendingAmount: number
  status: AdvanceStatus
}

export interface BusinessRecord {
  id: string
  employeeId: string
  leadsGenerated: number
  leadsConverted: number
  visits: number
  successfulVisits: number
  businessGenerated: number
  businessBenefit: number
  travelExpense: number
  salaryCost: number
  advanceAmount: number
}

export type ActivityType = 'Visit' | 'Follow-up' | 'Meeting' | 'Call' | 'Sales Activity' | 'Marketing Activity' | 'Task'

export type ScheduleStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'In Progress'

export interface ScheduleItem {
  id: string
  title: string
  type: ActivityType
  date: string
  time: string
  customer: string
  leadId: string | null
  employeeId: string
  status: ScheduleStatus
  notes: string
}

export interface AppFile {
  id: string
  name: string
  type: string
  size: string
  uploadDate: string
  uploadedBy: string
  category: 'Lead Document' | 'Visit Document' | 'Travel Bill' | 'Customer Document' | 'Report' | 'Supporting Document'
}

export type ShareStatus = 'Pending' | 'Acknowledged' | 'Completed'

export interface SharedRecord {
  id: string
  sharedById: string
  sharedWithId: string
  reason: string
  note: string
  date: string
  time: string
  status: ShareStatus
  relatedTo: string
  file?: string
}

export type NotificationType =
  | 'New lead assigned'
  | 'Lead converted'
  | 'Visit scheduled'
  | 'Visit updated'
  | 'Travel approval'
  | 'Advance update'
  | 'Shared information'
  | 'Schedule reminder'

export interface NotificationItem {
  id: string
  type: NotificationType
  message: string
  date: string
  time: string
  read: boolean
  employeeId: string | null
}

export interface ConversionDetail {
  leadId: string
  leadName: string
  employeeName: string
  conversionDate: string
  product: string
  businessValue: number
  customerLocation: string
  notes: string
}
