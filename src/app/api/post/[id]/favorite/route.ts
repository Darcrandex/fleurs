import { getUserFromToken } from '@/utils/getUserFromToken.server'
import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(request: NextRequest, ctx: { params: { id: string } }) {
  const { id: userId } = await getUserFromToken(request)
  const postId = Number(ctx.params.id)
  const { favoriteId } = (await request.json()) as { favoriteId: number | undefined }
  const favorites = await prisma.favorite.findMany({ where: { userId }, include: { posts: true } })

  // 同一个 post 只能被收藏一次
  const oldFavorite = favorites.find((favorite) => favorite.posts.some((post) => post.postId === postId))

  // 取消收藏
  if (!favoriteId) {
    if (oldFavorite) {
      await prisma.favorite.update({
        where: { id: oldFavorite.id },
        data: {
          posts: {
            delete: {
              postId_favoriteId: {
                postId,
                favoriteId: oldFavorite.id,
              },
            },
          },
        },
      })
    }
  }

  // 新的收藏
  if (!!favoriteId && !oldFavorite) {
    await prisma.favorite.update({
      where: { id: favoriteId },
      data: {
        posts: {
          connectOrCreate: {
            where: { postId_favoriteId: { favoriteId, postId } },
            create: { postId },
          },
        },
      },
    })
  }

  // 修改收藏夹
  if (!!favoriteId && !!oldFavorite && favoriteId !== oldFavorite.id) {
    await prisma.favorite.update({
      where: { id: oldFavorite.id },
      data: {
        posts: {
          delete: {
            postId_favoriteId: {
              postId,
              favoriteId: oldFavorite.id,
            },
          },
        },
      },
    })

    await prisma.favorite.update({
      where: { id: favoriteId },
      data: {
        posts: {
          connectOrCreate: {
            where: { postId_favoriteId: { postId, favoriteId } },
            create: { postId },
          },
        },
      },
    })
  }

  return NextResponse.json({ postId, favoriteId })
}
