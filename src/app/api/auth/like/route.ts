import { getUserFromToken } from '@/utils/getUserFromToken.server'
import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

// 分页查询当前用户的点赞
export async function GET(request: NextRequest) {
  const user = await getUserFromToken(request)
  const searchParams = request.nextUrl.searchParams
  const page = Number(searchParams.get('page') || 1)
  const pageSize = Number(searchParams.get('pageSize') || 10)

  const total = await prisma.like.count({ where: { userId: user.id } })
  const records = await prisma.like.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    where: { userId: user.id },
    include: { post: { include: { author: { select: { name: true, avatar: true } } } } },
  })

  return NextResponse.json({ records, total, page, pageSize })
}

// 当前用户点赞（取消点赞）一个文章
export async function POST(request: NextRequest) {
  const { postId } = (await request.json()) as { postId: number }
  const user = await getUserFromToken(request)

  const likes = await prisma.like.findMany({ where: { postId, userId: user.id } })
  const userHasLiked = likes.length > 0

  if (userHasLiked) {
    await prisma.post.update({
      where: { id: postId },
      data: {
        likes: {
          delete: { userId_postId: { userId: user.id, postId } },
        },
      },
    })
  } else {
    await prisma.post.update({
      where: { id: postId },
      data: {
        likes: {
          connectOrCreate: {
            where: { userId_postId: { userId: user.id, postId } },
            create: { userId: user.id },
          },
        },
      },
    })
  }

  const post = await prisma.post.findUnique({ where: { id: postId } })
  return NextResponse.json(post)
}
