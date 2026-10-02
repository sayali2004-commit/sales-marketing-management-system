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
        <div className="mb-6">
          <div className="max-w-md">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Search</p>
            <SearchInput value={search} onChange={setSearch} placeholder="Search by name, ID or email" />
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No employees found" description="Adjust filters or add a new employee." />
        ) : (
          <Table columns={columns} data={filtered} onRowClick={(r) => { setSelected(r); setShowDetail(true) }} />
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
        size="md"
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
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-lg font-semibold shrink-0">
                {selected.photo}
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-slate-900">{selected.name}</h3>
                <p className="text-sm text-slate-500">{selected.title}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-600">
                  <span>{selected.mobile}</span>
                  {selected.email && <span>{selected.email}</span>}
                  <StatusBadge status={selected.status} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Joining Date</p>
                <p className="text-sm font-medium text-slate-800 mt-1">{selected.joiningDate || 'Not set'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Monthly Salary</p>
                <p className="text-sm font-medium text-slate-800 mt-1">{formatCurrency(selected.monthlySalary)}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-600 mb-2">Work Summary</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 border border-slate-200 rounded-lg text-center">
                  <p className="text-lg font-semibold text-slate-900">{selectedLeads.length}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Leads</p>
                </div>
                <div className="p-3 border border-slate-200 rounded-lg text-center">
                  <p className="text-lg font-semibold text-slate-900">{selectedVisits.length}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Visits</p>
                </div>
                <div className="p-3 border border-slate-200 rounded-lg text-center">
                  <p className="text-lg font-semibold text-slate-900">{formatCurrency(selectedBiz?.businessGenerated || 0)}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Business</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
