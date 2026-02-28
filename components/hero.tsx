import { Shield, CheckCircle, ArrowDown } from 'lucide-react'

export default function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden bg-primary pt-20">
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
        />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 py-16 text-center lg:px-8 lg:py-28">
        <div className="mb-6 flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2">
          <Shield className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium text-accent">
            Devlet Onaylı Hizmet
          </span>
        </div>

        <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
          Türkiye'nin Tek Paketleme Sayfası ve
          <br />
          <span className="text-accent">ANKA</span>
        </h1>

        <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-primary-foreground/70 md:text-lg">
          {`Firmamız, çalışanlarımıza ürünleri (çorap) göndererek paketleme sürecini organize etmektedir. 
Paketleme işlemleri tamamlandıktan sonra ürünler tarafımızca teslim alınmakta ve Türkiye’nin 81 iline dağıtımı sağlanmaktadır.

Satış yapılmamaktadır. Sunulan hizmet yalnızca gönderim ve dağıtım süreçlerini kapsamaktadır. Tüm operasyonlar yasal çerçevede yürütülmektedir.`}
        </p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
          <a
            href="#apply"
            className="flex h-12 items-center justify-center rounded-lg bg-accent px-8 text-base font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
          >
            Hemen Başvur
          </a>

          <a
            href="#services"
            className="flex h-12 items-center justify-center rounded-lg border border-primary-foreground/20 px-8 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
          >
            Hizmetlerimiz
          </a>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-primary-foreground/60">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-accent" />
            <span>Ücretsiz Başvuru</span>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-accent" />
            <span>81 İle Teslimat</span>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-accent" />
            <span>7/24 Destek</span>
          </div>
        </div>

        <a href="#services" className="mt-12 animate-bounce" aria-label="Aşağı kaydır">
          <ArrowDown className="h-6 w-6 text-primary-foreground/40" />
        </a>
      </div>
    </section>
  )
}
