import { getUserFromToken } from '@/utils/getUserFromToken.server'
import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

// toggle user like
export async function POST(request: NextRequest, ctx: { params: { id: string } }) {
  const id = Number(ctx.params.id)
  const user = await getUserFromToken(request)

  const likes = await prisma.like.findMany({ where: { postId: id, userId: user.id } })
  const userHasLiked = likes.length > 0

  if (userHasLiked) {
    await prisma.post.update({
      where: { id },
      data: {
        likes: {
          delete: { userId_postId: { userId: user.id, postId: id } },
        },
      },
    })
  } else {
    await prisma.post.update({
      where: { id },
      data: {
        likes: {
          connectOrCreate: {
            where: { userId_postId: { userId: user.id, postId: id } },
            create: { userId: user.id },
          },
        },
      },
    })
  }

  const post = await prisma.post.findUnique({ where: { id } })
  return NextResponse.json(post)
}
