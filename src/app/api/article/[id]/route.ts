import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

// get article
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = Number(searchParams.get('id') || 0)
  const article = await prisma.article.findUnique({ where: { id }, include: { cover: true } })
  return NextResponse.json(article)
}

// update article
export async function PUT(request: NextRequest) {
  const data = await request.json()

  const updatedArticle = await prisma.article.update({
    where: { id: data.id },
    data,
  })

  return NextResponse.json(updatedArticle)
}

// delete article
export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = Number(searchParams.get('id') || 0)
  const deletedArticle = await prisma.article.delete({ where: { id } })
  return NextResponse.json(deletedArticle)
}
