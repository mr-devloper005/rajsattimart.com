'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { mockPressAssets, mockPressCoverage } from '@/data/mock-data'

export function PressKitClient() {
  const { toast } = useToast()
  const [activeAssetId, setActiveAssetId] = useState<string | null>(null)
  const activeAsset = mockPressAssets.find((asset) => asset.id === activeAssetId)

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-slate-200/80 bg-gradient-to-b from-slate-50/80 to-white shadow-sm">
          <CardContent className="space-y-4 p-6 sm:p-8">
            <h2 className="text-xl font-bold tracking-tight text-[#0f172a]">Brand &amp; media kit</h2>
            <p className="text-sm leading-relaxed text-[#64748b]">
              Download approved logos, product imagery, and short-form facts about Raj Satti Mart for news stories, partner pages, and social features.
            </p>
            <div className="grid gap-3">
              {mockPressAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#0f172a]">{asset.title}</p>
                      <p className="mt-1 text-xs text-[#64748b]">{asset.description}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="bg-slate-100">
                        {asset.fileType}
                      </Badge>
                      <Button size="sm" variant="outline" className="border-slate-200" onClick={() => setActiveAssetId(asset.id)}>
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        className="bg-[#ea580c] font-semibold text-white hover:bg-[#c2410c]"
                        onClick={() =>
                          toast({
                            title: 'Download started',
                            description: `${asset.title} is downloading.`,
                          })
                        }
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#64748b]">Coverage &amp; mentions</h2>
          {mockPressCoverage.map((item) => (
            <Card
              key={item.id}
              className="border-slate-200/80 bg-white shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
            >
              <CardContent className="p-5">
                <div className="text-xs font-semibold uppercase tracking-wide text-[#ea580c]">{item.outlet}</div>
                <p className="mt-2 text-sm font-medium leading-snug text-[#0f172a]">{item.headline}</p>
                <p className="mt-2 text-xs text-[#64748b]">{item.date}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={Boolean(activeAsset)} onOpenChange={() => setActiveAssetId(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{activeAsset?.title}</DialogTitle>
          </DialogHeader>
          {activeAsset?.previewUrl ? (
            <div className="relative aspect-video overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              <Image src={activeAsset.previewUrl} alt={activeAsset.title} fill className="object-cover" />
            </div>
          ) : null}
          <p className="text-sm text-[#64748b]">{activeAsset?.description}</p>
          <DialogFooter>
            <Button variant="outline" className="border-slate-200" onClick={() => setActiveAssetId(null)}>
              Close
            </Button>
            <Button
              className="bg-[#ea580c] font-semibold text-white hover:bg-[#c2410c]"
              onClick={() =>
                toast({
                  title: 'Download started',
                  description: `${activeAsset?.title} is downloading.`,
                })
              }
            >
              Download {activeAsset?.fileType}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
