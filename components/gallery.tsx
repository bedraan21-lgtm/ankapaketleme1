'use client'

import useSWR from 'swr'
import Image from 'next/image'
import type { Product } from '@/lib/store'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Gallery() {
  const { data: products } = useSWR<Product[]>('/api/public?type=products', fetcher)

  const items = products || []

  return (
    <section id="gallery" className="bg-secondary py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">
            Urunler
          </span>
          <h2 className="mt-2 text-balance text-2xl font-bold text-foreground md:text-3xl lg:text-4xl">
            {'Paketleme Urunlerimiz'}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
            {'Gosterim amaclidir. Bu urunler satisa sunulmamaktadir.'}
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((product) => (
            <div
              key={product.id}
              className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="p-4">
                <h3 className="text-base font-semibold text-card-foreground">{product.title}</h3>
                {product.description && (
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {product.description}
                  </p>
                )}
                <div className="mt-3">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                    product.status === 'Mevcut'
                      ? 'bg-accent/10 text-accent'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {product.status || 'Mevcut'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
