import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Mail,
  Navigation,
  Pencil,
  Phone,
  Power,
  Trash2,
  UserPlus,
  Users,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Badge, StatusBadge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/FormControls'
import { Modal, ModalActions } from '../../components/ui/Modal'
import { Table, type Column } from '../../components/ui/Table'
import { EmptyState } from '../../components/ui/States'
import { PageHeader, SearchInput } from '../../components/ui/Inputs'
import { StatCard } from '../../components/ui/StatCard'
import { formatCurrency } from '../../data/sampleData'
import type { Employee } from '../../types'

const emptyForm = {
  name: '',
  employeeId: '',
  role: 'employee',
  department: 'Sales',
  mobile: '',
  email: '',
  joiningDate: '',
  managerId: 'emp-002',
  monthlySalary: '',
}

export function EmployeeManagement() {
  const { employees, businessRecords, leads, visits, travelRecords, salaryRecords, advanceRecords } = useApp()
  const [localEmployees, setLocalEmployees] = useState<Employee[]>([])
  const allEmployees = useMemo(() => {
    const map = new Map<string, Employee>()
    localEmployees.forEach((e) => map.set(e.id, e))
    employees.forEach((e) => map.set(e.id, e))
    return Array.from(map.values())
  }, [employees, localEmployees])

  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [mobileLimit, setMobileLimit] = useState(4)
  const [selected, setSelected] = useState<Employee | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [editing, setEditing] = useState<Employee | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [workDetail, setWorkDetail] = useState<'leads' | 'visits' | null>(null)

  const filtered = useMemo(() => {
    return allEmployees.filter((e) => {
      const q = search.toLowerCase()
      const matchQ = !q || e.name.toLowerCase().includes(q) || e.employeeId.toLowerCase().includes(q) || e.email.toLowerCase().includes(q)
      const matchRole = roleFilter === 'all' || e.role === roleFilter
      const matchStatus = statusFilter === 'all' || e.status === statusFilter
      const matchDept = departmentFilter === 'all' || e.department === departmentFilter
      return matchQ && matchRole && matchStatus && matchDept
    })
  }, [allEmployees, search, roleFilter, statusFilter, departmentFilter])

  const stats = useMemo(() => ({
    total: allEmployees.length,
    active: allEmployees.filter((e) => e.status === 'Active').length,
    inactive: allEmployees.filter((e) => e.status === 'Inactive').length,
    managers: allEmployees.filter((e) => e.role === 'manager').length,
  }), [allEmployees])

  const updateEmployee = (updated: Employee) => {
    setLocalEmployees((prev) => {
      const next = prev.filter((p) => p.id !== updated.id)
      next.unshift(updated)
      return next
    })
    setSelected(updated)
  }

  const openEdit = (emp: Employee) => {
    setEditing(emp)
    setForm({
      name: emp.name,
      employeeId: emp.employeeId,
      role: emp.role,
      department: emp.department,
      mobile: emp.mobile,
      email: emp.email,
      joiningDate: emp.joiningDate,
      managerId: emp.managerId || '',
      monthlySalary: String(emp.monthlySalary),
    })
    setShowEdit(true)
    setExpandedId(null)
    setWorkDetail(null)
  }

  const toggleDetail = (emp: Employee) => {
    setSelected(emp)
    setExpandedId((prev) => (prev === emp.id ? null : emp.id))
    setWorkDetail(null)
  }

  const openCreate = () => {
    setForm({ ...emptyForm, employeeId: '', managerId: 'emp-002' })
    setShowCreate(true)
  }

  const saveEmployee = () => {
    if (!form.name || !form.mobile) return
    if (editing) {
      updateEmployee({
        ...editing,
        name: form.name,
        employeeId: form.employeeId || editing.employeeId,
        mobile: form.mobile,
        email: form.email,
        joiningDate: form.joiningDate,
        monthlySalary: Number(form.monthlySalary) || 0,
        photo: form.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase(),
      })
    } else {
      const seq = String(allEmployees.length + 1).padStart(3, '0')
      const newEmp: Employee = {
        id: `emp-${Date.now()}`,
        name: form.name,
        employeeId: form.employeeId || `SC-SAL-${seq}`,
        role: 'employee',
        department: 'Sales',
        mobile: form.mobile,
        email: form.email,
        joiningDate: form.joiningDate,
        managerId: 'emp-002',
        monthlySalary: Number(form.monthlySalary) || 0,
        status: 'Active',
        photo: form.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase(),
        title: 'Sales Executive',
      }
      setLocalEmployees((prev) => [newEmp, ...prev])
    }
    setShowEdit(false)
    setShowCreate(false)
    setEditing(null)
    setForm(emptyForm)
  }

  const deleteEmployee = () => {
    if (!selected) return
    setLocalEmployees((prev) => prev.filter((p) => p.id !== selected.id))
    setShowDelete(false)
    setExpandedId(null)
    setSelected(null)
  }

  const toggleStatus = (emp: Employee) => {
    updateEmployee({ ...emp, status: emp.status === 'Active' ? 'Inactive' : 'Active' })
  }

  const columns: Column<Employee>[] = [
    {
      key: 'name',
      header: 'Employee',
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-semibold shrink-0">
            {r.photo}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-slate-800 truncate">{r.name}</p>
            <p className="text-xs text-slate-400 truncate">{r.title}</p>
          </div>
        </div>
      ),
    },
    { key: 'employeeId', header: 'Employee ID', hideOnMobile: true, render: (r) => <span className="text-slate-600">{r.employeeId}</span> },
    {
      key: 'role',
      header: 'Role',
      render: (r) => <Badge tone={r.role === 'admin' ? 'rose' : r.role === 'manager' ? 'violet' : 'blue'} className="capitalize">{r.role}</Badge>,
    },
    {
      key: 'department',
      header: 'Department',
      hideOnMobile: true,
      render: (r) => <span className="text-slate-600">{r.department}</span>,
    },
    {
      key: 'monthlySalary',
      header: 'Salary',
      className: 'whitespace-nowrap',
      render: (r) => <span className="font-medium text-slate-800">{formatCurrency(r.monthlySalary)}</span>,
    },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => toggleDetail(r)}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
            title="View details"
          >
            {expandedId === r.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={() => openEdit(r)}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
            title="Edit employee"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setSelected(r); setShowDelete(true) }}
            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
            title="Delete employee"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  const selectedBiz = selected ? businessRecords.find((b) => b.employeeId === selected.id) : null
  const selectedLeads = selected ? leads.filter((l) => l.assignedEmployeeId === selected.id) : []
  const selectedVisits = selected ? visits.filter((v) => v.employeeId === selected.id) : []

  const employeeForm = (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">Fill only the basic details. Other details are set automatically.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Employee Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter full name" />
        <Input label="Mobile Number" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} placeholder="Enter mobile number" />
        <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Enter email" />
        <Input label="Joining Date" type="date" value={form.joiningDate} onChange={(e) => setForm({ ...form, joiningDate: e.target.value })} />
        <Input label="Monthly Salary (INR)" type="number" value={form.monthlySalary} onChange={(e) => setForm({ ...form, monthlySalary: e.target.value })} placeholder="Enter salary" />
        {editing && (
          <Input label="Employee ID" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} />
        )}
      </div>
    </div>
  )

  const mobileEmployees = filtered.slice(0, mobileLimit)
  const expanded = expandedId ? allEmployees.find((e) => e.id === expandedId) || selected : null
  const expandedBiz = expanded ? businessRecords.find((b) => b.employeeId === expanded.id) : null
  const expandedLeads = expanded ? leads.filter((l) => l.assignedEmployeeId === expanded.id) : []
  const expandedVisits = expanded ? visits.filter((v) => v.employeeId === expanded.id) : []

  const inlineDetail = expanded && (
    <div className="ui-card p-4 sm:p-5 mt-3 animate-in">
      <button
        type="button"
        onClick={() => setExpandedId(null)}
        className="inline-flex items-center gap-2 mb-4 px-3 py-2 rounded-xl text-sm font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/25 hover:bg-brand-100 dark:hover:bg-brand-900/40 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-base font-semibold shrink-0">
            {expanded.photo}
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-900 truncate">{expanded.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{expanded.title}</p>
            <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-600 dark:text-slate-400">
              <span className="inline-flex items-center gap-1">
                <Phone className="w-3 h-3" /> {expanded.mobile}
              </span>
              {expanded.email && (
                <span className="inline-flex items-center gap-1 truncate">
                  <Mail className="w-3 h-3" /> {expanded.email}
                </span>
              )}
              <StatusBadge status={expanded.status} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-slate-50 dark:bg-slate-800 ui-card-muted">
          <p className="text-xs text-slate-500 dark:text-slate-400">Joining Date</p>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-800 mt-1">{expanded.joiningDate || 'Not set'}</p>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800 ui-card-muted">
          <p className="text-xs text-slate-500 dark:text-slate-400">Monthly Salary</p>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-800 mt-1">{formatCurrency(expanded.monthlySalary)}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Button size="sm" variant="secondary" icon={<Pencil className="w-3.5 h-3.5" />} onClick={() => openEdit(expanded)}>
          Edit
        </Button>
        <Button
          size="sm"
          variant={expanded.status === 'Active' ? 'secondary' : 'success'}
          icon={<Power className="w-3.5 h-3.5" />}
          onClick={() => toggleStatus(expanded)}
        >
          {expanded.status === 'Active' ? 'Deactivate' : 'Activate'}
        </Button>
        <Button size="sm" variant="danger" icon={<Trash2 className="w-3.5 h-3.5" />} onClick={() => { setSelected(expanded); setShowDelete(true) }}>
          Delete
        </Button>
      </div>

      <div>
        <p className="text-xs font-medium text-slate-600 dark:text-slate-600 mb-2">Work Summary</p>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setWorkDetail(workDetail === 'leads' ? null : 'leads')}
            className={`p-3 ui-card-muted text-center border transition-colors ${
              workDetail === 'leads' ? 'border-brand-300 bg-brand-50 dark:bg-brand-900/20' : 'border-slate-200 dark:border-slate-700'
            }`}
          >
            <p className="text-lg font-bold text-slate-900 dark:text-slate-900">{expandedLeads.length}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center justify-center gap-1">
              Leads
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${workDetail === 'leads' ? 'rotate-180 text-brand-600' : 'text-slate-400'}`} />
            </p>
          </button>
          <button
            type="button"
            onClick={() => setWorkDetail(workDetail === 'visits' ? null : 'visits')}
            className={`p-3 ui-card-muted text-center border transition-colors ${
              workDetail === 'visits' ? 'border-brand-300 bg-brand-50 dark:bg-brand-900/20' : 'border-slate-200 dark:border-slate-700'
            }`}
          >
            <p className="text-lg font-bold text-slate-900 dark:text-slate-900">{expandedVisits.length}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center justify-center gap-1">
              Visits
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${workDetail === 'visits' ? 'rotate-180 text-brand-600' : 'text-slate-400'}`} />
            </p>
          </button>
          <div className="p-3 ui-card-muted border border-slate-200 dark:border-slate-700 text-center">
            <p className="text-sm font-bold text-slate-900 dark:text-slate-900 break-words">{formatCurrency(expandedBiz?.businessGenerated || 0)}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Business</p>
          </div>
        </div>

        {workDetail === 'leads' && (
          <div className="mt-3 ui-card-muted border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <p className="text-xs font-medium text-slate-700 dark:text-slate-700">Lead Details ({expandedLeads.length})</p>
            </div>
            {expandedLeads.length === 0 ? (
              <p className="px-3 py-3 text-xs text-slate-500">No leads assigned to this employee.</p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {expandedLeads.map((lead) => (
                  <div key={lead.id} className="px-3 py-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-800">{lead.customerName}</p>
                      <StatusBadge status={lead.status} />
                    </div>
                    <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-0.5 text-xs text-slate-500">
                      <span>Lead ID: <span className="text-slate-700 dark:text-slate-600">{lead.leadId}</span></span>
                      <span>Product: <span className="text-slate-700 dark:text-slate-600">{lead.product || '—'}</span></span>
                      <span>Location: <span className="text-slate-700 dark:text-slate-600">{lead.location || '—'}</span></span>
                      <span>Value: <span className="text-slate-700 dark:text-slate-600">{formatCurrency(lead.leadValue)}</span></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {workDetail === 'visits' && (
          <div className="mt-3 ui-card-muted border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <p className="text-xs font-medium text-slate-700 dark:text-slate-700">Visit Details ({expandedVisits.length})</p>
            </div>
            {expandedVisits.length === 0 ? (
              <p className="px-3 py-3 text-xs text-slate-500">No visits recorded for this employee.</p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {expandedVisits.map((visit) => (
                  <div key={visit.id} className="px-3 py-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-800">{visit.customerName}</p>
                      <StatusBadge status={visit.status} />
                    </div>
                    <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-0.5 text-xs text-slate-500">
                      <span>Visit ID: <span className="text-slate-700 dark:text-slate-600">{visit.visitId}</span></span>
                      <span>Date: <span className="text-slate-700 dark:text-slate-600">{visit.visitDate}</span></span>
                      <span className="col-span-2">Location: <span className="text-slate-700 dark:text-slate-600">{visit.customerLocation || visit.destination || '—'}</span></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div>
      <PageHeader
        title="Employees"
        subtitle="Add staff, edit details and change active status"
        actions={
          <Button icon={<UserPlus className="w-4 h-4" />} onClick={openCreate}>
            Add Employee
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard title="Total Employees" value={stats.total} icon={Users} accent="blue" />
        <StatCard title="Active" value={stats.active} icon={CheckCircle2} accent="emerald" />
        <StatCard title="Managers" value={stats.managers} icon={Briefcase} accent="violet" />
        <StatCard title="Inactive" value={stats.inactive} icon={Users} accent="rose" />
      </div>

      <Card>
        <div className="mb-4">
          <SearchInput value={search} onChange={setSearch} placeholder="Search by name, ID or email" />
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No employees found" description="Adjust filters or add a new employee." />
        ) : (
          <>
            <div className="lg:hidden space-y-2">
              {mobileEmployees.map((emp) => (
                <div key={emp.id} className="ui-card overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleDetail(emp)}
                    className="w-full flex items-center gap-3 p-3.5 text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-semibold shrink-0">
                      {emp.photo}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-800 truncate">{emp.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{emp.title} · {emp.employeeId}</p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        <Badge tone={emp.role === 'admin' ? 'rose' : emp.role === 'manager' ? 'violet' : 'blue'} className="capitalize">
                          {emp.role}
                        </Badge>
                        <StatusBadge status={emp.status} />
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                        expandedId === emp.id ? 'rotate-180 text-brand-600' : ''
                      }`}
                    />
                  </button>
                  {expandedId === emp.id && inlineDetail}
                </div>
              ))}
              {filtered.length > mobileLimit && (
                <button
                  type="button"
                  onClick={() => setMobileLimit((n) => n + 4)}
                  className="w-full ui-card py-3 text-sm font-semibold text-brand-600 dark:text-brand-400"
                >
                  View more ({filtered.length - mobileLimit} remaining)
                </button>
              )}
            </div>

            <div className="hidden lg:block">
              <Table
                columns={columns}
                data={filtered}
                onRowClick={(r) => toggleDetail(r)}
              />
              {inlineDetail}
            </div>
          </>
        )}
      </Card>

      <Modal
        open={showCreate}
        title="Add Employee"
        subtitle="Enter basic details only"
        onClose={() => setShowCreate(false)}
        size="md"
        footer={<ModalActions onClose={() => setShowCreate(false)} onSubmit={saveEmployee} submitLabel="Add Employee" />}
      >
        {employeeForm}
      </Modal>

      <Modal
        open={showEdit}
        title={editing ? `Edit ${editing.name}` : 'Edit Employee'}
        subtitle="Update basic details"
        onClose={() => setShowEdit(false)}
        size="md"
        footer={<ModalActions onClose={() => setShowEdit(false)} onSubmit={saveEmployee} submitLabel="Save Changes" />}
      >
        {employeeForm}
      </Modal>

      <Modal
        open={showDelete && !!selected}
        title="Delete Employee"
        subtitle={selected?.name}
        onClose={() => setShowDelete(false)}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowDelete(false)}>Cancel</Button>
            <Button variant="danger" icon={<Trash2 className="w-4 h-4" />} onClick={deleteEmployee}>Delete Employee</Button>
          </>
        }
      >
        <p className="text-sm text-slate-600 dark:text-slate-600">
          This will remove <span className="font-medium text-slate-900 dark:text-slate-800">{selected?.name}</span> from the employee list.
          Related leads, visits and salary records are kept for reporting.
        </p>
      </Modal>
    </div>
  )
}
