import { BrandPageFrame } from '@/components/marketing/brand-page-frame'
import { SITE_CONFIG } from '@/lib/site-config'

const sections = [
  {
    title: 'Who we are',
    body: `${SITE_CONFIG.name} ("we", "us") operates the website and related services that help you browse and publish local classified listings. This policy explains how we handle personal data when you use our platform.`,
  },
  {
    title: 'Information we collect',
    body: 'We collect account details (name, email, phone when provided), listing content you submit, messages sent through our tools, device and log data (IP address, browser type), and limited usage analytics to improve performance and security.',
  },
  {
    title: 'How we use information',
    body: 'Data is used to operate accounts, display listings, prevent fraud, send service-related notices, personalize your experience, comply with law, and measure product health. We do not sell personal information to data brokers.',
  },
  {
    title: 'Cookies & similar technologies',
    body: 'We use cookies for authentication, preferences, and analytics. You can control cookies through your browser; disabling essential cookies may limit certain features such as staying signed in.',
  },
  {
    title: 'Sharing & processors',
    body: 'We share information with infrastructure and email providers who process it on our instructions, and when required by law or to protect rights and safety. Partners never use your data for their own marketing without consent.',
  },
  {
    title: 'Retention',
    body: 'We keep account data while your profile is active. Listings and messages may be retained for a period after deletion for legal, fraud-prevention, or backup reasons, then removed or anonymized.',
  },
  {
    title: 'Your choices',
    body: 'You may access, update, or delete much of your information from account settings. You can opt out of non-essential emails and request a copy or erasure of data where applicable law applies.',
  },
  {
    title: 'Children',
    body: 'Our services are not directed to children under 16, and we do not knowingly collect their personal information.',
  },
  {
    title: 'International users',
    body: 'If you access the service from outside your home country, your information may be processed where we or our vendors operate, subject to appropriate safeguards.',
  },
  {
    title: 'Contact',
    body: `Questions about privacy? Reach us through the Contact page and mention "Privacy" in the subject line.`,
  },
]

export default function PrivacyPage() {
  return (
    <BrandPageFrame
      eyebrow="Legal"
      title={<span className="text-white">Privacy policy</span>}
      description="Plain-language overview of how Raj Satti Mart collects, uses, and protects your information."
    >
      <p className="text-xs font-medium text-[#64748b]">Last updated: April 13, 2026</p>
      <div className="mt-8 space-y-6">
        {sections.map((section) => (
          <section
            key={section.title}
            className="rounded-xl border border-slate-200/80 bg-slate-50/40 px-5 py-5 sm:px-6"
          >
            <h2 className="text-base font-bold text-[#0f172a]">{section.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#64748b]">{section.body}</p>
          </section>
        ))}
      </div>
    </BrandPageFrame>
  )
}
