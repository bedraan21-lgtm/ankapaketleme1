'use client'

import { useState } from 'react'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'

const cities = [
  'Adana', 'Adiyaman', 'Afyonkarahisar', 'Agri', 'Aksaray', 'Amasya', 'Ankara', 'Antalya',
  'Ardahan', 'Artvin', 'Aydin', 'Balikesir', 'Bartin', 'Batman', 'Bayburt', 'Bilecik',
  'Bingol', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Canakkale', 'Cankiri', 'Corum',
  'Denizli', 'Diyarbakir', 'Duzce', 'Edirne', 'Elazig', 'Erzincan', 'Erzurum', 'Eskisehir',
  'Gaziantep', 'Giresun', 'Gumushane', 'Hakkari', 'Hatay', 'Igdir', 'Isparta', 'Istanbul',
  'Izmir', 'Kahramanmaras', 'Karabuk', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri',
  'Kirikkale', 'Kirklareli', 'Kirsehir', 'Kilis', 'Kocaeli', 'Konya', 'Kutahya', 'Malatya',
  'Manisa', 'Mardin', 'Mersin', 'Mugla', 'Mus', 'Nevsehir', 'Nigde', 'Ordu', 'Osmaniye',
  'Rize', 'Sakarya', 'Samsun', 'Sanliurfa', 'Siirt', 'Sinop', 'Sivas', 'Sirnak',
  'Tekirdag', 'Tokat', 'Trabzon', 'Tunceli', 'Usak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak',
]

export default function ApplicationForm() {
  const [form, setForm] = useState({ fullName: '', phone: '', city: '', age: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setMessage(data.error)
        return
      }

      setStatus('success')
      setMessage('Basvurunuz basariyla alindi! En kisa surede sizinle iletisime gececegiz.')
      setForm({ fullName: '', phone: '', city: '', age: '' })
    } catch {
      setStatus('error')
      setMessage('Bir hata olustu. Lutfen tekrar deneyin.')
    }
  }

  return (
    <section id="apply" className="bg-secondary py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-xl">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-accent">
              Basvuru
            </span>
            <h2 className="mt-2 text-balance text-2xl font-bold text-foreground md:text-3xl">
              {'Hemen Basvurun'}
            </h2>
            <p className="mt-3 text-pretty text-muted-foreground">
              {'Paketleme ekibimize katilmak icin asagidaki formu doldurun. Hesap olusturmaniza gerek yoktur.'}
            </p>
          </div>

          <div className="mt-4 flex justify-center">
            <span className="inline-flex items-center rounded-full bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent">
              MEVCUT
            </span>
          </div>

          {status === 'success' ? (
            <div className="mt-8 rounded-xl border border-accent/30 bg-accent/5 p-6 text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-accent" />
              <p className="mt-4 text-lg font-semibold text-foreground">Tesekkurler!</p>
              <p className="mt-2 text-muted-foreground">{message}</p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-6 rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
              >
                Yeni Basvuru
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              {status === 'error' && (
                <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
                  <p className="text-sm text-destructive">{message}</p>
                </div>
              )}

              <div>
                <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-foreground">
                  Ad Soyad
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  minLength={3}
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="Adinizi ve soyadinizi girin"
                  className="h-12 w-full rounded-lg border border-input bg-card px-4 text-base text-card-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
              </div>

              <div>
                <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-foreground">
                  Telefon
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="05xx xxx xx xx"
                  className="h-12 w-full rounded-lg border border-input bg-card px-4 text-base text-card-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
              </div>

              <div>
                <label htmlFor="city" className="mb-1.5 block text-sm font-medium text-foreground">
                  Sehir
                </label>
                <select
                  id="city"
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="h-12 w-full rounded-lg border border-input bg-card px-4 text-base text-card-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                >
                  <option value="">Sehir secin</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="age" className="mb-1.5 block text-sm font-medium text-foreground">
                  Yas
                </label>
                <input
                  id="age"
                  type="number"
                  required
                  min={18}
                  max={80}
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  placeholder="Yasinizi girin"
                  className="h-12 w-full rounded-lg border border-input bg-card px-4 text-base text-card-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-accent text-base font-semibold text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-50"
              >
                {status === 'loading' ? (
                  <span>Gonderiliyor...</span>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Basvuru Gonder</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
