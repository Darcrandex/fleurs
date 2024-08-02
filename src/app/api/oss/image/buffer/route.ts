import { getUserFromToken } from '@/utils/getUserFromToken.server'
import { put } from '@vercel/blob'
import dayjs from 'dayjs'
import { NextRequest, NextResponse } from 'next/server'

// 使用 Buffer 上传
export async function POST(request: NextRequest) {
  await getUserFromToken(request)

  const searchParams = request.nextUrl.searchParams
  const bucket = searchParams.get('bucket') || 'public'
  const pathname = `${bucket}/${dayjs().format('YYYY')}/${dayjs().valueOf()}.jpeg`

  const blob = new Blob([await request.arrayBuffer()], { type: 'image/jpeg' })

  const res = await put(pathname, blob, { access: 'public' })
  return NextResponse.json(res)
}
