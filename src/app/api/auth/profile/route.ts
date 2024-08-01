import { getUserFromToken } from '@/utils/getUserFromToken.server'
import { Prisma, PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import * as R from 'ramda'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  const current = await getUserFromToken(request)
  const user = await prisma.user.findUnique({
    where: { id: current.id },
    // include: { posts: true, likes: true, favorites: true },
  })

  // 由于嵌套查询数量不确定，只计算数量
  const postCount = await prisma.post.count({ where: { authorId: current.id } })
  const likeCount = await prisma.like.count({ where: { userId: current.id } })
  const favoriteCount = await prisma.favorite.count({ where: { userId: current.id } })

  return NextResponse.json({ ...user, postCount, likeCount, favoriteCount })
}

// update profile
export async function PUT(request: NextRequest) {
  const data = (await request.json()) as Pick<Prisma.UserUpdateInput, 'name' | 'avatar'>
  const user = await getUserFromToken(request)
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: R.pick(['name', 'avatar'], data),
  })

  return NextResponse.json(updatedUser)
}
