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
import { createClient } from '@supabase/supabase-js'
import type { Application, Product, Announcement } from '@/lib/store'

const supabase = createClient(
  "https://nxjiphtlektiunvjsow.supabase.co",
  "sb_publishable_DMEbxzBOt2LYrNMkqbe0-w_FirNC6LY"
)

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

  const [productTitle, setProductTitle] = useState('')
  const [productDescription, setProductDescription] = useState('')
  const [productFile, setProductFile] = useState<File | null>(null)
  const [productPreview, setProductPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editStatus, setEditStatus] = useState('')

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
    } catch {}
    finally {
      setChecking(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const fetchData = useCallback(async () => {
    try {

      const { data } = await supabase.from("basvurular").select("*")
      if (data) setApplications(data)

      const res = await fetch('/api/admin/data', { credentials: 'same-origin' })
      if (res.ok) {
        const json = await res.json()
        setProducts(json.products || [])
        setAnnouncements(json.announcements || [])
      }

    } catch {}
  }, [])

  useEffect(() => {
    if (authenticated) fetchData()
  }, [authenticated, fetchData])

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
    reader.onloadend = () => {
      setProductPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!productTitle || !productFile) return

    setUploading(true)

    try {
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

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

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
      body: JSON.stringify({
        action: 'delete_product',
        id,
      }),
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

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b1120]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-sky-400" />
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b1120] px-4">
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-sky-500/20 shadow-lg shadow-sky-500/10">
              <Lock className="h-7 w-7 text-sky-400" />
            </div>

            <h1 className="mt-4 text-xl font-bold text-white">
              Admin Paneli
            </h1>

            <p className="mt-1 text-sm text-white/50">
              Giris yapmak icin sifrenizi girin
            </p>
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
              className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-base text-white"
            />

            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center rounded-xl bg-sky-500 text-base font-semibold text-white"
            >
              Giris Yap
            </button>
          </form>
        </div>
      </div>
    )
  }

  const tabs = [
    { key: 'applications', label: 'Basvurular', icon: Users, count: applications.length },
    { key: 'products', label: 'Urunler', icon: ImagePlus, count: products.length },
    { key: 'announcements', label: 'Duyurular', icon: Megaphone, count: announcements.length },
  ]

  return (
    <div className="min-h-screen bg-[#0b1120]">
      <header className="border-b border-white/10 bg-white/5">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <h1 className="text-white font-bold">ANKA PAKETLEME</h1>

          <button
            onClick={logout}
            className="text-red-400 text-sm"
          >
            Cikis
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">

        <div className="grid grid-cols-3 gap-3">
          {tabs.map((t:any) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="rounded-xl border border-white/10 bg-white/5 p-4 text-white"
            >
              <t.icon className="mx-auto h-5 w-5" />
              <div className="text-xl font-bold">{t.count}</div>
              <div className="text-xs">{t.label}</div>
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}
