import { getUserFromToken } from '@/utils/getUserFromToken.server'
import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

// 判断用户使用收藏了某个文章
export async function GET(request: NextRequest) {
  const postId = request.nextUrl.searchParams.get('postId')
  const user = await getUserFromToken(request)

  const first = await prisma.favorite.findFirst({
    where: { userId: user.id, posts: { some: { postId: Number(postId) } } },
  })
  const favorited = !!first
  return NextResponse.json({ favorited })
}
