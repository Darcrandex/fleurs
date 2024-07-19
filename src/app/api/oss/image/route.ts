import { del, head, put } from '@vercel/blob'
import dayjs from 'dayjs'
import { NextRequest, NextResponse } from 'next/server'

// upload image
export async function POST(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams
  const filename = searchParams.get('filename') || ''
  const bucket = searchParams.get('bucket') || 'public'

  if (!request.body || !filename) {
    return new NextResponse('request body is empty', { status: 400 })
  }

  const extension = filename.split('.').pop()
  // 存储路径不能以 / 开头
  // 多段路径时，会自动创建文件夹
  // 目前的业务场景，图片上传数量较少，按年份存储
  const pathname = `${bucket}/${dayjs().format('YYYY')}.${extension}`

  const createdBlob = await put(pathname, request.body, {
    access: 'public',
  })

  return NextResponse.json(createdBlob)
}

// delete image
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams
  const url = searchParams.get('url')

  if (!url) {
    return new NextResponse('url is empty', { status: 400 })
  }

  await del(url)
  return NextResponse.json({ url })
}

// get image meta by url
export async function GET(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams
  const url = searchParams.get('url')

  if (!url) {
    return new NextResponse('url is empty', { status: 400 })
  }

  const meta = await head(url)
  return NextResponse.json(meta)
}
