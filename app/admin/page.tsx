'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  LogOut,
  Package,
  Users,
  ImagePlus,
  Megaphone,
  Trash2,
  Plus,
  Eye,
  Lock,
  Upload,
  Pencil,
  X,
  Check,
} from 'lucide-react'
import Image from 'next/image'
import type { Application, Product, Announcement } from '@/lib/store'

type Tab = 'applications' | 'products' | 'announcements'

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [checking, setChecking] = useState(true)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  const [tab, setTab] = useState<Tab>('applications')
  const [applications, setApplications] = useState<Application[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])

  // Product form
  const [productTitle, setProductTitle] = useState('')
  const [productDescription, setProductDescription] = useState('')
  const [productFile, setProductFile] = useState<File | null>(null)
  const [productPreview, setProductPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Product editing
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editStatus, setEditStatus] = useState('')

  // Announcement form
  const [annTitle, setAnnTitle] = useState('')
  const [annContent, setAnnContent] = useState('')

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check' }),
        credentials: 'same-origin',
      })
      if (res.ok) {
        const data = await res.json()
        if (data.authenticated) {
          setAuthenticated(true)
        }
      }
    } catch {
      // not authenticated
    } finally {
      setChecking(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', password }),
        credentials: 'same-origin',
      })
      if (res.ok) {
        setAuthenticated(true)
      } else {
        const data = await res.json()
        setLoginError(data.error || 'Giris hatasi')
      }
    } catch {
      setLoginError('Bir hata olustu')
    }
  }

  const logout = async () => {
    await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
      credentials: 'same-origin',
    })
    setAuthenticated(false)
    setPassword('')
  }

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/data', { credentials: 'same-origin' })
      if (res.ok) {
        const data = await res.json()
        setApplications(data.applications || [])
        setProducts(data.products || [])
        setAnnouncements(data.announcements || [])
      }
    } catch {
      // handle error silently
    }
  }, [])

  useEffect(() => {
    if (authenticated) fetchData()
  }, [authenticated, fetchData])

  const deleteApplication = async (id: string) => {
    await fetch('/api/admin/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete_application', id }),
      credentials: 'same-origin',
    })
    fetchData()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setProductFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setProductPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!productTitle || !productFile) return
    setUploading(true)

    try {
      // Upload file first
      const formData = new FormData()
      formData.append('file', productFile)
      const uploadRes = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
        credentials: 'same-origin',
      })
      if (!uploadRes.ok) {
        setUploading(false)
        return
      }
      const { url } = await uploadRes.json()

      // Then create product
      await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_product',
          title: productTitle,
          description: productDescription,
          imageUrl: url,
          status: 'Mevcut',
        }),
        credentials: 'same-origin',
      })
      setProductTitle('')
      setProductDescription('')
      setProductFile(null)
      setProductPreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      fetchData()
    } finally {
      setUploading(false)
    }
  }

  const startEditProduct = (product: Product) => {
    setEditingProduct(product.id)
    setEditTitle(product.title)
    setEditDescription(product.description || '')
    setEditStatus(product.status || 'Mevcut')
  }

  const cancelEdit = () => {
    setEditingProduct(null)
    setEditTitle('')
    setEditDescription('')
    setEditStatus('')
  }

  const saveEditProduct = async (id: string) => {
    await fetch('/api/admin/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update_product',
        id,
        title: editTitle,
        description: editDescription,
        status: editStatus,
      }),
      credentials: 'same-origin',
    })
    setEditingProduct(null)
    fetchData()
  }

  const deleteProduct = async (id: string) => {
    await fetch('/api/admin/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete_product', id }),
      credentials: 'same-origin',
    })
    fetchData()
  }

  const addAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!annTitle || !annContent) return
    await fetch('/api/admin/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add_announcement', title: annTitle, content: annContent }),
      credentials: 'same-origin',
    })
    setAnnTitle('')
    setAnnContent('')
    fetchData()
  }

  const deleteAnnouncement = async (id: string) => {
    await fetch('/api/admin/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete_announcement', id }),
      credentials: 'same-origin',
    })
    fetchData()
  }

  // --- LOADING STATE ---
  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b1120]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-sky-400" />
      </div>
    )
  }

  // --- LOGIN SCREEN ---
  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b1120] px-4">
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-sky-500/20 shadow-lg shadow-sky-500/10">
              <Lock className="h-7 w-7 text-sky-400" />
            </div>
            <h1 className="mt-4 text-xl font-bold text-white">Admin Paneli</h1>
            <p className="mt-1 text-sm text-white/50">Giris yapmak icin sifrenizi girin</p>
          </div>
          <form onSubmit={login} className="mt-6 space-y-4">
            {loginError && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-center text-sm text-red-400">
                {loginError}
              </div>
            )}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sifre"
              className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-base text-white placeholder:text-white/30 focus:border-sky-400/50 focus:outline-none focus:ring-2 focus:ring-sky-400/20 backdrop-blur-sm"
            />
            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center rounded-xl bg-sky-500 text-base font-semibold text-white shadow-lg shadow-sky-500/25 transition-all hover:bg-sky-400 hover:shadow-sky-400/30"
            >
              Giris Yap
            </button>
          </form>
        </div>
      </div>
    )
  }

  // --- DASHBOARD ---
  const tabs: { key: Tab; label: string; icon: typeof Users; count: number }[] = [
    { key: 'applications', label: 'Basvurular', icon: Users, count: applications.length },
    { key: 'products', label: 'Urunler', icon: ImagePlus, count: products.length },
    { key: 'announcements', label: 'Duyurular', icon: Megaphone, count: announcements.length },
  ]

  return (
    <div className="min-h-screen bg-[#0b1120]">
      {/* Admin header - glassmorphism */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/20 shadow-lg shadow-sky-500/10">
              <Package className="h-4 w-4 text-sky-400" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">ANKA PAKETiME</h1>
              <p className="text-xs text-white/40">Admin Paneli</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="flex h-9 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 text-xs font-medium text-white/60 transition-all hover:bg-white/10 hover:text-white backdrop-blur-sm"
            >
              <Eye className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Siteyi Gor</span>
            </a>
            <button
              onClick={logout}
              className="flex h-9 items-center gap-1.5 rounded-lg bg-red-500/10 border border-red-500/20 px-3 text-xs font-medium text-red-400 transition-all hover:bg-red-500/20"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Cikis</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        {/* Tab cards */}
        <div className="grid grid-cols-3 gap-3">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex flex-col items-center gap-1 rounded-xl border p-4 transition-all backdrop-blur-sm ${
                tab === t.key
                  ? 'border-sky-400/30 bg-sky-500/10 text-sky-400 shadow-lg shadow-sky-500/5'
                  : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:bg-white/10 hover:text-white/70'
              }`}
            >
              <t.icon className="h-5 w-5" />
              <span className="text-xl font-bold">{t.count}</span>
              <span className="text-xs">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mt-6">
          {/* APPLICATIONS TAB */}
          {tab === 'applications' && (
            <div>
              <h2 className="text-lg font-bold text-white">Basvurular</h2>
              {applications.length === 0 ? (
                <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm">
                  <Users className="mx-auto h-10 w-10 text-white/20" />
                  <p className="mt-3 text-sm text-white/40">Henuz basvuru bulunmuyor.</p>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="flex items-start justify-between rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/[0.07]"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-white">{app.fullName}</h3>
                          <span className="rounded-full bg-sky-500/15 px-2.5 py-0.5 text-xs font-medium text-sky-400">
                            {app.status}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/50">
                          <span>{app.phone}</span>
                          <span>{app.city}</span>
                          <span>{app.age} yas</span>
                        </div>
                        <span className="mt-1 block text-xs text-white/30">
                          {new Date(app.createdAt).toLocaleString('tr-TR')}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteApplication(app.id)}
                        className="ml-3 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-red-400 transition-all hover:bg-red-500/10"
                        aria-label="Basvuruyu sil"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PRODUCTS TAB */}
          {tab === 'products' && (
            <div>
              <h2 className="text-lg font-bold text-white">Urunler</h2>

              {/* Add product form */}
              <form onSubmit={addProduct} className="mt-4 rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <h3 className="text-sm font-semibold text-white/80">Yeni Urun Ekle</h3>
                <div className="mt-4 space-y-3">
                  <input
                    type="text"
                    value={productTitle}
                    onChange={(e) => setProductTitle(e.target.value)}
                    placeholder="Urun adi"
                    required
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-base text-white placeholder:text-white/30 focus:border-sky-400/50 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
                  />
                  <textarea
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    placeholder="Urun aciklamasi"
                    rows={2}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base leading-relaxed text-white placeholder:text-white/30 focus:border-sky-400/50 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
                  />

                  {/* File upload area */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/15 bg-white/[0.02] p-6 transition-all hover:border-sky-400/30 hover:bg-sky-500/5"
                  >
                    {productPreview ? (
                      <div className="relative h-32 w-full overflow-hidden rounded-lg">
                        <Image src={productPreview} alt="Onizleme" fill className="object-contain" sizes="400px" />
                      </div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-white/20 transition-colors group-hover:text-sky-400/50" />
                        <p className="mt-2 text-sm text-white/40">Fotograf yuklemek icin tiklayin</p>
                        <p className="text-xs text-white/25">JPG, PNG, WebP - Maks 5MB</p>
                      </>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={uploading || !productFile}
                    className="flex h-11 items-center gap-2 rounded-xl bg-sky-500 px-5 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition-all hover:bg-sky-400 disabled:opacity-40 disabled:shadow-none"
                  >
                    {uploading ? (
                      <span>Yukleniyor...</span>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Urun Ekle
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Product grid */}
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="group overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/[0.07]"
                  >
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={product.imageUrl}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>

                    {editingProduct === product.id ? (
                      <div className="space-y-2 p-4">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="h-9 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white focus:border-sky-400/50 focus:outline-none"
                        />
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          rows={2}
                          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-sky-400/50 focus:outline-none"
                        />
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                          className="h-9 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white focus:border-sky-400/50 focus:outline-none"
                        >
                          <option value="Mevcut" className="bg-[#0b1120] text-white">Mevcut</option>
                          <option value="Tukendi" className="bg-[#0b1120] text-white">Tukendi</option>
                          <option value="Yakin Zamanda" className="bg-[#0b1120] text-white">Yakin Zamanda</option>
                        </select>
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEditProduct(product.id)}
                            className="flex h-8 items-center gap-1 rounded-lg bg-sky-500 px-3 text-xs font-medium text-white transition-colors hover:bg-sky-400"
                          >
                            <Check className="h-3.5 w-3.5" />
                            Kaydet
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="flex h-8 items-center gap-1 rounded-lg border border-white/10 px-3 text-xs font-medium text-white/60 transition-colors hover:bg-white/10"
                          >
                            <X className="h-3.5 w-3.5" />
                            Iptal
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-semibold text-white">{product.title}</h4>
                            {product.description && (
                              <p className="mt-1 text-xs leading-relaxed text-white/40">{product.description}</p>
                            )}
                            <span className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              product.status === 'Mevcut'
                                ? 'bg-emerald-500/15 text-emerald-400'
                                : product.status === 'Tukendi'
                                ? 'bg-red-500/15 text-red-400'
                                : 'bg-amber-500/15 text-amber-400'
                            }`}>
                              {product.status || 'Mevcut'}
                            </span>
                          </div>
                          <div className="ml-2 flex gap-1">
                            <button
                              onClick={() => startEditProduct(product)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-sky-400 transition-all hover:bg-sky-500/10"
                              aria-label="Urunu duzenle"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => deleteProduct(product.id)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 transition-all hover:bg-red-500/10"
                              aria-label="Urunu sil"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ANNOUNCEMENTS TAB */}
          {tab === 'announcements' && (
            <div>
              <h2 className="text-lg font-bold text-white">Duyurular</h2>
              <form onSubmit={addAnnouncement} className="mt-4 rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <h3 className="text-sm font-semibold text-white/80">Yeni Duyuru Ekle</h3>
                <div className="mt-3 space-y-3">
                  <input
                    type="text"
                    value={annTitle}
                    onChange={(e) => setAnnTitle(e.target.value)}
                    placeholder="Duyuru basligi"
                    required
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-base text-white placeholder:text-white/30 focus:border-sky-400/50 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
                  />
                  <textarea
                    value={annContent}
                    onChange={(e) => setAnnContent(e.target.value)}
                    placeholder="Duyuru icerigi"
                    required
                    rows={3}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base leading-relaxed text-white placeholder:text-white/30 focus:border-sky-400/50 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
                  />
                  <button
                    type="submit"
                    className="flex h-11 items-center gap-2 rounded-xl bg-sky-500 px-5 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition-all hover:bg-sky-400"
                  >
                    <Plus className="h-4 w-4" />
                    Ekle
                  </button>
                </div>
              </form>
              <div className="mt-4 space-y-3">
                {announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className="flex items-start justify-between rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/[0.07]"
                  >
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-white">{ann.title}</h3>
                      <p className="mt-1 text-sm text-white/50">{ann.content}</p>
                      <span className="mt-2 block text-xs text-white/30">
                        {new Date(ann.createdAt).toLocaleString('tr-TR')}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteAnnouncement(ann.id)}
                      className="ml-3 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-red-400 transition-all hover:bg-red-500/10"
                      aria-label="Duyuruyu sil"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
