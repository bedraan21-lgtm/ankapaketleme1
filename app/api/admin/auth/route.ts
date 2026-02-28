import { NextResponse } from 'next/server'
import { loginAdmin, validateSession, logoutAdmin } from '@/lib/store'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, password } = body

    if (action === 'login') {
      const session = loginAdmin(password)
      if (!session) {
        return NextResponse.json({ error: 'Yanlis sifre.' }, { status: 401 })
      }
      const response = NextResponse.json({ success: true })
      const cookieStore = await cookies()
      cookieStore.set('admin_session', session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 4, // 4 hours
        path: '/',
      })
      return response
    }

    if (action === 'logout') {
      logoutAdmin()
      const response = NextResponse.json({ success: true })
      const cookieStore = await cookies()
      cookieStore.delete('admin_session')
      return response
    }

    if (action === 'check') {
      const cookieStore = await cookies()
      const session = cookieStore.get('admin_session')?.value
      if (!session || !validateSession(session)) {
        return NextResponse.json({ authenticated: false }, { status: 401 })
      }
      return NextResponse.json({ authenticated: true })
    }

    return NextResponse.json({ error: 'Gecersiz islem.' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: 'Bir hata olustu.' }, { status: 500 })
  }
}
