import Link from 'next/link'
import { BrandPageFrame } from '@/components/marketing/brand-page-frame'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { SITE_CONFIG } from '@/lib/site-config'
import { Package, CreditCard, MessageCircle, Shield } from 'lucide-react'

const guides = [
  {
    icon: Package,
    title: 'Posting a classified ad',
    body: 'Use clear photos, honest condition notes, and a firm price. Buyers filter faster when titles mention brand, size, and location.',
  },
  {
    icon: CreditCard,
    title: 'Payments & handoffs',
    body: 'Meet in safe public places for cash deals. For shipped items, confirm tracking and keep chat inside the platform when possible.',
  },
  {
    icon: MessageCircle,
    title: 'Messaging etiquette',
    body: 'Reply within 24 hours, confirm pickup windows, and mark items sold to keep your reputation strong.',
  },
  {
    icon: Shield,
    title: 'Safety & reporting',
    body: 'Report suspicious listings or harassment immediately. We review every flag and may pause accounts that break community rules.',
  },
]

const faqs = [
  {
    id: 'faq-1',
    question: `How do I create an account on ${SITE_CONFIG.name}?`,
    answer:
      'Tap Register, confirm your email, and complete your profile with a display name and phone number. Verified profiles get better visibility in search.',
  },
  {
    id: 'faq-2',
    question: 'Can I edit or remove my listing after it goes live?',
    answer:
      'Yes. Open Dashboard → Listings, choose your ad, and use Edit or Unpublish. Sold items should be marked sold so buyers are not disappointed.',
  },
  {
    id: 'faq-3',
    question: 'Do you charge fees to post classifieds?',
    answer:
      'Basic listings are free in most categories. Optional boosts and sponsored slots may be available — check the publish screen for current pricing.',
  },
  {
    id: 'faq-4',
    question: 'How do I contact support for a dispute?',
    answer:
      'Email us through the Contact page with order details, screenshots, and the other party’s username. We mediate according to our community guidelines.',
  },
  {
    id: 'faq-5',
    question: 'What items are not allowed?',
    answer:
      'We prohibit illegal goods, recalled products, counterfeit merchandise, and misleading offers. See our Terms for the full restricted list.',
  },
]

export default function HelpPage() {
  return (
    <BrandPageFrame
      eyebrow="Help centre"
      title={<span className="text-white">How can we help?</span>}
      description="Quick answers for shoppers, sellers, and partners using Raj Satti Mart classifieds."
      actions={
        <Button
          className="rounded-full bg-[#fb923c] px-6 font-semibold text-[#0f172a] shadow-lg shadow-black/25 hover:bg-[#fdba74]"
          asChild
        >
          <Link href="/contact">Contact support</Link>
        </Button>
      }
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          {guides.map((topic) => (
            <Card key={topic.title} className="border-slate-200/80 bg-slate-50/40 shadow-sm">
              <CardContent className="p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#fff7ed] text-[#ea580c]">
                  <topic.icon className="h-5 w-5" aria-hidden />
                </div>
                <h2 className="mt-3 text-base font-bold text-[#0f172a]">{topic.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-[#64748b]">{topic.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="border-slate-200/80 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-[#0f172a]">Frequently asked questions</h3>
            <Accordion type="single" collapsible className="mt-4 w-full">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-left text-sm font-semibold text-[#0f172a]">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-[#64748b]">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </BrandPageFrame>
  )
}
