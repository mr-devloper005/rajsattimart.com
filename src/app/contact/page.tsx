import Link from 'next/link'
import { Building2, Mail, MapPin, Phone, Store } from 'lucide-react'
import { BrandPageFrame } from '@/components/marketing/brand-page-frame'
import { Button } from '@/components/ui/button'
import { CONTACT_PAGE_OVERRIDE_ENABLED, ContactPageOverride } from '@/overrides/contact-page'
import { SITE_CONFIG } from '@/lib/site-config'
import { ContactLeadForm } from "@/components/shared/contact-lead-form";

const lanes = [
  {
    icon: Store,
    title: 'Store & classifieds help',
    body: 'Questions about posting ads, editing photos, or marking items sold? We route you to the listings team first.',
  },
  {
    icon: Building2,
    title: 'Partnerships & bulk sellers',
    body: 'Retailers and service providers can coordinate featured placements, seasonal campaigns, and verification.',
  },
  {
    icon: MapPin,
    title: 'Local coverage',
    body: 'Request a new category focus or report inaccurate area tags so shoppers see the right neighbourhood results.',
  },
]

export default async function ContactPage({
  searchParams,
}: {
  searchParams?: Promise<{ topic?: string }>
}) {
  if (CONTACT_PAGE_OVERRIDE_ENABLED) {
    return <ContactPageOverride />
  }

  const resolved = searchParams ? await searchParams : {}
  const isAdvertiseInquiry = resolved.topic === 'advertise'
  const contactEmailRaw = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim()
  const contactEmail = contactEmailRaw || `support@${SITE_CONFIG.domain}`
  const contactMailto = `mailto:${contactEmail}`
  const mailSubject = isAdvertiseInquiry
    ? 'Advertising / sponsored placement'
    : `Contact request - ${SITE_CONFIG.name}`

  return (
    <BrandPageFrame
      eyebrow={`Contact ${SITE_CONFIG.name}`}
      title={<span className="text-white">We are here to help</span>}
      description="Share a little context and we will point your note to the right crew — listings support, partnerships, or press."
      actions={
        <div className="flex flex-wrap gap-2 text-xs text-slate-200">
          <Phone className="h-4 w-4 text-[#fb923c]" aria-hidden />
          <span>Typical reply time: one business day</span>
        </div>
      }
    >
      {isAdvertiseInquiry ? (
        <div className="mb-8 rounded-xl border border-[#fb923c]/40 bg-[#fff7ed] px-5 py-4">
          <p className="text-sm font-semibold text-[#0f172a]">Advertising &amp; sponsored placements</p>
          <p className="mt-1 text-sm text-[#64748b]">
            Describe your campaign goals, audience, and preferred surfaces (homepage, categories, or newsletter). Our partnerships
            desk will reply with availability.
          </p>
        </div>
      ) : null}

      <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-start">
        <div className="space-y-5">
          <p className="text-sm leading-relaxed text-[#64748b]">
            This is not a black-hole inbox. Tell us whether you are buying, selling, or partnering — we read every message and
            follow up with clear next steps.
          </p>
          <ul className="space-y-4">
            {lanes.map((lane) => (
              <li key={lane.title} className="flex gap-4 rounded-xl border border-slate-200/80 bg-slate-50/50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0f172a] text-[#fb923c]">
                  <lane.icon className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <h2 className="font-semibold text-[#0f172a]">{lane.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-[#64748b]">{lane.body}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="flex items-center gap-2 text-sm text-[#64748b]">
            <Mail className="h-4 w-4 text-[#ea580c]" aria-hidden />
            Prefer email? Reach us at{' '}
            <a href={contactMailto} className="font-semibold text-[#0f172a] hover:underline">
              {contactEmail}
            </a>
            .
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold text-[#0f172a]">Send a message</h2>
          <ContactLeadForm />
        </div>
      </div>
    </BrandPageFrame>
  )
}
