import Link from "next/link";
import { PageShell } from "@/components/shared/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockTeamMembers } from "@/data/mock-data";
import { SITE_CONFIG } from "@/lib/site-config";

const highlights = [
  { label: "Creators onboarded", value: "12k+" },
  { label: "Bookmarks shared", value: "180k" },
  { label: "Listings published", value: "8.6k" },
];

const values = [
  { title: "Curated by people", description: "We believe trusted recommendations beat endless feeds." },
  { title: "Designed for focus", description: "Clear, calm UI helps you find the next best resource fast." },
  { title: "Built to share", description: "Collections make collaboration and knowledge flow effortless." },
];

export default function AboutPage() {
  return (
    <PageShell
      title={`About ${SITE_CONFIG.name}`}
      description={`${SITE_CONFIG.name} is a modern platform for creators, communities, and curated business discovery.`}
      actions={
        <>
          <Button variant="outline" className="border-slate-200 bg-white text-[#0f172a] hover:bg-slate-50" asChild>
            <Link href="/team">Meet the Team</Link>
          </Button>
          <Button className="bg-[#22c55e] hover:bg-[#16a34a]" asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-slate-200 bg-slate-50/50 shadow-none">
          <CardContent className="space-y-4 p-6">
            <Badge className="border-[#22c55e]/30 bg-[#22c55e]/10 text-[#15803d]">Our Story</Badge>
            <h2 className="text-2xl font-bold tracking-tight text-[#0f172a]">
              A single home for knowledge, discovery, and community.
            </h2>
            <p className="text-sm text-[#64748b]">
              {SITE_CONFIG.name} brings together publishing, listings, and social bookmarking so teams can move faster
              and keep their best resources close.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {highlights.map((item) => (
                <div key={item.label} className="rounded-lg border border-slate-200 bg-white p-4">
                  <div className="text-2xl font-bold text-[#0f172a]">{item.value}</div>
                  <div className="text-xs text-[#64748b]">{item.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          {values.map((value) => (
            <Card key={value.title} className="border-slate-200 bg-slate-50/50 shadow-none">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-[#0f172a]">{value.title}</h3>
                <p className="mt-2 text-sm text-[#64748b]">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {mockTeamMembers.map((member) => (
          <Card key={member.id} className="border-slate-200 bg-slate-50/50 shadow-none transition-transform hover:-translate-y-0.5">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-[#0f172a]">{member.name}</p>
                  <p className="text-xs text-[#64748b]">{member.role}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-[#64748b]">{member.bio}</p>
              <p className="mt-3 text-xs text-[#64748b]">{member.location}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
