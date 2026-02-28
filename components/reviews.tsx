'use client'

import { Star } from 'lucide-react'
import Image from 'next/image'

const reviews = [
  {
    name: 'Ayşe Yılmaz',
    city: 'Istanbul',
    avatar: '/images/review-1.jpg',
    comment:
      'Anka Paketleme sayesinde evden calisarak ek gelir elde ediyorum. Maaşım hızlı geliyor, teslim sureleri cok iyi.',
  },
  {
    name: 'Mehmet Kaya',
    city: 'Ankara',
    avatar: '/images/review-2.jpg',
    comment:
      'çok guvenilir bir firma. 3 yıldır calışmaktayım, hic sorun yasamadim. Herkese tavsiye ederim.',
  },
  {
    name: 'Fatma Demir',
    city: 'Izmir',
    avatar: '/images/review-3.jpg',
    comment:
      'Devlet onaylı olmasi benim için cok onemli. Guvenerek calışıyorum. Musteriye hizmet kalitesi harika.',
  },
  {
    name: 'Ali Özturk',
    city: 'Bursa',
    avatar: '/images/review-4.jpg',
    comment:
      'MEHMET ALİ BEY TEŞEKKÜR EDERİM HERŞEY İÇİN Paketleme  cok memnunum. Zamanında odeme yapiyorlar, iletisim her zaman acik.',
  },
  {
    name: 'Zeynep Çelik',
    city: 'Antalya',
    avatar: '/images/review-5.jpg',
    comment:
      'Ev hanimlari icin mukemmel bir firsat. Cocuklarimla ilgilenirken paketleme isi yapabiliyorum.maaşımı istedipim zaman erken yatırıyorlar',
  },
  {
    name: 'Hasan Sahin',
    city: 'Konya',
    avatar: '/images/review-6.jpg',
    comment:
      'Profesyonel bir ekip, her konuda yardimci oluyorlar. Basvuru sureci de cok kolay ve hizliydi.teşşekürler Mehmet Ali Yeşilmeşe',
  },
  {
    name: 'Mehtap Açar',
    city: 'kayseri',
    avatar: 'https://i.pinimg.com/736x/9e/f8/38/9ef838c5b4e47a9a2e5a0fabeb6232f2.jpg',
    comment:
      'Maaşımı erken verdiğinizz için çok teşekkür ederim çocuklarıma hayırlara vesile ettiniz Basvuru sureci de cok kolay ve hizliydi.teşşekürler Mehmet Ali Yeşilmeşe',
  },
]

function ReviewCard({ review }: { review: (typeof reviews)[number] }) {
  return (
    <div className="w-[300px] flex-shrink-0 rounded-xl border border-border bg-card p-5 sm:w-[340px]">
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-muted">
          <Image
            src={review.avatar}
            alt={review.name}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-card-foreground">{review.name}</h4>
          <p className="text-xs text-muted-foreground">{review.city}</p>
        </div>
      </div>
      <div className="mt-3 flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{review.comment}</p>
    </div>
  )
}

export default function Reviews() {
  // Duplicate reviews for seamless loop
  const allReviews = [...reviews, ...reviews]

  return (
    <section id="reviews" className="bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">
            Müşterilerimiz
          </span>
          <h2 className="mt-2 text-balance text-2xl font-bold text-foreground md:text-3xl lg:text-4xl">
            {'Musteri Yorumlari'}
          </h2>
        </div>
      </div>

      {/* Marquee container */}
      <div className="group mt-10 overflow-hidden">
        <div className="flex w-max animate-marquee gap-4 hover:[animation-play-state:paused]">
          {allReviews.map((review, i) => (
            <ReviewCard key={`${review.name}-${i}`} review={review} />
          ))}
        </div>
      </div>
    </section>
  )
}
