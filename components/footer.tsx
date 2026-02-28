import { MapPin, Phone, Shield, Package } from 'lucide-react'

export default function Footer() {
  return (
    <footer id="contact" className="bg-primary py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <Package className="h-5 w-5 text-accent-foreground" />
              </div>
              <span className="text-lg font-bold text-primary-foreground">
                ANKA PAKETLEME
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-primary-foreground/60">
              Firmamız tarafından ürünler (çorap) çalışanlarımıza ulaştırılmakta,
              paketleme işlemleri çalışanlarımız tarafından gerçekleştirilmektedir.
              Paketleme süreci tamamlanan ürünler firmamızca geri teslim alınarak
              Türkiye’nin 81 iline sevk ve dağıtımı sağlanmaktadır.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/80">
              İletişim
            </h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                <span className="text-sm text-primary-foreground/60">
                  Saraylar, 20010 Denizli Merkezefendi/Denizli
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 flex-shrink-0 text-accent" />
                <span className="text-sm text-primary-foreground/60">
                  +90 501 689 90 33
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/80">
              Güvence
            </h3>
            <div className="mt-4 flex items-start gap-3">
              <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
              <p className="text-sm leading-relaxed text-primary-foreground/60">
                Firmamız, Maliye Bakanlığı onaylı olarak faaliyet göstermektedir.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-primary-foreground/10 pt-6 text-center">
          <p className="text-xs text-primary-foreground/40">
            2019 ANKA PAKETLEME. Tüm hakları saklıdır. Bu sitede satış yapılmamaktadır.
          </p>
        </div>
      </div>
    </footer>
  )
}