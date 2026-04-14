import type { ReactNode } from "react";
import Link from "next/link";
import { BrandPageFrame } from "@/components/marketing/brand-page-frame";
import { SITE_CONFIG } from "@/lib/site-config";

const sections: { title: string; body: string | ReactNode }[] = [
  {
    title: "Agreement to terms",
    body: `By accessing ${SITE_CONFIG.name}, you agree to these Terms and our Privacy Policy. If you do not agree, please discontinue use of the service.`,
  },
  {
    title: "Eligibility & accounts",
    body: "You must provide accurate registration information and safeguard your credentials. You are responsible for activity that occurs under your account until you notify us of unauthorized use.",
  },
  {
    title: "Listings & content",
    body: "You retain ownership of content you post and grant us a worldwide, non-exclusive license to host, display, and promote it in connection with the platform. Listings must be lawful, truthful, and categorized correctly.",
  },
  {
    title: "Prohibited conduct",
    body: "You may not post illegal, fraudulent, hateful, or misleading content; harass users; scrape the site in ways that harm performance; circumvent security; or use the service to distribute malware or spam.",
  },
  {
    title: "Transactions between users",
    body: `${SITE_CONFIG.name} is a venue. Deals are primarily between buyers and sellers. We are not a party to your transaction and do not guarantee item quality, delivery, or payment unless explicitly stated for a specific product.`,
  },
  {
    title: "Fees & promotions",
    body: "Certain features may be paid or sponsored. Pricing and terms will be disclosed before purchase. Taxes may apply based on your location.",
  },
  {
    title: "Intellectual property",
    body: "Our brand, design, and software are protected. Do not copy our trademarks or imply endorsement without written permission.",
  },
  {
    title: "Enforcement",
    body: "We may remove content, suspend accounts, or take legal action for violations. We may update these Terms; continued use after changes constitutes acceptance.",
  },
  {
    title: "Disclaimers",
    body: 'The service is provided "as is" without warranties of uninterrupted or error-free operation. To the fullest extent permitted by law, we disclaim implied warranties of merchantability and fitness for a particular purpose.',
  },
  {
    title: "Limitation of liability",
    body: "To the extent permitted by law, our total liability arising from these Terms or the service is limited to the greater of amounts you paid us in the past twelve months or fifty currency units, except where liability cannot be limited.",
  },
  {
    title: "Contact",
    body: (
      <>
        For questions about these Terms, visit our{" "}
        <Link href="/contact" className="font-semibold text-[#ea580c] hover:underline">
          Contact
        </Link>{" "}
        page.
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <BrandPageFrame
      eyebrow="Legal"
      title={<span className="text-white">Terms of service</span>}
      description={`Rules for using ${SITE_CONFIG.name} classifieds, accounts, and community features.`}
    >
      <p className="text-xs font-medium text-[#64748b]">Last updated: April 13, 2026</p>
      <div className="mt-8 space-y-6">
        {sections.map((section) => (
          <section
            key={section.title}
            className="rounded-xl border border-slate-200/80 bg-slate-50/40 px-5 py-5 sm:px-6"
          >
            <h2 className="text-base font-bold text-[#0f172a]">{section.title}</h2>
            <div className="mt-2 text-sm leading-relaxed text-[#64748b]">{section.body}</div>
          </section>
        ))}
      </div>
    </BrandPageFrame>
  );
}
