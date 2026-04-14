import type { ReactNode } from 'react'
import Image from 'next/image'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { SITE_CONFIG } from '@/lib/site-config'
export function BrandPageFrame({
  eyebrow,
  title,
  description,
  actions,
  children,
}: {
  eyebrow?: string
  title: ReactNode
  description?: string
  actions?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#dfe6ef_0%,#eef2f7_45%,#f4f6f9_100%)]">
      <NavbarShell />
      <header className="relative overflow-hidden bg-gradient-to-br from-[#0b1628] via-[#132a47] to-[#1a3a5c] text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-14 lg:px-8">
          <div className="max-w-2xl">
            {eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#fdba74]">{eyebrow}</p>
            ) : null}
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/20 bg-white p-2 shadow-lg shadow-black/20">
                <Image
                  src="/favicon.png"
                  alt={`${SITE_CONFIG.name} logo`}
                  width={48}
                  height={48}
                  className="h-full w-full object-contain"
                  priority
                />
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
            </div>
            {description ? <p className="mt-4 text-sm leading-relaxed text-slate-200">{description}</p> : null}
          </div>
          {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
        </div>
        <p className="relative mx-auto max-w-6xl px-4 pb-6 text-center text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-300 sm:px-6 sm:text-left lg:px-8">
          Shop more · Pay less · Live better
        </p>
      </header>
      <main className="mx-auto max-w-6xl -mt-6 px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xl shadow-slate-900/10 sm:p-9 lg:p-10">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}
