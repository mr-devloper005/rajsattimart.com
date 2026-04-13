import Link from 'next/link'
import { BrandPageFrame } from '@/components/marketing/brand-page-frame'
import { Button } from '@/components/ui/button'
import { PressKitClient } from './press-kit-client'
import { SITE_CONFIG } from '@/lib/site-config'

export default function PressPage() {
  return (
    <BrandPageFrame
      eyebrow="For journalists & partners"
      title={
        <>
          <span className="text-white">Press &amp; </span>
          <span className="text-[#fb923c]">media</span>
        </>
      }
      description={`Official storylines, visuals, and fact sheets for ${SITE_CONFIG.name} — your neighbourhood destination for value, variety, and trusted local listings.`}
      actions={
        <Button
          asChild
          className="rounded-full bg-[#fb923c] px-6 font-semibold text-[#0f172a] shadow-lg shadow-black/20 hover:bg-[#fdba74]"
        >
          <Link href="/contact">Press inquiries</Link>
        </Button>
      }
    >
      <PressKitClient />
    </BrandPageFrame>
  )
}
