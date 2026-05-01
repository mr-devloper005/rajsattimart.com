"use client";

import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ContentImage } from "@/components/shared/content-image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TaskImageCarousel({ images }: { images: string[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: images.length > 1,
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
    };
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  if (!images.length) return null;

  return (
    <>
      <div className="relative overflow-hidden rounded-3xl border border-border bg-muted">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {images.map((src, index) => (
              <div key={`${src}-${index}`} className="min-w-0 flex-[0_0_100%]">
                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className="relative block aspect-[16/10] w-full"
                  aria-label={`Open image ${index + 1}`}
                >
                  <ContentImage
                    src={src}
                    alt={`Gallery image ${index + 1} for verified business listing`}
                    fill
                    sizes="(max-width: 768px) 100vw, 900px"
                    quality={78}
                    className="object-cover"
                    intrinsicWidth={1440}
                    intrinsicHeight={900}
                    priority={index === 0}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              aria-label="Previous image"
              className="absolute left-4 top-1/2 -translate-y-1/2"
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!canPrev}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              aria-label="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2"
              onClick={() => emblaApi?.scrollNext()}
              disabled={!canNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {activeIndex !== null ? (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveIndex(null)}
        >
          <div
            className="relative w-full max-w-6xl overflow-hidden rounded-xl bg-black"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-900 hover:bg-white"
              aria-label="Close image popup"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="relative aspect-[16/10] w-full">
              <ContentImage
                src={images[activeIndex]}
                alt={`Gallery image ${activeIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}




