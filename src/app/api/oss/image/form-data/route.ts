import { getUserFromToken } from '@/utils/getUserFromToken.server'
import { put } from '@vercel/blob'
import dayjs from 'dayjs'
import { NextRequest, NextResponse } from 'next/server'

// 使用 FormData 上传
export async function POST(request: NextRequest) {
  await getUserFromToken(request)

  const formData = await request.formData()
  const image = formData.get('file') as File
  const bucket = formData.get('bucket') as string

  if (!image) {
    return new NextResponse('image is empty', { status: 400 })
  }

  const extension = image.name.split('.').pop()
  const pathname = `${bucket}/${dayjs().format('YYYY')}/${dayjs().valueOf()}.${extension}`
  const res = await put(pathname, image, { access: 'public' })

  return NextResponse.json(res)
}
