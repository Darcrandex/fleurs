import { getUserFromToken } from '@/utils/getUserFromToken.server'
import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

// create article
export async function POST(request: NextRequest) {
  const user = await getUserFromToken(request)
  const data = await request.json()
  const newArticle = await prisma.article.create({ data: { authorId: user.id, ...data } })
  return NextResponse.json(newArticle)
}

// get articles
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = Number(searchParams.get('page') || 1)
  const pageSize = Number(searchParams.get('pageSize') || 10)
  const keyword = searchParams.get('keyword') || ''

  const total = await prisma.article.count({ where: { title: { contains: keyword } } })

  const records = await prisma.article.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    where: { title: { contains: keyword } },
  })

  return NextResponse.json({ records, total, page, pageSize })
}
