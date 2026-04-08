'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { getSafeInternalPath } from '@/lib/auth-redirect'
import { loadLoginPrefs, saveLoginPrefs } from '@/lib/auth-local'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

export function LoginForm({
  actionClass,
  mutedClass,
}: {
  actionClass: string
  mutedClass: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, isLoading } = useAuth()
  const nextPath = getSafeInternalPath(searchParams.get('next'))
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const prefs = loadLoginPrefs()
    if (prefs.remember) {
      setRemember(true)
      if (prefs.email) setEmail(prefs.email)
      if (prefs.password) setPassword(prefs.password)
    }
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const result = await login(email, password)
    if (!result.success) {
      setError(result.error || 'Sign in failed.')
      return
    }
    if (remember) {
      saveLoginPrefs({ remember: true, email: email.trim(), password })
    } else {
      saveLoginPrefs({ remember: false })
    }
    router.push(nextPath || '/')
    router.refresh()
  }

  return (
    <form className="mt-6 grid gap-4" onSubmit={onSubmit} noValidate>
      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}
      <input
        name="email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-11 rounded-md border border-slate-200 bg-white px-4 text-sm text-[#0f172a] placeholder:text-slate-400 focus:border-[#22c55e] focus:outline-none focus:ring-1 focus:ring-[#22c55e]"
        placeholder="Email address"
      />
      <input
        name="password"
        type="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="h-11 rounded-md border border-slate-200 bg-white px-4 text-sm text-[#0f172a] placeholder:text-slate-400 focus:border-[#22c55e] focus:outline-none focus:ring-1 focus:ring-[#22c55e]"
        placeholder="Password"
      />
      <div className="flex items-center gap-2">
        <Checkbox
          id="remember"
          checked={remember}
          onCheckedChange={(v) => setRemember(v === true)}
        />
        <Label htmlFor="remember" className="text-sm font-normal text-[#475569]">
          Remember my email and password on this device
        </Label>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className={`inline-flex h-11 items-center justify-center rounded-md px-6 text-sm font-semibold shadow-sm disabled:opacity-60 ${actionClass}`}
      >
        {isLoading ? 'Signing in…' : 'Sign in'}
      </button>
      <div className={`flex items-center justify-between text-sm ${mutedClass}`}>
        <Link href="/forgot-password" className="hover:underline">
          Forgot password?
        </Link>
        <Link
          href={nextPath ? `/register?next=${encodeURIComponent(nextPath)}` : '/register'}
          className="inline-flex items-center gap-2 font-semibold hover:underline"
        >
          <Sparkles className="h-4 w-4" />
          Create account
        </Link>
      </div>
    </form>
  )
}
