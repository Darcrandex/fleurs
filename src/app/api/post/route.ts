import { getUserFromToken } from '@/utils/getUserFromToken.server'
import { Prisma, PrismaClient, Role } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

// create post
export async function POST(request: NextRequest) {
  const user = await getUserFromToken(request)
  // 现版本只有管理员才能创建
  if (user.role !== Role.ADMIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = (await request.json()) as Prisma.PostUncheckedCreateInput
  const newPost = await prisma.post.create({
    data: {
      authorId: user.id,
      title: data.title,
      content: data.content,
      categoryId: data.categoryId,
      tags: data.tags,
      coverUrl: data.coverUrl,
      coverWidth: data.coverWidth,
      coverHeight: data.coverHeight,
      coverAspectRatio: data.coverAspectRatio,
      coverThumbnail: data.coverThumbnail,
    },
  })

  return NextResponse.json(newPost)
}

// get posts
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = Number(searchParams.get('page') || 1)
  const pageSize = Number(searchParams.get('pageSize') || 10)
  const keyword = searchParams.get('keyword') || undefined
  const categoryId = Number(searchParams.get('categoryId') || 0) || undefined

  const total = await prisma.post.count({ where: { title: { contains: keyword }, categoryId } })
  const records = await prisma.post.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    where: { title: { contains: keyword }, categoryId },
  })

  return NextResponse.json({ records, total, page, pageSize })
}
