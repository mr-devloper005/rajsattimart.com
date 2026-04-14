import Link from "next/link";
import { BrandPageFrame } from "@/components/marketing/brand-page-frame";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SITE_CONFIG } from "@/lib/site-config";
import { ShoppingBag, Truck, ShieldCheck, HeartHandshake } from "lucide-react";

const pillars = [
  {
    icon: ShoppingBag,
    title: "Everyday value",
    body: "We curate offers and local listings so families can stretch their budget without compromising on quality.",
  },
  {
    icon: Truck,
    title: "Neighbourhood speed",
    body: "From quick pickups to clear delivery windows, we design the experience around real schedules and real streets.",
  },
  {
    icon: ShieldCheck,
    title: "Trust on the shelf",
    body: "Clear seller signals, honest descriptions, and responsive help keep shopping predictable and stress-free.",
  },
  {
    icon: HeartHandshake,
    title: "Community first",
    body: `${SITE_CONFIG.name} grows with the towns we serve — spotlighting local sellers, jobs, and services.`,
  },
];

const milestones = [
  { year: "2018", label: "First neighbourhood pop-ups and seasonal markets." },
  { year: "2021", label: "Digital classifieds launch for jobs, vehicles, and home goods." },
  { year: "2024", label: "Expanded fulfilment partnerships across the region." },
  { year: "Today", label: "Thousands of monthly visitors browsing deals and local listings." },
];

export default function AboutPage() {
  return (
    <BrandPageFrame
      eyebrow="Our story"
      title={
        <>
          <span className="text-white">About </span>
          <span className="text-[#fb923c]">Raj Satti</span>
          <span className="text-white"> Mart</span>
        </>
      }
      description={`${SITE_CONFIG.name} began as a simple idea: bring supermarket-style clarity to local buying and selling — fair prices, friendly service, and a digital window into what your community has in stock.`}
      actions={
        <>
          <Button
            variant="outline"
            className="rounded-full border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20"
            asChild
          >
            <Link href="/classifieds">Browse classifieds</Link>
          </Button>
          <Button
            className="rounded-full bg-[#fb923c] px-6 font-semibold text-[#0f172a] shadow-lg shadow-black/25 hover:bg-[#fdba74]"
            asChild
          >
            <Link href="/contact">Talk to us</Link>
          </Button>
        </>
      }
    >
      <div className="space-y-12">
        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-4">
            <Badge className="border-[#ea580c]/30 bg-[#fff7ed] text-[#c2410c]">Why we exist</Badge>
            <h2 className="text-2xl font-bold tracking-tight text-[#0f172a]">Retail discipline meets local heart.</h2>
            <p className="text-sm leading-relaxed text-[#64748b]">
              Shoppers should never have to guess if a deal is real. Sellers should never wonder if their listing will be seen.
              We built {SITE_CONFIG.name} as a calm, modern storefront for both sides — online classifieds with the warmth of a
              counter conversation.
            </p>
            <p className="text-sm leading-relaxed text-[#64748b]">
              Whether you are furnishing a flat, hunting for your next vehicle, or hiring nearby talent, our platform keeps categories
              tidy, photos bright, and contact paths short.
            </p>
          </div>
          <Card className="border-slate-200/80 bg-gradient-to-br from-[#0f172a] to-[#1e3a5c] text-white shadow-lg">
            <CardContent className="space-y-5 p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#fdba74]">Timeline</p>
              <ul className="space-y-4">
                {milestones.map((m) => (
                  <li key={m.year} className="border-l-2 border-[#fb923c] pl-4">
                    <p className="text-sm font-bold text-[#fb923c]">{m.year}</p>
                    <p className="mt-1 text-sm text-slate-200">{m.label}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-center text-xl font-bold text-[#0f172a] sm:text-2xl">What guides us</h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-[#64748b]">
            Four promises we revisit in every product decision, campaign, and support ticket.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {pillars.map((p) => (
              <Card key={p.title} className="border-slate-200/80 bg-slate-50/50 shadow-sm transition-transform hover:-translate-y-0.5">
                <CardContent className="flex gap-4 p-5 sm:p-6">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff7ed] text-[#ea580c]">
                    <p.icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0f172a]">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#64748b]">{p.body}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </BrandPageFrame>
  );
}
