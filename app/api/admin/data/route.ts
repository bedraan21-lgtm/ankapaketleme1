import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { validateSession, getApplications, deleteApplication, getProducts, addProduct, updateProduct, deleteProduct, getAnnouncements, addAnnouncement, deleteAnnouncement } from '@/lib/store'

async function checkAuth() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')?.value
  if (!session || !validateSession(session)) {
    return false
  }
  return true
}

export async function GET(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Yetkisiz erisim.' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')

  if (type === 'applications') {
    return NextResponse.json(getApplications())
  }
  if (type === 'products') {
    return NextResponse.json(getProducts())
  }
  if (type === 'announcements') {
    return NextResponse.json(getAnnouncements())
  }

  return NextResponse.json({
    applications: getApplications(),
    products: getProducts(),
    announcements: getAnnouncements(),
  })
}

export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Yetkisiz erisim.' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { action } = body

    if (action === 'delete_application') {
      const success = deleteApplication(body.id)
      return NextResponse.json({ success })
    }

    if (action === 'add_product') {
      const product = addProduct({
        title: body.title,
        description: body.description || '',
        imageUrl: body.imageUrl,
        status: body.status || 'Mevcut',
      })
      return NextResponse.json(product)
    }

    if (action === 'update_product') {
      const updated = updateProduct(body.id, {
        title: body.title,
        description: body.description,
        status: body.status,
      })
      if (!updated) {
        return NextResponse.json({ error: 'Urun bulunamadi.' }, { status: 404 })
      }
      return NextResponse.json(updated)
    }

    if (action === 'delete_product') {
      const success = deleteProduct(body.id)
      return NextResponse.json({ success })
    }

    if (action === 'add_announcement') {
      const announcement = addAnnouncement({ title: body.title, content: body.content })
      return NextResponse.json(announcement)
    }

    if (action === 'delete_announcement') {
      const success = deleteAnnouncement(body.id)
      return NextResponse.json({ success })
    }

    return NextResponse.json({ error: 'Gecersiz islem.' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: 'Bir hata olustu.' }, { status: 500 })
  }
}
