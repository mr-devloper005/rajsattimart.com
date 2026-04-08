'use client'

import type { ReactNode } from 'react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'

export function PageShell({
  title,
  description,
  actions,
  children,
}: {
  title: string
  description?: string
  actions?: ReactNode
  children?: ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#eef1f6]">
      <NavbarShell />
      <main>
        <section className="border-b border-slate-200/80 bg-white shadow-sm">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-[#0f172a]">{title}</h1>
                {description && (
                  <p className="mt-2 max-w-2xl text-sm text-[#64748b]">{description}</p>
                )}
              </div>
              {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 [&_h2]:text-[#0f172a] [&_h3]:text-[#0f172a] [&_.text-muted-foreground]:text-[#64748b]">
            {children}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
