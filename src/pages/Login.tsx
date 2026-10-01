import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Mail, ShieldCheck } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/FormControls'
import { employees } from '../data/sampleData'

export function LoginPage() {
  const { login } = useApp()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    window.setTimeout(() => {
      const emp = employees.find((x) => x.email.toLowerCase() === email.trim().toLowerCase())
      if (!emp || password !== 'salescore') {
        setError('Invalid email or password. Use the demo credentials below.')
        setLoading(false)
        return
      }
      const ok = login(emp.id)
      setLoading(false)
      if (!ok) {
        setError('Account is inactive. Contact the administrator.')
        return
      }
      navigate(emp.role === 'admin' ? '/admin' : emp.role === 'manager' ? '/manager' : '/employee')
    }, 400)
  }

  const quickLogin = (id: string) => {
    const ok = login(id)
    if (ok) {
      const emp = employees.find((e) => e.id === id)!
      navigate(emp.role === 'admin' ? '/admin' : emp.role === 'manager' ? '/manager' : '/employee')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-8">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-600/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-brand-800/30 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-brand-600 flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">SC</span>
          </div>
          <h1 className="text-2xl font-semibold text-white">SalesCore</h1>
          <p className="text-sm text-slate-400 mt-1">Sales and Marketing Management System</p>
        </div>

        <div className="bg-white rounded-2xl shadow-modal p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-slate-900">Sign in to your account</h2>
          <p className="text-sm text-slate-500 mt-1">Enter your credentials to access the dashboard.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="name@salescore.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              required
            />

            {error && <p className="text-xs text-rose-600">{error}</p>}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Signing in' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              <p className="text-xs font-medium text-slate-600">Demo Accounts</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => quickLogin('emp-001')}
                className="px-3 py-2.5 rounded-lg border border-slate-200 text-left hover:border-brand-400 hover:bg-brand-50/40 transition-colors"
              >
                <p className="text-xs font-semibold text-slate-800">Admin</p>
                <p className="text-[11px] text-slate-500 truncate">rajesh.verma@salescore.com</p>
              </button>
              <button
                onClick={() => quickLogin('emp-002')}
                className="px-3 py-2.5 rounded-lg border border-slate-200 text-left hover:border-brand-400 hover:bg-brand-50/40 transition-colors"
              >
                <p className="text-xs font-semibold text-slate-800">Manager</p>
                <p className="text-[11px] text-slate-500 truncate">priya.sharma@salescore.com</p>
              </button>
              <button
                onClick={() => quickLogin('emp-004')}
                className="px-3 py-2.5 rounded-lg border border-slate-200 text-left hover:border-brand-400 hover:bg-brand-50/40 transition-colors"
              >
                <p className="text-xs font-semibold text-slate-800">Employee</p>
                <p className="text-[11px] text-slate-500 truncate">sunita.rao@salescore.com</p>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-3 text-center">Password for all demo accounts: salescore</p>
          </div>
        </div>
      </div>
    </div>
  )
}
