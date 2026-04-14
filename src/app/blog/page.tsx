import Link from "next/link";
import type { Metadata } from "next";
import { BrandPageFrame } from "@/components/marketing/brand-page-frame";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SITE_CONFIG } from "@/lib/site-config";
import { ArrowRight, Newspaper, Tag, Megaphone } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog & updates",
  description: `Stories, seasonal guides, and platform news from ${SITE_CONFIG.name}.`,
};

const stories = [
  {
    icon: Newspaper,
    category: "Retail radar",
    title: "How we pick spotlight deals each week",
    excerpt: "A look at the checks our merchandising team runs before a listing hits the homepage carousel.",
    href: "/classifieds",
  },
  {
    icon: Tag,
    category: "Seller playbook",
    title: "Five photo habits that sell furniture faster",
    excerpt: "Natural light, wide angles, and honest wear-and-tear notes build trust before the first message.",
    href: "/classifieds",
  },
  {
    icon: Megaphone,
    category: "Community",
    title: "Neighbourhood pop-ups are back this spring",
    excerpt: "Meet the team, trade coupons, and learn how to verify local pickup locations safely.",
    href: "/contact",
  },
];

export default function BlogPage() {
  return (
    <BrandPageFrame
      eyebrow="Stories & guides"
      title={
        <>
          <span className="text-white">The </span>
          <span className="text-[#fb923c]">Raj Satti</span>
          <span className="text-white"> Mart journal</span>
        </>
      }
      description="Practical tips for smart shopping, confident selling, and staying in sync with what is new on the platform."
      actions={
        <Button
          variant="outline"
          className="rounded-full border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20"
          asChild
        >
          <Link href="/classifieds">
            Browse live listings
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      }
    >
      <div className="space-y-10">
        <section className="rounded-2xl border border-[#ea580c]/20 bg-gradient-to-r from-[#fff7ed] to-white p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c2410c]">Editor&apos;s note</p>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#475569]">
            This space is where we share how {SITE_CONFIG.name} thinks about value, safety, and community — not press releases
            buried in jargon. New long reads arrive monthly; shorter drops land whenever we ship a feature shoppers asked for.
          </p>
        </section>

        <div className="grid gap-5 md:grid-cols-3">
          {stories.map((story) => (
            <Card key={story.title} className="border-slate-200/80 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
              <CardContent className="flex h-full flex-col p-5 sm:p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0f172a] text-[#fb923c]">
                  <story.icon className="h-5 w-5" aria-hidden />
                </div>
                <Badge className="mt-4 w-fit border-transparent bg-slate-100 text-[#64748b]">{story.category}</Badge>
                <h2 className="mt-3 text-lg font-bold text-[#0f172a]">{story.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[#64748b]">{story.excerpt}</p>
                <Link
                  href={story.href}
                  className="mt-4 inline-flex items-center text-sm font-semibold text-[#ea580c] hover:underline"
                >
                  Read more
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <section className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-8 text-center">
          <p className="text-sm font-semibold text-[#0f172a]">Want these stories in your inbox?</p>
          <p className="mt-2 text-sm text-[#64748b]">Tell us on the contact page and we will add you to our low-volume updates list.</p>
          <Button className="mt-4 bg-[#ea580c] font-semibold text-white hover:bg-[#c2410c]" asChild>
            <Link href="/contact">Subscribe interest</Link>
          </Button>
        </section>
      </div>
    </BrandPageFrame>
  );
}
