import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const filename = searchParams.get('filename')

  if (!request.body || !filename) {
    return NextResponse.json(
      {
        error: 'request body is empty'
      },
      { status: 400 }
    )
  }

  const folder = 'public'
  const extension = filename.split('.').pop()
  // 存储路径不能以 / 开头
  // 多段路径时，会自动创建文件夹
  const pathname = `${folder}/${Date.now()}-${Math.random()}.${extension}`

  // ⚠️ The below code is for App Router Route Handlers only
  const blob = await put(pathname, request.body, {
    access: 'public'
  })

  // Here's the code for Pages API Routes:
  // const blob = await put(filename, request, {
  //   access: 'public',
  // });

  // https://sixtiecxwvafdumo.public.blob.vercel-storage.com/1721206343068-0-tTTXB4LUrppFA7MqcT8nYYntozC68Z.9387277776796457

  return NextResponse.json(blob)
}

// The next lines are required for Pages API Routes only
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };
