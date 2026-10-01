import { useMemo, useState } from 'react'
import {
  Briefcase,
  CheckCircle2,
  Eye,
  Mail,
  Pencil,
  Phone,
  Plus,
  Search,
  TrendingUp,
  UserPlus,
  Users,
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

export function EmployeeManagement() {
  const { employees, businessRecords, leads, visits } = useApp()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [selected, setSelected] = useState<Employee | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({
    name: '',
    employeeId: '',
    role: 'employee',
    department: 'Sales',
    mobile: '',
    email: '',
    joiningDate: '',
    managerId: 'emp-002',
    monthlySalary: '',
  })

  const filtered = useMemo(() => {
    return employees.filter((e) => {
      const q = search.toLowerCase()
      const matchQ = !q || e.name.toLowerCase().includes(q) || e.employeeId.toLowerCase().includes(q) || e.email.toLowerCase().includes(q)
      const matchRole = roleFilter === 'all' || e.role === roleFilter
      const matchStatus = statusFilter === 'all' || e.status === statusFilter
      const matchDept = departmentFilter === 'all' || e.department === departmentFilter
      return matchQ && matchRole && matchStatus && matchDept
    })
  }, [employees, search, roleFilter, statusFilter, departmentFilter])

  const stats = useMemo(() => ({
    total: employees.length,
    active: employees.filter((e) => e.status === 'Active').length,
    inactive: employees.filter((e) => e.status === 'Inactive').length,
    managers: employees.filter((e) => e.role === 'manager').length,
  }), [employees])

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
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); setSelected(r); setShowDetail(true) }}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
            title="View employee"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100" title="Edit employee">
            <Pencil className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  const selectedBiz = selected ? businessRecords.find((b) => b.employeeId === selected.id) : null
  const selectedLeads = selected ? leads.filter((l) => l.assignedEmployeeId === selected.id) : []
  const selectedVisits = selected ? visits.filter((v) => v.employeeId === selected.id) : []

  return (
    <div>
      <PageHeader
        title="Employee Management"
        subtitle="Add, edit, assign roles and review employee performance"
        actions={
          <Button icon={<UserPlus className="w-4 h-4" />} onClick={() => setShowCreate(true)}>
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
          <EmptyState title="No employees found" description="Adjust filters or add a new employee." icon={<Search className="w-6 h-6" />} />
        ) : (
          <Table columns={columns} data={filtered} onRowClick={(r) => { setSelected(r); setShowDetail(true) }} />
        )}
      </Card>

      <Modal open={showCreate} title="Add Employee" subtitle="Create a new employee record" onClose={() => setShowCreate(false)} size="lg" footer={<ModalActions onClose={() => setShowCreate(false)} onSubmit={() => setShowCreate(false)} submitLabel="Add Employee" />}>
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
            {employees.filter((e) => e.role === 'manager' || e.role === 'admin').map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </Select>
          <Input label="Monthly Salary (INR)" type="number" value={form.monthlySalary} onChange={(e) => setForm({ ...form, monthlySalary: e.target.value })} />
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Profile Photo</label>
            <div className="flex items-center gap-3 px-3 py-2.5 border border-dashed border-slate-300 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-semibold">
                {form.name ? form.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase() : 'NA'}
              </div>
              <p className="text-xs text-slate-500">Initials are used as profile photo</p>
            </div>
          </div>
        </div>
      </Modal>

      <Modal open={showDetail && !!selected} title={selected?.name || 'Employee'} subtitle={selected?.title} onClose={() => setShowDetail(false)} size="xl" footer={<Button onClick={() => setShowDetail(false)}>Close</Button>}>
        {selected && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xl font-semibold">
                {selected.photo}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{selected.name}</h3>
                <p className="text-sm text-slate-500">{selected.title} · {selected.department}</p>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-600">
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{selected.mobile}</span>
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{selected.email}</span>
                  <Badge tone="blue">{selected.employeeId}</Badge>
                  <StatusBadge status={selected.status} />
                </div>
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

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Leads Generated', value: selectedBiz?.leadsGenerated || 0 },
                { label: 'Leads Converted', value: selectedBiz?.leadsConverted || 0 },
                { label: 'Visits', value: selectedVisits.length },
                { label: 'Business Generated', value: formatCurrency(selectedBiz?.businessGenerated || 0) },
              ].map((s) => (
                <div key={s.label} className="p-3 border border-slate-200 rounded-lg">
                  <p className="text-xs text-slate-500">{s.label}</p>
                  <p className="text-lg font-semibold text-slate-900 mt-1">{s.value}</p>
                </div>
              ))}
            </div>

            <div>
              <p className="text-xs font-medium text-slate-600 mb-2">Recent Leads</p>
              {selectedLeads.length === 0 ? (
                <p className="text-xs text-slate-400">No leads assigned.</p>
              ) : (
                <div className="space-y-1.5">
                  {selectedLeads.slice(0, 4).map((l) => (
                    <div key={l.id} className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg text-sm">
                      <span className="text-slate-700">{l.leadId} · {l.customerName}</span>
                      <StatusBadge status={l.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <p className="text-xs font-medium text-slate-600 mb-2">Recent Visits</p>
              {selectedVisits.length === 0 ? (
                <p className="text-xs text-slate-400">No visits recorded.</p>
              ) : (
                <div className="space-y-1.5">
                  {selectedVisits.slice(0, 4).map((v) => (
                    <div key={v.id} className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg text-sm">
                      <span className="text-slate-700">{v.visitId} · {v.customerName} · {v.visitDate}</span>
                      <StatusBadge status={v.status} />
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
