'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { getSafeInternalPath } from '@/lib/auth-redirect'

export function RegisterForm({
  actionClass,
  mutedClass,
}: {
  actionClass: string
  mutedClass: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signup, isLoading } = useAuth()
  const nextPath = getSafeInternalPath(searchParams.get('next'))
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [intent, setIntent] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const result = await signup(name, email, password, intent)
    if (!result.success) {
      setError(result.error || 'Could not create account.')
      return
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
        name="name"
        autoComplete="name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="h-11 rounded-md border border-slate-200 bg-white px-4 text-sm text-[#0f172a] placeholder:text-slate-400 focus:border-[#22c55e] focus:outline-none focus:ring-1 focus:ring-[#22c55e]"
        placeholder="Full name"
      />
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
        autoComplete="new-password"
        required
        minLength={4}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="h-11 rounded-md border border-slate-200 bg-white px-4 text-sm text-[#0f172a] placeholder:text-slate-400 focus:border-[#22c55e] focus:outline-none focus:ring-1 focus:ring-[#22c55e]"
        placeholder="Password"
      />
      <input
        name="intent"
        value={intent}
        onChange={(e) => setIntent(e.target.value)}
        className="h-11 rounded-md border border-slate-200 bg-white px-4 text-sm text-[#0f172a] placeholder:text-slate-400 focus:border-[#22c55e] focus:outline-none focus:ring-1 focus:ring-[#22c55e]"
        placeholder="What are you selling or looking for?"
      />
      <button
        type="submit"
        disabled={isLoading}
        className={`inline-flex h-11 items-center justify-center rounded-md px-6 text-sm font-semibold shadow-sm disabled:opacity-60 ${actionClass}`}
      >
        {isLoading ? 'Creating account…' : 'Create account'}
      </button>
      <div className={`flex items-center justify-between text-sm ${mutedClass}`}>
        <span>Already have an account?</span>
        <Link
          href={nextPath ? `/login?next=${encodeURIComponent(nextPath)}` : '/login'}
          className="inline-flex items-center gap-2 font-semibold hover:underline"
        >
          <Sparkles className="h-4 w-4" />
          Sign in
        </Link>
      </div>
    </form>
  )
}
