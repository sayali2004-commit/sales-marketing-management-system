import { useState } from 'react'
import { Download, FileText, Trash2, Upload } from 'lucide-react'
import { Badge } from './ui/Badge'
import type { AppFile } from '../types'
import { employeeName } from '../data/sampleData'

interface FileUploadProps {
  label?: string
  onUpload?: (file: AppFile) => void
}

export function FileUpload({ label = 'Upload Files', onUpload }: FileUploadProps) {
  const [pending, setPending] = useState<string[]>([])

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    const names = Array.from(files).map((f) => f.name)
    setPending((p) => [...p, ...names])
    names.forEach((name) => {
      onUpload?.({
        id: `file-${Date.now()}-${name}`,
        name,
        type: name.split('.').pop()?.toUpperCase() || 'FILE',
        size: `${Math.max(1, Math.round(Math.random() * 500))} KB`,
        uploadDate: new Date().toISOString().slice(0, 10),
        uploadedBy: 'current',
        category: 'Supporting Document',
      })
    })
  }

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">{label}</label>
      <label className="flex items-center gap-3 px-4 py-3 border border-dashed border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer hover:border-brand-400 hover:bg-brand-50/40 dark:hover:bg-brand-900/20 transition-colors">
        <Upload className="w-5 h-5 text-slate-400 dark:text-slate-500" />
        <div>
          <p className="text-sm text-slate-700 dark:text-slate-200">Click to browse files</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">Bills, documents and supporting files</p>
        </div>
        <input type="file" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      </label>
      {pending.length > 0 && (
        <div className="mt-3 space-y-2">
          {pending.map((name, i) => (
            <div key={i} className="flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <span className="text-xs text-slate-600 dark:text-slate-300 truncate">{name}</span>
              <button
                onClick={() => setPending((p) => p.filter((_, idx) => idx !== i))}
                className="text-slate-400 hover:text-rose-600"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

interface FileListProps {
  files: AppFile[]
  title?: string
}

export function FileList({ files, title = 'Uploaded Files' }: FileListProps) {
  if (files.length === 0) {
    return (
      <div>
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">{title}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 py-3">No files uploaded yet.</p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">{title}</p>
      <div className="space-y-2">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center gap-3 px-3 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700"
          >
            <div className="w-9 h-9 rounded-lg bg-surface border border-slate-200 dark:border-slate-600 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-800 dark:text-slate-100 truncate">{file.name}</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                {file.type} · {file.size} · {file.uploadDate} · {employeeName(file.uploadedBy)}
              </p>
            </div>
            <Badge tone="blue">{file.category}</Badge>
            <button
              className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-surface dark:hover:bg-slate-700 transition-colors"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
