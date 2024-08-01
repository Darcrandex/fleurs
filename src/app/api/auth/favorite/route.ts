import { getUserFromToken } from '@/utils/getUserFromToken.server'
import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

// 分页查询当前用户的收藏
export async function GET(request: NextRequest) {
  const user = await getUserFromToken(request)
  const searchParams = request.nextUrl.searchParams
  const page = Number(searchParams.get('page') || 1)
  const pageSize = Number(searchParams.get('pageSize') || 10)

  const total = await prisma.favorite.count({ where: { userId: user.id } })
  const records = await prisma.favorite.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    where: { userId: user.id },
    include: { posts: true },
  })

  return NextResponse.json({ records, total, page, pageSize })
}

// 收藏，取消收藏一个文章；切换收藏夹
export async function POST(request: NextRequest) {
  const { id: userId } = await getUserFromToken(request)
  const { postId, favoriteId } = (await request.json()) as { favoriteId: number; postId: number }

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
