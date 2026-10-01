import { useMemo, useState } from 'react'
import {
  Briefcase,
  CheckCircle2,
  Mail,
  Navigation,
  Pencil,
  Phone,
  Power,
  Trash2,
  UserPlus,
  Users,
  Wallet,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Badge, StatusBadge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input, Select } from '../../components/ui/FormControls'
import { Modal, ModalActions } from '../../components/ui/Modal'
import { Table, type Column } from '../../components/ui/Table'
import { EmptyState } from '../../components/ui/States'
import { FilterBar, PageHeader, SearchInput } from '../../components/ui/Inputs'
import { StatCard } from '../../components/ui/StatCard'
import { employeeName, formatCurrency } from '../../data/sampleData'
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
  const [selected, setSelected] = useState<Employee | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [editing, setEditing] = useState<Employee | null>(null)
  const [form, setForm] = useState(emptyForm)

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
    setShowDetail(false)
  }

  const openCreate = () => {
    setForm(emptyForm)
    setShowCreate(true)
  }

  const saveEmployee = () => {
    if (!form.name || !form.employeeId) return
    if (editing) {
      updateEmployee({
        ...editing,
        name: form.name,
        employeeId: form.employeeId,
        role: form.role as Employee['role'],
        department: form.department as Employee['department'],
        mobile: form.mobile,
        email: form.email,
        joiningDate: form.joiningDate,
        managerId: form.managerId || null,
        monthlySalary: Number(form.monthlySalary) || 0,
        photo: form.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase(),
      })
    } else {
      const newEmp: Employee = {
        id: `emp-${Date.now()}`,
        name: form.name,
        employeeId: form.employeeId,
        role: form.role as Employee['role'],
        department: form.department as Employee['department'],
        mobile: form.mobile,
        email: form.email,
        joiningDate: form.joiningDate,
        managerId: form.managerId || null,
        monthlySalary: Number(form.monthlySalary) || 0,
        status: 'Active',
        photo: form.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase(),
        title: form.role === 'admin' ? 'Admin' : form.role === 'manager' ? 'Manager' : 'Employee',
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
    setShowDetail(false)
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
      key: 'managerId',
      header: 'Assigned Manager',
      hideOnMobile: true,
      render: (r) => <span className="text-slate-600">{r.managerId ? employeeName(r.managerId) : 'None'}</span>,
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
            onClick={() => { setSelected(r); setShowDetail(true) }}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
            title="View details"
          >
            <Users className="w-4 h-4" />
          </button>
          <button
            onClick={() => openEdit(r)}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
            title="Edit employee"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleStatus(r)}
            className={`p-1.5 rounded-lg ${r.status === 'Active' ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
            title={r.status === 'Active' ? 'Deactivate' : 'Activate'}
          >
            <Power className="w-4 h-4" />
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
  const selectedTravel = selected ? travelRecords.filter((t) => t.employeeId === selected.id) : []
  const selectedSalary = selected ? salaryRecords.filter((s) => s.employeeId === selected.id) : []
  const selectedAdvance = selected ? advanceRecords.filter((a) => a.employeeId === selected.id) : []
  const travelDistance = selectedTravel.reduce((s, t) => s + t.distance, 0)
  const travelAmount = selectedTravel.reduce((s, t) => s + t.totalAmount, 0)
  const salaryPaid = selectedSalary.reduce((s, r) => s + r.paidAmount, 0)
  const advancePending = selectedAdvance.reduce((s, a) => s + a.pendingAmount, 0)

  const employeeForm = (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Input label="Employee Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <Input label="Employee ID" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} placeholder="SC-SAL-006" />
      <Select label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
        <option value="employee">Employee</option>
        <option value="manager">Manager</option>
        <option value="admin">Admin</option>
      </Select>
      <Select label="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
        <option value="Sales">Sales</option>
        <option value="Marketing">Marketing</option>
        <option value="Sales and Marketing">Sales and Marketing</option>
        <option value="Management">Management</option>
      </Select>
      <Input label="Mobile Number" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
      <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <Input label="Joining Date" type="date" value={form.joiningDate} onChange={(e) => setForm({ ...form, joiningDate: e.target.value })} />
      <Select label="Assigned Manager" value={form.managerId} onChange={(e) => setForm({ ...form, managerId: e.target.value })}>
        <option value="">No manager</option>
        {allEmployees.filter((e) => e.role === 'manager' || e.role === 'admin').map((e) => (
          <option key={e.id} value={e.id}>{e.name}</option>
        ))}
      </Select>
      <Input label="Monthly Salary (INR)" type="number" value={form.monthlySalary} onChange={(e) => setForm({ ...form, monthlySalary: e.target.value })} />
    </div>
  )

  return (
    <div>
      <PageHeader
        title="Employee Management"
        subtitle="Add, edit, activate, deactivate and review employee performance"
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
        <FilterBar className="mb-4">
          <SearchInput value={search} onChange={setSearch} placeholder="Search employees" className="w-full sm:w-72" />
          <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
          </Select>
          <Select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
            <option value="all">All Departments</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales and Marketing">Sales and Marketing</option>
            <option value="Management">Management</option>
          </Select>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </Select>
        </FilterBar>

        {filtered.length === 0 ? (
          <EmptyState title="No employees found" description="Adjust filters or add a new employee." />
        ) : (
          <Table columns={columns} data={filtered} onRowClick={(r) => { setSelected(r); setShowDetail(true) }} />
        )}
      </Card>

      <Modal
        open={showCreate}
        title="Add Employee"
        subtitle="Create a new employee record"
        onClose={() => setShowCreate(false)}
        size="lg"
        footer={<ModalActions onClose={() => setShowCreate(false)} onSubmit={saveEmployee} submitLabel="Add Employee" />}
      >
        {employeeForm}
      </Modal>

      <Modal
        open={showEdit}
        title={editing ? `Edit ${editing.name}` : 'Edit Employee'}
        subtitle="Update employee information"
        onClose={() => setShowEdit(false)}
        size="lg"
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
        <p className="text-sm text-slate-600">
          This will remove <span className="font-medium text-slate-900">{selected?.name}</span> from the employee list.
          Related leads, visits and salary records are kept for reporting.
        </p>
      </Modal>

      <Modal
        open={showDetail && !!selected}
        title={selected?.name || 'Employee'}
        subtitle={selected?.title}
        onClose={() => setShowDetail(false)}
        size="xl"
        footer={
          <>
            <Button variant="secondary" icon={<Pencil className="w-4 h-4" />} onClick={() => selected && openEdit(selected)}>
              Edit
            </Button>
            <Button
              variant={selected?.status === 'Active' ? 'secondary' : 'success'}
              icon={<Power className="w-4 h-4" />}
              onClick={() => selected && toggleStatus(selected)}
            >
              {selected?.status === 'Active' ? 'Deactivate' : 'Activate'}
            </Button>
            <Button variant="danger" icon={<Trash2 className="w-4 h-4" />} onClick={() => setShowDelete(true)}>
              Delete
            </Button>
            <Button onClick={() => setShowDetail(false)}>Close</Button>
          </>
        }
      >
        {selected && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xl font-semibold shrink-0">
                {selected.photo}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-slate-900">{selected.name}</h3>
                <p className="text-sm text-slate-500">{selected.title} · {selected.department}</p>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-600">
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{selected.mobile}</span>
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{selected.email}</span>
                  <Badge tone="blue">{selected.employeeId}</Badge>
                  <StatusBadge status={selected.status} />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 sm:hidden">
                <Button size="sm" variant="secondary" icon={<Pencil className="w-3.5 h-3.5" />} onClick={() => openEdit(selected)}>Edit</Button>
                <Button size="sm" variant="danger" icon={<Trash2 className="w-3.5 h-3.5" />} onClick={() => setShowDelete(true)}>Delete</Button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Joining Date</p>
                <p className="text-sm font-medium text-slate-800 mt-1">{selected.joiningDate}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Assigned Manager</p>
                <p className="text-sm font-medium text-slate-800 mt-1">{selected.managerId ? employeeName(selected.managerId) : 'None'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Monthly Salary</p>
                <p className="text-sm font-medium text-slate-800 mt-1">{formatCurrency(selected.monthlySalary)}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Role</p>
                <p className="text-sm font-medium text-slate-800 mt-1 capitalize">{selected.role}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-600 mb-2">Quick Actions</p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="secondary" icon={<Pencil className="w-3.5 h-3.5" />} onClick={() => openEdit(selected)}>
                  Edit Employee
                </Button>
                <Button
                  size="sm"
                  variant={selected.status === 'Active' ? 'secondary' : 'success'}
                  icon={<Power className="w-3.5 h-3.5" />}
                  onClick={() => toggleStatus(selected)}
                >
                  {selected.status === 'Active' ? 'Deactivate' : 'Activate'}
                </Button>
                <Button size="sm" variant="secondary" icon={<Wallet className="w-3.5 h-3.5" />} onClick={() => openEdit(selected)}>
                  Update Salary
                </Button>
                <Button size="sm" variant="secondary" icon={<Briefcase className="w-3.5 h-3.5" />} onClick={() => openEdit(selected)}>
                  Change Role
                </Button>
                <Button size="sm" variant="danger" icon={<Trash2 className="w-3.5 h-3.5" />} onClick={() => setShowDelete(true)}>
                  Delete
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Leads Generated', value: selectedBiz?.leadsGenerated || 0 },
                { label: 'Leads Converted', value: selectedBiz?.leadsConverted || 0 },
                { label: 'Visits', value: selectedVisits.length },
                { label: 'Business Generated', value: formatCurrency(selectedBiz?.businessGenerated || 0) },
                { label: 'Business Benefit', value: formatCurrency(selectedBiz?.businessBenefit || 0) },
                { label: 'Travel Distance', value: `${travelDistance} KM` },
                { label: 'Travel Expense', value: formatCurrency(travelAmount) },
                { label: 'Salary Paid', value: formatCurrency(salaryPaid) },
              ].map((s) => (
                <div key={s.label} className="p-3 border border-slate-200 rounded-lg">
                  <p className="text-xs text-slate-500">{s.label}</p>
                  <p className="text-sm font-semibold text-slate-900 mt-1">{s.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-medium text-slate-600 mb-2">Employee Leads</p>
                {selectedLeads.length === 0 ? (
                  <p className="text-xs text-slate-400">No leads assigned.</p>
                ) : (
                  <div className="space-y-1.5">
                    {selectedLeads.slice(0, 5).map((l) => (
                      <div key={l.id} className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg text-sm">
                        <span className="text-slate-700">{l.leadId} · {l.customerName}</span>
                        <StatusBadge status={l.status} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs font-medium text-slate-600 mb-2">Employee Visits</p>
                {selectedVisits.length === 0 ? (
                  <p className="text-xs text-slate-400">No visits recorded.</p>
                ) : (
                  <div className="space-y-1.5">
                    {selectedVisits.slice(0, 5).map((v) => (
                      <div key={v.id} className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg text-sm">
                        <span className="text-slate-700">{v.visitId} · {v.customerName}</span>
                        <StatusBadge status={v.status} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-medium text-slate-600 mb-2">Travel Records</p>
                {selectedTravel.length === 0 ? (
                  <p className="text-xs text-slate-400">No travel records.</p>
                ) : (
                  <div className="space-y-1.5">
                    {selectedTravel.slice(0, 4).map((t) => (
                      <div key={t.id} className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg text-sm">
                        <span className="text-slate-700 flex items-center gap-1.5">
                          <Navigation className="w-3.5 h-3.5 text-brand-600" />
                          {t.travelDate} · {t.destination}
                        </span>
                        <span className="text-slate-800 font-medium">{formatCurrency(t.totalAmount)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs font-medium text-slate-600 mb-2">Salary Information</p>
                {selectedSalary.length === 0 ? (
                  <p className="text-xs text-slate-400">No salary records.</p>
                ) : (
                  <div className="space-y-1.5">
                    {selectedSalary.slice(0, 4).map((s) => (
                      <div key={s.id} className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg text-sm">
                        <span className="text-slate-700">{s.salaryMonth}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-700 font-medium">{formatCurrency(s.paidAmount)}</span>
                          <StatusBadge status={s.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-600 mb-2">Advance Information</p>
              {selectedAdvance.length === 0 ? (
                <p className="text-xs text-slate-400">No advance records. Pending amount: {formatCurrency(advancePending)}</p>
              ) : (
                <div className="space-y-1.5">
                  {selectedAdvance.slice(0, 4).map((a) => (
                    <div key={a.id} className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg text-sm">
                      <span className="text-slate-700">{a.advanceDate} · {a.reason}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-800 font-medium">{formatCurrency(a.advanceAmount)}</span>
                        <StatusBadge status={a.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
