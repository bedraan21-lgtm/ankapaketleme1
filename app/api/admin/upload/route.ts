import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { validateSession } from '@/lib/store'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

async function checkAuth() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')?.value
  if (!session || !validateSession(session)) {
    return false
  }
  return true
}

export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Yetkisiz erisim.' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Dosya bulunamadi.' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Sadece resim dosyalari yuklenebilir.' }, { status: 400 })
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Dosya boyutu en fazla 5MB olabilir.' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const ext = file.name.split('.').pop() || 'jpg'
    const filename = `upload-${Date.now()}.${ext}`

    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })

    const filePath = path.join(uploadDir, filename)
    await writeFile(filePath, buffer)

    return NextResponse.json({ url: `/uploads/${filename}` })
  } catch {
    return NextResponse.json({ error: 'Dosya yuklenirken hata olustu.' }, { status: 500 })
  }
}
