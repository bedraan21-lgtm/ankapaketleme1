import { NextResponse } from 'next/server'
import { addApplication } from '@/lib/store'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fullName, phone, city, age } = body

    if (!fullName || !phone || !city || !age) {
      return NextResponse.json({ error: 'Tum alanlar zorunludur.' }, { status: 400 })
    }

    if (fullName.trim().length < 3) {
      return NextResponse.json({ error: 'Ad Soyad en az 3 karakter olmalidir.' }, { status: 400 })
    }

    const phoneClean = phone.replace(/\s/g, '')
    if (!/^(05\d{9}|\+905\d{9})$/.test(phoneClean)) {
      return NextResponse.json({ error: 'Gecerli bir telefon numarasi giriniz. (05xx xxx xx xx)' }, { status: 400 })
    }

    const ageNum = parseInt(age, 10)
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 80) {
      return NextResponse.json({ error: 'Yas 18-80 arasinda olmalidir.' }, { status: 400 })
    }

    const result = addApplication({ fullName: fullName.trim(), phone: phoneClean, city: city.trim(), age })
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 409 })
    }

    return NextResponse.json({ success: true, application: result })
  } catch {
    return NextResponse.json({ error: 'Bir hata olustu.' }, { status: 500 })
  }
}
