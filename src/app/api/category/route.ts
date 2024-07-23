import { getUserFromToken } from '@/utils/getUserFromToken.server'
import { Prisma, PrismaClient, Role } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

// get all categories
export async function GET(request: NextRequest) {
  const categories = await prisma.category.findMany()
  return NextResponse.json(categories)
}

// create category
export async function POST(request: NextRequest) {
  const admin = await getUserFromToken(request)
  if (admin.role !== Role.ADMIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = (await request.json()) as Pick<Prisma.CategoryCreateInput, 'name'>
  const newCategory = await prisma.category.create({ data })

  return NextResponse.json(newCategory)
}
