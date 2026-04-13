'use client'

import { useMemo } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Search, User, FileText, Building2, LayoutGrid, Tag, Image as ImageIcon, ChevronRight, Sparkles, MapPin, Plus, UserPlus, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { cn } from '@/lib/utils'
import { siteContent } from '@/config/site.content'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { NAVBAR_OVERRIDE_ENABLED, NavbarOverride } from '@/overrides/navbar'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'

const NavbarAuthControls = dynamic(() => import('@/components/shared/navbar-auth-controls').then((mod) => mod.NavbarAuthControls), {
  ssr: false,
  loading: () => null,
})

const taskIcons: Record<TaskKey, any> = {
  article: FileText,
  listing: Building2,
  sbm: LayoutGrid,
  classified: Tag,
  image: ImageIcon,
  profile: User,
  social: LayoutGrid,
  pdf: FileText,
  org: Building2,
  comment: FileText,
}

const variantClasses = {
  'compact-bar': {
    shell: 'border-b border-slate-200/80 bg-white/88 text-slate-950 backdrop-blur-xl',
    logo: 'rounded-2xl border border-slate-200 bg-white shadow-sm',
    active: 'bg-slate-950 text-white',
    idle: 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
    cta: 'rounded-full bg-slate-950 text-white hover:bg-slate-800',
    mobile: 'border-t border-slate-200/70 bg-white/95',
  },
  'editorial-bar': {
    shell: 'border-b border-[#d7c4b3] bg-[#fff7ee]/90 text-[#2f1d16] backdrop-blur-xl',
    logo: 'rounded-full border border-[#dbc6b6] bg-white shadow-sm',
    active: 'bg-[#2f1d16] text-[#fff4e4]',
    idle: 'text-[#72594a] hover:bg-[#f2e5d4] hover:text-[#2f1d16]',
    cta: 'rounded-full bg-[#2f1d16] text-[#fff4e4] hover:bg-[#452920]',
    mobile: 'border-t border-[#dbc6b6] bg-[#fff7ee]',
  },
  'floating-bar': {
    shell: 'border-b border-transparent bg-transparent text-white',
    logo: 'rounded-[1.35rem] border border-white/12 bg-white/8 shadow-[0_16px_48px_rgba(15,23,42,0.22)] backdrop-blur',
    active: 'bg-[#8df0c8] text-[#07111f]',
    idle: 'text-slate-200 hover:bg-white/10 hover:text-white',
    cta: 'rounded-full bg-[#8df0c8] text-[#07111f] hover:bg-[#77dfb8]',
    mobile: 'border-t border-white/10 bg-[#09101d]/96',
  },
  'utility-bar': {
    shell: 'border-b border-[#d7deca] bg-[#f4f6ef]/94 text-[#1f2617] backdrop-blur-xl',
    logo: 'rounded-xl border border-[#d7deca] bg-white shadow-sm',
    active: 'bg-[#1f2617] text-[#edf5dc]',
    idle: 'text-[#56604b] hover:bg-[#e7edd9] hover:text-[#1f2617]',
    cta: 'rounded-lg bg-[#1f2617] text-[#edf5dc] hover:bg-[#2f3a24]',
    mobile: 'border-t border-[#d7deca] bg-[#f4f6ef]',
  },
} as const

export function Navbar() {
  if (NAVBAR_OVERRIDE_ENABLED) {
    return <NavbarOverride />
  }

  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { isAuthenticated } = useAuth()
  const { recipe } = getFactoryState()

  const navigation = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled && task.key !== 'profile'), [])
  const primaryNavigation = navigation.slice(0, 5)
  const primaryTask = SITE_CONFIG.tasks.find((task) => task.key === recipe.primaryTask && task.enabled) || primaryNavigation[0]
  const isDirectoryProduct = recipe.homeLayout === 'listing-home' || recipe.homeLayout === 'classified-home'

  if (isDirectoryProduct) {
    const categoryNav = CATEGORY_OPTIONS.slice(0, 8)
    const categoryQuery = searchParams.get('category')?.trim()
    const activeCategory = categoryQuery ? normalizeCategory(categoryQuery) : ''
    const classifiedRoute = primaryTask?.route || '/classifieds'
    const postAdHref = primaryTask ? `/create/${primaryTask.key}` : '/register'

    return (
      <header data-mobile-nav="true" className="sticky top-0 z-50 w-full shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
        <div className="bg-[#131a26] text-white">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:flex-nowrap sm:px-6 lg:gap-4 lg:px-8">
            <Link href="/" className="flex shrink-0 items-center gap-2.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-white/20 bg-white p-1 shadow-sm">
                <img
                  src="/favicon.png?v=20260414"
                  alt={`${SITE_CONFIG.name} logo`}
                  width={40}
                  height={40}
                  className="h-full w-full object-contain"
                />
              </span>
              <span className="max-w-[9rem] truncate text-base font-bold tracking-tight sm:max-w-none sm:text-lg">{SITE_CONFIG.name}</span>
            </Link>

            <form action="/search" method="GET" className="order-3 flex w-full min-w-0 flex-[1_1_100%] items-stretch sm:order-none sm:flex-[1_1_auto] lg:max-w-2xl xl:max-w-3xl">
              <input type="hidden" name="master" value="1" />
              <div className="flex min-h-11 min-w-0 flex-1 overflow-hidden rounded-l-md border border-white/10 bg-white">
                <label className="flex min-w-0 flex-1 items-center gap-2 border-r border-slate-200 px-3">
                  <Search className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                  <input
                    name="q"
                    className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    placeholder={`Search ${SITE_CONFIG.name}`}
                    autoComplete="off"
                  />
                </label>
                <label className="hidden w-[38%] max-w-[11rem] shrink-0 items-center gap-2 border-r border-slate-200 px-3 sm:flex">
                  <MapPin className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                  <input
                    name="location"
                    className="w-full min-w-0 bg-transparent py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    placeholder="Location"
                    autoComplete="off"
                  />
                </label>
              </div>
              <button
                type="submit"
                className="flex h-11 w-12 shrink-0 items-center justify-center rounded-r-md bg-[#22c55e] text-white transition hover:bg-[#16a34a]"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>

            <div className="ml-auto flex items-center gap-0.5 sm:gap-2">
              {isAuthenticated ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="hidden h-9 gap-1 rounded-md px-2 text-white hover:bg-white/10 hover:text-white sm:inline-flex"
                  >
                    <Link href={postAdHref} className="flex flex-col items-center gap-0.5 py-1 text-[10px] font-medium leading-none sm:flex-row sm:text-sm">
                      <Plus className="h-4 w-4" />
                      <span>Post an ad</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild className="inline-flex h-9 rounded-md bg-[#22c55e] px-3 text-sm font-semibold text-white hover:bg-[#16a34a] sm:hidden">
                    <Link href={postAdHref}>Post</Link>
                  </Button>
                  <NavbarAuthControls />
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild className="hidden h-9 gap-1 rounded-md px-2 text-white hover:bg-white/10 hover:text-white md:inline-flex">
                    <Link href="/register" className="flex flex-col items-center gap-0.5 py-1 text-[10px] font-medium leading-none sm:flex-row sm:text-sm">
                      <UserPlus className="h-4 w-4" />
                      <span>Sign up</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild className="hidden h-9 gap-1 rounded-md px-2 text-white hover:bg-white/10 hover:text-white lg:inline-flex">
                    <Link href="/login" className="flex flex-col items-center gap-0.5 py-1 text-[10px] font-medium leading-none sm:flex-row sm:text-sm">
                      <LogIn className="h-4 w-4" />
                      <span>Login</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild className="inline-flex h-9 rounded-md bg-[#22c55e] px-3 text-sm font-semibold text-white hover:bg-[#16a34a] md:hidden">
                    <Link href="/login">Login</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <nav className="border-t border-black/15 bg-[#e4e7ec]" aria-label="Browse categories">
          <div className="mx-auto flex max-w-7xl items-center gap-0 overflow-x-auto px-2 py-0 sm:px-4 lg:px-8">
            <Link
              href={classifiedRoute}
              className={cn(
                'shrink-0 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-[#334155] transition hover:bg-white/70 sm:py-3',
                pathname.startsWith(classifiedRoute.replace(/\/$/, '')) && !categoryQuery && 'border-[#22c55e] bg-white text-[#0f172a]',
              )}
            >
              All
            </Link>
            {categoryNav.map((cat) => {
              const active = activeCategory === cat.slug
              return (
                <Link
                  key={cat.slug}
                  href={`${classifiedRoute}?category=${encodeURIComponent(cat.slug)}`}
                  className={cn(
                    'shrink-0 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-[#334155] transition hover:bg-white/70 sm:py-3',
                    active && 'border-[#22c55e] bg-white text-[#0f172a]',
                  )}
                >
                  {cat.name}
                </Link>
              )
            })}
          </div>
        </nav>
      </header>
    )
  }

  const style = variantClasses[recipe.navbar]
  const isFloating = recipe.navbar === 'floating-bar'
  const isEditorial = recipe.navbar === 'editorial-bar'
  const isUtility = recipe.navbar === 'utility-bar'

  return (
    <>
      <header data-mobile-nav="true" className={cn('sticky top-0 z-50 w-full xl:hidden', style.shell)}>
        <nav className={cn('mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8', isFloating ? 'h-24 pt-4' : 'h-20')}>
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/" className="flex min-w-0 items-center gap-3">
              <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden p-1.5', style.logo)}>
                <img src="/favicon.png?v=20260414" alt={`${SITE_CONFIG.name} logo`} width="48" height="48" className="h-full w-full object-contain" />
              </div>
              <div className="min-w-0">
                <span className="block truncate text-lg font-semibold">{SITE_CONFIG.name}</span>
                <span className="block truncate text-[10px] uppercase tracking-[0.22em] opacity-70">{siteContent.navbar.tagline}</span>
              </div>
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {!isAuthenticated ? (
              <Button size="sm" asChild className={cn('rounded-full', style.cta)}>
                <Link href="/register">
                  <Plus className="mr-1 h-4 w-4" />
                  Get Started
                </Link>
              </Button>
            ) : (
              <NavbarAuthControls />
            )}
          </div>
        </nav>
      </header>

      <aside className={cn('hidden xl:fixed xl:inset-y-0 xl:left-0 xl:z-40 xl:flex xl:w-80 xl:flex-col xl:overflow-y-auto xl:border-r xl:px-6 xl:py-7', style.shell)}>
        <div className="flex h-full flex-col">
          <Link href="/" className="flex items-center gap-3">
            <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden p-1.5', style.logo)}>
              <img src="/favicon.png?v=20260414" alt={`${SITE_CONFIG.name} logo`} width="48" height="48" className="h-full w-full object-contain" />
            </div>
            <div className="min-w-0">
              <span className="block truncate text-xl font-semibold">{SITE_CONFIG.name}</span>
              <span className="block truncate text-[10px] uppercase tracking-[0.24em] opacity-70">{siteContent.navbar.tagline}</span>
            </div>
          </Link>

          <div className={cn('mt-7 rounded-[1.35rem] border border-current/10 px-4 py-4', isFloating ? 'bg-white/6 backdrop-blur' : isEditorial ? 'bg-white/70' : isUtility ? 'bg-white/80' : 'bg-slate-50')}>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] opacity-70">
              <Search className="h-3.5 w-3.5" />
              Quick Find
            </div>
            <p className="mt-2 text-sm leading-6 opacity-80">Browse by task, lane, or content type without cramped top navigation.</p>
          </div>

          {primaryTask ? (
            <Link href={primaryTask.route} className={cn('mt-5 inline-flex items-center gap-2 self-start rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em]', isFloating ? 'border border-white/10 bg-white/6 text-white/80' : 'border border-current/10 bg-white/70 opacity-80')}>
              <Sparkles className="h-3.5 w-3.5" />
              {primaryTask.label}
            </Link>
          ) : null}

          <nav className="mt-8 space-y-2">
            {primaryNavigation.map((task) => {
              const Icon = taskIcons[task.key] || LayoutGrid
              const isActive = pathname.startsWith(task.route)
              return (
                <Link key={task.key} href={task.route} className={cn('flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors', isActive ? style.active : style.idle)}>
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{task.label}</span>
                  <ChevronRight className="ml-auto h-4 w-4 opacity-45" />
                </Link>
              )
            })}
          </nav>

          <div className="mt-8 space-y-3">
            <div className={cn('rounded-[1.6rem] border border-current/10 px-4 py-4 text-sm', isFloating ? 'bg-white/6 text-slate-200' : 'bg-white/75')}>
              <div className="font-semibold">Navigation Note</div>
              <p className="mt-2 text-xs leading-6 opacity-75">Desktop navigation now sits on the left so long task labels do not collide with actions or utility controls.</p>
            </div>
          </div>

          <div className="mt-auto space-y-3 pt-8">
            {isAuthenticated ? (
              <NavbarAuthControls />
            ) : (
              <div className="space-y-3">
                <Button variant="ghost" size="sm" asChild className="w-full justify-center rounded-full px-4">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild className={cn('w-full justify-center rounded-full', style.cta)}>
                  <Link href="/register">
                    <Plus className="mr-1 h-4 w-4" />
                    Get Started
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )

}
