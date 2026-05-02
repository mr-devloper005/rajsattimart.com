"use client";

import { useState } from "react";
import Link from "next/link";
import { X, ArrowRight } from "lucide-react";
import { ContentImage } from "@/components/shared/content-image";

export type CategoryPopupCard = {
  slug: string;
  name: string;
  count: number;
  image: string;
};

export function CategoryCardsPopup({ cards }: { cards: CategoryPopupCard[] }) {
  const [active, setActive] = useState<CategoryPopupCard | null>(null);

  if (!cards.length) return null;

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-2">
        {cards.map((cat) => (
          <div
            key={cat.slug}
            className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            <button
              type="button"
              onClick={() => setActive(cat)}
              className="relative block aspect-[16/10] w-full overflow-hidden bg-slate-200 text-left"
              aria-label={`Open ${cat.name} photo`}
            >
              <ContentImage
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
              <span className="absolute bottom-3 left-3 text-sm font-semibold text-white">{cat.name}</span>
            </button>
            <Link
              href={`/classifieds?category=${encodeURIComponent(cat.slug)}`}
              className="flex items-center justify-between px-4 py-3"
            >
              <span className="text-sm font-semibold text-[#0f172a]">
                {cat.count} listing{cat.count === 1 ? "" : "s"}
              </span>
              <ArrowRight className="h-4 w-4 text-[#22c55e] transition group-hover:translate-x-0.5" />
            </Link>
          </div>
        ))}
      </div>

      {active ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-5xl overflow-hidden rounded-xl bg-black">
            <button
              type="button"
              onClick={() => setActive(null)}
              className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-900 hover:bg-white"
              aria-label="Close image popup"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="relative aspect-[16/10] w-full">
              <ContentImage
                src={active.image}
                alt={active.name}
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

