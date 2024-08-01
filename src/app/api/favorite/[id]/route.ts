import { getUserFromToken } from '@/utils/getUserFromToken.server'
import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

// get favorite folder
export async function GET(request: NextRequest, ctx: { params: { id: string } }) {
  const user = await getUserFromToken(request)
  const id = Number(ctx.params.id)
  const folder = await prisma.favorite.findUnique({
    where: { id, userId: user.id },
    include: { posts: { include: { post: true } } },
  })
  return NextResponse.json(folder)
}

// delete favorite folder
export async function DELETE(request: NextRequest, ctx: { params: { id: string } }) {
  const user = await getUserFromToken(request)
  const id = Number(ctx.params.id)
  const deletedFolder = await prisma.favorite.delete({ where: { id, userId: user.id } })
  return NextResponse.json(deletedFolder)
}

// update favorite folder
export async function PUT(request: NextRequest, ctx: { params: { id: string } }) {
  const user = await getUserFromToken(request)
  const id = Number(ctx.params.id)
  const body = (await request.json()) as { name: string }
  const name = body.name || ''
  const newFolder = await prisma.favorite.update({ where: { id, userId: user.id }, data: { name } })
  return NextResponse.json(newFolder)
}
