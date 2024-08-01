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
  const searchParams = request.nextUrl.searchParams
  const page = Number(searchParams.get('page') || 1)
  const pageSize = Number(searchParams.get('pageSize') || 10)
  const keyword = searchParams.get('keyword') || undefined

  const total = await prisma.favorite.count({ where: { name: { contains: keyword } } })
  const records = await prisma.favorite.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    where: { name: { contains: keyword } },
  })

  return NextResponse.json({ records, total, page, pageSize })
}
