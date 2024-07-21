import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

// get article
export async function GET(request: NextRequest, ctx: { params: { id: string } }) {
  const articleId = Number(ctx.params.id || 0)

  const article = await prisma.article.findUnique({
    where: { id: articleId },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  })
  return NextResponse.json(article)
}

// update article
export async function PUT(request: NextRequest, ctx: { params: { id: string } }) {
  const data = await request.json()

  const updatedArticle = await prisma.article.update({
    where: { id: Number(ctx.params.id) },
    data,
  })

  return NextResponse.json(updatedArticle)
}

// delete article
export async function DELETE(request: NextRequest, ctx: { params: { id: string } }) {
  const articleId = Number(ctx.params.id || 0)

  try {
    const deletedArticle = await prisma.article.delete({
      where: { id: articleId },
    })
    console.log('Article deleted:', deletedArticle)
  } catch (error) {
    console.error('Error deleting article:', error)
  } finally {
    await prisma.$disconnect()
  }

  return NextResponse.json(articleId)
}
