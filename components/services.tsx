import { Package, Truck, ShieldCheck, Users } from 'lucide-react'

const services = [
  {
    icon: Truck,
    title: 'Gonderim ve Dagitim',
    description:
      '81 ile PTT kargo aracılığıyla ürünlerimizi göndermekteyiz kargo ücreti bizlere aittir',
  },
  {
    icon: Package,
    title: 'Urun Toplama',
    description:
      'Paketlenmis urunleri düzenli olarak calısşanlarımızdan teslim alırız. Her urun ozenle kontrol edilir ve maaş ödemesi yapılır.',
  },
  {
    icon: ShieldCheck,
    title: 'Devlet Onayli Hizmet',
    description:
      'Maliye Bakanlığı onaylı olarak faaliyet gostermekteyiz. Tum islemler yasal çerçevede, güvenilir ve seffaf sekilde yürütülür.',
  },
  {
    icon: Users,
    title: 'is Ortaklığı',
    description:
      'Müşterilerimize paketleme isi gondererek evden calışma imkanı sağlıyoruz. Satış yapılmaz, devlet onaylı gonderim ve dağıtım hizmeti sunulmaktadır.',
  },
]

export default function Services() {
  return (
    <section id="services" className="bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">
            Hizmetlerimiz
          </span>
          <h2 className="mt-2 text-balance text-2xl font-bold text-foreground md:text-3xl lg:text-4xl">
            {'Neler Sunuyoruz?'}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
            {'Satis yapilmaz. Devlet onayli gonderim ve dagitim hizmeti sunulmaktadir.'}
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <div
              key={service.title}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-accent/30 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                <service.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-card-foreground">{service.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
