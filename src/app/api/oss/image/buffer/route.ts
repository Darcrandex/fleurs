import { put } from '@vercel/blob'
import dayjs from 'dayjs'
import { NextRequest, NextResponse } from 'next/server'

// 使用 Buffer 上传
export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const bucket = searchParams.get('bucket') || 'public'
  const pathname = `${bucket}/${dayjs().format('YYYY')}.jpeg`

  const blob = new Blob([await request.arrayBuffer()], { type: 'image/jpeg' })

  const res = await put(pathname, blob, { access: 'public' })
  return NextResponse.json(res)
}
