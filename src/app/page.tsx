import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Bookmark, Building2, Check, FileText, Image as ImageIcon, LayoutGrid, MapPin, Plus, Tag, User } from 'lucide-react'
import { ContentImage } from '@/components/shared/content-image'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { SchemaJsonLd } from '@/components/seo/schema-jsonld'
import { TaskPostCard } from '@/components/shared/task-post-card'
import { CategoryCardsPopup } from '@/components/home/category-cards-popup'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { buildPageMetadata } from '@/lib/seo'
import { fetchTaskPosts, getPostTaskKey } from '@/lib/task-data'
import { siteContent } from '@/config/site.content'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind, type ProductKind } from '@/design/factory/get-product-kind'
import type { SitePost } from '@/lib/site-connector'
import { HOME_PAGE_OVERRIDE_ENABLED, HomePageOverride } from '@/overrides/home-page'
import { CATEGORY_OPTIONS, isValidCategory, normalizeCategory } from '@/lib/categories'
import { cn } from '@/lib/utils'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/',
    title: siteContent.home.metadata.title,
    description: siteContent.home.metadata.description,
    openGraphTitle: siteContent.home.metadata.openGraphTitle,
    openGraphDescription: siteContent.home.metadata.openGraphDescription,
    image: SITE_CONFIG.defaultOgImage,
    keywords: [...siteContent.home.metadata.keywords],
  })
}

type EnabledTask = (typeof SITE_CONFIG.tasks)[number]
type TaskFeedItem = { task: EnabledTask; posts: SitePost[] }

const taskIcons: Record<TaskKey, any> = {
  article: FileText,
  listing: Building2,
  sbm: Bookmark,
  classified: Tag,
  image: ImageIcon,
  profile: User,
  social: LayoutGrid,
  comment: FileText,
  pdf: FileText,
  org: Building2,
}

function resolveTaskKey(value: unknown, fallback: TaskKey): TaskKey {
  if (value === 'listing' || value === 'classified' || value === 'article' || value === 'image' || value === 'profile' || value === 'sbm') return value
  return fallback
}

function getTaskHref(task: TaskKey, slug: string) {
  const route = SITE_CONFIG.tasks.find((item) => item.key === task)?.route || `/${task}`
  return `${route}/${slug}`
}

function getPostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const contentImage = typeof post?.content === 'object' && post?.content && Array.isArray((post.content as any).images)
    ? (post.content as any).images.find((url: unknown) => typeof url === 'string' && url)
    : null
  const logo = typeof post?.content === 'object' && post?.content && typeof (post.content as any).logo === 'string'
    ? (post.content as any).logo
    : null
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

function titleCaseFromSlug(value: string) {
  return value
    .split(/[-_\s]+/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function getDirectoryTone(brandPack: string) {
  if (brandPack === 'market-utility') {
    return {
      shell: 'bg-[#eef1f6] text-[#0f172a]',
      hero: 'bg-[#eef1f6]',
      panel: 'rounded-xl border border-slate-200 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.07)]',
      soft: 'rounded-xl border border-slate-200 bg-white shadow-sm',
      muted: 'text-[#64748b]',
      title: 'text-[#0f172a]',
      badge: 'bg-[#22c55e] text-white',
      action: 'bg-[#22c55e] text-white hover:bg-[#16a34a]',
      actionAlt: 'border border-slate-200 bg-white text-[#0f172a] hover:bg-slate-50',
    }
  }
  return {
    shell: 'bg-[#eef1f6] text-[#0f172a]',
    hero: 'bg-[#eef1f6]',
    panel: 'rounded-xl border border-slate-200 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.07)]',
    soft: 'rounded-xl border border-slate-200 bg-white shadow-sm',
    muted: 'text-[#64748b]',
    title: 'text-[#0f172a]',
    badge: 'bg-[#22c55e] text-white',
    action: 'bg-[#22c55e] text-white hover:bg-[#16a34a]',
    actionAlt: 'border border-slate-200 bg-white text-[#0f172a] hover:bg-slate-50',
  }
}

function getEditorialTone() {
  return {
    shell: 'bg-[#fbf6ee] text-[#241711]',
    panel: 'border border-[#dcc8b7] bg-[#fffdfa] shadow-[0_24px_60px_rgba(77,47,27,0.08)]',
    soft: 'border border-[#e6d6c8] bg-[#fff4e8]',
    muted: 'text-[#6e5547]',
    title: 'text-[#241711]',
    badge: 'bg-[#241711] text-[#fff1e2]',
    action: 'bg-[#241711] text-[#fff1e2] hover:bg-[#3a241b]',
    actionAlt: 'border border-[#dcc8b7] bg-transparent text-[#241711] hover:bg-[#f5e7d7]',
  }
}

function getVisualTone() {
  return {
    shell: 'bg-[#07101f] text-white',
    panel: 'border border-white/10 bg-[rgba(11,18,31,0.78)] shadow-[0_28px_80px_rgba(0,0,0,0.35)]',
    soft: 'border border-white/10 bg-white/6',
    muted: 'text-slate-300',
    title: 'text-white',
    badge: 'bg-[#8df0c8] text-[#07111f]',
    action: 'bg-[#8df0c8] text-[#07111f] hover:bg-[#77dfb8]',
    actionAlt: 'border border-white/10 bg-white/6 text-white hover:bg-white/10',
  }
}

function getCurationTone() {
  return {
    shell: 'bg-[#f7f1ea] text-[#261811]',
    panel: 'border border-[#ddcdbd] bg-[#fffaf4] shadow-[0_24px_60px_rgba(91,56,37,0.08)]',
    soft: 'border border-[#e8dbce] bg-[#f3e8db]',
    muted: 'text-[#71574a]',
    title: 'text-[#261811]',
    badge: 'bg-[#5b2b3b] text-[#fff0f5]',
    action: 'bg-[#5b2b3b] text-[#fff0f5] hover:bg-[#74364b]',
    actionAlt: 'border border-[#ddcdbd] bg-transparent text-[#261811] hover:bg-[#efe3d6]',
  }
}

function DirectoryHome({ primaryTask, listingPosts, classifiedPosts, brandPack }: {
  primaryTask?: EnabledTask
  listingPosts: SitePost[]
  classifiedPosts: SitePost[]
  brandPack: string
}) {
  const tone = getDirectoryTone(brandPack)
  const featuredListings = (listingPosts.length ? listingPosts : classifiedPosts).slice(0, 4)
  const featuredTaskKey: TaskKey = listingPosts.length ? 'listing' : 'classified'
  const collage = (classifiedPosts.length ? classifiedPosts : listingPosts).slice(0, 6)
  const postAdHref = primaryTask ? `/create/${primaryTask.key}` : '/register'
  const goodFindsListings = featuredListings.slice(0, 4)

  const topCategories = (() => {
    const combined = [...classifiedPosts, ...listingPosts]
    const bySlug = new Map<string, { slug: string; name: string; count: number; heroPost: SitePost }>()

    for (const post of combined) {
      const content = post.content && typeof post.content === 'object' ? (post.content as any) : {}
      const raw = typeof content.category === 'string' ? content.category : ''
      if (!raw.trim()) continue
      const slug = normalizeCategory(raw)
      if (!isValidCategory(slug)) continue

      const existing = bySlug.get(slug)
      if (existing) {
        existing.count += 1
      } else {
        const name = CATEGORY_OPTIONS.find((c) => c.slug === slug)?.name || titleCaseFromSlug(slug)
        bySlug.set(slug, { slug, name, count: 1, heroPost: post })
      }
    }

    return Array.from(bySlug.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)
  })()

  return (
    <main className="pb-16">
      <section className="border-b border-[#003087]/20 bg-[#003087] text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
          <div>
            <p className="text-2xl font-bold tracking-tight sm:text-3xl">Free local classifieds.</p>
            <p className="mt-1 text-lg font-semibold text-sky-200">One place for all your ads.</p>
            <p className="mt-2 max-w-md text-sm text-white/85">Buy, sell, and trade locally with clear listings and fast search.</p>
          </div>
          <Link
            href={postAdHref}
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-bold text-[#003087] shadow-md transition hover:bg-slate-100"
          >
            Get started
          </Link>
        </div>
      </section>

      <section className={tone.hero}>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className={`p-8 sm:p-10 ${tone.panel}`}>
              <h1 className={`text-4xl font-bold tracking-tight sm:text-5xl ${tone.title}`}>Free local classifieds</h1>
              <p className={`mt-3 text-lg ${tone.muted}`}>One place for all your ads</p>
              <ul className="mt-8 space-y-3">
                {[
                  'Trusted by thousands of daily visitors',
                  'New listings added around the clock',
                ].map((line) => (
                  <li key={line} className={`flex items-center gap-3 text-sm font-medium ${tone.muted}`}>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#22c55e]/15 text-[#16a34a]">
                      <Check className="h-4 w-4" strokeWidth={3} />
                    </span>
                    {line}
                  </li>
                ))}
              </ul>
              <Link
                href={postAdHref}
                className={`mt-10 inline-flex items-center gap-2 rounded-md px-8 py-3.5 text-base font-bold text-white shadow-md ${tone.action}`}
              >
                <Plus className="h-5 w-5" />
                Post Ad
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {collage.length
                ? collage.map((post, index) => (
                    <Link
                      key={post.id}
                      href={getTaskHref(featuredTaskKey, post.slug)}
                      className={cn(
                        'relative block overflow-hidden rounded-lg bg-slate-200 shadow-sm ring-1 ring-black/5',
                        index === 0 ? 'col-span-2 row-span-2 min-h-[200px]' : 'aspect-square min-h-[96px]',
                      )}
                    >
                      <ContentImage src={getPostImage(post)} alt="" fill className="object-cover" />
                    </Link>
                  ))
                : [1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className={cn(
                        'rounded-lg bg-gradient-to-br from-slate-200 to-slate-300',
                        i === 1 ? 'col-span-2 row-span-2 min-h-[200px]' : 'aspect-square min-h-[96px]',
                      )}
                    />
                  ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className={`text-2xl font-bold tracking-tight ${tone.title}`}>Featured listings</h2>
            <p className={`mt-2 max-w-2xl text-sm ${tone.muted}`}>
              Browse the latest listings and classifieds from our community.
            </p>
          </div>
          <Link
            href={primaryTask?.route || '/classifieds'}
            className={`inline-flex shrink-0 items-center gap-2 text-sm font-semibold ${tone.title} hover:underline`}
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredListings.length > 0 ? (
            featuredListings.map((post) => (
              <TaskPostCard
                key={post.id}
                post={post}
                href={getTaskHref(featuredTaskKey, post.slug)}
                taskKey={featuredTaskKey}
              />
            ))
          ) : (
            <div className={`col-span-full rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center ${tone.soft}`}>
              <p className={`text-sm ${tone.muted}`}>No listings yet. Be the first to post!</p>
              <Link
                href={postAdHref}
                className={`mt-4 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white ${tone.action}`}
              >
                <Plus className="h-4 w-4" />
                Post an ad
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className={`${tone.shell}`}>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className={`text-2xl font-bold tracking-tight ${tone.title}`}>Discover more good finds</h2>
              <p className={`mt-2 max-w-2xl text-sm ${tone.muted}`}>
                Hand-picked listings near you—furniture, vehicles, jobs, and more. Browse categories or open a listing to get in touch with the seller.
              </p>
            </div>
            <span className={`inline-flex shrink-0 items-center gap-2 text-sm ${tone.muted}`}>
              <MapPin className="h-4 w-4" />
              Local listings
            </span>
          </div>
          <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-2">
              {goodFindsListings.length > 0 ? (
                goodFindsListings.map((post) => (
                  <TaskPostCard key={post.id} post={post} href={getTaskHref(featuredTaskKey, post.slug)} taskKey={featuredTaskKey} />
                ))
              ) : topCategories.length > 0 ? (
                <CategoryCardsPopup
                  cards={topCategories.map((cat) => ({
                    slug: cat.slug,
                    name: cat.name,
                    count: cat.count,
                    image: getPostImage(cat.heroPost),
                  }))}
                />
              ) : (
                <div className={`col-span-full rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center ${tone.soft}`}>
                  <p className={`text-sm ${tone.muted}`}>No listings yet. Once posts are added, categories will appear here automatically.</p>
                  <Link
                    href={postAdHref}
                    className={`mt-4 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white ${tone.action}`}
                  >
                    <Plus className="h-4 w-4" />
                    Post an ad
                  </Link>
                </div>
              )}
            </div>
            <aside className={`hidden h-min rounded-xl border border-slate-200 bg-[#0066ff] p-6 text-white shadow-md lg:block`}>
              <p className="text-lg font-bold leading-snug">Sponsored</p>
              <p className="mt-3 text-sm text-white/90">Feature your brand or offer in this sidebar placement.</p>
              <Link
                href="/contact?topic=advertise"
                className="mt-6 flex w-full items-center justify-center rounded-full bg-[#facc15] py-3 text-sm font-bold text-[#0f172a] shadow-sm transition hover:bg-[#fde047]"
              >
                Learn more
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col items-center gap-6 rounded-xl border border-slate-200 bg-white p-8 shadow-md md:flex-row md:justify-between lg:p-10`}>
          <div className="max-w-xl">
            <h2 className={`text-2xl font-bold ${tone.title}`}>Ready to sell something?</h2>
            <p className={`mt-2 text-sm ${tone.muted}`}>Reach buyers on {SITE_CONFIG.name} in three steps.</p>
            <div className="mt-6 flex flex-wrap gap-6 text-sm font-semibold text-[#334155]">
              {['1 Free', '2 Quick', '3 Easy'].map((s) => (
                <span key={s} className="inline-flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-bold">{s[0]}</span>
                  {s.slice(2)}
                </span>
              ))}
            </div>
          </div>
          <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex h-12 flex-1 items-center gap-2 rounded-md border-2 border-[#facc15] bg-[#fef9c3] px-3 text-sm text-[#0f172a]">
              <span className="rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] font-bold">Ad</span>
              <span className="text-slate-500">Describe your item…</span>
            </div>
            <Link href={postAdHref} className={`inline-flex h-12 shrink-0 items-center justify-center rounded-md px-8 text-sm font-bold text-white ${tone.action}`}>
              Post now
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

function EditorialHome({ primaryTask, articlePosts, supportTasks }: { primaryTask?: EnabledTask; articlePosts: SitePost[]; supportTasks: EnabledTask[] }) {
  const tone = getEditorialTone()
  const lead = articlePosts[0]
  const side = articlePosts.slice(1, 5)

  return (
    <main className={tone.shell}>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${tone.badge}`}>
              <FileText className="h-3.5 w-3.5" />
              Reading-first publication
            </span>
            <h1 className={`mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.06em] sm:text-6xl ${tone.title}`}>
              Essays, analysis, and slower reading designed like a publication, not a dashboard.
            </h1>
            <p className={`mt-6 max-w-2xl text-base leading-8 ${tone.muted}`}>{SITE_CONFIG.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={primaryTask?.route || '/articles'} className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${tone.action}`}>
                Start reading
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/about" className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${tone.actionAlt}`}>
                About the publication
              </Link>
            </div>
          </div>

          <aside className={`rounded-[2rem] p-6 ${tone.panel}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">Inside this issue</p>
            <div className="mt-5 space-y-5">
              {side.map((post) => (
                <Link key={post.id} href={`/articles/${post.slug}`} className="block border-b border-black/10 pb-5 last:border-b-0 last:pb-0">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] opacity-60">Feature</p>
                  <h3 className="mt-2 text-xl font-semibold">{post.title}</h3>
                  <p className={`mt-2 text-sm leading-7 ${tone.muted}`}>{post.summary || 'Long-form perspective with a calmer reading rhythm.'}</p>
                </Link>
              ))}
            </div>
          </aside>
        </div>

        {lead ? (
          <div className={`mt-12 overflow-hidden rounded-[2.5rem] ${tone.panel}`}>
            <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
              <div className="relative min-h-[360px] overflow-hidden">
                <ContentImage src={getPostImage(lead)} alt={lead.title} fill className="object-cover" />
              </div>
              <div className="p-8 lg:p-10">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">Lead story</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">{lead.title}</h2>
                <p className={`mt-4 text-sm leading-8 ${tone.muted}`}>{lead.summary || 'A more deliberate lead story surface with room for a proper narrative setup.'}</p>
                <Link href={`/articles/${lead.slug}`} className={`mt-8 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${tone.action}`}>
                  Read article
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {supportTasks.slice(0, 3).map((task) => (
            <Link key={task.key} href={task.route} className={`rounded-[1.8rem] p-6 ${tone.soft}`}>
              <h3 className="text-xl font-semibold">{task.label}</h3>
              <p className={`mt-3 text-sm leading-7 ${tone.muted}`}>{task.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

function VisualHome({ primaryTask, imagePosts, profilePosts, articlePosts }: { primaryTask?: EnabledTask; imagePosts: SitePost[]; profilePosts: SitePost[]; articlePosts: SitePost[] }) {
  const tone = getVisualTone()
  const gallery = imagePosts.length ? imagePosts.slice(0, 5) : articlePosts.slice(0, 5)
  const creators = profilePosts.slice(0, 3)

  return (
    <main className={tone.shell}>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${tone.badge}`}>
              <ImageIcon className="h-3.5 w-3.5" />
              Visual publishing system
            </span>
            <h1 className={`mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.06em] sm:text-6xl ${tone.title}`}>
              Image-led discovery with creator profiles and a more gallery-like browsing rhythm.
            </h1>
            <p className={`mt-6 max-w-2xl text-base leading-8 ${tone.muted}`}>{SITE_CONFIG.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={primaryTask?.route || '/image-sharing'} className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${tone.action}`}>
                Open gallery
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/profile" className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${tone.actionAlt}`}>
                Meet creators
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {gallery.slice(0, 5).map((post, index) => (
              <Link
                key={post.id}
                href={getTaskHref(resolveTaskKey(getPostTaskKey(post) || 'image', 'image'), post.slug)}
                className={index === 0 ? `col-span-2 row-span-2 overflow-hidden rounded-[2.4rem] ${tone.panel}` : `overflow-hidden rounded-[1.8rem] ${tone.soft}`}
              >
                <div className={index === 0 ? 'relative h-[360px]' : 'relative h-[170px]'}>
                  <ContentImage src={getPostImage(post)} alt={post.title} fill className="object-cover" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className={`rounded-[2rem] p-7 ${tone.panel}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">Visual notes</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">Larger media surfaces, fewer boxes, stronger pacing.</h2>
            <p className={`mt-4 max-w-2xl text-sm leading-8 ${tone.muted}`}>This product avoids business-directory density and publication framing. The homepage behaves more like a visual board, with profile surfaces and imagery leading the experience.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {creators.map((post) => (
              <Link key={post.id} href={`/profile/${post.slug}`} className={`rounded-[1.8rem] p-5 ${tone.soft}`}>
                <div className="relative h-40 overflow-hidden rounded-[1.2rem]">
                  <ContentImage src={getPostImage(post)} alt={post.title} fill className="object-cover" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{post.title}</h3>
                <p className={`mt-2 text-sm leading-7 ${tone.muted}`}>{post.summary || 'Creator profile and visual identity surface.'}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

function CurationHome({ primaryTask, bookmarkPosts, profilePosts, articlePosts }: { primaryTask?: EnabledTask; bookmarkPosts: SitePost[]; profilePosts: SitePost[]; articlePosts: SitePost[] }) {
  const tone = getCurationTone()
  const collections = bookmarkPosts.length ? bookmarkPosts.slice(0, 4) : articlePosts.slice(0, 4)
  const people = profilePosts.slice(0, 3)

  return (
    <main className={tone.shell}>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div>
            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${tone.badge}`}>
              <Bookmark className="h-3.5 w-3.5" />
              Curated collections
            </span>
            <h1 className={`mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.06em] sm:text-6xl ${tone.title}`}>
              Save, organize, and revisit resources through shelves, boards, and curated collections.
            </h1>
            <p className={`mt-6 max-w-2xl text-base leading-8 ${tone.muted}`}>{SITE_CONFIG.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={primaryTask?.route || '/sbm'} className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${tone.action}`}>
                Open collections
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/profile" className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${tone.actionAlt}`}>
                Explore curators
              </Link>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {collections.map((post) => (
              <Link key={post.id} href={getTaskHref(resolveTaskKey(getPostTaskKey(post) || 'sbm', 'sbm'), post.slug)} className={`rounded-[1.8rem] p-6 ${tone.panel}`}>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">Collection</p>
                <h3 className="mt-3 text-2xl font-semibold">{post.title}</h3>
                <p className={`mt-3 text-sm leading-8 ${tone.muted}`}>{post.summary || 'A calmer bookmark surface with room for context and grouping.'}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className={`rounded-[2rem] p-7 ${tone.panel}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">Why this feels different</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">More like saved boards and reading shelves than a generic post feed.</h2>
            <p className={`mt-4 max-w-2xl text-sm leading-8 ${tone.muted}`}>The structure is calmer, the cards are less noisy, and the page encourages collecting and returning instead of forcing everything into a fast-scrolling list.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {people.map((post) => (
              <Link key={post.id} href={`/profile/${post.slug}`} className={`rounded-[1.8rem] p-5 ${tone.soft}`}>
                <div className="relative h-32 overflow-hidden rounded-[1.2rem]">
                  <ContentImage src={getPostImage(post)} alt={post.title} fill className="object-cover" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{post.title}</h3>
                <p className={`mt-2 text-sm leading-7 ${tone.muted}`}>Curator profile, saved resources, and collection notes.</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default async function HomePage() {
  if (HOME_PAGE_OVERRIDE_ENABLED) {
    return <HomePageOverride />
  }

  const enabledTasks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)
  const taskFeed: TaskFeedItem[] = (
    await Promise.all(
      enabledTasks.map(async (task) => ({
        task,
        posts: await fetchTaskPosts(task.key, 8, { allowMockFallback: false, fresh: true }),
      }))
    )
  ).filter(({ posts }) => posts.length)

  const primaryTask = enabledTasks.find((task) => task.key === recipe.primaryTask) || enabledTasks[0]
  const supportTasks = enabledTasks.filter((task) => task.key !== primaryTask?.key)
  const listingPosts = taskFeed.find(({ task }) => task.key === 'listing')?.posts || []
  const classifiedPosts = taskFeed.find(({ task }) => task.key === 'classified')?.posts || []
  const articlePosts = taskFeed.find(({ task }) => task.key === 'article')?.posts || []
  const imagePosts = taskFeed.find(({ task }) => task.key === 'image')?.posts || []
  const profilePosts = taskFeed.find(({ task }) => task.key === 'profile')?.posts || []
  const bookmarkPosts = taskFeed.find(({ task }) => task.key === 'sbm')?.posts || []

  const schemaData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.baseUrl,
      logo: `${SITE_CONFIG.baseUrl.replace(/\/$/, '')}${SITE_CONFIG.defaultOgImage}`,
      sameAs: [],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.baseUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_CONFIG.baseUrl.replace(/\/$/, '')}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavbarShell />
      <SchemaJsonLd data={schemaData} />
      {productKind === 'directory' ? (
        <DirectoryHome
          primaryTask={primaryTask}
          listingPosts={listingPosts}
          classifiedPosts={classifiedPosts}
          brandPack={recipe.brandPack}
        />
      ) : null}
      {productKind === 'editorial' ? (
        <EditorialHome primaryTask={primaryTask} articlePosts={articlePosts} supportTasks={supportTasks} />
      ) : null}
      {productKind === 'visual' ? (
        <VisualHome primaryTask={primaryTask} imagePosts={imagePosts} profilePosts={profilePosts} articlePosts={articlePosts} />
      ) : null}
      {productKind === 'curation' ? (
        <CurationHome primaryTask={primaryTask} bookmarkPosts={bookmarkPosts} profilePosts={profilePosts} articlePosts={articlePosts} />
      ) : null}
      <Footer />
    </div>
  )
}
