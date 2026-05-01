'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ContentImage } from '@/components/shared/content-image'

export type CategoryCard = {
  slug: string
  name: string
  count?: number
  image?: string
}

export function CategorySection({ categories }: { categories: CategoryCard[] }) {
  if (!categories?.length) return null
  return (
    <section className="border-b border-border py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Explore Categories
          </h2>
          <p className="mt-2 text-muted-foreground">
            Browse through our diverse range of content and listings
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {categories.slice(0, 10).map((category, index) => {
            return (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={`/search?category=${category.slug}`}
                  className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:border-accent/50 hover:shadow-md"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    {category.image ? (
                      <ContentImage src={category.image} alt={category.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-slate-200 to-slate-300" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <span className="absolute bottom-3 left-3 text-sm font-semibold text-white">
                      {category.name}
                    </span>
                  </div>
                  {typeof category.count === 'number' ? (
                    <div className="flex items-center justify-between px-4 py-3">
                      <span className="text-sm font-semibold text-foreground">{category.count} item{category.count === 1 ? '' : 's'}</span>
                      <span className="text-sm font-semibold text-muted-foreground">Browse</span>
                    </div>
                  ) : (
                    <div className="px-4 py-3">
                      <span className="text-sm font-semibold text-foreground">Browse</span>
                    </div>
                  )}
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
