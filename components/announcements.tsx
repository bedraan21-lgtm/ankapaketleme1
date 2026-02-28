'use client'

import useSWR from 'swr'
import { Bell } from 'lucide-react'
import type { Announcement } from '@/lib/store'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Announcements() {
  const { data: announcements } = useSWR<Announcement[]>(
    '/api/public?type=announcements',
    fetcher
  )

  const items = announcements || []

  if (items.length === 0) return null

  return (
    <section className="bg-background py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <Bell className="h-5 w-5 text-accent" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Duyurular</h2>
        </div>
        <div className="mt-6 space-y-3">
          {items.map((a) => (
            <div
              key={a.id}
              className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-accent/20"
            >
              <h3 className="font-semibold text-card-foreground">{a.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.content}</p>
              <span className="mt-3 block text-xs text-muted-foreground/60">
                {new Date(a.createdAt).toLocaleDateString('tr-TR')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
