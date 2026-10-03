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
      navigate(emp.role === 'employee' ? '/employee' : '/admin')
    }, 400)
  }

  const quickLogin = (id: string) => {
    const ok = login(id)
    if (ok) {
      const emp = employees.find((e) => e.id === id)!
      navigate(emp.role === 'employee' ? '/employee' : '/admin')
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-ink-deep px-4 py-8 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 20% 20%, rgba(99,102,241,0.25) 0%, transparent 50%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(124,58,237,0.2) 0%, transparent 50%), radial-gradient(ellipse 50% 40% at 50% 100%, rgba(79,70,229,0.15) 0%, transparent 50%)',
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
        aria-hidden
      />

      <div className="relative w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center mx-auto mb-4 shadow-glow">
            <span className="text-white font-bold text-xl">SC</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Sales<span className="brand-text-gradient">Core</span>
          </h1>
          <p className="text-sm text-slate-400 mt-2">Sales and Marketing Management System</p>
        </div>

        <div className="bg-surface rounded-2xl shadow-modal p-6 sm:p-8 border border-white/10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50 tracking-tight">
            Sign in to your account
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Enter your credentials to access the dashboard.
          </p>

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

            {error && <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{error}</p>}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-brand-500 dark:text-brand-400" />
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Demo Accounts</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => quickLogin('emp-001')}
                className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-left hover:border-brand-400 hover:bg-brand-50/50 dark:hover:bg-brand-900/20 transition-all"
              >
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Admin</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  rajesh.verma@salescore.com
                </p>
              </button>
              <button
                onClick={() => quickLogin('emp-002')}
                className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-left hover:border-brand-400 hover:bg-brand-50/50 dark:hover:bg-brand-900/20 transition-all"
              >
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Manager</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  priya.sharma@salescore.com
                </p>
              </button>
              <button
                onClick={() => quickLogin('emp-004')}
                className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-left hover:border-brand-400 hover:bg-brand-50/50 dark:hover:bg-brand-900/20 transition-all"
              >
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Employee</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  sunita.rao@salescore.com
                </p>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-3 text-center">
              Password for all demo accounts: salescore
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
