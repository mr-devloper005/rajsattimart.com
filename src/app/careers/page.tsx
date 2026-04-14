import Link from "next/link";
import { BrandPageFrame } from "@/components/marketing/brand-page-frame";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SITE_CONFIG } from "@/lib/site-config";
import { MapPin, Clock, Sparkles } from "lucide-react";

const openings = [
  {
    title: "Store operations lead",
    location: "Regional flagship",
    type: "Full-time",
    blurb: "Own daily floor rhythm, stock accuracy, and team coaching for a high-traffic location.",
  },
  {
    title: "Digital listings specialist",
    location: "Hybrid",
    type: "Full-time",
    blurb: "Help sellers publish sharp classifieds, verify details, and keep categories healthy.",
  },
  {
    title: "Customer care associate",
    location: "Remote-first",
    type: "Full-time",
    blurb: "Resolve buyer and seller questions across chat, email, and phone with empathy and speed.",
  },
  {
    title: "Weekend merchandising support",
    location: "Local hubs",
    type: "Part-time",
    blurb: "Support campaign resets, signage, and on-site events during peak shopping windows.",
  },
];

const perks = [
  "Competitive pay with transparent growth ladders",
  "Staff discounts on featured categories and partner brands",
  "Health coverage options for full-time roles",
  "Paid training on retail systems and digital tools",
  "Rotating mentorship with leadership team members",
];

export default function CareersPage() {
  return (
    <BrandPageFrame
      eyebrow="Join the team"
      title={
        <>
          <span className="text-white">Careers at </span>
          <span className="text-[#fb923c]">Raj Satti Mart</span>
        </>
      }
      description={`Help us keep local commerce human. From the sales floor to the listings desk, ${SITE_CONFIG.name} is building a crew that loves service, speed, and honest value.`}
      actions={
        <Button
          className="rounded-full bg-[#fb923c] px-6 font-semibold text-[#0f172a] shadow-lg shadow-black/25 hover:bg-[#fdba74]"
          asChild
        >
          <Link href="/contact">Send your CV</Link>
        </Button>
      }
    >
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748b]">
            <Clock className="h-4 w-4 text-[#ea580c]" />
            <span>We review applications within five business days.</span>
          </div>
          {openings.map((role) => (
            <Card key={role.title} className="border-slate-200/80 bg-white shadow-sm transition-shadow hover:shadow-md">
              <CardContent className="p-5 sm:p-6">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-slate-100">
                    {role.type}
                  </Badge>
                  <Badge className="border-[#ea580c]/20 bg-[#fff7ed] text-[#c2410c]">Hiring</Badge>
                </div>
                <h2 className="mt-3 text-lg font-bold text-[#0f172a]">{role.title}</h2>
                <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-[#64748b]">
                  <MapPin className="h-3.5 w-3.5 text-[#ea580c]" />
                  {role.location}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[#64748b]">{role.blurb}</p>
                <Button
                  variant="outline"
                  className="mt-4 border-slate-200 font-semibold text-[#0f172a] hover:bg-slate-50"
                  asChild
                >
                  <Link href="/contact">Apply for this role</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="h-fit border-slate-200/80 bg-gradient-to-b from-[#fff7ed] to-white shadow-sm">
          <CardContent className="space-y-4 p-6 sm:p-7">
            <div className="flex items-center gap-2 text-[#ea580c]">
              <Sparkles className="h-5 w-5" />
              <h3 className="text-lg font-bold text-[#0f172a]">Life on the team</h3>
            </div>
            <p className="text-sm leading-relaxed text-[#64748b]">
              We are picky about culture, not credentials alone. Bring curiosity, respect for shoppers, and a bias toward getting
              the small details right.
            </p>
            <ul className="space-y-3 text-sm text-[#475569]">
              {perks.map((perk) => (
                <li key={perk} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ea580c]" />
                  {perk}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </BrandPageFrame>
  );
}
