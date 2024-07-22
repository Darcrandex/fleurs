import { getUserFromToken } from '@/utils/getUserFromToken.server'
import { Prisma, PrismaClient, Role } from '@prisma/client'
import { del } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'
import * as R from 'ramda'

const prisma = new PrismaClient()

// get post
export async function GET(request: NextRequest, ctx: { params: { id: string } }) {
  const post = await prisma.post.findUnique({ where: { id: Number(ctx.params.id) } })
  return NextResponse.json(post)
}

// update post
export async function PUT(request: NextRequest, ctx: { params: { id: string } }) {
  const id = Number(ctx.params.id)
  const user = await getUserFromToken(request)
  const post = await prisma.post.findUnique({ where: { id } })

  if (!post || (post.authorId !== user.id && user.role !== Role.ADMIN)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = (await request.json()) as Prisma.PostUncheckedUpdateInput
  const updatedPost = await prisma.post.update({ where: { id }, data: R.omit(['id', 'authorId'], data) })
  return NextResponse.json(updatedPost)
}

// delete post
export async function DELETE(request: NextRequest, ctx: { params: { id: string } }) {
  const id = Number(ctx.params.id)
  const user = await getUserFromToken(request)
  const post = await prisma.post.findUnique({ where: { id } })

  if (!post || (post.authorId !== user.id && user.role !== Role.ADMIN)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 删除关联的图片
  if (post.coverUrl) {
    await del(post.coverUrl)
  }

  await prisma.post.delete({ where: { id } })
  return NextResponse.json(post)
}
