import { useMemo, useState } from 'react'
import { Download, FileText, FolderOpen, Trash2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Select } from '../../components/ui/FormControls'
import { Table, type Column } from '../../components/ui/Table'
import { EmptyState } from '../../components/ui/States'
import { FilterBar, SearchInput } from '../../components/ui/Inputs'
import { StatCard } from '../../components/ui/StatCard'
import { employeeName } from '../../data/sampleData'
import type { AppFile } from '../../types'

export function FileManagementSection() {
  const { appFiles } = useApp()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const files = appFiles

  const filtered = useMemo(() => {
    return files.filter((f) => {
      const q = search.toLowerCase()
      const matchQ = !q || f.name.toLowerCase().includes(q) || employeeName(f.uploadedBy).toLowerCase().includes(q)
      const matchCat = categoryFilter === 'all' || f.category === categoryFilter
      return matchQ && matchCat
    })
  }, [files, search, categoryFilter])

  const columns: Column<AppFile>[] = [
    {
      key: 'name',
      header: 'File Name',
      render: (f) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-slate-800 truncate">{f.name}</p>
            <p className="text-xs text-slate-400">{f.type} · {f.size}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (f) => <Badge tone="cyan">{f.category}</Badge>,
    },
    {
      key: 'uploadedBy',
      header: 'Uploaded By',
      hideOnMobile: true,
      render: (f) => <span className="text-slate-600">{employeeName(f.uploadedBy)}</span>,
    },
    {
      key: 'uploadDate',
      header: 'Upload Date',
      className: 'whitespace-nowrap',
      render: (f) => <span className="text-slate-600">{f.uploadDate}</span>,
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: () => (
        <div className="flex items-center justify-end gap-1">
          <button className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100" title="View or download">
            <Download className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600" title="Delete">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard title="Total Files" value={files.length} icon={FolderOpen} accent="blue" />
        <StatCard title="Travel Bills" value={files.filter((f) => f.category === 'Travel Bill').length} icon={FileText} accent="amber" />
        <StatCard title="Lead Documents" value={files.filter((f) => f.category === 'Lead Document').length} icon={FileText} accent="violet" />
        <StatCard title="Reports" value={files.filter((f) => f.category === 'Report').length} icon={FileText} accent="emerald" />
      </div>

      <Card>
        <FilterBar className="mb-4">
          <SearchInput value={search} onChange={setSearch} placeholder="Search files" className="w-full sm:w-64" />
          <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="Lead Document">Lead Document</option>
            <option value="Visit Document">Visit Document</option>
            <option value="Travel Bill">Travel Bill</option>
            <option value="Customer Document">Customer Document</option>
            <option value="Report">Report</option>
            <option value="Supporting Document">Supporting Document</option>
          </Select>
          <Button variant="secondary" size="sm">Download All</Button>
        </FilterBar>

        {filtered.length === 0 ? (
          <EmptyState title="No files found" description="Upload documents or adjust the filters." />
        ) : (
          <Table columns={columns} data={filtered} />
        )}
      </Card>
    </div>
  )
}
