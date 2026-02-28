// In-memory store for applications, products, and announcements
// Note: This resets on server restart. For production, use a database.

export interface Application {
  id: string
  fullName: string
  phone: string
  city: string
  age: string
  status: string
  createdAt: string
}

export interface Product {
  id: string
  title: string
  description: string
  imageUrl: string
  status: string
  createdAt: string
}

export interface Announcement {
  id: string
  title: string
  content: string
  createdAt: string
}

const applications: Application[] = []
const products: Product[] = [
  { id: '1', title: 'Karton Kutu Paketleme', description: 'Cesitli boyutlarda karton kutular ile guvenli paketleme hizmeti.', imageUrl: '/images/products-1.jpg', status: 'Mevcut', createdAt: new Date().toISOString() },
  { id: '2', title: 'El ile Paketleme', description: 'Ozenli el isciligi ile hassas urunlerin paketlenmesi.', imageUrl: '/images/products-2.jpg', status: 'Mevcut', createdAt: new Date().toISOString() },
  { id: '3', title: 'Depo ve Lojistik', description: 'Modern depo ortaminda organize gonderim hazirliklari.', imageUrl: '/images/products-3.jpg', status: 'Mevcut', createdAt: new Date().toISOString() },
  { id: '4', title: 'Kraft Ambalaj', description: 'Cevre dostu kraft kagit ile dogal ambalaj cozumleri.', imageUrl: '/images/products-4.jpg', status: 'Mevcut', createdAt: new Date().toISOString() },
  { id: '5', title: 'Paketleme Istasyonu', description: 'Profesyonel ekipmanlar ile hizli ve verimli paketleme.', imageUrl: '/images/products-5.jpg', status: 'Mevcut', createdAt: new Date().toISOString() },
  { id: '6', title: 'Etiketli Gonderim', description: 'Barkodlu ve etiketli gonderime hazir paketler.', imageUrl: '/images/products-6.jpg', status: 'Mevcut', createdAt: new Date().toISOString() },
]
const announcements: Announcement[] = [
  {
    id: '1',
    title: 'Yeni Donem Basvurulari Acildi',
    content: 'Mart 2026 donemi icin yeni basvurular alinmaya baslanmistir. Basvuru formunu doldurarak kayit olabilirsiniz.',
    createdAt: new Date().toISOString(),
  },
]

// Session store for admin
let adminSession: string | null = null

export function getApplications(): Application[] {
  return [...applications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function addApplication(app: Omit<Application, 'id' | 'status' | 'createdAt'>): Application | { error: string } {
  const exists = applications.find((a) => a.phone === app.phone)
  if (exists) {
    return { error: 'Bu telefon numarasi ile daha once basvuru yapilmistir.' }
  }
  const newApp: Application = {
    ...app,
    id: Date.now().toString(),
    status: 'MEVCUT',
    createdAt: new Date().toISOString(),
  }
  applications.push(newApp)
  return newApp
}

export function deleteApplication(id: string): boolean {
  const index = applications.findIndex((a) => a.id === id)
  if (index === -1) return false
  applications.splice(index, 1)
  return true
}

export function getProducts(): Product[] {
  return [...products].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function addProduct(product: Omit<Product, 'id' | 'createdAt'>): Product {
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  products.push(newProduct)
  return newProduct
}

export function updateProduct(id: string, updates: Partial<Pick<Product, 'title' | 'description' | 'status'>>): Product | null {
  const product = products.find((p) => p.id === id)
  if (!product) return null
  if (updates.title !== undefined) product.title = updates.title
  if (updates.description !== undefined) product.description = updates.description
  if (updates.status !== undefined) product.status = updates.status
  return { ...product }
}

export function deleteProduct(id: string): boolean {
  const index = products.findIndex((p) => p.id === id)
  if (index === -1) return false
  products.splice(index, 1)
  return true
}

export function getAnnouncements(): Announcement[] {
  return [...announcements].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function addAnnouncement(announcement: Omit<Announcement, 'id' | 'createdAt'>): Announcement {
  const newAnnouncement: Announcement = {
    ...announcement,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  announcements.push(newAnnouncement)
  return newAnnouncement
}

export function deleteAnnouncement(id: string): boolean {
  const index = announcements.findIndex((a) => a.id === id)
  if (index === -1) return false
  announcements.splice(index, 1)
  return true
}

// Admin auth (simple hardcoded for demo)
const ADMIN_PASSWORD = 'ankapaketim2026'

export function loginAdmin(password: string): string | null {
  if (password === ADMIN_PASSWORD) {
    adminSession = Date.now().toString() + Math.random().toString(36)
    return adminSession
  }
  return null
}

export function validateSession(session: string): boolean {
  return adminSession !== null && adminSession === session
}

export function logoutAdmin(): void {
  adminSession = null
}
