import { NextResponse } from 'next/server'
import { getProducts, getAnnouncements } from '@/lib/store'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')

  if (type === 'products') {
    return NextResponse.json(getProducts())
  }
  if (type === 'announcements') {
    return NextResponse.json(getAnnouncements())
  }

  return NextResponse.json({
    products: getProducts(),
    announcements: getAnnouncements(),
  })
}
