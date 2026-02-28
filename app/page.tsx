import Header from '@/components/header'
import Hero from '@/components/hero'
import Services from '@/components/services'
import Gallery from '@/components/gallery'
import Reviews from '@/components/reviews'
import Announcements from '@/components/announcements'
import ApplicationForm from '@/components/application-form'
import Footer from '@/components/footer'
import WhatsAppButton from '@/components/whatsapp-button'

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Services />
      <Gallery />
      <Reviews />
      <Announcements />
      <ApplicationForm />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
