import { getUserFromToken } from '@/utils/getUserFromToken.server'
import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

// 判断当前用户是否点赞过某篇文章
export async function GET(request: NextRequest) {
  const postId = request.nextUrl.searchParams.get('postId')
  const user = await getUserFromToken(request)

  const first = await prisma.like.findFirst({ where: { postId: Number(postId), userId: user.id } })
  const liked = !!first
  return NextResponse.json({ liked })
}
