import { getUserFromToken } from '@/utils/getUserFromToken.server'
import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

// create favorite folder
export async function POST(request: NextRequest) {
  const user = await getUserFromToken(request)
  const { name } = (await request.json()) as { name: string }

  if (!name?.trim()) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }

  const newFolder = await prisma.favorite.create({
    data: { name, userId: user.id },
  })

  return NextResponse.json(newFolder)
}

// get favorite folders
export async function GET(request: NextRequest) {
  const user = await getUserFromToken(request)
  const favorites = await prisma.favorite.findMany({ where: { userId: user.id }, include: { posts: true } })
  return NextResponse.json(favorites)
}
