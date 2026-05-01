import Link from 'next/link'
import { ArrowRight, Globe, Mail, MapPin, Phone, ShieldCheck, Tag, Info } from 'lucide-react'
import { ContentImage } from '@/components/shared/content-image'
import { SchemaJsonLd } from '@/components/seo/schema-jsonld'
import { RichContent, formatRichHtml } from '@/components/shared/rich-content'
import { TaskPostCard } from '@/components/shared/task-post-card'
import { TaskImageCarousel } from '@/components/tasks/task-image-carousel'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'

export function DirectoryTaskDetailPage({
  task,
  taskLabel,
  taskRoute,
  post,
  description,
  category,
  images,
  mapEmbedUrl,
  related,
}: {
  task: TaskKey
  taskLabel: string
  taskRoute: string
  post: SitePost
  description: string
  category: string
  images: string[]
  mapEmbedUrl: string | null
  related: SitePost[]
}) {
  const content = post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const location = typeof content.address === 'string' ? content.address : typeof content.location === 'string' ? content.location : ''
  const website = typeof content.website === 'string' ? content.website : ''
  const phone = typeof content.phone === 'string' ? content.phone : ''
  const email = typeof content.email === 'string' ? content.email : ''
  const highlights = Array.isArray(content.highlights) ? content.highlights.filter((item): item is string => typeof item === 'string') : []
  const logo = typeof content.logo === 'string' ? content.logo : ''
  const descriptionHtml = formatRichHtml(description, 'Details coming soon.')
  const schemaPayload = {
    '@context': 'https://schema.org',
    '@type': task === 'profile' ? 'Organization' : 'LocalBusiness',
    name: post.title,
    description,
    image: images[0],
    url: `${taskRoute}/${post.slug}`,
    address: location || undefined,
    telephone: phone || undefined,
    email: email || undefined,
  }

  return (
    <div className="min-h-screen bg-[#eef1f6] text-[#0f172a]">
      <SchemaJsonLd data={schemaPayload} />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href={taskRoute} className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#64748b] hover:text-[#0f172a]">
          &larr; Back to {taskLabel}
        </Link>

        <section className="grid gap-8 lg:grid-cols-[1.7fr_1fr] lg:items-start">
          <div className="space-y-8">
            <TaskImageCarousel images={images} />

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#64748b]">{category || taskLabel}</p>
                  <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#0f172a] sm:text-4xl">{post.title}</h1>
                </div>
                <span className="inline-flex items-center gap-2 rounded-md bg-[#22c55e] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                  <ShieldCheck className="h-3.5 w-3.5" /> Listed
                </span>
              </div>

              <div className="mt-6 border-b border-slate-200 pb-3">
                <h2 className="text-base font-semibold text-[#0f172a]">Description</h2>
              </div>
              <RichContent html={descriptionHtml} className="mt-4 text-sm leading-7 text-[#475569]" />

              {highlights.length ? (
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {highlights.slice(0, 6).map((item) => (
                    <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
                      {item}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <div className="relative h-28 w-28 overflow-hidden rounded-full border border-slate-200 bg-slate-50 shadow-sm">
                  <ContentImage src={logo || images[0]} alt={`${post.title} logo`} fill className="object-cover" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[#0f172a]">{post.title}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#2563eb]">{category || taskLabel}</p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {phone ? (
                  <a
                    href={`tel:${phone}`}
                    className="inline-flex items-center justify-center rounded-md bg-[#22c55e] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#16a34a]"
                  >
                    Call
                  </a>
                ) : (
                  <span className="inline-flex items-center justify-center rounded-md bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-400">
                    Call
                  </span>
                )}
                {email ? (
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex items-center justify-center rounded-md bg-[#ef4444] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#dc2626]"
                  >
                    Message
                  </a>
                ) : (
                  <span className="inline-flex items-center justify-center rounded-md bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-400">
                    Message
                  </span>
                )}
              </div>

              <div className="mt-6 space-y-3 text-sm text-[#334155]">
                {phone ? (
                  <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#64748b]" />
                    <span className="break-words">{phone}</span>
                  </div>
                ) : null}
                {location ? (
                  <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#64748b]" />
                    <span className="break-words">{location}</span>
                  </div>
                ) : null}
                {website ? (
                  <a
                    href={website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 hover:bg-white"
                  >
                    <Globe className="mt-0.5 h-4 w-4 shrink-0 text-[#64748b]" />
                    <span className="break-words">{website}</span>
                  </a>
                ) : null}
                {email ? (
                  <a
                    href={`mailto:${email}`}
                    className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 hover:bg-white"
                  >
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#64748b]" />
                    <span className="break-words">{email}</span>
                  </a>
                ) : null}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {website ? (
                  <a
                    href={website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#0f172a] hover:bg-slate-50"
                  >
                    Visit Website <ArrowRight className="h-4 w-4" />
                  </a>
                ) : null}
                <Link
                  href={taskRoute}
                  className="inline-flex flex-1 items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#0f172a] hover:bg-slate-50"
                >
                  Browse More
                </Link>
              </div>
            </div>

            {mapEmbedUrl ? (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#64748b]">Location Map</p>
                </div>
                <iframe src={mapEmbedUrl} title={`${post.title} map`} className="h-[300px] w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            ) : null}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-[#0f172a]">Useful Info</p>
                <Info className="h-4 w-4 text-[#64748b]" />
              </div>
              <div className="mt-4 space-y-3 text-sm text-[#475569]">
                {[
                  'Avoid paying upfront. Meet locally when possible.',
                  'Never share OTPs, passwords, or banking details.',
                  'Inspect services/items before committing to payment.',
                  'If something feels off, report and move on.',
                ].map((item) => (
                  <div key={item} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>

        {related.length ? (
          <section className="mt-14">
            <div className="flex items-end justify-between gap-4 border-b border-slate-200 pb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#64748b]">More listings</p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#0f172a]">You may also like</h2>
              </div>
              <span className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#64748b]">
                <Tag className="h-3.5 w-3.5" /> {taskLabel}
              </span>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <TaskPostCard key={item.id} post={item} href={`${taskRoute}/${item.slug}`} taskKey={task} />
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  )
}
